function getTemplate(templateID) {
    let template = document.getElementById(templateID);
    template = document.importNode(template.content, true);
    return template;
}

function addToContainer(node) {
    document.getElementById("container").appendChild(node);
}

function clearContainer() {
    
    
    let taskContainer = document.getElementById("taskContainer")
    while (taskContainer.firstChild) {
        taskContainer.removeChild(taskContainer.firstChild);
        taskContainer.style.display = "none";
    }
    
    



    /* while (container.firstChild) {
        container.removeChild(container.firstChild);
    }*/
}



function clearList(){
let listView = document.getElementById("listView")
    while (listView.firstChild) {
        listView.removeChild(listView.firstChild);
        listView.style.display = "none";
    }

    let listheader = document.getElementById("listHeader")
    while (listheader.firstChild) {
        listheader.removeChild(listheader.firstChild);
        listheader.style.display = "none";
    }

  

}

function log(...messages) {
    if (DEBUG) {
        messages.forEach(msg => {
            console.log(msg);
        })
    }
}
