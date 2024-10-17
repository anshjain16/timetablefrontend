import { Routes } from '@angular/router';
import { TeacherComponent } from '../formchilds/teacher/teacher.component';
import { RoomComponent } from '../formchilds/room/room.component';
import { SubjectComponent } from '../formchilds/subject/subject.component';
import { ClassComponent } from '../formchilds/class/class.component';

export const routes: Routes = [
    {path: 'teacher', component: TeacherComponent},
    {path: 'room', component: RoomComponent},
    {path: 'subject', component: SubjectComponent},
    {path: 'class', component: ClassComponent}
];
