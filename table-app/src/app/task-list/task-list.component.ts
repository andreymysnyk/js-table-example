import { Component, OnInit } from '@angular/core';
import { Task } from '../task';
import { TasksService } from '../tasks.service';
import * as moment from 'moment';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  providers: [TasksService]
})
export class TaskListComponent implements OnInit {

  TIME_FORMAT_DATE = "YYYY-MM-DD";

  tasks: Task[];
  map = new Map();
  dates = [];

  constructor(private tasksService: TasksService) {
  }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.tasksService.getTasks().then(tasks => {
      this.tasks = tasks;
      this._setMap();
    });
  }

  onSave(task: Task) {
    // copy obj to avoid binding
    let newTask = Object.assign({}, task);
    this.tasks.push(newTask);
    this._setMap()
  }

  static _sortEvents(a,b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  }

  _setMap() {
    this.map.clear();
    this.dates = [];

    // sort tasks
    this.tasks = this.tasks.sort(TaskListComponent._sortEvents);

    this.tasks.forEach(task => {

      // get date key
      let dateKey = moment(task.date).format(this.TIME_FORMAT_DATE);

      // get tasks list for date, append
      let currentTasks = this.map.get(dateKey);
      currentTasks = currentTasks || [];
      currentTasks.push(task);
      this.map.set(dateKey, currentTasks);

      // add to the dates array
      if (!this.dates.includes(dateKey)) {
        this.dates = [dateKey].concat(this.dates);
      }
    });
  }
}