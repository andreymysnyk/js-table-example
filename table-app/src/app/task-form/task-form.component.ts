import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { Task } from '../task';
import { FormsModule, NgForm }  from '@angular/forms';
import { TasksService } from '../tasks.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  providers: [TasksService]
})
@NgModule({
  imports: [ FormsModule, NgbModule.forRoot()]
})

export class TaskFormComponent implements OnInit {
    eventForm: NgForm;
    @ViewChild('eventForm') currentForm: NgForm;
    task: Task;
    model: NgbDateStruct;
    date: {year: number, month: number};
    time = {hour: 13, minute: 30};

    constructor(private tasksService: TasksService) {
    }

    onSubmit() {
      const form = this.currentForm.form;

      if (form.valid) {
          const date = form.value.date;
          const text = form.value.text;

          this.tasksService.saveTask(form.value).subscribe(data => console.log(data),
              error => {
                  console.log(error)
              }
          )
      }
    }

  ngOnInit() {
    this.task = new Task();
  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
      if (this.currentForm === this.eventForm) { return; }
      this.eventForm = this.currentForm;
      if (this.eventForm) {
          this.eventForm.valueChanges.subscribe(data => this.onValueChanged(data));
      }
  }

  onValueChanged(data?: any) {
      if (!this.eventForm) { return; }
      const form = this.eventForm.form;

      for (const field in this.formErrors) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
    
          if (control && control.dirty && !control.valid) {
              const messages = this.validationMessages[field];
              for (const key in control.errors) {
                  this.formErrors[field] += messages[key] + ' ';
              }
          }
      }
  }

  formErrors = {
      'date': '',
      'text': ''
  };

  validationMessages = {
      'text': {
          'required':      'Task details are required.',
          'minlength':     'Task details must be at least 5 characters long.',
          'maxlength':     'Task details cannot be more than 140 characters long.'
      },
      'date': {
          'required': 'Date is required.'
      }
  };

}
