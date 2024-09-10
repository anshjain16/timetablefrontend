// class-list.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.css']
})
export class ClassListComponent {
  classes = [
    { name: 'Biology 101', code: 'BIO101', instructor: 'Dr. Smith', time: '8:00 AM' },
    { name: 'Chemistry 201', code: 'CHE201', instructor: 'Dr. Adams', time: '9:00 AM' },
    { name: 'Physics 101', code: 'PHY101', instructor: 'Dr. Brown', time: '10:00 AM' }
  ];
}
