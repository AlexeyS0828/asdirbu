import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MustMatch } from 'src/app/validators/must-match.validator';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ltLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { AuthService as Auth, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { Subscription } from 'rxjs';
defineLocale("lt", ltLocale);

@Component({
	selector: 'app-individual-register',
	templateUrl: './individual-register.component.html',
	styleUrls: ['./individual-register.component.scss']
})

export class IndividualRegisterComponent implements OnInit {
	submitted = false;
	form: FormGroup;
	type: string;
	maxDate: Date = new Date();
	errorMessage: string = "";
	registerData: any;
	token: string;
	private socialAuthStatusSub: Subscription;
	user = {
		appId: "",
		name: "",
		email: "",
		loginType: 0,
		userType: 1
	};
	constructor(public authService: AuthService, private bsLocaleService: BsLocaleService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public auth: Auth) {
		this.bsLocaleService.use('lt');
	}

	ngOnInit() {
		if (!this.authService.getToken()) {
			this.socialAuthStatusSub = this.auth.authState.subscribe((user) => {
				if (user != null && user.id != null) {
					this.user.appId = user.id;
					this.user.name = user.name;
					this.user.email = user.email;
					if (user.provider == "FACEBOOK") {
						this.user.loginType = 1;
					}
					else if (user.provider == "GOOGLE") {
						this.user.loginType = 2;
					}
					this.authService.setSocialLogin(1);
					this.authService.socialLogin(this.user);
				}
			});
		}
		this.form = this.formBuilder.group({
			email: ["", [Validators.required,Validators.pattern("^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}$")]],
			password: ["",[Validators.required, Validators.minLength(9),Validators.pattern('^(?=.*?[A-Za-z])(?=.*?[0-9]).{9,}$')]],
			confirmPassword: ["",Validators.required],
			name: ["",Validators.required],
			lastname: ["",Validators.required],
			dob: ["",Validators.required,this.checkEighteenPlus.bind(this)],
			allowRegister: [false,Validators.required],
		}, {
			validator: MustMatch('password', 'confirmPassword')
		});
		this.route.paramMap.subscribe((paramMap: ParamMap) => {
			this.type = paramMap.get('type');
		});
		this.registerData = this.authService.getRegisterData();
		this.token = this.authService.getToken();
		if (!this.registerData && !this.token && this.type != "register") {
			this.router.navigate(['/fast-posting']);
		}
	}

	
	checkEighteenPlus(control:FormControl){
	    const _element = new Promise((resolve, reject) => {          
			
            if (control.value !== undefined && control.value !=="") {
				let today = new Date();
				let birthDate = new Date(control.value);
				let age = today.getFullYear() - birthDate.getFullYear();
				var m = today.getMonth() - birthDate.getMonth();
				if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
					age--;
				}
				if(age<18){
					resolve({ 'eighteenPlus': true });
				}
				else {
					resolve(null);	
				}
			}
            else {
                resolve(null);
            }
        });
        return _element;
    }
	onRegister() {
		this.submitted = true;
		if (this.form.invalid) {
			return;
		}
		if (!this.form.value.allowRegister) {
			return;
		}
		(<HTMLButtonElement>document.getElementById("submitButton")).disabled = true;
		const dateSendingToServer = new DatePipe('en-US').transform(this.form.value.dob, 'dd/MM/yyyy');
		const registrationData = {
			email: this.form.value.email,
			password: this.form.value.password,
			name: this.form.value.name,
			lastname: this.form.value.lastname,
			dob: dateSendingToServer,
			userType: 1
		};
		this.authService.checkEmail(this.form.value.email).subscribe((response) => {
			if (response.success) {
				if (this.type === 'register') {
					this.authService.registration(registrationData);
				} else {
					const quickjob = this.authService.getRegisterData();
					const quickjobData = { ...quickjob, ...registrationData };
					this.authService.fastPosting(quickjobData);
				}
			}
			else {
				(<HTMLButtonElement>document.getElementById("submitButton")).disabled  = false;
				document.getElementById("errorMessageSection").style.display = 'block';
				document.getElementById("errorMessage").innerHTML = response.message;
			}
		}, error => {
			(<HTMLButtonElement>document.getElementById("submitButton")).disabled  = false;
			document.getElementById("errorMessageSection").style.display = 'block';
			document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
		});
	}

	signInWithFacebook(): void {
		this.auth.signIn(FacebookLoginProvider.PROVIDER_ID);
	}

	signInWithGoogle(): void {
		this.auth.signIn(GoogleLoginProvider.PROVIDER_ID);
	}


	ngOnDestroy() {
		this.socialAuthStatusSub.unsubscribe();
	}
}
