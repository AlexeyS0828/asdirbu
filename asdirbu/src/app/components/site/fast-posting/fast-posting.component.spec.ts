import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastPostingComponent } from './fast-posting.component';

describe('FastPostingComponent', () => {
  let component: FastPostingComponent;
  let fixture: ComponentFixture<FastPostingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastPostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
