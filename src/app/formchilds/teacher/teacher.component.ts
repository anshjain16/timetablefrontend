import { Component, inject } from '@angular/core';
import { DataService } from '../../data.service';
import { Teacher } from '../../Teacher';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [NgFor],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.css',
  providers: [DataService]
})
export class TeacherComponent {
  dataService = inject(DataService)
  teachers: Teacher[] = this.dataService.getTeachers();
  getTeachers(): Teacher[]{
    return this.dataService.getTeachers()
  }

  addTeacher(name: string, teacherName: HTMLInputElement): void{
    const teacher = {name: name} as Teacher
    this.dataService.addTeacher(teacher);
    this.teachers = this.getTeachers();
    teacherName.value = ''
  }

}
