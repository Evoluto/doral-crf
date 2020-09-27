import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationsAddComponent } from './communications-add.component';

describe('CommunicationsAddComponent', () => {
  let component: CommunicationsAddComponent;
  let fixture: ComponentFixture<CommunicationsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunicationsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
