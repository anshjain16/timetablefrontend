import { Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { TeacherComponent } from './formchilds/teacher/teacher.component';
import { RoomComponent } from './formchilds/room/room.component';
import { SubjectComponent } from './formchilds/subject/subject.component';
import { ClassComponent } from './formchilds/class/class.component';
import { InfoformComponent } from './infoform/infoform.component';

export const routes: Routes = [
    // {path: "form", component: FormComponent},
    {path: 'teacher', component: TeacherComponent},
    {path: 'room', component: RoomComponent},
    {path: 'subject', component: SubjectComponent},
    {path: 'class', component: ClassComponent},
    {path: 'info/:classname', component: InfoformComponent}
];
