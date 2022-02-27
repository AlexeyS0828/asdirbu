import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef,SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-messages-view',
  templateUrl: './messages-view.component.html',
  styleUrls: ['./messages-view.component.scss']
})
export class MessagesViewComponent implements OnInit {

	currentUserId = 0;
	@Input() messages: [];
	@Input() selectedUser = {id:"",name:"",profileImage:""};
	@Output() sendMessage = new EventEmitter<string>();
	@ViewChild('scrollMe', { static: false })
	messagesContainer: ElementRef<HTMLDivElement>;
    constructor(private messageService: MessageService, private authService: AuthService) { }
	ngOnInit(): void {
		if(this.authService.getUser()){
			this.currentUserId = this.authService.getUser();
		}
    }



	onSendMessage(message: string) {
		if(this.selectedUser.id != "" && this.selectedUser.id != undefined){
	  		this.sendMessage.emit(message);
		}
	}
	ngOnChanges(changes: SimpleChanges): void {
	  if (changes.messages) {
	   setTimeout(()=>{this.scrollIntoView();},10);
	  }
	}
	private scrollIntoView() {
	  	if (this.messagesContainer) {
	    	const { nativeElement } = this.messagesContainer;
	    	nativeElement.scrollTop = nativeElement.scrollHeight;
	  	}
	}
}
