import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MustMatch } from 'src/app/validators/must-match.validator';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
	submitted = false;
	form: FormGroup;
	errorMessage: string = "";
	token: string;
	constructor(public authService: AuthService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) { }

	ngOnInit() {
		this.route.paramMap.subscribe((paramMap: ParamMap) => {
			this.token = paramMap.get('token');
		});
		this.form = this.formBuilder.group({
			newpassword: [null,[Validators.required]],
			confirmPassword: [null, Validators.required]
		}, {
			validator: MustMatch('newpassword', 'confirmPassword')
		});
	}

	onResetPassword() {
		this.submitted = true;
		if (this.form.invalid) {
			return;
		}
		const resetPasswordData = {
			newpassword: this.form.value.newpassword,
			token: this.token
		};
		this.authService.resetPassword(resetPasswordData).subscribe(response => {
			if (response.success) {
				this.router.navigate(['/registration']);
			}
			else {
				document.getElementById("errorMessageSection").style.display = "block";
				document.getElementById("errorMessage").innerHTML = response.message;
			}
		}, error => {
			document.getElementById("errorMessageSection").style.display = "block";
			document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
		});
	}
}
