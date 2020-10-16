import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessapplicationsViewComponent } from './businessapplications-view.component';

describe('BusinessapplicationsViewComponent', () => {
  let component: BusinessapplicationsViewComponent;
  let fixture: ComponentFixture<BusinessapplicationsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessapplicationsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessapplicationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
