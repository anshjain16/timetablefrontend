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
  availableSubjects = this.dataService.getSubjects();
  teachers = this.dataService.getTeachers();
  rooms = this.dataService.getRooms();
  ttSlots: any;
  days = ['Monday', "Tuesday", "Wednesday", "Thursday", "Friday"]
  timeSlots = ["9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 1:00", "1:00 - 2:00", "2:00 - 3:00", "3:00 - 4:00", "4:00 - 5:00", "5:00 - 6:00"];
  currentIndex: number = 0
  toAllocate: number[] = [];
  uniqueSlotCombinations: { [key: string]: number[] } = {};
  // availableSlots: 
  
  subjectForSlots: Slot[] = []
  
  constructor(private route: ActivatedRoute){
    this.route.params.subscribe(params => {
      this.class = params['classname']
    })
    console.log(this.class);
    this.ttSlots = this.dataService.getTimetableSlots(this.class) ? this.dataService.getTimetableSlots(this.class).subjects : [];
    console.log(this.ttSlots)
    this.ttSlots.forEach((slot:any, index:number) => {
      this.toAllocate[index] = slot.num_lectures - slot.slots.length;
      slot.slots.forEach((allocatedSlot:any) => {
          const uniqueSlot = `${allocatedSlot.day}#${allocatedSlot.time_slot}`;
          if (!this.uniqueSlotCombinations[uniqueSlot]) {
              this.uniqueSlotCombinations[uniqueSlot] = [];
          }
          this.uniqueSlotCombinations[uniqueSlot].push(index);
      });
    });
    console.log(this.toAllocate)
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
    this.ttSlots.forEach((slot:any, index:number) => {
      this.toAllocate[index] = slot.num_lectures - slot.slots.length;
    })
  }
  

  drag(ev: any, index: number): void {
    // ev.preventDefault();
    // const dataObject = \
    const ele = (ev.target as HTMLElement);
    const parent_class = ele.parentElement?.className || "";
    const parent_id = ele.parentElement?.id || "";
    this.currentIndex = index;
    // console.log(parent_ele)
    ev.dataTransfer.setData("text", `${ev.target.id},${parent_class},${parent_id},${index}`)
  }

  allowDrop(ev : any, time_slot: string, day: string) {
    const slot = this.ttSlots[this.currentIndex];

    const conflicts = this.dataService.getDataForTimeSlots(day, time_slot, this.class).filter(data =>
      data.teacher === slot.teacher || data.room === slot.room
    );
    
    let batchConflict = false;
    let roomConflict = false;
    let teacherConflict = false;
    
    for (const [idx, slot] of this.ttSlots.entries()) {
      if (idx === this.currentIndex) {
          continue;
      }

      const existingSlotIndex = slot.slots.findIndex(
          (s: any) => s.day === day && s.time_slot === time_slot
      );

      if (existingSlotIndex !== -1) {
          if (slot.room === slot.room) {
              roomConflict = true;
          }

          if (slot.teacher === slot.teacher) {
              teacherConflict = true;
          }

          if (slot.batchwise && slot.batchwise) {
              const commonBatches = slot.batches.filter((batch: string) =>
                  slot.batches.includes(batch)
              );
              if (commonBatches.length > 0) {
                  batchConflict = true;
              }
          } else if (!slot.batchwise || !slot.batchwise) {
              batchConflict = true;
          }
          if (roomConflict || teacherConflict || batchConflict) {
              break;
          }
      }
  }

    if (conflicts.length > 0 || batchConflict || roomConflict || teacherConflict) {
      return;
    }
    ev.preventDefault();
  }

  drop(ev: any, slot: string, day: string) {
    ev.preventDefault();
    console.log(slot, day)
    var [data, parent_class, parent_id, index] = ev.dataTransfer.getData("text").split(',');
    // console.log(parent_id)
    // console.log(data)
    console.log(parent_class)
    if(parent_class != "slotHolder"){
      this.removeTimeSlot(index, parent_id);
    }

    this.addTimeSlot(index, day, slot)

    const element = document.getElementById(data);
    if(element){
      element.style.position = "";
    }
    ev.target.appendChild(element);
  }


  getNumberArray(num: number): number[] {
    // console.log(Array(num).fill(0).map((x, i) => i))
    return Array(num).fill(0).map((x, i) => i);
  }

  getAdjustedIndex(index: number, slot: any): number {
    return index + slot.slots.length;
  }

  removeTimeSlot(index: number, slot_string: string){
    const ttslot = this.ttSlots[index];
    const slot_to_remove = slot_string.split('#');
    const slot_obj = {day: slot_to_remove[0], time_slot: slot_to_remove[1]};
    // console.log(slot_obj)
    const slotIndex = ttslot.slots.findIndex(
      (slot: any) => slot.day === slot_obj.day && slot.time_slot === slot_obj.time_slot
    );
    if (slotIndex !== -1) {
      this.ttSlots[index].slots.splice(slotIndex, 1);
    }
    if(this.uniqueSlotCombinations[slot_string]){
      const idx = this.uniqueSlotCombinations[slot_string].indexOf(index);
      if(idx != -1){
        this.uniqueSlotCombinations[slot_string].splice(idx, 1);
      }
    }
  }

  addTimeSlot(index: number, day: string, time: string){
    
    const slot_obj = {day: day, time_slot: time};
    this.ttSlots[index].slots.push(slot_obj);
    console.log(this.ttSlots)
    // this.dataService.getDataForTimeSlots(day, time, this.class)
  }

  saveTimetable(){
    this.dataService.saveTimetable(this.class, this.ttSlots);
  }

}
