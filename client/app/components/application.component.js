import {Component, OnInit}        from 'angular2/core';
import {TaskService}              from '../services/task.service';
import {StopPropagationDirective} from '../directives/stop-propagation.directive';
import {Task}                     from '../classes/task.js';

@Component({
    selector: 'todo-app',
    templateUrl: '/templates/application.component.html',
    styleUrls: [
        'css/application.component.css'
    ],
    providers: [TaskService],
    directives: [StopPropagationDirective]
})
export class ApplicationComponent implements OnInit {
    tasks:Tasks[];

    selected:Task = null;
    creatingOrEditing:bool = false;
    edition:Task = null;

    constructor(_taskService:TaskService) {
        this._taskService = _taskService;
    }

    ngOnInit() {
        this._taskService.getTasks().then((tasks) => this.tasks = tasks);
    }

    toggleSelection(task:Task) {
        if (this.creatingOrEditing === false) {
            this.selected = this.isSelected(task) ? null : task;
        } else {
            if (this.edition.id !== task.id) {
                this._taskService.getById(task.id).then((task) => {
                    this.edition = Object.assign({}, task) || {};
                });
            }
        }
    }

    isSelected(task:Task) {
        return this.selected === task;
    }

    setEditing(task:Task) {
        this._taskService.getById(task.id).then((task) => {
            this.edition = Object.assign({}, task) || {};
            this.creatingOrEditing = true;
        });
    }

    save(task) {
        this._taskService.save(task);
        this._taskService.getTasks().then((tasks) => {
            this.tasks = tasks;

            this.creatingOrEditing = false;
            this.selected = null;
            this.edition = null;
        });
    }

    delete(task) {
        this._taskService.delete(task);
        this._taskService.getTasks().then((tasks) => {
            this.tasks = tasks;

            this.selected = null;
            this.edition = null;
        });
    }

    creatingOrEditing() {
        return this.creatingOrEditing;
    }
}
