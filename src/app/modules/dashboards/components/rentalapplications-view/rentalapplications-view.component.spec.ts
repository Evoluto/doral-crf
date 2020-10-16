import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalapplicationsViewComponent } from './rentalapplications-view.component';

describe('RentalapplicationsViewComponent', () => {
  let component: RentalapplicationsViewComponent;
  let fixture: ComponentFixture<RentalapplicationsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentalapplicationsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalapplicationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
