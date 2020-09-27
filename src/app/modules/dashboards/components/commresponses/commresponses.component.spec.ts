import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommresponsesComponent } from './commresponses.component';

describe('CommresponsesComponent', () => {
  let component: CommresponsesComponent;
  let fixture: ComponentFixture<CommresponsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommresponsesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommresponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
