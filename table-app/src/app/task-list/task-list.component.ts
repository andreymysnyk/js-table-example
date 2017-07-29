import { Component, OnInit } from '@angular/core';
import { Task } from '../task';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  providers: [TasksService]
})
export class TaskListComponent implements OnInit {

  tasks: Task[];

  constructor(private tasksService: TasksService) {
  }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.tasksService.getTasks().then(tasks => this.tasks = tasks);
  }

  onSave(task: Task) {
    //TODO
    console.log(task)
  }
}