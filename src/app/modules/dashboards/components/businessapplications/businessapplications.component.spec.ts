import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessapplicationsComponent } from './businessapplications.component';

describe('BusinessapplicationsComponent', () => {
  let component: BusinessapplicationsComponent;
  let fixture: ComponentFixture<BusinessapplicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessapplicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessapplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
