import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import { Router, ActivatedRoute, Route, ParamMap } from '@angular/router';

@Component({
	selector: 'app-reservation',
	templateUrl: './reservation.component.html',
	styleUrls: ['./reservation.component.scss']
})

export class ReservationComponent implements OnInit {
	submitted = false;
	form: FormGroup;
	bookingId: string;
	userId: string;
	errorMessage: string = "";
	constructor(private authService: AuthService,
		private paymentService: PaymentService,
		private formBuilder: FormBuilder,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		 if (!this.authService.getViewReservation()) {
		 	this.router.navigate(['/']);
		}
		this.form = this.formBuilder.group({
			message: [null, Validators.required]
		});
		this.route.paramMap.subscribe((paramMap: ParamMap) => {
			this.userId = paramMap.get('userId');
			this.bookingId = paramMap.get('bookingId');
		});
	}

	onFormSubmit(): void {
		this.submitted = true;
		if (this.form.invalid) {
			return;
		}
		const params = {
			user_id:this.userId,
			message: this.form.value.message,
			bookingId: this.bookingId,
		};
		this.paymentService.reservation(params).subscribe(response => {
			if (response) {
				this.authService.setViewReservation(false);
				this.router.navigate(['/confirm/payment']);
			} else {
				document.getElementById("errorMessageSection").style.display = 'block';
				document.getElementById("errorMessage").innerHTML = response.message;
			}
		}, error => {
			document.getElementById("errorMessageSection").style.display = 'block';
			document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
		});
	}
}
