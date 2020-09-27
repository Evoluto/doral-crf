import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalApplicationsComponent } from './rentalapplications.component';

describe('RentalApplicationsComponent', () => {
  let component: RentalApplicationsComponent;
  let fixture: ComponentFixture<RentalApplicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentalApplicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
