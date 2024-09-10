import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Room } from '../models/room.model';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private rooms: Room[] = [];
  private roomsSubject = new BehaviorSubject<Room[]>(this.rooms);

  getRooms(): Observable<Room[]> {
    return this.roomsSubject.asObservable();
  }

  addRoom(newRoom: Room): void {
    this.rooms.push(newRoom);
    this.roomsSubject.next(this.rooms);
  }

  updateRoom(updatedRoom: Room): void {
    const index = this.rooms.findIndex((rm) => rm.id === updatedRoom.id);
    if (index !== -1) {
      this.rooms[index] = updatedRoom;
      this.roomsSubject.next(this.rooms);
    }
  }

  deleteRoom(roomId: number): void {
    this.rooms = this.rooms.filter((rm) => rm.id !== roomId);
    this.roomsSubject.next(this.rooms);
  }
}