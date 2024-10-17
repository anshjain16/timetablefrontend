import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { DataService } from '../../data.service';
import { Room } from '../../Room';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [NgFor],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css',
  providers: [DataService]
})


export class RoomComponent {
  dataService = inject(DataService)
  rooms: Room[] = this.dataService.getRooms();

  getRooms(): Room[] {
    return this.dataService.getRooms();
  }

  addRoom(quantity: HTMLInputElement, room: HTMLInputElement): void {
    const numQuantity = Number(quantity.value);
    const newroom = {name: room.value, quantity: numQuantity} as Room;
    this.dataService.addRoom(newroom);
    this.rooms = this.getRooms();
    quantity.value = '';
    room.value = '';
  }

}
