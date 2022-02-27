import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { apiConstants } from '../constants/api-constants';
import { ToastrService } from 'ngx-toastr';
import * as jwt_decode from 'jwt-decode';
import {AuthService as Auth } from 'angularx-social-login';
import { Socket } from 'ngx-socket-io';

/* Model */
import { ProfileDetails } from '../models/profiledetails.model';
import { Registration } from '../models/registration.model';
import { Profile } from '../models/profile.model';
import { Login } from '../models/login.model';
import { UserDetails } from '../models/userdetails.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private isAuthenticated = false;
	private token: string;
	private tokenTimer: any;
	public authStatusListener = new Subject<boolean>();
	public messagecount = new Subject();
	private userId: string;
	private data: any;
	private registerData: any;
	private registerDataListener = new Subject<Registration>();
	private jobPostedListener = new Subject<boolean>();
	private canViewReservation = false;
	private canViewReviews = false;
	public userHireId = 0;
	public hireId = 0;
	public jobId = 0;
	public bookingId = 0;
	public bookUserId = 0;
	public hireUserId = 0;
	public chatUserId=0;
	constructor(
		private http: HttpClient,
		private router: Router,
		private toastr: ToastrService,
		private auth :Auth,
		private socket :Socket
	) { }

	getViewReservation(): boolean {
		return this.canViewReservation;
	}
	
	setSocialLogin(value): void {
		localStorage.setItem("APP_TOKEN",value);
	}
	getSocialLogin(){
		return localStorage.getItem('APP_TOKEN') || null;
	}

	setViewReservation(value: boolean) {
		this.canViewReservation = value;
	}

	getViewReviews(): boolean {
		return this.canViewReviews;
	}

	setViewReviews(value: boolean): void {
		this.canViewReviews = value;
	}

	getToken() {
		return localStorage.getItem('token') || null;
	}

	getUserData() {
		return JSON.parse(localStorage.getItem('userData')) || null;
	}

	getIsAuth() {
		return this.isAuthenticated;
	}

	getUserId() {
		return this.userId;
	}

	getUser() {
		if (localStorage.getItem("userData")) {
			const data = JSON.parse(localStorage.getItem('userData'));
			return data.id;
		}
		else {
			return 0;
		}
	}
	getRegisterData() {
		return this.registerData;
	}

	getAuthStatusListener() {
		return this.authStatusListener.asObservable();
	}

	getRegisterDataListener() {
		return this.registerDataListener.asObservable();
	}

	getJobPostedListener() {
		return this.jobPostedListener.asObservable();
	}

	registration(registrationData: any) {
		const registration: Registration = {
			email: registrationData.email,
			password: registrationData.password,
			name: registrationData.name,
			lastname: registrationData.lastname,
			dob: registrationData.dob,
			companyName: registrationData.companyName,
			companyCode: registrationData.companyCode,
			userType: registrationData.userType
		};
		this.http
			.post<{ success: boolean; message: string }>(
				apiConstants.registration,
				registration
			)
			.subscribe(
				responseData => {
					if (responseData.success) {
						this.router.navigate(['/confirm/registration']);
					} else {
						(<HTMLButtonElement>document.getElementById("submitButton")).disabled  = false;
						document.getElementById("errorMessageSection").style.display = 'block';
						document.getElementById("errorMessage").innerHTML = responseData.message;
					}
				},
				error => {
					this.authStatusListener.next(false);
					(<HTMLButtonElement>document.getElementById("submitButton")).disabled  = false;
					document.getElementById("errorMessageSection").style.display = 'block';
					document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
				}
			);
	}

	login(loginData: any) {
		const login: Login = {
			email: loginData.email,
			password: loginData.password
		};
		this.http
			.post<{ success: boolean; message: string; data: any }>(
				apiConstants.login,
				login
			)
			.subscribe(
				responseData => {
					if (responseData.success) {
						const token = responseData.data._token;
						this.token = token;
						if (token) {
							this.socket.connect();
							this.socket.emit('join', responseData.data.id);
							const decoded = jwt_decode(token);
							this.isAuthenticated = true;							
							this.jobPostedListener.next(responseData.data.isJobPosted);
							this.userId = responseData.data.id;
							this.data = JSON.stringify(responseData.data);
							this.saveAuthData(token, this.data);
							this.authStatusListener.next(true);
							this.messagecount.next(1);

							if (this.hireId !== 0 && this.userHireId !== 0 && responseData.data.id !== this.userHireId) {
								this.router.navigate(['payment-details', this.hireId, this.userHireId]);
							}
							else if(this.jobId !== 0 && this.hireUserId !== 0 && responseData.data.id !== this.hireUserId){
								this.router.navigate(['payment',this.jobId,this.hireUserId]);
							}
							else if(this.jobId !== 0 && this.userHireId !== 0){
								this.router.navigate(['chat',0,0,0]);
							}
							else if(this.bookUserId !== 0 && this.bookingId !== 0){
								this.router.navigate(['review',this.bookingId,this.bookUserId]);
							}
							else if(this.chatUserId !== 0 && responseData.data.id !==this.chatUserId){
								this.addUserChat({ "userId": this.chatUserId, "postJobId": 0 }).subscribe();
								this.router.navigate(['chat',0,this.chatUserId,0]);
							}
							else {
								this.router.navigate(['/my-profile']);
							}
							this.hireId = 0;
							this.jobId = 0;
							this.userHireId = 0;
							this.bookUserId = 0;
							this.bookingId = 0;
							this.chatUserId = 0;
						}
					} else {
						document.getElementById("errorMessageSection").style.display = 'block';
						document.getElementById("errorMessage").innerHTML = responseData.message;
					}
				},
				error => {
					this.authStatusListener.next(false);
					document.getElementById("errorMessageSection").style.display = 'block';
					document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
				}
			);
	}
	logout() {
		this.token = null;
		this.userId = null;
		this.isAuthenticated = false;
		this.authStatusListener.next(false);
		this.data = null;
		if(this.getSocialLogin() !== null){
			this.auth.signOut();
		}
		this.clearAuthData();
		this.socket.disconnect();
		this.router.navigate(['/']);
	}

	public saveAuthData(token: string, data: any) {
		localStorage.setItem('token', token);
		localStorage.setItem('userData', data);
	}

	private clearAuthData() {
		localStorage.removeItem('token');
		localStorage.removeItem('userData');
		localStorage.removeItem('userType');
		localStorage.removeItem('userLogin');
		localStorage.removeItem('message');
		localStorage.removeItem('APP_TOKEN');
		localStorage.removeItem('counter');
	}

	private getAuthData() {
		const token = localStorage.getItem('token');
		const userData = localStorage.getItem('userData');
		if (!token ||  !userData) {
			return;
		}
		return {
			token,
			userData
		};
	}


	quickJobData(quickJobData: any) {
		this.registerData = quickJobData;
		this.registerDataListener.next(quickJobData);
		this.router.navigate(['individual','fast-posting']);
	}

	fastPosting(fastPostingData: any) {
		const fastPosting = new FormData();
		fastPosting.append('paslaugos_priemimo_laikas',fastPostingData.paslaugos_priemimo_laikas);
		fastPosting.append('skelbimo_pavadinimas',fastPostingData.skelbimo_pavadinimas);
		fastPosting.append('papasakok_placiau', fastPostingData.papasakok_placiau);
		fastPosting.append('paslaugos_kaina', fastPostingData.paslaugos_kaina);
		fastPosting.append('paslaugos_suteikimo_vieta',fastPostingData.paslaugos_suteikimo_vieta);
		fastPosting.append('distance', fastPostingData.distance);
		fastPosting.append('paslaugos_priėmimo_vieta',fastPostingData.paslaugos_priėmimo_vieta);
		fastPosting.append('email', fastPostingData.email);
		fastPosting.append('password', fastPostingData.password);
		fastPosting.append('name', fastPostingData.name);
		fastPosting.append('lastname', fastPostingData.lastname);
		fastPosting.append('service', fastPostingData.service);
		fastPosting.append('dob', fastPostingData.dob);
		fastPosting.append('job_type', fastPostingData.jobType);
		fastPosting.append('latitude', fastPostingData.latitude);
		fastPosting.append('longitude', fastPostingData.longitude);
		fastPosting.append('pridėk_nuotrauką[0]', fastPostingData.image1);
		fastPosting.append('pridėk_nuotrauką[1]', fastPostingData.image2);
		fastPosting.append('pridėk_nuotrauką[2]', fastPostingData.image3);
		fastPosting.append('pridėk_nuotrauką[3]', fastPostingData.image4);
		fastPosting.append('currentLongitude', fastPostingData.currentLongitude);
		fastPosting.append('currentLatitude', fastPostingData.currentLatitude);
		fastPosting.append('serviceName', fastPostingData.serviceName);
		fastPosting.append('otherServiceName', fastPostingData.otherServiceName);
		fastPosting.append('specialty', fastPostingData.specialty);
		fastPosting.append('otherSpecialty', fastPostingData.otherSpecialty);
		fastPosting.append('placeGoodsDelivery', fastPostingData.placeGoodsDelivery);
		
		
		this.http
			.post<{ success: boolean; message: string }>(
				apiConstants.fastPosting,
				fastPosting
			)
			.subscribe(
				responseData => {
					if (responseData.success) {
						this.jobPostedListener.next(true);
						this.router.navigate(['/confirm/job-posting']);
					} else {
						(<HTMLButtonElement>document.getElementById("submitButton")).disabled  = false;
						document.getElementById("errorMessageSection").style.display = 'block';
						document.getElementById("errorMessage").innerHTML = responseData.message;
					}
				},
				error => {
					this.authStatusListener.next(false);
					(<HTMLButtonElement>document.getElementById("submitButton")).disabled  = false;
					document.getElementById("errorMessageSection").style.display = 'block';
					document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
				}
			);
	}

	jobPosting(jobPostingData: any) {
		const jobPosting = new FormData();
		jobPosting.append('paslaugos_priemimo_laikas',jobPostingData.paslaugos_priemimo_laikas);
		jobPosting.append('skelbimo_pavadinimas',jobPostingData.skelbimo_pavadinimas);
		jobPosting.append('papasakok_placiau', jobPostingData.papasakok_placiau);
		jobPosting.append('paslaugos_kaina', jobPostingData.paslaugos_kaina);
		jobPosting.append('paslaugos_suteikimo_vieta',jobPostingData.paslaugos_suteikimo_vieta);
		jobPosting.append('distance', jobPostingData.distance);
		jobPosting.append('paslaugos_priėmimo_vieta',jobPostingData.paslaugos_priėmimo_vieta);
		jobPosting.append('job_type', jobPostingData.jobType);
		jobPosting.append('latitude', jobPostingData.latitude);
		jobPosting.append('longitude', jobPostingData.longitude);
		jobPosting.append('pridėk_nuotrauką[0]', jobPostingData.image1);
		jobPosting.append('pridėk_nuotrauką[1]', jobPostingData.image2);
		jobPosting.append('pridėk_nuotrauką[2]', jobPostingData.image3);
		jobPosting.append('pridėk_nuotrauką[3]', jobPostingData.image4);
		jobPosting.append('currentLongitude', jobPostingData.currentLongitude);
		jobPosting.append('currentLatitude', jobPostingData.currentLatitude);
		jobPosting.append('serviceName', jobPostingData.serviceName);
		jobPosting.append('otherServiceName', jobPostingData.otherServiceName);
		jobPosting.append('specialty', jobPostingData.specialty);
		jobPosting.append('otherSpecialty', jobPostingData.otherSpecialty);
		jobPosting.append('placeGoodsDelivery', jobPostingData.placeGoodsDelivery);
		this.http
			.post<{ success: boolean; message: string }>(
				apiConstants.jobPosting,
				jobPosting
			)
			.subscribe(
				responseData => {
					if (responseData.success) {
						this.jobPostedListener.next(true);
						this.router.navigate(['/confirm/job-posting']);
					} else {
						document.getElementById("errorMessageSection").style.display = 'block';
						document.getElementById("errorMessage").innerHTML = responseData.message;
					}
				},
				error => {
					this.authStatusListener.next(false);
					document.getElementById("errorMessageSection").style.display = 'block';
					document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
				}
			);
	}

	getProfile(): Observable<{ success: boolean; message: string;data: Profile }> {
		return this.http.get<{ success: boolean; message: string; data: Profile }>(apiConstants.getProfile);
	}

	updateProfile(profileData: FormData): Observable<{ success: boolean; message: string }> {
		return this.http.post<{ success: boolean; message: string }>(apiConstants.updateProfile, profileData);
	}

	getUserProfileDetails(userId: string): Observable<{ success: boolean; message: string; data: ProfileDetails }> {
		const form = { user_id: userId };
		return this.http.post<{ success: boolean; message: string; data: ProfileDetails }>(apiConstants.profileDetalis, form);
	}

	deleteDocument(documentId: number): Observable<{ success: boolean; message: string }> {
		const form = { document_id: documentId };
		return this.http.post<{ success: boolean; message: string }>(apiConstants.deleteDocument, form);
	}

	getUserDetails(params): Observable<{ success: boolean; message: string; data: any }> {
		return this.http.post<{ success: boolean; message: string; data: any }>(apiConstants.userDetails, params);
	}

	review(params): Observable<{ success: boolean; message: string }> {
		return this.http.post<{ success: boolean; message: string }>(apiConstants.review, params);
	}

	userSubscribe(params): Observable<{ success: boolean; message: string }> {
		return this.http.post<{ success: boolean; message: string }>(apiConstants.userSubscribe, params);
	}

	getTimesheetData(params): Observable<{ success: boolean; message: string; data: any }> {
		return this.http.post<{ success: boolean; message: string; data: any }>(apiConstants.getTimeSheetByUserId, params);
	}

	storeUserHireDay(params): Observable<{ success: boolean; message: string; userHireId: number }> {
		return this.http.post<{ success: boolean; message: string; userHireId: number }>(apiConstants.storeUserHireDay, params);
	}

	contactus(params): Observable<{ success: boolean; message: string }> {
		return this.http.post<{ success: boolean; message: string }>(apiConstants.contactus, params);
	}

	tokenVerify(params): Observable<{ success: boolean; message: string }> {
		return this.http.post<{ success: boolean; message: string }>(apiConstants.tokenVerify, params);
	}

	getTimeSheetHour(params): Observable<{ success: boolean; message: string; data: any }> {
		return this.http.post<{ success: boolean; message: string; data: any }>(apiConstants.getTimeSheetHour, params);
	}

	forgotpassword(params): Observable<{ success: boolean; message: string }> {
		return this.http.post<{ success: boolean; message: string }>(apiConstants.forgotpassword, params);
	}

	resetPassword(params): Observable<{ success: boolean; message: string }> {
		return this.http.post<{ success: boolean; message: string }>(apiConstants.resetpassword, params);
	}

	getUserAllDetails(params): Observable<{ success: boolean; message: string;data:any}> {
		return this.http.post<{ success: boolean; message: string;data:any }>(apiConstants.getUserAllDetails, params);
	}

	socialLogin(params) {
		return this.http.post<{ success: boolean; message: string;data:any }>(apiConstants.socialLogin, params)
		.subscribe(
			responseData => {
				if (responseData.success) {
					const token = responseData.data._token;
					this.token = token;
					if (token) {
						this.socket.connect();
						this.socket.emit('join', responseData.data.id);
						this.isAuthenticated = true;						
						this.jobPostedListener.next(responseData.data.isJobPosted);
						this.userId = responseData.data.id;
						this.data = JSON.stringify(responseData.data);
						this.saveAuthData(token, this.data);
						this.authStatusListener.next(true);
						this.messagecount.next(1);

						if (this.hireId !== 0 && this.userHireId !== 0 && responseData.data.id !== this.userHireId) {
							this.router.navigate(['payment-details', this.hireId, this.userHireId]);
						}
						else if(this.jobId !== 0 && this.hireUserId !== 0 && responseData.data.id !== this.hireUserId){
							this.router.navigate(['payment',this.jobId,this.hireUserId]);
						}
						else if(this.jobId !== 0 && this.userHireId !== 0){
							this.router.navigate(['chat',0,0,0]);
						}
						else if(this.bookUserId !== 0 && this.bookingId !== 0){
							this.router.navigate(['review',this.bookingId,this.bookUserId]);
						}
						else if(this.chatUserId !== 0 && responseData.data.id !==this.chatUserId){
							this.addUserChat({ "userId": this.chatUserId, "postJobId": 0 }).subscribe();
							this.router.navigate(['chat',0,this.chatUserId,0]);
						}
						else {
							this.router.navigate(['/my-profile']);
						}
						this.hireId = 0;
						this.jobId = 0;
						this.userHireId = 0;
						this.bookUserId = 0;
						this.bookingId = 0;
						this.chatUserId = 0;
					}
				} else {
					document.getElementById("errorMessageSection").style.display = 'block';
					document.getElementById("errorMessage").innerHTML = responseData.message;
				}
			},
			error => {
				this.authStatusListener.next(false);
				document.getElementById("errorMessageSection").style.display = 'block';
				document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
			}
		);
	}

	storeMessageByJobId(params) : Observable<{ success: boolean; message: string;data:any}>{
		return this.http.post<{ success: boolean; message: string;data:any }>(apiConstants.storeMessageByJobId, params);
	}
	getUserDetailsByJobId(params) : Observable<{ success: boolean; message: string;data:any}>{
		return this.http.post<{ success: boolean; message: string;data:any }>(apiConstants.getUserDetailsByJobId, params);
	}	
	addUserChat(params) : Observable<{ success: boolean; message: string;data:any}>{
		return this.http.post<{ success: boolean; message: string;data:any }>(apiConstants.addUserChat, params);
	}
	getJobDetailsById(params) : Observable<{ success: boolean; message: string;data:any}>{
		return this.http.post<{ success: boolean; message: string;data:any }>(apiConstants.getJobDetailsById, params);
	}
	checkEmail(email: string,userId:string="0") {
		const params = {email,userId};
		return this.http.post<{ success: boolean, message: string }>(apiConstants.isEmailUnique,params);
	}
	sendMessagePostJobUser(params): Observable<{ success: boolean; message: string}>{
		return this.http.post<{ success: boolean; message: string}>(apiConstants.sendMessagePostJobUser, params);
	}
	getTimeSheetByStartDate(params): Observable<{ success: boolean; message: string;data:any}>{
		return this.http.post<{ success: boolean; message: string;data:any}>(apiConstants.getTimeSheetByStartDate, params);
	}
	getUserTimesheet(params): Observable<{ success: boolean; message: string,data:any}>{
		return this.http.post<{ success: boolean; message: string;data:any}>(apiConstants.getUserTimesheet, params);
	}
	sendUserNotificationForJob(params):Observable<{ success: boolean; message: string}>{
		return this.http.post<{ success: boolean; message: string}>(apiConstants.sendUserNotificationForJob, params);
	}
	addCustomTime(params):Observable<{ success: boolean; message: string}>{
		return this.http.post<{ success: boolean; message: string}>(apiConstants.addCustomTime, params);
	}
	changeUserChatStatus(params):Observable<{ success: boolean; message: string}>{
		return this.http.post<{ success: boolean; message: string}>(apiConstants.userChatStatus, params);
	}
	getJobReviewById(params):Observable<{ success: boolean,message: string;data:any}>{
		return this.http.post<{ success: boolean; message: string;data:any}>(apiConstants.getjobreviewbyid, params);
	}
	showSuccessMessage(message: string): void {
		this.toastr.success(message, 'Sėkmė');
	}
	showErrorMessage(message: string): void {
		this.toastr.error(message, 'Klaida');
	}	
}