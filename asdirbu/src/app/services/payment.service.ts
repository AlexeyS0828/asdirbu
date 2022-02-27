import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { apiConstants } from '../constants/api-constants';

@Injectable({
  providedIn: 'root'
})

export class PaymentService {
	constructor(
		private http: HttpClient
	) {}

	transaction(params): Observable<{ success: boolean; message: string, bookingId: number}> {
		return this.http.post<{ success: boolean; message: string, bookingId: number}>(apiConstants.transaction,params);
	}

  	reservation(params): Observable<{ success: boolean; message: string}> {
		return this.http.post<{ success: boolean; message: string}>(apiConstants.reservation, params);
  	}

  	stripePayment(params): Observable<{ success: boolean; message: string, bookingId: number}> {
		return this.http.post<{ success: boolean; message: string, bookingId: number}>(apiConstants.stripePayment, params);
	}  
	
	opayPayment(params): Observable<{ success: boolean; message: string, encodeUrl: string}> {
		return this.http.post<{ success: boolean; message: string, encodeUrl: string}>(apiConstants.opayPayment, params);
	}

	changePaymentStatus(params): Observable<{ success: boolean; message: string, data: any}> {
		return this.http.post<{ success: boolean; message: string, data: any}>(apiConstants.changePaymentStatus, params);
	}
}
