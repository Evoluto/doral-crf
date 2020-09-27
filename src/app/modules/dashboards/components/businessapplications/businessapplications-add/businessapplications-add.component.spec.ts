import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessApplicationsAddComponent } from './businessapplications-add.component';

describe('BusinessApplicationsAddComponent', () => {
  let component: BusinessApplicationsAddComponent;
  let fixture: ComponentFixture<BusinessApplicationsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessApplicationsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessApplicationsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
