import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Task } from './task'

@Injectable()
export class TasksService {

  private apiURL = '/api/events';  // URL to web api

  constructor(private http: Http) { }

  getTasks(): Promise<Task[]> {
    return this.http.get(this.apiURL)
        .toPromise()
        .then(response => response.json() as Task[])
        .catch(this.handleError);
  }

  saveTask(task: Task) {
    return this.http.post(this.apiURL, task)
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
