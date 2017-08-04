import { Component, EventEmitter, OnInit, Output, ViewChild, NgModule, ViewContainerRef } from '@angular/core';
import { Task } from '../task';
import { FormsModule, NgForm }  from '@angular/forms';
import { TasksService } from '../tasks.service';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  providers: [TasksService]
})
@NgModule({
  imports: [ FormsModule, ToastModule.forRoot() ]
})

export class TaskFormComponent implements OnInit {
    TIME_FORMAT_DATETIME = "YYYY-MM-DD HH:mm";
    eventForm: NgForm;
    @ViewChild('eventForm') currentForm: NgForm;
    task: Task;
    date: NgbDateStruct;
    time: NgbTimeStruct;
    @Output() onSave = new EventEmitter<Task>();

    constructor(private tasksService: TasksService, private toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    onSubmit() {
      const form = this.currentForm.form;

      if (form.valid) {

          let postDate = new Date(this.date.year, this.date.month - 1, this.date.day, this.time.hour, this.time.minute, this.time.second);

          this.task.date = moment(postDate).format(this.TIME_FORMAT_DATETIME);

          this.tasksService.saveTask(this.task).subscribe(data => {
                this.onSave.emit(this.task); // send event to the parent component
                this.toastr.success('Task was successfully saved');
                this.currentForm.reset()
              },
              error => {
                this.toastr.error(`Error: Task was not saved! ${error}`);
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
