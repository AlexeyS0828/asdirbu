import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable,Subject } from 'rxjs';
import { Router } from '@angular/router';
import { apiConstants } from '../constants/api-constants';
import { AuthService } from 'src/app/services/auth.service';
import { Socket } from 'ngx-socket-io';
import { Message } from 'src/app/models/message.model';
@Injectable({
  providedIn: 'root'
})

export class MessageService {
	public  resetCouter = new Subject<number>();
	

	public selectedUserId = 0;
	constructor(
		private http: HttpClient,
		private router: Router,
		private authService: AuthService,
		private socket: Socket
	) {}


	setUserId(userId) {
		let total = 0;
		this.selectedUserId = userId;
		let data = this.getUnreadMessage();
		let newdata = [];
		data.forEach((element) => {
			if(element.userId!=this.selectedUserId){
				newdata.push(element);
				total +=element.total; 
			}	
		});
		localStorage.setItem("message",JSON.stringify(data));
		this.resetCouter.next(total);
	}
	
	reset() {
		this.resetCouter.next(0);
	}

	setUnreadMessage(userid,total=1){
		let data = this.getUnreadMessage();
		let elementfind = false;
		data.forEach((element,index) => {
			if(element.userId==userid){
				data[index].total +=total;
				elementfind = true; 	
			}	
		});
		if(!elementfind){
			data.push({"userId":userid,"total":1});
		}
		localStorage.setItem("message",JSON.stringify(data));
	}
	getUnreadMessage(){
		if(localStorage.getItem("message")){
			return JSON.parse(localStorage.getItem("message"));
		}
		else{
			return [];
		}	
	}

	setMessageCount(counter){
		localStorage.setItem("counter",counter.toString());
	}	

	getMessageCount():number{
		return Number(localStorage.getItem("counter") || 0);
	}
	
	getUserList(): Observable<{ success: boolean; message: string, data: any}> {
		const params = {};
		return this.http.post<{ success: boolean; message: string, data: any}>(apiConstants.userlist, params);
  	}

  	getMessageListByUserId(params): Observable<{ success: boolean; message: string, data: any}> {
		return this.http.post<{ success: boolean; message: string, data: any}>(apiConstants.getMessageListByUserId, params);
  	}

  	userjoin(userId: number) {
        this.socket.emit('join', userId);
	}	

	activeuser() {
		this.socket.emit('activeuser');
	}
	

  	sendMessage(message: Message) {
        this.socket.emit('messagedetection', message);
    }

    activeUserList(): Observable<any> {
	    return Observable.create(observer => {
	      	this.socket.on('activeuserlist', msg => {
				observer.next(msg);
	      	});
	    });
	}
	
	receiverMessage(): Observable<any> {
	    return Observable.create(observer => {
	      	this.socket.on('message', msg => {
	        	observer.next(msg);
	      	});
	    });
    }
    
    newUserJoin(): Observable<any> {
	    return Observable.create(observer => {
	      	this.socket.on('userjoinedthechat', msg => {
				observer.next(msg);
	      	});
	    });
    }

    userdisconnect(): Observable<any> {
	    return Observable.create(observer => {
	      	this.socket.on('disconnect', userid => {
	        	observer.next(userid);
	      	});
	    });
    }

    disconnect(){
		this.socket.disconnect();
    }
    connect(){
		this.socket.connect();
	}
	countMessage(): Observable<{ success: boolean; message: string, data: any}> {
		return this.http.get<{ success: boolean; message: string, data: any}>(apiConstants.countmessage);
  	}

  	
}
