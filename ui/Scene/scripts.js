const scene = document.getElementById('scene');
const inspector = document.getElementById('inspector');
const objectList = document.getElementById('object-list');
let selectedNode = null;

let nodeIndex = 0;
let lastClicked = "world-node"
let switched = false;
let scaleFactor = 1;
let lastX = 0;
let lastY = 0;
let panX = 0;
let panY = 0;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;

const openButton = document.getElementById("openButton");
const closeButton = document.getElementById("closeButton");
const popupMenu = document.getElementById("popupMenu");

document.addEventListener("DOMContentLoaded", function () {
  openButton.addEventListener("click", function () {
    popupMenu.style.display = "block";
  });

  closeButton.addEventListener("click", function () {
    popupMenu.style.display = "none";
  });
});

function createNode(dataType) {
  popupMenu.style.display = "none";
  scene.addEventListener("click", onSceneClickOnce)

  function onSceneClickOnce(event) {
    nodeIndex++;
    scene.removeEventListener('click', onSceneClickOnce);

    const newNode = document.createElement('div');
    newNode.classList.add('node');
    newNode.textContent = 'Node';
    newNode.id = dataType + nodeIndex;
    newNode.setAttribute("data-type", dataType);
    newNode.style.left = `${event.clientX - scene.getBoundingClientRect().left}px`;
    newNode.style.top = `${event.clientY - scene.getBoundingClientRect().top}px`;

    newNode.addEventListener('mousedown', onNodeMouseDown);

    scene.appendChild(newNode);
    selectedNode = newNode;
    updateInspector();
    updateObjectList();
  }
}

function onNodeMouseDown(event) {
  const node = event.target;
  let offsetX = event.clientX - node.getBoundingClientRect().left;
  let offsetY = event.clientY - node.getBoundingClientRect().top;

  function onMouseMove(event) {
    node.style.left = `${event.clientX - offsetX - scene.getBoundingClientRect().left}px`;
    node.style.top = `${event.clientY - offsetY - scene.getBoundingClientRect().top}px`;
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    updateInspector();
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

function hideAllScenes() {
  const scenes = document.getElementsByClassName("node");
  for (let i = 0; i < scenes.length; i++) {
      scenes[i].style.display = "none";
  }
}

function showAllScenes() {
  const scenes = document.getElementsByClassName("node");
  for (let i = 0; i < scenes.length; i++) {
      scenes[i].style.display = "flex";
  }
}

function showScene(sceneId) {
  hideAllScenes();
  const sceneNode = document.getElementById(sceneId);
  if (sceneNode) {
      sceneNode.style.display = "flex";
  }
}

function goToScene(sceneId) {
  const sceneNode = document.getElementById(sceneId);
  if (sceneNode) {
      showScene(sceneId);
  }
}

function updateInspector() {
  inspector.innerHTML = ''; // Clear previous content

  if (selectedNode) {
    // Name property
    const name = document.createElement('div');
    name.classList.add('property');
    name.innerHTML = `
      <label>Name:</label>
      <input type="text" value="${selectedNode.dataset.name || ''}">
    `;
    name.querySelector('input').addEventListener('change', (event) => {
      selectedNode.dataset.name = event.target.value;
      updateSelectedObjectList().updateSelectedObjectList();
    });
    inspector.appendChild(name);
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
}

function updateObjectList() {
  objectList.innerHTML = ''; // Clear previous content

  const nodes = document.querySelectorAll('.node');
  const objectDataList = [];

  nodes.forEach((node) => {
    const objectData = {
      type: "rectangle",
      width: parseInt(node.style.width) || 100,
      height: parseInt(node.style.height) || 100,
      x: parseInt(node.style.left),
      y: parseInt(node.style.top),
      color: node.style.backgroundColor || 'transparent',
      name: node.id || node.dataset.name
    };

    objectDataList.push(objectData);

    const listItem = document.createElement('li');
    listItem.textContent = objectData.name;
    listItem.classList = "listItem";
    listItem.id = node.id;
    listItem.setAttribute("list-type", node.getAttribute("data-type"));

    if (listItem.id == "World-Node") {listItem.classList.add("world-node");}

    listItem.addEventListener('click', () => {
      selectedNode = node;
      updateInspector();
      updateSelectedObjectList();
    });

    if (listItem.getAttribute("list-type") != "World-Node") {
      listItem.addEventListener('dblclick', function () {
        if (switched) {
          listItem.removeEventListener("dblclick");
        }

        const listItems = document.querySelectorAll(".listItem");
        listItems.forEach((item) => {
          if (item.id != node.id) {
            item.style.display = "none";
          }
        });

        goToScene(node.id);
        lastClicked = node.id;
        node.setAttribute("lastX", node.style.left);
        node.setAttribute("lastY", node.style.top);
        node.style.left = "650px";
        node.style.top = "300px";
        scene.style.transform = `scale(${scaleFactor}) translate(0px, 0px)`;
        document.querySelector(".world-node").style.display = "block";
        updateWorldNode();
        switched = true;

        console.log(lastClicked);
      });
    }
    else {
      listItem.addEventListener("dblclick", function () {
        const lastElement = document.getElementById(lastClicked);
        lastElement.style.left = lastElement.getAttribute("lastX");
        lastElement.style.top = lastElement.getAttribute("lastY");

        lastClicked = node.id;
        switched = false;
        updateObjectList();
        showAllScenes(); 
        updateWorldNode();

        console.log(lastClicked);
      });
    }

    updateSelectedObjectList();

    objectList.appendChild(listItem);
  });

  updateWorldNode();

  console.log(objectDataList);
}

function updateSelectedObjectList() {
  const listItems = document.querySelectorAll(".listItem");
  listItems.forEach((item) => {
    if (item.id === selectedNode.id) {
      item.classList.add('selected');
    } else {
      item.classList.remove('selected');
    }
  });
}

function updateWorldNode() {
  document.getElementById("World-Node").style.display = "none";
}

function getObjectDataList() {
  return objectDataList;
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

// Initial update of the object list and inspector
updateObjectList();
updateInspector();
