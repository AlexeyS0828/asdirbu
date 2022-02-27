import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickjobComponent } from './quickjob.component';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('QuickjobComponent', () => {
  let component: QuickjobComponent;
  let fixture: ComponentFixture<QuickjobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickjobComponent ],
      imports:[DataTablesModule,HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickjobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
