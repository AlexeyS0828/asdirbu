import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MustMatch } from 'src/app/validators/must-match.validator';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {AuthService as Auth,FacebookLoginProvider,GoogleLoginProvider} from 'angularx-social-login';
@Component({
  selector: 'app-business-register',
  templateUrl: './business-register.component.html',
  styleUrls: ['./business-register.component.scss']
})
export class BusinessRegisterComponent implements OnInit {

  submitted = false;
  form: FormGroup;
	errorMessage: string = "";
  user = {
		appId: "",
		name: "",
		email: "",
		loginType: 0,
		userType: 2  
  };
	private socialAuthStatusSub: Subscription;
  constructor(public authService: AuthService,public auth: Auth, private formBuilder: FormBuilder, private router: Router) { }

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
      email: new FormControl(null, {
        validators: [Validators.required,
        Validators.pattern("^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}$")]
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(8),
        Validators.pattern('^(?=.*?[A-Za-z])(?=.*?[0-9]).{9,}$')]
      }),
      confirmPassword: new FormControl(null, {
        validators: [Validators.required],
      }),
      companyCode: new FormControl(null, {
        validators: [Validators.required,Validators.pattern("[0-9]*"),Validators.minLength(7),Validators.maxLength(9)]
      }),
      companyName: new FormControl(null, {
        validators: [Validators.required],
      }),
      // sector: new FormControl(null, {
      //   validators: [Validators.required],
      // }),
      allowRegister: new FormControl(false, {
        validators: [Validators.required],
      })
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  onRegister() {
    console.log("sdf");
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
   if (!this.form.value.allowRegister) {
      return;
    }
    (<HTMLButtonElement>document.getElementById("submitButton")).disabled  = true;
    const registrationData = {
      email: this.form.value.email,
      password: this.form.value.password,
      companyName: this.form.value.companyName,
      companyCode: this.form.value.companyCode,
     // sector: this.form.value.sector,
      userType: 2
    };

    this.authService.checkEmail(this.form.value.email).subscribe((response) => {
        if (response.success) {
          this.authService.registration(registrationData);
        }
        else{
          (<HTMLButtonElement>document.getElementById("submitButton")).disabled  = false;
          document.getElementById("errorMessageSection").style.display = 'block';
					document.getElementById("errorMessage").innerHTML = response.message;
        }
    },error=>{
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
