import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessApplicationsComponent } from './businessapplications.component';

describe('BusinessApplicationsComponent', () => {
  let component: BusinessApplicationsComponent;
  let fixture: ComponentFixture<BusinessApplicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessApplicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
