import { Component, OnInit, EventEmitter, Output,Input } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent implements OnInit {

    userList = [];
    activelist = [];
    activeUserId:number = 0;
    @Output() selectedUser = new EventEmitter<any>();
    @Input() defaultSelectedUser = 0;
    messageSub:Subscription;
    newUserSub:Subscription;
    userDisconnectSub:Subscription;
    constructor(private messageService: MessageService, private authService: AuthService) { 
        this.messageSub =  this.messageService.activeUserList().subscribe(response => {
            this.activelist = response;
          //  this.checkNewUserJoin();
        }); 
    }

    ngOnInit(): void {
        this.userDisconnectSub =  this.messageService.userdisconnect().subscribe(response => {
            this.userList.forEach((element,index)=>{
                if(element.id==response) {
                    this.userList[index].status = 0;
                }
            });
        }); 
       
        this.newUserSub = this.messageService.newUserJoin().subscribe(response => {
            this.userList.forEach((element,index)=>{
                if(element.id==response) {
                    this.userList[index].status = 1;
                }
            });
        });
        this.getUserList();
    }

    getUserList() {
        this.messageService.getUserList().subscribe(response => {
            if (response.success) {
                this.userList = response.data;
                if(this.defaultSelectedUser!==0){
                    const user = response.data.find(element=>(element.id===this.defaultSelectedUser));
                    this.onUserSelected(user);                
                    this.messageService.setUserId(this.defaultSelectedUser);             
                }
                this.messageService.activeuser();      
             //   this.checkNewUserJoin();   
                
            } else {
               // this.authService.showErrorMessage(response.message);
            }
        }, error => {
            //this.authService.showErrorMessage(error.message);
        });
    }
    
    onUserSelected(user) {
        if(this.activeUserId !== user.id){
            this.messageService.setUserId(user.id);             
            this.activeUserId = user.id;
            const userdata = {"id":this.activeUserId,"name":user.name,"profileImage":user.profileImage};
            this.selectedUser.emit(userdata);
        }
    }

    checkNewUserJoin(){
        console.log("activelist",this.activelist);
        this.userList.forEach((element,index) => {
            this.userList[index].status = (this.activelist.findIndex(ele=>(ele.userid==element.id)) > -1) ? 1 : 0;
        });
        console.log("Activelist",this.userList);
    }
    ngOnDestroy() {
		this.messageSub.unsubscribe();
		this.userDisconnectSub.unsubscribe();
		this.newUserSub.unsubscribe();
	}
}
