import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Teacher } from '../models/teacher.model';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private teachers: Teacher[] = [];
  private teachersSubject = new BehaviorSubject<Teacher[]>(this.teachers);

  getTeachers(): Observable<Teacher[]> {
    return this.teachersSubject.asObservable();
  }

  addTeacher(newTeacher: Teacher): void {
    this.teachers.push(newTeacher);
    this.teachersSubject.next(this.teachers);
  }

  updateTeacher(updatedTeacher: Teacher): void {
    const index = this.teachers.findIndex((tch) => tch.id === updatedTeacher.id);
    if (index !== -1) {
      this.teachers[index] = updatedTeacher;
      this.teachersSubject.next(this.teachers);
    }
  }

  deleteTeacher(teacherId: number): void {
    this.teachers = this.teachers.filter((tch) => tch.id !== teacherId);
    this.teachersSubject.next(this.teachers);
  }
}