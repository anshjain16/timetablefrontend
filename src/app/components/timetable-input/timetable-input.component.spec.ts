import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableInputComponent } from './timetable-input.component';

describe('TimetableInputComponent', () => {
  let component: TimetableInputComponent;
  let fixture: ComponentFixture<TimetableInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimetableInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimetableInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
