import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasslistComponent } from './classlist.component';

describe('ClasslistComponent', () => {
  let component: ClasslistComponent;
  let fixture: ComponentFixture<ClasslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasslistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClasslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
