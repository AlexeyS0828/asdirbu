import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute,ParamMap }from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit {
	submitted = false;
	form: FormGroup;
	userId: string;
	profileImage = '';
	bookingId: string;
	name = '';
	constructor(private authService: AuthService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) { }
	ngOnInit() {
		if(this.authService.getToken()) {
			this.form = this.formBuilder.group({
				message: [null, Validators.required],
				ratings: [null, Validators.required]
			});
			this.route.paramMap.subscribe((paramMap: ParamMap) => {
				this.userId = paramMap.get('userId');
				this.bookingId = paramMap.get('bookingId');
				this.getUserProfileDetails();
			});
		}
		else {
			this.route.paramMap.subscribe((paramMap: ParamMap) => {
				this.userId = paramMap.get('userId');
				this.bookingId = paramMap.get('bookingId');
				this.authService.bookingId = Number(this.bookingId);
				this.authService.bookUserId = Number(this.userId);
				this.authService.logout();
				this.router.navigate(["/registration"]);
			});
		}		
	}
	getUserProfileDetails(): void {
		this.authService.getUserProfileDetails(this.userId.toString()).subscribe(response => {
			if (response.success) {
				this.form.patchValue({
					ratings: response.data.rating
				});
				this.profileImage = response.data.profile_image;
				this.name = response.data.name;
			}
			else {
				document.getElementById("errorMessageSection").style.display = 'block';
				document.getElementById("errorMessage").innerHTML = response.message;
			}
		}, error => {
			document.getElementById("errorMessageSection").style.display = 'block';
			document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
		});
	}
	onFormSubmit(): void {
		this.submitted = true;
		if (this.form.invalid) {
			return;
		}
		const params = {
			bookingId: this.bookingId,
			user_id: this.userId,
			message: this.form.value.message,
			ratings: this.form.value.ratings,
		};
		this.authService.review(params).subscribe(response => {
			if (response.success) {
				this.router.navigate(['/my-profile']);
			} else {
				document.getElementById("errorMessageSection").style.display = 'block';
				document.getElementById("errorMessage").innerHTML = response.message;
			}
		}, error => {
			console.log("Message",error);
			document.getElementById("errorMessageSection").style.display = 'block';
			document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
		});
	}
}
