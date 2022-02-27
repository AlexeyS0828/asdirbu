import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from 'src/app/services/auth.service';
import { Message } from 'src/app/models/message.model';
import { ActivatedRoute,ParamMap,Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {

	messages = [];
	defaultSelectedUser:number = 0;
	selectedUserId: number;
	selectedUserName: number;
	selectedUser:object={};
	userId: number;
	jobId:number;
	postId:number;
	showContactList:boolean  = false;
	showMessageList:boolean  = false;
	constructor(
		private messageService: MessageService, 
		private authService: AuthService,
		private route: ActivatedRoute,
		private router:Router
	){ }

	ngOnInit(): void {
		this.messageService.receiverMessage().subscribe(response => {
			if(response.sender_id==this.selectedUserId || response.receiver_id==this.selectedUserId){
				this.messages = [...this.messages, response];
			}
		});
	
		this.authService.userHireId = 0;
		this.authService.jobId = 0;
		this.route.paramMap.subscribe((paramMap: ParamMap) => {
			this.jobId = Number(paramMap.get('jobId'));
			this.userId = Number(paramMap.get('userId'));
			this.postId = Number(paramMap.get('postId'));
			if(this.jobId !== 0 && this.userId !== 0) {
				const params = {jobId:this.jobId,userId:this.userId};
				this.authService.storeMessageByJobId(params).subscribe(response=>{
					if(response.success) {
						const data = JSON.parse(localStorage.getItem('userData'));
						if(!data){
							this.authService.userHireId = this.userId;
							this.authService.jobId = this.jobId;
							this.router.navigate(['/registration']);
						}
						else {
							this.userId = data.id;
							this.showContactList = true;
							this.showMessageList = true;
						//	this.userjoin();
						}
					}
				});
			}
			else if(this.userId !== 0 && this.postId !== 0){
				const params = {postId:this.postId};
				this.authService.changeUserChatStatus(params).subscribe(response=>{
					if(response.success) {
						if(this.authService.getToken()){
							this.userId = this.authService.getUser();
							this.defaultSelectedUser = this.userId;
							this.showContactList = true;
							this.showMessageList = true;
						//	this.userjoin();
						}
						else{
							this.router.navigate(['/registration']);
						}
					}
					else{
						console.log("Error",response.message);
					}
				});				
			}
			else if(this.userId !== 0){
				this.defaultSelectedUser = this.userId;
				const data = JSON.parse(localStorage.getItem('userData'));
				this.userId = data.id;
				this.showContactList = true;
				this.showMessageList = true;
			//	this.userjoin();
			}
			else if(this.authService.getToken()){
				const data = JSON.parse(localStorage.getItem('userData'));
				this.userId = data.id;
				this.showContactList = true;
				this.showMessageList = true;
			//	this.userjoin();
			}
			else {
				this.authService.logout();
				this.router.navigate(['/registration']);
			}
		});		
	}

	userjoin() {
		this.messageService.userjoin(this.userId);
	}

	onUserSelected(user) {
		this.selectedUser = user;
	  	this.selectedUserId = user.id;
	  	this.selectedUserName = user.name;
	  	this.getMessageListByUserId();
	}

	onSendMessage(message: string) {
		if(message!=""){
			const data: Message = {
				sender_id: this.userId,
			    receiver_id: this.selectedUserId,
			    message:message.trim()
			};
			this.messageService.sendMessage(data);
			this.messages = [...this.messages, data];
  		}
  	}

  	getMessageListByUserId() {
		const params = {user_id: this.selectedUserId};
		this.messageService.getMessageListByUserId(params).subscribe(response => {
			if (response.success) {
				this.messages = response.data;
			} else {
				console.log("Error Message",response.message);
			}
		}, error => {
			console.log("Error Message",error.message);
		});
	}

	ngOnDestroy(){
		//this.messageService.disconnect(this.userId);
	}
}
