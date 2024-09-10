import { Component, OnInit } from '@angular/core';
import { ClassService } from '../../services/class.service';
import { Class } from '../../models/class.model';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css'],
})
export class ClassComponent implements OnInit {
  classes: Class[] = [];

  constructor(private classService: ClassService) {}

  ngOnInit(): void {
    this.classService.getClasses().subscribe((classes) => (this.classes = classes));
  }

  addClass(): void {
    const newClass: Class = {
      id: this.classes.length + 1,
      name: `Class ${this.classes.length + 1}`,
      year: 2, // Example year
    };
    this.classService.addClass(newClass);
  }

  deleteClass(classId: number): void {
    this.classService.deleteClass(classId);
  }
}