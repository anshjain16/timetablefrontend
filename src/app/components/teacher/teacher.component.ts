import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../services/teacher.service';
import { Teacher } from '../../models/teacher.model';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
})
export class TeacherComponent implements OnInit {
  teachers: Teacher[] = [];

  constructor(private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.teacherService.getTeachers().subscribe((teachers) => (this.teachers = teachers));
  }

  addTeacher(name: string): void {
    const newTeacher: Teacher = {
      id: this.teachers.length + 1,
      name: name,
      subjectIds: [],
    };
    this.teacherService.addTeacher(newTeacher);
  }

  deleteTeacher(teacherId: number): void {
    this.teacherService.deleteTeacher(teacherId);
  }
}