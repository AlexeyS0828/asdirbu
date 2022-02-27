import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiConstants } from 'src/app/constants/api-constants';

@Injectable({
	providedIn: 'root'
})

export class DashboardService {

	constructor(private http: HttpClient) { }

	getDashboardData(): Observable<{ success: boolean, message: string, data: any }> {
		return this.http.get<{ success: boolean, message: string, data: any }>(apiConstants.dashboard);
	}

	getTotalPayementByDate(params): Observable<{ success: boolean, message: string, data: any }> {
		return this.http.post<{ success: boolean, message: string, data: any }>(apiConstants.getTotalPayementByDate,params);
	}
}
