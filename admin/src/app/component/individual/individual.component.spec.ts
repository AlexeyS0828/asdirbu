import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualComponent } from './individual.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DataTablesModule } from 'angular-datatables';

describe('IndividualComponent', () => {
  let component: IndividualComponent;
  let fixture: ComponentFixture<IndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule,DataTablesModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
