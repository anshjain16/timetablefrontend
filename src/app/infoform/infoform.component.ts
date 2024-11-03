import { Component, inject } from '@angular/core';
import { NgFor, NgIf, NgStyle, NgClass } from '@angular/common';
import { DataService } from '../data.service';
import { Subject } from '../Subject';
import { ActivatedRoute } from '@angular/router';
import { Slot } from '../Slot';
import { Timetable } from '../Timetable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-infoform',
  standalone: true,
  imports: [NgFor, NgIf, NgStyle, NgClass],
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
  additionalTeachers: { [subjectName: string]: string[] } = {};
  showConflictTooltip: boolean = false;
  conflictMessage: string = '';
  tooltipPosition = { x: 0, y: 0 };
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
      this.additionalTeachers[slot.name] = slot.additional_teachers ? slot.additional_teachers : [];
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
    console.log(this.additionalTeachers)
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

  addTeacher(subjectName: string, teacherName: string) {
    if (!teacherName) return;
    
    
    if (!this.additionalTeachers[subjectName]) {
        this.additionalTeachers[subjectName] = [];
    }
    
    this.additionalTeachers[subjectName].push(teacherName);
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
    this.dataService.createTimetableSlot(subject, this.class, this.additionalTeachers[subject.name])
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
    const currentSlot = this.ttSlots[this.currentIndex];

    const conflicts = this.dataService.getDataForTimeSlots(day, time_slot, this.class).filter(data =>
      data.teacher === currentSlot.teacher || data.room === currentSlot.room
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
          if (slot.room === currentSlot.room) {
              roomConflict = true;
          }

          if (slot.teacher === currentSlot.teacher) {
              teacherConflict = true;
          }

          if (slot.batchwise && currentSlot.batchwise) {
              const commonBatches = slot.batches.filter((batch: string) =>
                  currentSlot.batches.includes(batch)
              );
              if (commonBatches.length > 0) {
                  batchConflict = true;
              }
          } else if (!slot.batchwise || !currentSlot.batchwise) {
              batchConflict = true;
          }
          if (roomConflict || teacherConflict || batchConflict) {
              break;
          }
      }
  }

    if (conflicts.length > 0 || batchConflict || roomConflict || teacherConflict) {
      this.showConflictTooltip = true;
      this.tooltipPosition = { x: ev.clientX + 50, y: ev.clientY + 50 };
      this.conflictMessage = this.getConflictMessage(conflicts, roomConflict, teacherConflict, batchConflict);
      return;
    }
    ev.preventDefault();
  }

  onDragLeave() {
    this.showConflictTooltip = false;
  }

  getConflictMessage(conflicts: any[], room: boolean, teacher: boolean, batch: boolean): string {
    const messages = conflicts.map(conflict => {
        if (conflict.teacher === this.ttSlots[this.currentIndex].teacher) {
            return `Teacher ${conflict.teacher} is already assigned at this time.`;
        }
        if (conflict.room === this.ttSlots[this.currentIndex].room) {
            return `Room ${conflict.room} is occupied at this time.`;
        }
        return ''; 
    });

    // console.log(room, teacher, batch)
    if (room) messages.push("Room conflict with an existing slot.");
    if (teacher) messages.push("Teacher conflict with an existing slot.");
    if (batch) messages.push("Batch conflict with an overlapping batch.");

    return messages.filter(msg => msg).join(" ");
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


  exportTimetableToExcel() {
    const sheetData: any[][] = [];
    sheetData.push(['Day', ...this.timeSlots]); 

    this.days.forEach(day => {
      const row = [day]; 

      this.timeSlots.forEach(slot => {
        const slotKey = `${day}#${slot}`;
        if (this.uniqueSlotCombinations[slotKey]?.length) {
          const slotDetails = this.uniqueSlotCombinations[slotKey].map(idx => {
            const slot = this.ttSlots[idx];
            
            const batchInfo = slot.batchwise ? slot.batches.join(', ') : '';
            return [slot.name, slot.teacher, batchInfo, slot.room];
          });

          
          const flattenedDetails = slotDetails.flat().filter(detail => detail).join('\n');
          row.push(flattenedDetails);
        } else {
          row.push('');
        }
      });

      sheetData.push(row);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Timetable');

    
    const colWidths = [
      { wpx: 100 },
      ...this.timeSlots.map(() => ({ wpx: 150 })) 
    ];
    ws['!cols'] = colWidths;

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Timetable.xlsx';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

}
