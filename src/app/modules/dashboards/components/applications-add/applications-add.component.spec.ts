import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsAddComponent } from './applications-add.component';

describe('ApplicationsAddComponent', () => {
  let component: ApplicationsAddComponent;
  let fixture: ComponentFixture<ApplicationsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
