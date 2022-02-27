import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { apiConstants } from '../constants/api-constants';
import { AuthService } from '../services/auth.service';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeService {
    constructor(
        private http: HttpClient,
        private router: Router,
        private toastr: ToastrService,
        private authService:AuthService
    ) { }

    getHomePageDetails(params: any) {
        const homeParams = new URLSearchParams();
        homeParams.set('newUserPage', params.newUserPage.toString());
        homeParams.set('jobPage', params.jobPage.toString());
        let userId = "0";
        if(this.authService.getUser()) {
           userId =  this.authService.getUser();
        }
        homeParams.set('user_id',userId);

        const options = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        };

        return this.http
            .post<{ success: boolean, message: string, data: any }>(
                apiConstants.home,
                homeParams.toString(),
                options
            );
    }

    getSearchFilterHomePageDetails(params: any) {
        const homeParams = new URLSearchParams();
        homeParams.set('newUserPage', params.newUserPage.toString());
        homeParams.set('jobPage', params.jobPage.toString());
        homeParams.set('specialty', params.specialty);
        homeParams.set('otherSpecialty', params.otherSpecialty);
        homeParams.set('city', params.city);
        homeParams.set('latitude', params.latitude);
        homeParams.set('longitude', params.longitude);
        homeParams.set('serviceName', params.serviceName);
        homeParams.set('otherServiceName', params.otherServiceName);
        let userId = "0";
        if(this.authService.getUser()) {
           userId =  this.authService.getUser();
        }
        homeParams.set('user_id',userId);

        const options = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        };

        return this.http
            .post<{ success: boolean, message: string, data: any }>(
                apiConstants.homeSearchFilter,
                homeParams.toString(),
                options
            );
    }

    getRangeFilterHomePageDetails(params: any) {
        const homeParams = new URLSearchParams();
        homeParams.set('newUserPage', params.newUserPage.toString());
        homeParams.set('jobPage', params.jobPage.toString());
        homeParams.set('price', params.perHour.toString());
        homeParams.set('distance', params.distance.toString());
        homeParams.set('latitude', params.latitude.toString());
        homeParams.set('longitude', params.longitude.toString());
        let userId = "0";
        if(this.authService.getUser()) {
           userId =  this.authService.getUser();
        }
        homeParams.set('user_id',userId);
        const options = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        };

        return this.http
            .post<{ success: boolean, message: string, data: any }>(
                apiConstants.homeRangeFilter,
                homeParams.toString(),
                options
            );
    }

    getBlogList(): Observable<{ success: boolean; message: string,data:any }> {
		return this.http.get<{ success: boolean; message: string,data:any }>(apiConstants.blog);
    }
     getAllBlog(): Observable<{ success: boolean; message: string,data:any }> {
		return this.http.get<{ success: boolean; message: string,data:any }>(apiConstants.getAllBlog);
    }
    getBlogById(params:any): Observable<{ success: boolean; message: string,data:any }> {
		return this.http.post<{ success: boolean; message: string,data:any }>(apiConstants.getBlogById,params);
	}
    getAllLocation(data): Observable<{ success: boolean; message: string,data:any }> {
        let userId = "0";
        if(this.authService.getUser()) {
           userId =  this.authService.getUser();
        }
        const params = {userId:userId,...data};        
        return this.http.post<{ success: boolean; message: string,data:any }>(apiConstants.getAllLocation,params);
	}
}
