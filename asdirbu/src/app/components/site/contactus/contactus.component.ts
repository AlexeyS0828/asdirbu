import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-contactus',
	templateUrl: './contactus.component.html',
	styleUrls: ['./contactus.component.scss']
})

export class ContactusComponent implements OnInit {
	submitted = false;
	form: FormGroup;
	errorMessage: string = "";
	successMessage: string = "";
	constructor(public authService: AuthService, private formBuilder: FormBuilder) { }
	ngOnInit() {
		this.form = this.formBuilder.group({
			name: [null, [Validators.required]],
			email: [null, [Validators.required, Validators.email]],
			message: [null, [Validators.required]]
		});
	}
	onFormSubmit() {
		this.submitted = true;
		if (this.form.invalid) {
			return;
		}
		this.authService.contactus(this.form.value).subscribe(response => {
			if (response.success) {			
				this.submitted = false;
				this.form.reset();	
				document.getElementById("errorMessageSection").style.display = 'none';
				document.getElementById("successMessageSection").style.display = 'block';
				document.getElementById("successMessage").innerHTML = response.message;
				// this.authService.showSuccessMessage(response.message);
			} else {
				document.getElementById("errorMessageSection").style.display = 'block';
				document.getElementById("errorMessage").innerHTML = response.message;
				// this.authService.showErrorMessage(response.message);
			}
		}, error => {
			document.getElementById("errorMessageSection").style.display = 'block';
			document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
			// this.authService.showErrorMessage(error.message);
		});
	
	}
}
