import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetablegridComponent } from './timetablegrid.component';

describe('TimetablegridComponent', () => {
  let component: TimetablegridComponent;
  let fixture: ComponentFixture<TimetablegridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimetablegridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimetablegridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
