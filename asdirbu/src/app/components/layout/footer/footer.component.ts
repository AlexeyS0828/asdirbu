import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit {

	submitted = false;
	form: FormGroup;
	currentYear: number = Date.now();

	constructor(private authService: AuthService, private formBuilder: FormBuilder) { }
	ngOnInit() {
		this.form = this.formBuilder.group({
			email: [null, [Validators.required, Validators.email]]
		});
	}

	onFormSubmit(): void {
		this.submitted = true;
		if (this.form.invalid) {
			return;
		}
		const params = {
			email: this.form.value.email
		};
		this.authService.userSubscribe(params).subscribe(response => {
			if (response.success) {
				//this.authService.showSuccessMessage(response.message);
				this.submitted = false;
				this.form.reset();
				document.getElementById("subscribeErrorMessageSection").style.display = "none";
				document.getElementById("subscribeSuccessMessageSection").style.display = "block";
				document.getElementById("subscribeSuccessMessage").innerHTML = response.message;
			} else {
				//this.authService.showErrorMessage(response.message);				
				document.getElementById("subscribeSuccessMessageSection").style.display = "none";
				document.getElementById("subscribeErrorMessageSection").style.display = "block";
				document.getElementById("subscribeErrorMessage").innerHTML = response.message;
			}
		}, error => {
			//this.authService.showErrorMessage(error.message);
			document.getElementById("subscribeSuccessMessageSection").style.display = "none";
			document.getElementById("subscribeErrorMessageSection").style.display = "block";
			document.getElementById("subscribeErrorMessage").innerHTML = error.message;
		});
	}
}
