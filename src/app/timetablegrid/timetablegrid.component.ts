// timetable-grid.component.ts
import { Component } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-timetable-grid',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './timetable-grid.component.html',
  styleUrls: ['./timetable-grid.component.css']
})
export class TimetableGridComponent {
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  times = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'];

  schedule: any[][] = [];

  constructor() {
    // Initialize the schedule with empty slots
    this.schedule = Array(this.times.length).fill(null).map(() => Array(this.days.length).fill(null));
  }

  drop(event: any, rowIndex: number, colIndex: number) {
    // Dummy drop function (populate this to handle data)
    const droppedData = event.item.data;
    this.schedule[rowIndex][colIndex] = droppedData;
  }
}
