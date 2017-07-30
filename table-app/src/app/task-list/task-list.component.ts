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

  TIME_FORMAT_TIME = "HH:mm";
  TIME_FORMAT_DATETIME = "YYYY-MM-DD HH:mm";
  TIME_FORMAT_DATE = "YYYY-MM-DD";

  tasks: Task[];
  map = new Map();

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
    this.tasks.push(task);
  }

  static _sortEvents(a,b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  }

  _setMap() {
    // sort tasks
    this.tasks = this.tasks.sort(TaskListComponent._sortEvents);

    this.tasks.forEach(task => {

      // get date key
      let dateKey = moment(task.date, this.TIME_FORMAT_DATETIME).format(this.TIME_FORMAT_DATE);

      // get tasks list for date, append
      let currentTasks = this.map.get(dateKey);

      currentTasks = currentTasks || [];
      currentTasks.push(task);

      // set again
      this.map.set(dateKey, currentTasks);
    });

    console.log(this.map);
  }
}