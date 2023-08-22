// values
const scene = document.getElementById('scene');
const nodes = document.querySelectorAll(".node");
const scriptArea = document.getElementById('scriptArea');
const inspector = document.getElementById('inspector');
const objectList = document.getElementById('object-list');
const toolbar = document.getElementById("createButton");
let selectedNode = null;

let lastClicked = "world-node"
let switched = false;
let currDataType = "";
let scaleFactor = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let nodeIndex = 0;
let newNode = null;

const scriptAreaButton = document.getElementById("Script-Area");
const workspaceAreaButton = document.getElementById("Workspace-Area");

const openButton = document.getElementById("openButton");
const closeButton = document.getElementById("closeButton");
const popupMenu = document.getElementById("popupMenu");

document.addEventListener("DOMContentLoaded", function () {
    scriptAreaButton.textContent = scriptAreaButton.id;
    workspaceAreaButton.textContent = workspaceAreaButton.id;
  
    scriptAreaButton.addEventListener("click", function () {
        scene.style.display = "none";
        toolbar.style.display = "none";
        objectList.style.display = "none";
        inspector.style.display = "none"
        scriptArea.style.display = "flex";
    });
  
    workspaceAreaButton.addEventListener("click", function () {
        scriptArea.style.display = "none"
        scene.style.display = "flex";
        toolbar.style.display = "block";
        objectList.style.display = "block";
        inspector.style.display = "block"
    });
  
    openButton.addEventListener("click", function () {
        popupMenu.style.display = "block";
    });
  
    closeButton.addEventListener("click", function () {
        popupMenu.style.display = "none";
    });
});

function createNode(dataType) {
    popupMenu.style.display = "none";
    nodeIndex ++;
    currDataType = dataType;

    if (!switched) {
        scene.addEventListener("click", createSceneNode);
    }
    else {
        scene.addEventListener("click", createChildNode);
    }
}

function createSceneNode(event) {
    scene.removeEventListener('click', createSceneNode);
    newNode = createNodeBase()

    newNode.style.left = `${event.clientX - scene.getBoundingClientRect().left}px`;
    newNode.style.top = `${event.clientY - scene.getBoundingClientRect().top}px`;
    newNode.textContent = 'Node';

    scene.appendChild(newNode);
    selectedNode = newNode;
    setupNodes(currDataType);
}

function createChildNode(event) {
    scene.removeEventListener('click', createChildNode);
    const lastElement = document.getElementById(lastClicked);

    newNode = createNodeBase();
    const scaleFactorInverse = 1 / scaleFactor;
    const offsetX = panX + event.clientX - lastElement.getBoundingClientRect().left;
    const offsetY = panY + event.clientY - lastElement.getBoundingClientRect().top;

    newNode.style.left = `${offsetX * scaleFactorInverse}px`;
    newNode.style.top = `${offsetY * scaleFactorInverse}px`;

    newNode.setAttribute("child-type", lastElement.id)
    newNode.textContent = 'Child';
    newNode.classList.add("child");

    lastElement.appendChild(newNode);
    selectedNode = newNode;
    setupNodes(currDataType);
}

function createNodeBase() {
    const createdNode = document.createElement("div");
    createdNode.classList.add('node');
    createdNode.addEventListener('mousedown', onNodeMouseDown);

    return createdNode;
}

function setupNodes(dataType) {
    // setting up last data for newNode
    newNode.setAttribute("data-type", dataType);
    newNode.id = dataType + nodeIndex;
    // setup for worldnode
    setupWorldNodeId(document.getElementById("World-Node"));

    newNode.props = setupNodeProps(newNode);
    createObjectListElement(newNode);
}

function setupNodeProps(node) {
    return {
        type: "rectangle",
        width: parseInt(node.style.width) || 100,
        height: parseInt(node.style.height) || 100,
        x: parseInt(node.style.left),
        y: parseInt(node.style.top),
        color: node.style.backgroundColor || 'transparent',
        name: node.id || node.dataset.name
    };
}

function setupWorldNodeId(worldNode) {
    worldNode.setAttribute("data-type", "World-Node");
}


function createObjectListElement(node) {
    const listElement = createListElement(node);

    setupListElementEventListener(listElement);

    objectList.appendChild(listElement);
}

function createListElement(node) {
    const listElement = document.createElement("li");
    listElement.textContent = node.props.name;
    listElement.classList.add("listElement");
    listElement.id = node.id;
    listElement.setAttribute("list-type", node.getAttribute("data-type"));

    if (switched) {
        setupChildListElementData(listElement, node);
    }
    else {
        node.lastX = node.style.left;
        node.lastY = node.style.top;

        console.log(node.lastX + "," + node.lastY);
    }

    return listElement;
}

function setupChildListElementData(listElement, node) {
    listElement.setAttribute("child-type", node.getAttribute("child-type"));
    listElement.classList.add("child")
}

function setupListElementEventListener(listElement)  {
    listElement.addEventListener("click", onListElementClickOnce);

    // make sure you cant go into a scene in a scene
    const worldListElement = document.querySelector(".listElement#World-Node");
    worldListElement.addEventListener("dblclick", onWorldNodeClickDlb);
    worldListElement.addEventListener("click", onListElementClickOnce);

    if (!switched && listElement.id != "World-Node" && !listElement.classList.contains("child")) {
        listElement.addEventListener("dblclick", onListElementClickDbl);
    }
}

function onListElementClickOnce(event) {
    const listElement = event.target;

    selectedNode = document.getElementById(listElement.id);
    updateSelectedObjectList();
}

function onWorldNodeClickDlb(event) {
    if (switched) {
        gotoWorldScene();
        switched = false;
        lastClicked = event.target.id;
        console.log(lastClicked);
    }   
}

function gotoWorldScene() {
    const lastElement = document.getElementById(lastClicked);
    document.querySelectorAll(".listElement").forEach((element) => {
        element.style.display = "block";

        if (element.classList.contains("child")) {
            element.style.display = "none";
        }
    })

    nodes.forEach((node) => {
        if (!node.classList.contains("child")) {
            lastElement.style.left = lastElement.lastX;
            lastElement.style.top = lastElement.lastY;
        }
    });
    const scenes = document.getElementsByClassName("node");
    for (let i = 0; i < scenes.length; i++) {
        scenes[i].style.display = "flex";
    }

    updateWorldNode();
}

function onListElementClickDbl(event) {
    const node = document.getElementById(event.target.id);
    lastClicked = node.id;

    hideAllNodes(node);

    for (child of node.children) {
        child.style.display = "flex"; 
    }
    document.querySelectorAll(".listElement").forEach((element) => {
        if (element.classList.contains("child") && element.getAttribute("child-type") == node.id) {
            element.style.display = "block";
        }
        else if (element.id != node.id) {
            element.style.display = "none";
            document.querySelector(".listElement#World-Node").style.display = "block";
        }
    });

    node.style.left = "650px";
    node.style.top = "300px";
    scene.style.transform = `scale(${scaleFactor}) translate(0px, 0px)`;

    switched = true;

    console.log(lastClicked);
}

function hideAllNodes(node) {
    const allNodes = document.getElementsByClassName("node");
    for (let i = 0; i < allNodes.length; i++) {
        if (allNodes[i].id != node.id) {
            allNodes[i].style.display = "none";
        }
    }
}

// Updating the Inspector, which is placed on the top-right
function updateInspector() {
    inspector.innerHTML = ''; // Clear previous content
  
    if (selectedNode) {
        updateNameProperty();
      
        updatePostionPropety();

        updateBackgroundColorProperty();
  
        updateAreaProperty();
    }
  }

function updateNameProperty() {
    // Name property
    const name = document.createElement('div');
    name.classList.add('property');
    name.innerHTML = `
        <label>Name:</label>
        <input type="text" value="${selectedNode.dataset.name || ''}">
    `;
    name.querySelector('input').addEventListener('change', (event) => {
        selectedNode.props.name = event.target.value;
        setupListElementData(document.querySelector("#" + selectedNode.id + ".listElement"), document.getElementById(selectedNode.id));
    });
    inspector.appendChild(name);
}

function updatePostionPropety() {
    // Position properties
    const positionX = document.createElement('div');
    positionX.classList.add('property');
    positionX.innerHTML = `
      <label>X:</label>
      <input type="text" value="${parseInt(selectedNode.style.left)}">
    `;
    positionX.querySelector('input').addEventListener('change', (event) => {
      selectedNode.style.left = `${event.target.value}px`;
      updateSelectedObjectList(); // Update object list when X position changes
    });
    inspector.appendChild(positionX);

    const positionY = document.createElement('div');
    positionY.classList.add('property');
    positionY.innerHTML = `
      <label>Y:</label>
      <input type="text" value="${parseInt(selectedNode.style.top)}">
    `;
    positionY.querySelector('input').addEventListener('change', (event) => {
      selectedNode.style.top = `${event.target.value}px`;
      updateSelectedObjectList(); // Update object list when Y position changes
    });
    inspector.appendChild(positionY);
}

function updateBackgroundColorProperty() {
    // Background color property
    const bgColor = document.createElement('div');
    bgColor.classList.add('property');
    bgColor.innerHTML = `
        <label> Color:</label>
        <input type="text" value="${selectedNode.style.backgroundColor || '#f0f0f0'}">
    `;
    bgColor.querySelector('input').addEventListener('change', (event) => {
        selectedNode.style.backgroundColor = event.target.value;
    });
    inspector.appendChild(bgColor);
}

function updateAreaProperty() {
    const width = document.createElement('div');
    width.classList.add('property');
    width.innerHTML = `
        <label>Width:</label>
        <input type="text" value="${parseInt(selectedNode.style.width)}">
    `;
    width.querySelector('input').addEventListener('change', (event) => {
        selectedNode.style.width = `${event.target.value}px`;
        updateSelectedObjectList(); // Update object list when width changes
    });
    inspector.appendChild(width);
  
    const height = document.createElement('div');
    height.classList.add('property');
    height.innerHTML = `
        <label>Height:</label>
        <input type="text" value="${parseInt(selectedNode.style.height)}">
    `;
    height.querySelector('input').addEventListener('change', (event) => {
        selectedNode.style.height = `${event.target.value}px`;
        updateSelectedObjectList(); // Update object list when height changes
    });
    inspector.appendChild(height);
}

function updateSelectedObjectList() {
    const listItems = document.querySelectorAll(".listElement");
    listItems.forEach((element) => {
      if (element.id === selectedNode.id) {
        element.classList.add('selected');
      } else {
        element.classList.remove('selected');
      }
    });
}

function updateWorldNode() {
    document.getElementById("World-Node").style.display = "none";
}

scene.addEventListener('wheel', (event) => {
    // Zoom in/out using the mouse wheel
    event.preventDefault();
    const zoomSpeed = 0.1;
    let newScaleFactor = scaleFactor - event.deltaY * zoomSpeed;
    newScaleFactor = Math.max(0.5, Math.min(2, newScaleFactor)); // Limit zoom to between 0.5x and 2x
    const scaleFactorChange = newScaleFactor / scaleFactor;
    scaleFactor = newScaleFactor;
    panX *= scaleFactorChange;
    panY *= scaleFactorChange;
    scene.style.transform = `scale(${scaleFactor}) translate(${panX}px, ${panY}px)`;
});

function onNodeMouseDown(event) {
    const node = event.target;
    const lastElement = document.getElementById(lastClicked);
    let offsetX = event.clientX - node.getBoundingClientRect().left;
    let offsetY = event.clientY - node.getBoundingClientRect().top;
  
    function onMouseMove(event) {
      if (!switched && node.classList.contains("child")) {
        // do nothing
      }
      else if (!switched) {
        node.style.left = panX + `${event.clientX - offsetX - scene.getBoundingClientRect().left}px`;
        node.style.top = panY + `${event.clientY - offsetY - scene.getBoundingClientRect().top}px`;
      }
      else if (node.classList.contains("child")) {
        const scaleFactorInverse = 1 / scaleFactor;
        offsetX = panX + event.clientX - lastElement.getBoundingClientRect().left;
        offsetY = panY + event.clientY - lastElement.getBoundingClientRect().top;
  
        node.style.left = `${offsetX * scaleFactorInverse}px`;
        node.style.top = `${offsetY * scaleFactorInverse}px`;
      }
      else {
        node.style.left = `${event.clientX - offsetX - scene.getBoundingClientRect().left}px`;
        node.style.top = `${event.clientY - offsetY - scene.getBoundingClientRect().top}px`;
      }
    }
  
    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      updateSelectedObjectList(); // Update object list when the node is moved
    }
  
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    selectedNode = node;
    updateSelectedObjectList();
  }

  scene.addEventListener('mousedown', (event) => {
    // Check if we're selecting a node
    if (event.button === 0) {
      const clickedNode = event.target.closest('.node');
      if (clickedNode) {
        selectedNode = clickedNode;
        updateInspector();
        // Highlight the selected node in the object list
        const nodes = document.querySelectorAll('.node');
        nodes.forEach(node => {
          if (node === selectedNode) {
            node.classList.add('selected');
          } else {
            node.classList.remove('selected');
          }
        });
      } else {
        startPan(event);
      }
    }
  });
  
  document.addEventListener('mouseup', () => {
    endPan();
  });
  
  function runProject() {
    window.open("../../testgameui/index.html", "_blank");
  }
  
  function startPan(event) {
    isPanning = true;
    panStartX = event.clientX;
    panStartY = event.clientY;
  }
  
  function endPan() {
    isPanning = false;
  }
  
  document.addEventListener('mousemove', (event) => {
    if (isPanning) {
      const deltaX = event.clientX - panStartX;
      const deltaY = event.clientY - panStartY;
      panX += deltaX;
      panY += deltaY;
      scene.style.transform = `scale(${scaleFactor}) translate(${panX}px, ${panY}px)`;
      panStartX = event.clientX;
      panStartY = event.clientY;
    }
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    scene.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      event.stopPropagation();
  
      if (!event.target.classList.contains('node')) {
        selectedNode = null;
        updateSelectedObjectList();
      }
    });
  
    // Add grid lines to the scene
    const gridLines = document.createElement('div');
    gridLines.classList.add('grid-lines');
    scene.appendChild(gridLines);
});
  
// Initial update of the inspector
updateInspector();
updateWorldNode();

// Initial update of the object list and inspector
updateObjectList();
updateInspector();
