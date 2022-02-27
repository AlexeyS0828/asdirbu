import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessComponent } from './business.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataTablesModule } from 'angular-datatables';

describe('BusinessComponent', () => {
  let component: BusinessComponent;
  let fixture: ComponentFixture<BusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessComponent ],
      imports: [HttpClientTestingModule,DataTablesModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
