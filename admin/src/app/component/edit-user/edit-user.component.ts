import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ltLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
defineLocale("lt", ltLocale);

@Component({
	selector: 'app-edit-user',
	templateUrl: './edit-user.component.html',
	styleUrls: ['./edit-user.component.css']
})

export class EditUserComponent implements OnInit {
	updateUserForm: FormGroup;
	errorMessage: string = "";
	maxDate = new Date();
	userId: string;
	userType:number;
	submitted:boolean = false;
	documentTypes:Array<string> = ['pdf', 'docx', 'doc', 'jpg','jpeg'];
	constructor(private formBuilder: FormBuilder, private authService: AuthService, private route: ActivatedRoute,private router: Router, private bsLocaleService: BsLocaleService) {
		this.bsLocaleService.use("lt");
	}

	ngOnInit(): void {
		this.route.paramMap.subscribe((paramMap: ParamMap) => {
			this.userId = paramMap.get('userId');
			this.getUserDeatailsById();
		});
		this.updateUserForm = this.formBuilder.group({
			name: [""],
			lastname: [""],
			email: ["", Validators.email],
			phone: ["",[Validators.pattern('[3706]{4}[0-9]{7}')],this.startWithCharacter.bind(this)],
			companyName: [""],
			companyCode: [""],
			dob: [""],
			hourrate: [""],
			type: [""],
			serviceName: [""],
			otherServiceName: [""],
			specialty: [""],
			backAccountNumber: [""],
			service: [""],
			aboutMe: [""],
			address: [""],
			city: [""],
			houseNumber: [""],
			documentImage: [""],
			profileImage: [""],
			images: [""],
		});

	}
	startWithCharacter(control: FormControl) {
        const _element = new Promise((resolve, reject) => {          
            if (control.value !== undefined && control.value !== null && !control.value.startsWith("3706")) {
                resolve({ 'match': true });
            }
            else{
                resolve(null);
            }
        });
        return _element;
    }


	getUserDeatailsById() {
		const params = { "userId": this.userId };
		this.authService.getUserDetailsById(params).subscribe((response) => {
			if (response.success) {
				this.updateUserForm.patchValue({
					name: response.data.name,
					lastname: response.data.lastname,
					email: response.data.email,
					phone: response.data.mobileNumber,
					companyCode: response.data.companyCode,
					companyName: response.data.companyName,
					hourrate: response.data.hourRate,
					type: response.data.type,
					serviceName: response.data.serviceName,
					otherServiceName: response.data.otherServiceName,
					specialty: response.data.specialty,
					backAccountNumber: response.data.bankAccountNumber,
					service: response.data.service,
					aboutMe: response.data.aboutMe,
					address: response.data.address,
					city: response.data.city,
					houseNumber: response.data.houseNumber,
					//documentImage: response.data.documentFile,
					profileImage: response.data.profileImage,
					//images:response.data.images
				});
				if(response.data.dob !== "" && response.data.dob !=null){
					this.updateUserForm.patchValue({dob:new Date(response.data.dob)});
				}
				this.userType = response.data.userType;
			}
			else {
				this.errorMessage = response.message;
			}
		}, error => {
			this.errorMessage = "Klaida, bandykite dar kartą.";
		});
	}
	onImageSelect(event: Event,FileInput:any) {
		const file = (event.target as HTMLInputElement).files[0];
		if (!(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
			this.errorMessage = "Įkelkite galiojantį vaizdo failą";
			FileInput.value = "";
			return;
		}
		else if (file.size > 10000000) {
			this.errorMessage = "Didžiausias įkeliamo failo dydis - 10 mb";
			FileInput.value = "";
			return;
		}
		this.errorMessage = "";
		this.updateUserForm.patchValue({ profileImage: file });
		this.updateUserForm.get('profileImage').updateValueAndValidity();
	}	
	onFileSelect(event: Event,FileInput:any) {
		this.errorMessage = "";
		const files = (event.target as HTMLInputElement).files;
		for(let i=0;i<files.length;i++){
			let file = files.item(i);
			const extension = file.name.split('.').pop().toLowerCase();
			if (!(this.documentTypes.indexOf(extension) > -1)) {
				FileInput.value = "";
		     	this.errorMessage = "Pasirinkite tik pdf, doc,jpg failą";
			}
			else if (file.size > 10000000) {
				FileInput.value = "";
				this.errorMessage = "Didžiausias įkeliamo failo dydis - 10 mb";
			}			
		}
		if(this.errorMessage !== ""){
			return;
		}
		this.updateUserForm.patchValue({ documentImage: files });
		this.updateUserForm.get('documentImage').updateValueAndValidity();
	}
	onImagePicked(event: Event,FileInput:any) {
		this.errorMessage = "";
		const files = (event.target as HTMLInputElement).files;
		let filelist = [];
		for(let i=0;i<files.length;i++){
			let file = files.item(i);
			filelist.push(file);
			if (!(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
				FileInput.value = "";
				this.errorMessage = "Įkelkite galiojantį vaizdo failą";
			}
			else if (file.size > 10000000) {
				FileInput.value = "";
				this.errorMessage = "Didžiausias įkeliamo failo dydis - 10 mb";
			}			
		}
		if(this.errorMessage !== ""){
			return;
		}
		this.updateUserForm.patchValue({ images:  files });
	}

	updateUserFormSubmit() {
		this.submitted = true;
		if(this.updateUserForm.invalid){
			return;
		}
		const userData = this.updateUserForm.value;
		let dob = null;
		if(userData.dob!=null && userData.dob != "Invalid Date"){
		  dob = new DatePipe('en-US').transform(userData.dob, 'yyyy-MM-dd');
		}
		let form  = new FormData();
		form.append("userId",this.userId);	
		form.append("name",userData.name);	
		form.append("lastname",userData.lastname);	
		form.append("email",userData.email);	
		form.append("phone",userData.phone);	
		form.append("companyName",userData.companyName);	
		form.append("companyCode",userData.companyCode);	
		form.append("dob",dob);	
		form.append("hourrate",userData.hourrate);	
		form.append("type",userData.type);	
		form.append("serviceName",userData.serviceName);	
		form.append("otherServiceName",userData.otherServiceName);	
		form.append("specialty",userData.specialty);	
		form.append("backAccountNumber",userData.backAccountNumber);	
		form.append("service",userData.service);
		form.append("aboutMe",userData.aboutMe);
		form.append("address",userData.address);
		form.append("city",userData.city);
		form.append("houseNumber",userData.houseNumber);
		form.append("profileImage",userData.profileImage);
		if(userData.documentImage.length > 0){
			let index = 0;
			for(const data of userData.documentImage){
				form.append('document[' + index + ']', data);
				index++;
			}
		}	
		//console.log(userData.images);
		if(userData.images.length > 0){
			let index = 0;
			for(const data of userData.images){
				form.append('image[' + index + ']', data);
				index++;
			}
		}
		this.authService.updateProfileById(form).subscribe(response=>{
			if(response.success){
				if(this.userType==2){
					this.router.navigate(["/business"]);
				}
				else{
					this.router.navigate(["/individual"]);
				}
			}
			else{
				this.errorMessage = response.message;
			}
		},error=>{	
			this.errorMessage= "Klaida, bandykite dar kartą.";
		});
	}
}
