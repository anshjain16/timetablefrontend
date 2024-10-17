import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { DataService } from '../../data.service';
import { Subject } from '../../Subject';


@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [NgFor],
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.css',
  providers: [DataService]
})

export class SubjectComponent {
  dataService = inject(DataService)
  subjects: Subject[] = this.dataService.getSubjects()

  getSubjects(): Subject[] {
    return this.dataService.getSubjects();
  }

  addSubject(subjectName: HTMLInputElement): void {
    const subject = {name: subjectName.value} as Subject;
    this.dataService.addSubject(subject);
    this.subjects = this.getSubjects();
    subjectName.value = ''
  }

}
