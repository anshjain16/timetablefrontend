import { Component, inject } from '@angular/core';
import { DataService } from '../data.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { Teacher } from '../Teacher';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatTabsModule, NgFor],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  providers: [DataService]
})
export class FormComponent {
  
  constructor(private router: Router){
    
  }
  
  dataService = inject(DataService)
  sections = ["teacher", "class", "room", "subject"]
  active_section = this.sections[0]

  setTab(tabname: string) {
    this.router.navigate([`/${tabname}`]);
  }
}
