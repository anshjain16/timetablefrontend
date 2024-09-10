import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  rooms: Room[] = [];

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.roomService.getRooms().subscribe((rooms) => (this.rooms = rooms));
  }

  addRoom(): void {
    const newRoom: Room = {
      id: this.rooms.length + 1,
      name: `Room ${this.rooms.length + 1}`,
      capacity: 30, // Example capacity
    };
    this.roomService.addRoom(newRoom);
  }

  deleteRoom(roomId: number): void {
    this.roomService.deleteRoom(roomId);
  }
}