import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Class } from '../models/class.model';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private classes: Class[] = [];
  private classesSubject = new BehaviorSubject<Class[]>(this.classes);

  getClasses(): Observable<Class[]> {
    return this.classesSubject.asObservable();
  }

  addClass(newClass: Class): void {
    this.classes.push(newClass);
    this.classesSubject.next(this.classes);
  }

  updateClass(updatedClass: Class): void {
    const index = this.classes.findIndex((cls) => cls.id === updatedClass.id);
    if (index !== -1) {
      this.classes[index] = updatedClass;
      this.classesSubject.next(this.classes);
    }
  }

  deleteClass(classId: number): void {
    this.classes = this.classes.filter((cls) => cls.id !== classId);
    this.classesSubject.next(this.classes);
  }
}