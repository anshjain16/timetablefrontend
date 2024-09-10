import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Define types for days and hours
type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
type Hour = '8:00' | '9:00' | '10:00' | '11:00';

interface Timetable {
  [day: string]: {
    [hour: string]: string[];
  };
}

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  days: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  hours: Hour[] = ['8:00', '9:00', '10:00', '11:00'];

  timetable: Timetable = {
    Monday: {
      '8:00': ['Class A', 'Class B'],
      '9:00': ['Class C'],
      '10:00': ['Class A'],
      '11:00': []
    },
    Tuesday: {
      '8:00': ['Class B'],
      '9:00': ['Class C'],
      '10:00': [],
      '11:00': ['Class A', 'Class C']
    },
    Wednesday: {
      '8:00': ['Class A'],
      '9:00': ['Class B', 'Class C'],
      '10:00': [],
      '11:00': []
    },
    Thursday: {
      '8:00': ['Class C'],
      '9:00': ['Class A'],
      '10:00': ['Class B'],
      '11:00': []
    },
    Friday: {
      '8:00': [],
      '9:00': ['Class A', 'Class B'],
      '10:00': ['Class C'],
      '11:00': []
    }
  };

  classesToSchedule = ['Class A', 'Class B', 'Class C', 'Class D', 'Class E'];

  class!: string;
  teacher!: string;
  room!: string;

  ngOnInit() {
    const timetableData = JSON.parse(localStorage.getItem('timetableData') || '{}');
    this.class = timetableData.class || 'Default Class';
    this.teacher = timetableData.teacher || 'Default Teacher';
    this.room = timetableData.room || 'Default Room';
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
