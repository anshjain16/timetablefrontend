import { RouterModule, Routes } from '@angular/router';
import { ClassComponent } from './components/class/class.component';
import { SubjectComponent } from './components/subject/subject.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { RoomComponent } from './components/room/room.component';
import { BatchComponent } from './components/batch/batch.component';
import { TimetableInputComponent } from './components/timetable-input/timetable-input.component';
import { TimetableComponent } from './components/timetable/timetable.component';
export const routes: Routes = [
    { path: 'classes', component: ClassComponent },
    { path: 'subjects', component: SubjectComponent },
    { path: 'teachers', component: TeacherComponent },
    { path: 'rooms', component: RoomComponent },
    { path: 'batches', component: BatchComponent },
    { path: 'timetable', component: TimetableComponent},
    { path: 'input', component: TimetableInputComponent},
    { path: '', redirectTo: '/', pathMatch: 'full' },
];
