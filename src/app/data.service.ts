import { Injectable } from '@angular/core';
import { Teacher } from './Teacher';
import { Class } from './Class';
import { Room } from './Room';
import { Subject } from './Subject';
import { Timetable } from './Timetable';
import { Slot } from './Slot';

@Injectable({
    providedIn: 'root'
  })
export class DataService {
    teachers: Teacher[] = [];
    classes: Class[] = [];
    rooms: Room[] = [];
    subjects: Subject[] = [];

    addTeacher(teacher: Teacher): void {
        const stored_teachers = sessionStorage.getItem("teachers");
        const teachers = stored_teachers ? JSON.parse(stored_teachers) : [];
        teachers.push(teacher);
        sessionStorage.setItem('teachers', JSON.stringify(teachers))
    }

    getTeachers(): Teacher[] {
        const stored_teachers = sessionStorage.getItem("teachers");
        const teachers = stored_teachers ? JSON.parse(stored_teachers) : [];
        return teachers
    }

    addClass(c: Class): void {
        const stored_classes = sessionStorage.getItem("classes");
        const classes = stored_classes ? JSON.parse(stored_classes) : [];
        classes.push(c);
        sessionStorage.setItem('classes', JSON.stringify(classes))
    }

    getClasses(): Class[] {
        const stored_classes = sessionStorage.getItem("classes");
        const classes = stored_classes ? JSON.parse(stored_classes) : [];
        return classes;
    }

    addRoom(room: Room): void {
        const stored_rooms = sessionStorage.getItem("rooms");
        const rooms = stored_rooms ? JSON.parse(stored_rooms) : [];
        rooms.push(room);
        sessionStorage.setItem('rooms', JSON.stringify(rooms))
    }

    getRooms(): Room[] {
        const stored_rooms = sessionStorage.getItem("rooms");
        const rooms = stored_rooms ? JSON.parse(stored_rooms) : [];
        return rooms
    }

    addSubject(subject: Subject): void {
        const stored_subjects = sessionStorage.getItem("subjects");
        const subjects = stored_subjects ? JSON.parse(stored_subjects) : [];
        subject.isUsed = false;
        subjects.push(subject);
        sessionStorage.setItem('subjects', JSON.stringify(subjects));
    }

    getSubjects(): Subject[] {
        const stored_subjects = sessionStorage.getItem("subjects");
        const subjects = stored_subjects ? JSON.parse(stored_subjects) : [];
        return subjects;
    }


    createTimetableSlot(slot: Slot, className: string, additional_teachers: string[]): void {
        const stored_timetables = sessionStorage.getItem("timetables");
        let timetables = stored_timetables ? JSON.parse(stored_timetables) as Timetable[] : [] as Timetable[];
        const filtered_timetable = timetables.filter(tt => tt.class_name == className);
        let timetable: Timetable;
        if(filtered_timetable.length == 0){
            timetable = {class_name: className, subjects: []} as Timetable;
        }
        else{
            timetable = filtered_timetable[0];
        }

        timetable.subjects.push({name: slot.name, teacher: slot.teacher, additional_teachers: additional_teachers, room: slot.room, batchwise: slot.batchwise, batches: slot.batches, num_lectures: slot.num_lectures, slots: []});
        timetables = timetables.filter(tt => tt.class_name != className);
        timetables.push(timetable);
        console.log(timetables)
        sessionStorage.setItem("timetables", JSON.stringify(timetables)) 

    }

    getTimetableSlots(className: string): Timetable {
        const stored_timetables = sessionStorage.getItem('timetables');
        const timetables = stored_timetables ? JSON.parse(stored_timetables) as Timetable[] : [] as Timetable[];
        // console.log(timetables)
        let required_timetables = timetables.filter(tt => tt.class_name == className);
        // console.log(className)
        return required_timetables[0];
    }

    saveTimetable(classname: string, slots: []){
        const stored_timetables = sessionStorage.getItem('timetables');
        const timetables = stored_timetables ? JSON.parse(stored_timetables) as Timetable[] : [] as Timetable[];
        // console.log(timetables)
        let required_timetables = timetables.filter(tt => tt.class_name == classname);
        required_timetables[0].subjects = slots
        var newtt = timetables.filter(tt => tt.class_name != classname);
        newtt.push(required_timetables[0]);
        sessionStorage.setItem("timetables", JSON.stringify(newtt));
    }

    getDataForTimeSlots(day: string, time: string, classname: string){
        const stored_timetables = sessionStorage.getItem('timetables');
        const timetables = stored_timetables ? JSON.parse(stored_timetables) as Timetable[] : [] as Timetable[];
        const required_timetables = timetables.filter(tt => tt.class_name != classname);
        const result = required_timetables
            .map(tt => {
                return tt.subjects.filter(subject => 
                    subject.slots.some(slot => slot.day === day && slot.time_slot === time)
                ).map(subject => ({
                    teacher: subject.teacher,
                    room: subject.room
                }));
            })
            .flat();
        // console.log(result);
        return result;
    }

}
