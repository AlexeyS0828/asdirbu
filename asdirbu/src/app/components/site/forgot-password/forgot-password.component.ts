import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit {
	submitted = false;
	form: FormGroup;
	errorMessage: string = "";
	constructor(public authService: AuthService, private formBuilder: FormBuilder) { }
	ngOnInit() {
		this.form = this.formBuilder.group({
			email: [null,[Validators.required,Validators.email]]
		});
	}
	onForgotPassword() {
		this.submitted = true;
		if (this.form.invalid) {
			return;
		}
		const forgotPasswordData = {
			email: this.form.value.email
		};
		this.authService.forgotpassword(forgotPasswordData).subscribe(response=>{
				if(response.success){
					document.getElementById("errorMessageSection").style.display = "none";
					document.getElementById("successMessageSection").style.display = "block";
					document.getElementById("successMessage").innerHTML = response.message;
					this.submitted = false;
					this.form.reset();					
				}
				else{
					document.getElementById("successMessageSection").style.display = "none";
					document.getElementById("errorMessageSection").style.display = "block";
					document.getElementById("errorMessage").innerHTML = response.message;
				}
		},error=>{
			document.getElementById("successMessageSection").style.display = "none";
			document.getElementById("errorMessageSection").style.display = "block";
			document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
		});
	}
}
