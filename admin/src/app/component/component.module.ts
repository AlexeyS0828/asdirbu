import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { BusinessComponent } from './business/business.component';
import { IndividualComponent } from './individual/individual.component';
import { QuickjobComponent } from './quickjob/quickjob.component';
import { BlogComponent } from './blog/blog.component';
import { TransactionComponent } from './transaction/transaction.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AuthGuard } from "src/app/guards/auth.guard";
import { AddUserComponent } from './add-user/add-user.component';

const routes: Routes = [
	{ path: '', component: LoginComponent },
	{
		path: '', component: LayoutComponent,canActivate:[AuthGuard], children: [
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'business', component: BusinessComponent },
			{ path: 'individual', component: IndividualComponent },
			{ path: 'quickjob', component: QuickjobComponent },
			{ path: 'blog', component: BlogComponent },
			{ path: 'transaction', component: TransactionComponent },
			{ path: 'edituser/:userId', component: EditUserComponent },
			{ path: 'adduser/:userType', component: AddUserComponent },
		]
	}];

@NgModule({
	declarations: [DashboardComponent, LoginComponent, LayoutComponent, BusinessComponent, IndividualComponent, QuickjobComponent, BlogComponent, TransactionComponent,EditUserComponent, AddUserComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		ReactiveFormsModule,
		FormsModule,
		DataTablesModule,
		BsDatepickerModule.forRoot(),
		RichTextEditorAllModule
	],
	providers:[AuthGuard]
})
export class ComponentModule { }
