import {Injectable} from 'angular2/core';
import {Task}       from '../classes/task.js';

const storageKey = 'kookie.todo.tasks'

function generateId(limit) {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        len = chars.length,
        generate = [];

    for (var i = 0, l = (limit||16); i < l; ++i) {
        generate.push(chars[Math.floor(Math.random() * len)]);
    }
    return generate.join('');
}

function _newTask(service:TaskService, newTask:Task) {
    let task = Object.assign({}, {id: generateId(40), completed: false}, newTask),
        tasks = localStorage.getItem(storageKey);

    tasks = tasks ? JSON.parse(tasks) : [];
    tasks.push(task);
    localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function _updateTask(service:TaskService, newTask:Task) {
    let task = Object.assign({}, {completed: false}, newTask),
        tasks = localStorage.getItem(storageKey), idx = -1;

    tasks = tasks ? JSON.parse(tasks) : [];
    tasks.forEach((v, k) => {
        if (v.id === task.id) {
            idx = k;
        }
    });

    if (idx === -1) {
        throw 'Data could not be retrieved';
    }

    tasks[idx] = task;
    localStorage.setItem(storageKey, JSON.stringify(tasks));
}

@Injectable()
export class TaskService {
    getTasks() {
        let tasks = localStorage.getItem(storageKey);
        return Promise.resolve(tasks ? JSON.parse(tasks) : []);
    }

    getById(id) {
        let tasks = localStorage.getItem(storageKey), idx = -1;
        return (new Promise((resolve, reject) => {
            tasks = tasks ? JSON.parse(tasks) : [];
            tasks.forEach((v, k) => v.id === id && resolve(v));
            reject();
        }));
    }

    save(task) {
        return !task.id ? _newTask(this, task) : _updateTask(this, task);
    }

    delete(task) {
        let tasks = localStorage.getItem(storageKey), idx = -1;
        return (new Promise((resolve, reject) => {
            tasks = tasks ? JSON.parse(tasks) : [];
            tasks = tasks.filter((v) => v.id !== task.id);
            localStorage.setItem(storageKey, JSON.stringify(tasks));
            resolve();
        }));
    }
}
