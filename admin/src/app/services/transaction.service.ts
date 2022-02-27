import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiConstants } from 'src/app/constants/api-constants';


@Injectable({
  providedIn: 'root'
})

export class TransactionService {

	constructor(
		private http: HttpClient
	) { }

  getTransactionHistroy(): Observable<{ success: boolean, message: string, data: any }> {
		return this.http.get<{ success: boolean, message: string, data: any }>(apiConstants.transctionHistroy);
  }
  
  getTransactionByDate(params:any): Observable<{ success: boolean, message: string, data: any }> {
		return this.http.post<{ success: boolean, message: string, data: any }>(apiConstants.getTransactionByDate,params);
	}
	
	changeTransactionStatus(params): Observable<{ success: boolean, message: string}> {
		return this.http.post<{ success: boolean, message: string}>(apiConstants.changeTransactionStatus,params);
  }  
}
