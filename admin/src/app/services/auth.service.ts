import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { apiConstants } from 'src/app/constants/api-constants';
import { UserDetails } from 'src/app/models/userdetails.model';
import { QuickJob } from 'src/app/models/quickjob.model';
@Injectable({
	providedIn: 'root'
})

export class AuthService {
	private userLoggedIn = new BehaviorSubject(false);
	private userName = new BehaviorSubject<string>('');

	constructor(
		private http: HttpClient
	) { }

	getUserName(): Observable<string> {
		this.userLoggedIn.next(!!localStorage.getItem('userName'));
		return this.userName.asObservable();
	}

	setUserName(name: string): void {
		this.userName.next(name);
	}

	setLoggedIn(value: boolean): void {
		this.userLoggedIn.next(value);
	}

	getLoggedIn(): Observable<boolean> {
		this.userLoggedIn.next(!!localStorage.getItem('id'));
		return this.userLoggedIn.asObservable();
	}

	getUserId(): string {
		return localStorage.getItem('id');
	}

	isLoggin(): boolean {
		return !!localStorage.getItem('id');
	}

	setUserLogin(data)	{
		localStorage.setItem('id', data.id);
		localStorage.setItem('token', data._token);
		this.setLoggedIn(true);
	}

	logout(): void {
		this.setLoggedIn(false);
		localStorage.clear();
	}

	adminLogin(params: any): Observable<{ success: boolean, message: string, data: any }> {
		return this.http.post<{ success: boolean, message: string, data: any }>(apiConstants.login, params);
	}

	deleteUserById(params: any): Observable<{ success: boolean, message: string }> {
		return this.http.post<{ success: boolean, message: string }>(apiConstants.deleteUser, params);
	}

	getToken() {
		return localStorage.getItem('token') || null;
	}

	getUserListByType(params: any): Observable<{ success: boolean, message: string, data: any }> {
		return this.http.post<{ success: boolean, message: string, data: any }>(apiConstants.userListByType, params);
	}

	getUserDetailsById(params: any): Observable<{ success: boolean, message: string, data: UserDetails }> {
		return this.http.post<{ success: boolean, message: string, data: any }>(apiConstants.userDetailsById, params);
	}	
	
	getQuickJobList(): Observable<{ success: boolean, message: string, data: any }> {
		return this.http.get<{ success: boolean, message: string, data: any }>(apiConstants.quickJobList);
	}

	deleteQuickJobById(params: any): Observable<{ success: boolean, message: string, data: UserDetails }> {
		return this.http.post<{ success: boolean, message: string, data: any }>(apiConstants.deleteQuickJob, params);
	}
	
	getQuickJobDetailById(params: any): Observable<{ success: boolean, message: string, data: QuickJob }> {
		return this.http.post<{ success: boolean, message: string, data: QuickJob }>(apiConstants.quickJobDetailById, params);
	}

	updateUserStatus(params: any): Observable<{ success: boolean, message: string }> {
		return this.http.post<{ success: boolean, message: string}>(apiConstants.updateUserStatus, params);
	}

	updateProfileById(params: any): Observable<{ success: boolean, message: string }> {
		return this.http.post<{ success: boolean, message: string}>(apiConstants.updateProfileById, params);
	}

	addNewUser(params: any): Observable<{ success: boolean, message: string }> {
		return this.http.post<{ success: boolean, message: string}>(apiConstants.addNewUser, params);
	}
	
}
