import { Component, OnInit,ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import  Swal  from 'sweetalert2';
import { UserDetails } from 'src/app/models/userdetails.model';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.css']
})

export class IndividualComponent implements OnInit {
	userType:number = 1;
	dtOptions: DataTables.Settings = {};
	userList = [];
	errorMessage = '';
	index=1;
	dataTable:any;
	@ViewChild('dataTable',{static:false}) table;
	userDetail:UserDetails ={
		id:"",
		aboutMe:"",
		address:"",
		city:"",
		documentFile:[],
		email:"",
		hourRate:"",
		mobileNumber:"",
		name:"",
		timeSheet:[],
		bankAccountNumber:"",
		isApproved:0,
		specialty:"",
		serviceName:""
	};
	bsInlineValue:Date;
	isFirstTime:boolean = true;
	dateCustomClasses=[];
	@ViewChild("bsDatePicker") bsDatePicker;
	constructor(private authService: AuthService) { 
		
	}

	ngOnInit(): void {
		this.bsInlineValue = new Date();
		this.getUserList();
	}

	load(){
		this.dataTable = $(this.table.nativeElement).DataTable({
			responsive: true,
			"language": {
			"lengthMenu": "Ekranas _MENU_ įrašų viename puslapyje",
			"zeroRecords": "Įrašas nerastas",
			 "info": "Rodomas puslapis _PAGE_ of _PAGES_",
			 "infoEmpty": "Įrašų nėra",
			"infoFiltered": "(filtruojamas iš _MAX_ viso įrašų)",
			"search": "Paieška",
			"paginate": {
				"first": "Pirmas",
				"last": "paskutinis",
				"next": "Kitas",
				"previous": "Ankstesnis"
			},
		}});
	}		
	getUserList() {
		const form = {userType: this.userType};
		this.authService.getUserListByType(form).subscribe(response => {
			if (response.success) {
				this.errorMessage = '';
				this.userList = response.data;
					setTimeout(()=>{this.load();},100);
		    }
			else {
				this.errorMessage = response.message;
			}
		}, error => {
			this.errorMessage = "Klaida, bandykite dar kartą.";
		});
	}

	deleteUserById(id) {
		console.log(id);
		Swal.fire({
			title: 'Ar tikrai norite ištrinti vartotoją ?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Taip',
			cancelButtonText: 'Ne'
		}).then((result) => {
			if (result.value) {
				const form = { userId:id };
				this.authService.deleteUserById(form).subscribe(response => {
					if (response.success) {
						this.dataTable.destroy();
						this.getUserList();
					}
					else {
					}
				});
			}
		});
	}
	userDetails(userId,openModal){
		const params = {userId};
		this.authService.getUserDetailsById(params).subscribe(response=>{
			if(response.success){
				this.userDetail.aboutMe = response.data.aboutMe; 
				this.userDetail.address = response.data.address; 
				this.userDetail.bankAccountNumber = response.data.bankAccountNumber; 
				this.userDetail.city = response.data.city; 
				this.userDetail.documentFile = response.data.documentFile; 
				this.userDetail.email = response.data.email; 
				this.userDetail.hourRate = response.data.hourRate; 
				this.userDetail.id = response.data.id; 
				this.userDetail.mobileNumber = response.data.mobileNumber; 
				this.userDetail.name = response.data.name; 
				this.userDetail.timeSheet = response.data.timeSheet;
				this.userDetail.isApproved = response.data.isApproved;
				this.userDetail.serviceName = response.data.serviceName;
				this.userDetail.specialty = response.data.specialty;
				this.userDetail.timeSheet.forEach((value:any)=>{
					this.dateCustomClasses.push({ date: new Date(value.date), classes: ['', 'text-lightred font-weight-bold'] });
				});
				this.bsInlineValue = new Date();
				openModal.click();
			}
			else{
				this.errorMessage = response.message;
			}
		},error=>{
			this.errorMessage = "Klaida, bandykite dar kartą.";
		});
	}
	
	updateUserStatus(isApproved,userId) {
		const params = {isApproved,userId};
			this.authService.updateUserStatus(params).subscribe(response => {
				if (response.success) {
					this.dataTable.destroy();
					this.getUserList();
				}
			});
	}
}

