import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSuccessPopupComponent } from './appointment-success-popup.component';

describe('AppointmentSuccessPopupComponent', () => {
  let component: AppointmentSuccessPopupComponent;
  let fixture: ComponentFixture<AppointmentSuccessPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentSuccessPopupComponent]
    });
    fixture = TestBed.createComponent(AppointmentSuccessPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
