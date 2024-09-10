import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatSelectModule } from '@angular/material/select';  
import { MatButtonModule } from '@angular/material/button';  

@Component({
  selector: 'app-timetable-input',
  standalone: true,
  imports:[
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule],
  templateUrl: './timetable-input.component.html'
})
export class TimetableInputComponent {
  timetableForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.timetableForm = this.fb.group({
      class: [''],
      teacher: [''],
      room: ['']
    });
  }

  onSubmit() {
    const formData = this.timetableForm.value;

    // Save the form data (maybe in a service)
    localStorage.setItem('timetableData', JSON.stringify(formData));

    // Navigate to the timetable creation page
    this.router.navigate(['/timetable']);
  }
}
