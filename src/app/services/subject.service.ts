import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from '../models/subject.model';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private subjects: Subject[] = [];
  private subjectsSubject = new BehaviorSubject<Subject[]>(this.subjects);

  getSubjects(): Observable<Subject[]> {
    return this.subjectsSubject.asObservable();
  }

  addSubject(newSubject: Subject): void {
    this.subjects.push(newSubject);
    this.subjectsSubject.next(this.subjects);
  }

  updateSubject(updatedSubject: Subject): void {
    const index = this.subjects.findIndex((sub) => sub.id === updatedSubject.id);
    if (index !== -1) {
      this.subjects[index] = updatedSubject;
      this.subjectsSubject.next(this.subjects);
    }
  }

  deleteSubject(subjectId: number): void {
    this.subjects = this.subjects.filter((sub) => sub.id !== subjectId);
    this.subjectsSubject.next(this.subjects);
  }
}