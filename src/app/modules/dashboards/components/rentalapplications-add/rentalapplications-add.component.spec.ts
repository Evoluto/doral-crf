import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalApplicationsAddComponent } from './rentalapplications-add.component';

describe('RentalApplicationsAddComponent', () => {
  let component: RentalApplicationsAddComponent;
  let fixture: ComponentFixture<RentalApplicationsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentalApplicationsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalApplicationsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
