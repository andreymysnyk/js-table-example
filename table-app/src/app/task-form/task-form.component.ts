import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { Task } from '../task';
import { FormsModule, NgForm }  from '@angular/forms';
import { TasksService } from '../tasks.service';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  providers: [TasksService]
})
@NgModule({
  imports: [ FormsModule ]
})

export class TaskFormComponent implements OnInit {
    eventForm: NgForm;
    @ViewChild('eventForm') currentForm: NgForm;
    task: Task;
    date: NgbDateStruct;
    time: NgbTimeStruct;

    constructor(private tasksService: TasksService) {
    }

    dateFormat(date: Date, format: string) {
        format = format.replace("DD", (date.getDate() < 10 ? '0' : '') + date.getDate());
        format = format.replace("MM", (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1));
        format = format.replace("YYYY", date.getFullYear().toString());
        format = format.replace("HH", (date.getHours() < 10 ? '0' : '') + date.getHours());
        format = format.replace("mm", (date.getMinutes() < 10 ? '0' : '') + date.getMinutes());
        return format;
    }

    onSubmit() {
      const form = this.currentForm.form;

      if (form.valid) {

          let postDate = new Date(this.date.year, this.date.month - 1, this.date.day, this.time.hour, this.time.minute, this.time.second);

          this.task.date = this.dateFormat(postDate, "YYYY-MM-DD HH:mm");

          this.tasksService.saveTask(this.task).subscribe(data => console.log(data),
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
