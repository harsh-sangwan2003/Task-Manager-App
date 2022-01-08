import { taskOperations } from "../Model/task-operations.js";
import { doAjax } from "../../Utils/ajax.js";
import { initCount } from "../../Utils/id-generator.js";

window.addEventListener("load", init);

let incFn;
function init() {

    bindEvents();
    countUpdate();
    incFn = initCount();
    printId();
}

const printId = () => document.querySelector('#id').innerText = incFn.next().value;


function countUpdate() {

    let total = taskOperations.getLength();
    let marked = taskOperations.markedTasks();

    document.querySelector("#total-rec").innerText = total;
    document.querySelector("#marked-rec").innerText = marked;
    document.querySelector("#unmarked-rec").innerText = total - marked;
}

function bindEvents() {

    document.querySelector("#add").addEventListener("click", addTask);
    document.querySelector("#delete").addEventListener("click", deleteTasks);
    document.querySelector("#search").addEventListener("click", searchTask);
    document.querySelector("#update").addEventListener("click", updateTask);
    document.querySelector("#sort").addEventListener("click", sortTasks);
    document.querySelector("#save").addEventListener("click", saveTasks);
    document.querySelector("#load").addEventListener("click", loadTasks);
    document.querySelector("#load-server").addEventListener("click", loadFromServer);
    document.querySelector("#pr").addEventListener("change", updatePr);
    document.querySelector("#clear").addEventListener("click", clearBoxes);
}

function updatePr() {

    let val = document.querySelector("#pr").value;
    document.querySelector("#current-pr").innerText = val;
}

function searchTask() {


}

function sortTasks() {

    taskOperations.sort();
    printTasks();
}

function saveTasks() {

    if (window.localStorage) {

        localStorage.tasks = JSON.stringify(taskOperations.getAllTasks());
        alert("Data saved successfully");
    }

    else {

        alert("Oops! your browser doesn't support local storage!");
    }
}

function loadTasks() {

    if (window.localStorage) {

        if (localStorage.tasks) {

            let tasks = JSON.parse(localStorage.tasks);
            taskOperations.convertToTasks(tasks);
            printTasks();
            countUpdate();
            alert("Data loaded successfully");
        }

        else {

            alert("No data to be loaded!");
        }
    }

    else {

        alert("Oops! your browser doesn't support local storage!");
    }
}

function loadFromServer() {

    const promise = doAjax();

    promise.then(response => {

        response.json().then(object => {

            const taskList = object["task"];
            taskOperations.convertToTasks(taskList);
            printTasks();
            countUpdate();
        })
    }).catch(err => console.log("Server error ", err));
}

function clearBoxes() {

    for (let field of fields) {

        if (field == "id")
            continue;

        document.querySelector(`#${field}`).value = "";
    }

    document.querySelector("#pr").value = 0;
    document.querySelector("#id").focus();
}

const fields = ["id", "name", "desc", "date", "url", "pr"];
function addTask() {


    const task = {};

    for (let field of fields) {

        if (field == "id") {
            task[field] = document.querySelector(`#${field}`).innerText;
            continue;
        }

        task[field] = document.querySelector(`#${field}`).value;
    }

    taskOperations.add(task);
    printTask(task);
    countUpdate();
    clearBoxes();
}

let taskObject;
function edit() {

    let id = this.getAttribute("task-id");
    taskObject = taskOperations.search(id);

    for (let key in taskObject) {

        if (key == "mark" || key == "toggle")
            continue;

        if (key == "id") {
            document.querySelector(`#${key}`).innerText = taskObject[key];
            continue;
        }

        document.querySelector(`#${key}`).value = taskObject[key];
    }
}


function updateTask() {

    for (let key in taskObject) {

        if (key == "mark" || key == "toggle")
            continue;

        if (key == "id") {

            taskObject[key] = document.querySelector(`#${key}`).innerText;
            continue;
        }

        taskObject[key] = document.querySelector(`#${key}`).value;
    }

    printTasks();
}

function markForDelete() {

    let tr = this.parentNode.parentNode;
    let id = this.getAttribute("task-id");
    taskOperations.markDelete(id);
    countUpdate();
    tr.classList.toggle("alert-danger");
}

function deleteTasks() {

    taskOperations.remove();
    printTasks();
    countUpdate();
    clearBoxes();
}

function createIcon(className, fn, taskid) {

    let icon = document.createElement("i");
    icon.setAttribute("task-id", taskid);
    icon.className = `fas ${className} icon`;
    icon.addEventListener("click", fn);
    return icon;
}

function printTasks() {

    document.querySelector("#table-body").innerHTML = "";
    let tasks = taskOperations.getAllTasks();
    tasks.forEach(printTask);
}

function printTask(task) {

    let tbody = document.querySelector("#table-body");
    let tr = tbody.insertRow();
    let idx = 0;

    for (let key in task) {

        if (key == "mark" || key == "toggle")
            continue;

        tr.insertCell(idx).innerText = task[key];
        idx++;
    }

    let editIcon = createIcon("fa-edit me-3", edit, task.id);
    let deleteIcon = createIcon("fa-trash-alt", markForDelete, task.id);
    let td = tr.insertCell(idx);
    td.appendChild(editIcon);
    td.appendChild(deleteIcon);
    printId();
}

