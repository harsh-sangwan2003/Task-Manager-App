import { Task } from "./task-data.js";

export const taskOperations = {

    tasks: [],
    getLength() {

        return this.tasks.length;
    },
    getAllTasks() {

        return this.tasks;
    },
    convertToTasks(tasks) {

        this.tasks = tasks.map(
            task => new Task(task.id, task.name, task.desc, task.date, task.url, task.pr)
        );
    },
    add(task) {

        let taskObject = new Task(task.id, task.name, task.desc, task.date, task.url, task.pr);
        this.tasks.push(taskObject);
    },
    search(id) {

        return this.tasks.find(task => task.id == id);
    },
    markDelete(id) {

        let taskObject = this.search(id);

        if (taskObject)
            taskObject.toggle();
    },
    markedTasks() {

        return this.tasks.filter(task => task.mark).length;
    },
    remove() {

        this.tasks = this.tasks.filter(task => !task.mark);
    },
    sort() {

        this.tasks = this.tasks.sort((a, b) => a.pr - b.pr);
    }
}