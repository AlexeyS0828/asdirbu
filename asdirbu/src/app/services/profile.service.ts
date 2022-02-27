import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { apiConstants } from '../constants/api-constants';
import { AboutMe } from '../models/aboutMe.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    constructor(
        private http: HttpClient,
        private toastr: ToastrService
    ) { }

    saveAboutMeAndService(form: FormData): Observable<{ success: boolean, message: string}> {
        return this.http.post<{ success: boolean, message: string}>(apiConstants.saveAboutMe,form);
    }

    getAboutMeAndService() {
        return this.http.get<{ success: boolean, message: string, data: AboutMe }>(apiConstants.getAboutMe);
    }

    getTimesheets(startDate?: string, endDate?: string) {
        const timesheetParams = new URLSearchParams();
        if (startDate && endDate) {
            timesheetParams.set('startDate', startDate);
            timesheetParams.set('endDate', endDate);
        }
        const options = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        };
        return this.http.post<{ success: boolean, message: string, data: any }>(apiConstants.getTimeSheet,timesheetParams.toString(),options);
    }

    storeTimeSheets(params) {
        return this.http.post<{ success: boolean, message: string, data: any }>(apiConstants.storeTimeSheet,params);
    }
    
    getReview(params: any): Observable<{ success: boolean, message: string, data: any, pagination: number }> {
        return this.http.post<{ success: boolean, message: string, data: any, pagination: number }>(apiConstants.getReview, params);
    }
}

