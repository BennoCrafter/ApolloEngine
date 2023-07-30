function hideAllScenes() {
    const scenes = document.getElementsByClassName("scene");
    for (let i = 0; i < scenes.length; i++) {
        scenes[i].style.display = "none";
    }
}

function showScene(sceneNumber) {
    hideAllScenes();
    const scene = document.getElementById("scene" + sceneNumber);
    if (scene) {
        scene.style.display = "block";
    }
}

function goToScene(sceneNumber) {
    showScene(sceneNumber);
}