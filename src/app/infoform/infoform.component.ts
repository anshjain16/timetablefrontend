import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { DataService } from '../data.service';
import { Subject } from '../Subject';
import { ActivatedRoute } from '@angular/router';
import { Slot } from '../Slot';
import { Timetable } from '../Timetable';

@Component({
  selector: 'app-infoform',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './infoform.component.html',
  styleUrl: './infoform.component.css',
  providers: [DataService]
})


export class InfoformComponent {
  dataService = inject(DataService);
  class: string = "";
  availableSubjects = this.dataService.getSubjects(); // replace with new method getnotusedsubjects
  teachers = this.dataService.getTeachers();
  rooms = this.dataService.getRooms();
  ttSlots: any;
  days = ['Monday', "Tuesday", "Wednesday", "Thursday", "Friday"]
  timeSlots = ["9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 1:00", "1:00 - 2:00", "2:00 - 3:00", "3:00 - 4:00", "4:00 - 5:00", "5:00 - 6:00"];
  // availableSlots: 
  
  subjectForSlots: Slot[] = []
  
  constructor(private route: ActivatedRoute){
    this.route.params.subscribe(params => {
      this.class = params['classname']
    })
    console.log(this.class);
    this.ttSlots = this.dataService.getTimetableSlots(this.class) ? this.dataService.getTimetableSlots(this.class).subjects : [];
    console.log(this.ttSlots)
  }

  addSubject(subject: HTMLSelectElement): void {
    console.log(subject.value)
    let newSlot= {name: subject.value, batchwise: false, slot_id: 1} as Slot;
    let filteredResults = this.subjectForSlots.filter(slot => slot.name == subject.value);
    // console.log(filteredResults)
    if(filteredResults.length > 0){
      let slotId = 1;
      filteredResults.forEach(slot => {
        slot.slot_id = slotId++;
        slot.batchwise = true;
      });
      this.subjectForSlots = this.subjectForSlots.filter(slot => slot.name != subject.value);
      this.subjectForSlots.push(...filteredResults);
      newSlot.batchwise = true;
      newSlot.slot_id = filteredResults.length + 1;
    }
    if(filteredResults[0]?.batchwise == true){
      newSlot.batchwise = true;
      newSlot.slot_id = filteredResults.length + 1;
    }
    console.log(newSlot)
    this.subjectForSlots.push(newSlot)
    // console.log(this.subjectForSlots);
  }

  onBatchwiseChange(subject: string, batchwise: HTMLInputElement): void {
    // check if it is already batchwise or not, and what kind of change is coming
    let currentSlots = this.subjectForSlots.filter(slot => slot.name == subject);
    if(batchwise.checked == false){
      currentSlots[0].batchwise = false;
      let filteredResults = this.subjectForSlots.filter(slot => slot.name != subject);
      filteredResults.push(currentSlots[0]);
      this.subjectForSlots = filteredResults;
    }
    else{
      let newSlot = currentSlots[0];
      newSlot.batches = [];
      newSlot.batchwise = true;
      let filteredResults = this.subjectForSlots.filter(slot => slot.name != subject);
      filteredResults.push(newSlot);
      this.subjectForSlots = filteredResults;
    }
  }


  createSlot(teacher: HTMLSelectElement, room: HTMLSelectElement, batchwise: HTMLInputElement, lectures: HTMLSelectElement, subject: Slot): void {
    // let batchesArr = batches.value.split(",");
    // console.log(teacher.value, room.value, batchwise, lectures, batchesArr, subject, subject.slot_id)
    const batchesArr = (document.getElementById(`batch${subject.name}${subject.slot_id}`) as HTMLInputElement)?.value.split(",")
    // console.log(batchesArr)
    subject.teacher = teacher.value;
    subject.batches = batchesArr;
    subject.batchwise = batchwise.checked;
    subject.num_lectures = Number(lectures.value);
    subject.room = room.value;
    this.dataService.createTimetableSlot(subject, this.class)
    this.subjectForSlots = this.subjectForSlots.filter(slot => {
      slot.name !== subject.name && slot.slot_id !== subject.slot_id
    })
    this.ttSlots = this.dataService.getTimetableSlots(this.class).subjects
  }
  

  drag(ev: any): void {
    // ev.preventDefault();
    ev.dataTransfer.setData("text", ev.target.id)
  }

  allowDrop(ev : any, slot: string, day: string) {
    ev.preventDefault();
    // var data = ev.dataTransfer.getData("text");
    // var ele = document.getElementById(data) as HTMLDivElement;
    // console.log()
  }

  drop(ev: any, slot: string, day: string) {
    ev.preventDefault();
    console.log(slot, day)
    var data = ev.dataTransfer.getData("text");
    console.log(data)
    ev.target.appendChild(document.getElementById(data));
  }


  getNumberArray(num: number): number[] {
    return Array(num).fill(0).map((x, i) => i);
  }


}
