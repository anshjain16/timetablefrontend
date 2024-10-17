import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { DataService } from '../../data.service';
import { Class } from '../../Class';

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [NgFor],
  templateUrl: './class.component.html',
  styleUrl: './class.component.css',
  providers: [DataService]
})


export class ClassComponent {
  dataService = inject(DataService);
  classes: Class[] = this.dataService.getClasses();

  getClasses(): Class[] {
    return this.dataService.getClasses();
  }

  addClass(batches: HTMLInputElement, newClass: HTMLInputElement): void {
    const numBatches = Number(batches.value);
    const myClass = {name: newClass.value, num_batches: numBatches} as Class;
    this.dataService.addClass(myClass);
    this.classes = this.getClasses();
    batches.value = '';
    newClass.value = '';
  }
  
}
