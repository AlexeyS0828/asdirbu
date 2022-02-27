import { Component, OnInit,ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { QuickJob } from 'src/app/models/quickjob.model';
import  Swal  from 'sweetalert2';

@Component({
  selector: 'app-quickjob',
  templateUrl: './quickjob.component.html',
  styleUrls: ['./quickjob.component.css']
})

export class QuickjobComponent implements OnInit {

	userType:number = 1;
	dtOptions: DataTables.Settings = {};
	quickJobs = [];
	errorMessage = '';
	index=1;
	dataTable:any;
	@ViewChild('dataTable',{static:false}) table;
	quickJobDetail:QuickJob ={
		name:"",
		email:"",
		adName:"",
		serviceAdmissionTime:"",
		tellMore:"",
		keyword:"",
		servicePrice:"",
		locationServicePrice:"",
		distance:"",
		image:[],
		serivcePlace:"",
		jobType:"",
		specialty:"",
		serviceName:""
	};
	bsInlineValue:Date;
	isFirstTime:boolean = true;
	dateCustomClasses=[];
	@ViewChild("bsDatePicker") bsDatePicker;
	constructor(private authService: AuthService) { }

	ngOnInit(): void {
		this.bsInlineValue = new Date();
		this.getQuickJobList();
	}

	load() {
		this.dataTable = $(this.table.nativeElement).DataTable({
			responsive:true,
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
	getQuickJobList() {
		this.authService.getQuickJobList().subscribe(response => {
			if (response.success) {
				this.errorMessage = '';
				this.quickJobs = response.data;
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
		Swal.fire({
			title: 'Ar tikrai norite ištrinti darbą ?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Taip',
			cancelButtonText: 'Ne'
		}).then((result) => {
			if (result.value) {
				const form = { quickJobId:id };
				this.authService.deleteQuickJobById(form).subscribe(response => {
					if (response.success) {
						this.dataTable.destroy();
						this.getQuickJobList();
					}
					else {
					}
				});
			}
		});
	}
	quickJobDetails(quickJobId,openModal){
		const params = {quickJobId	};
		this.authService.getQuickJobDetailById(params).subscribe(response=>{
			if(response.success){
				this.quickJobDetail.name= response.data.name; 
				this.quickJobDetail.email= response.data.email; 
				this.quickJobDetail.adName= response.data.adName; 
				this.quickJobDetail.distance = response.data.distance; 
				this.quickJobDetail.image = response.data.image; 
				this.quickJobDetail.jobType = response.data.jobType; 
				this.quickJobDetail.keyword = response.data.keyword; 
				this.quickJobDetail.locationServicePrice = response.data.locationServicePrice; 
				this.quickJobDetail.serivcePlace = response.data.serivcePlace ; 
				this.quickJobDetail.serviceAdmissionTime = response.data.serviceAdmissionTime; 
				this.quickJobDetail.servicePrice = response.data.servicePrice; 
				this.quickJobDetail.tellMore = response.data.tellMore;
				this.quickJobDetail.serviceName = response.data.serviceName;
				this.quickJobDetail.specialty = response.data.specialty;
				openModal.click();
			}
			else{
				this.errorMessage = response.message;
			}
		},error=>{
			this.errorMessage = "Klaida, bandykite dar kartą.";
		});
	}
}

