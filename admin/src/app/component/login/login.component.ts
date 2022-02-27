import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	errorMessage: string;
	constructor(
		private router: Router,
		private formBuilder: FormBuilder,
		private authService: AuthService
	) { }

	ngOnInit() {
		if (this.authService.isLoggin()) {
			this.router.navigate(['/dashboard']);
		}
		this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required]],
		});
	}

	onLoginFormSubmit(): void {
		if (this.loginForm.valid) {
			this.authService.adminLogin(this.loginForm.value).subscribe((response) => {
				if (response.success) {
					this.authService.setUserLogin(response.data);
					this.router.navigate(['/dashboard']);
				}
				else {
					this.errorMessage = response.message;
				}
			}, error => {
				this.errorMessage = "Klaida, bandykite dar kartą.";
			});
		}
		else {
			this.loginForm.markAllAsTouched();
		}
	}
}
