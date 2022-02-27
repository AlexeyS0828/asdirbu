import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
	menuStatus = false;
	currentHeader = 0;
	loggedIn = false;
	counter = 0;
	isJobPosted = true;
	private authStatusSubs: Subscription;
	private jobPostedSub: Subscription;
	private messageSub: Subscription;
	private messageCountSub: Subscription;
	private resetCouterSub: Subscription;

	constructor(private router: Router, private authService: AuthService, private messageService: MessageService) { }
	ngOnInit() {
		this.messageService.connect();
		
		this.counter = this.messageService.getMessageCount();
		this.messageSub = this.messageService.receiverMessage().subscribe(response => {
			if (response && (this.messageService.selectedUserId!=response.sender_id || !this.router.url.startsWith("/chat"))) {
				this.messageService.setUnreadMessage(response.sender_id);
				this.messageService.setMessageCount(++this.counter);
			}
		});
		this.resetCouterSub = this.messageService.resetCouter.subscribe(response => {
			if (response == 0) {
				this.counter = 0;
				this.messageService.setMessageCount(0);
			}
		});
		this.loggedIn = !this.authService.getToken() ? false : true;
		if (this.loggedIn) {
			this.userjoin();
		}
		this.messageCountSub = this.authService.messagecount.subscribe((response) => {	

			if(this.authService.getUser()){
				this.countmessage();
			}
		});
		this.authStatusSubs = this.authService.getAuthStatusListener().subscribe((response) => {
			if (response) {
				this.loggedIn = true;
				this.userjoin();
			} else {
				this.messageService.disconnect();
				this.loggedIn = false;
			}
		});
		this.jobPostedSub = this.authService.getJobPostedListener().subscribe((response) => {
			this.isJobPosted = response ? true : false;
		});
		if(this.loggedIn){
			this.countmessage();
		}

	}

	countmessage(){
		this.messageService.countMessage().subscribe(response => {
			let total = 0;
			if(Array.isArray(response.data)){
				response.data.forEach(element => {
					this.messageService.setUnreadMessage(element.userId,element.total);
					total +=element.total;	
				});
			}
			this.counter = total;
			this.messageService.setMessageCount(total);
		});
	}
	
	userjoin() {
		if (this.authService.getUser()) {
			let userId = this.authService.getUser();
			this.messageService.userjoin(userId);
		}
	}

	clickMenuEvent() {
		this.menuStatus = !this.menuStatus;
	}

	logout() {
		this.authService.logout();
	}

	ngOnDestroy() {
		this.authStatusSubs.unsubscribe();
		this.jobPostedSub.unsubscribe();
		this.messageSub.unsubscribe();
		this.messageCountSub.unsubscribe();
		this.resetCouterSub.unsubscribe();
		this.messageService.disconnect();
	}
}
