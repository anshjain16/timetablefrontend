import { Component, OnInit } from '@angular/core';
import { SubjectService } from '../../services/subject.service';
import { Subject } from '../../models/subject.model';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
})
export class SubjectComponent implements OnInit {
  subjects: Subject[] = [];

  constructor(private subjectService: SubjectService) {}

  ngOnInit(): void {
    this.subjectService.getSubjects().subscribe((subjects) => (this.subjects = subjects));
  }

  addSubject(): void {
    const newSubject: Subject = {
      id: this.subjects.length + 1,
      name: `Subject ${this.subjects.length + 1}`,
      classId: 1, // Example classId
    };
    this.subjectService.addSubject(newSubject);
  }

  deleteSubject(subjectId: number): void {
    this.subjectService.deleteSubject(subjectId);
  }
}