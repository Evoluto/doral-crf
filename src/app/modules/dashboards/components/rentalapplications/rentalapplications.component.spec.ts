import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalapplicationsComponent } from './rentalapplications.component';

describe('RentalapplicationsComponent', () => {
  let component: RentalapplicationsComponent;
  let fixture: ComponentFixture<RentalapplicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentalapplicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalapplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
