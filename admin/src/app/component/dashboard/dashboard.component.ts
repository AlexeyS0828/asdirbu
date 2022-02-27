import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { DatePipe } from '@angular/common';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ltLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
defineLocale("lt", ltLocale);


@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

	totalUser: number = 0;
	individualUser:number = 0;
	bussinessUser:number = 0;
	quickJobs:number = 0;
	totalEuro:number = 0;
	employeesEuro:number = 0;
	feesEuro:number = 0;
	constructor(
		private authService: AuthService,
		private router: Router,
		private dashboardService: DashboardService,
		private bsLocaleService:BsLocaleService
	) { 
		this.bsLocaleService.use("lt");
	}

	ngOnInit(): void {
		this.dashboardService.getDashboardData().subscribe(response => {
			if(response.success){
				this.totalUser = response.data.totalUsers;
				this.individualUser = response.data.individualUsers;
				this.bussinessUser = response.data.businessUsers;
				this.quickJobs = response.data.totalJobs;
				this.totalEuro = response.data.totalEuro;
				this.employeesEuro = response.data.employeesEuro;
				this.feesEuro = response.data.feesEuro;
			}
		});
	}

	logout(): void {
		this.authService.logout();
		this.router.navigate(['/']);
	}

	redirectToUser(): void {
		this.router.navigate(['/user']);
	}
	
    onCalendarValueChange(value: Date) {
        const startDate = new DatePipe('en-US').transform(value[0], 'yyyy-MM-dd');
        const endDate = new DatePipe('en-US').transform(value[1], 'yyyy-MM-dd');
		const params = {startDate,endDate};
		this.dashboardService.getTotalPayementByDate(params).subscribe(response => {
			if(response.success){
				// this.totalEuro = response.data.totalEuro;
				// this.employeesEuro = response.data.employeesEuro;
				// this.feesEuro = response.data.feesEuro;
				this.individualUser = response.data.individualUsers;
				this.bussinessUser = response.data.businessUsers;
				this.quickJobs = response.data.totalJobs;
				this.totalEuro = response.data.totalEuro;
				this.employeesEuro = response.data.employeesEuro;
				this.feesEuro = response.data.feesEuro;
			}
		});		
	}
}
