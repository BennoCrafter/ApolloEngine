const scene = document.getElementById('scene');
const inspector = document.getElementById('inspector');
const objectList = document.getElementById('object-list');
let selectedNode = null;

let scaleFactor = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;

function createNode() {
  scene.addEventListener('click', onSceneClickOnce);

  function onSceneClickOnce(event) {
    scene.removeEventListener('click', onSceneClickOnce);
    
    const newNode = document.createElement('div');
    newNode.classList.add('node');
    newNode.textContent = 'Node';
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
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  selectedNode = node;
  updateInspector();
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
      updateInspector();
    }
  });

  // Add grid lines to the scene
  const gridLines = document.createElement('div');
  gridLines.classList.add('grid-lines');
  scene.appendChild(gridLines);
});

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
      updateObjectList();
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
      selectedNode.style.left = `${event.target.value}`;
    });
    inspector.appendChild(positionX);

    const positionY = document.createElement('div');
    positionY.classList.add('property');
    positionY.innerHTML = `
      <label>Y:</label>
      <input type="text" value="${parseInt(selectedNode.style.top)}">
    `;
    positionY.querySelector('input').addEventListener('change', (event) => {
      selectedNode.style.top = `${event.target.value}`;
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
    });
    inspector.appendChild(height);
  }
}

function updateObjectList() {
  objectList.innerHTML = ''; // Clear previous content

  const nodes = document.querySelectorAll('.node');
  nodes.forEach((node, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = node.dataset.name || `Object ${index + 1}`;

    listItem.addEventListener('click', () => {
      selectedNode = node;
      updateInspector();
      // Highlight the selected node in the object list
      nodes.forEach(node => {
        if (node === selectedNode) {
          node.classList.add('selected');
        } else {
          node.classList.remove('selected');
        }
      });
    });

    // Add 'selected' class to highlight the selected node in the object list
    if (node === selectedNode) {
      listItem.classList.add('selected');
    }

    objectList.appendChild(listItem);
  });
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
