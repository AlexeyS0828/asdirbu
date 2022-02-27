import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  submitted = false;
  form: FormGroup;
  errorMessage:string = "";

  constructor(public authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: new FormControl(null, {
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  onLogin() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const registrationData = {
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.authService.login(registrationData);

    // this.submitted = false;
    // this.form.reset();
  }
}
