import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent {

  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('Form Data:', form.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
