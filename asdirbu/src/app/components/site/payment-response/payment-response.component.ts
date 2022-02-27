import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-payment-response',
	templateUrl: './payment-response.component.html',
	styleUrls: ['./payment-response.component.css']
})

export class PaymentResponseComponent implements OnInit {
	encodeString = "";
	errorMessage = "";
	successMessage = "";
	
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private paymentService: PaymentService,
		private authService: AuthService
	) {
		this.encodeString = this.route.snapshot.queryParamMap.get("encoded");
		if (this.encodeString != "" && this.encodeString != undefined) {
			try{
				let data = this.encodeString.substr(0, this.encodeString.length-2);
				let decodeString = atob(data);
				if (decodeString != "") {
					let data = decodeString.split("&");
					if (data.length > 0) {
						let params = {};
						data.forEach(element => {
							let singleElement = element.split("=");
							params = { ...params, ...{ [singleElement[0]]: singleElement[1] } }
						});
						if(params["status"]==1){
							this.errorMessage = "";
							this.successMessage = "Ačiū, tavo mokėjimas sėkmingas!";
							this.paymentService.changePaymentStatus(params).subscribe(response=>{	
								if(response.success) {
									let bookingId = response.data.bookingId;
									let userId = response.data.userId;
									if(response.data.hasOwnProperty('logindata')){
										this.authService.authStatusListener.next(true);
										this.authService.saveAuthData(response.data.logindata._token,JSON.stringify(response.data.logindata));
									}
									this.authService.setViewReservation(true);
									this.router.navigate(["/reservation",bookingId,userId]);
								}
								else {
									this.successMessage = "";
									this.errorMessage = "Atsiprašome įvyko klaida, bandykite dar karta";
									setTimeout(function(){this.router.navigate(['/']);}, 3000);	
								}
							});
						}	
						else {
							this.successMessage = "";
							this.errorMessage = "Atsiprašome įvyko klaida, bandykite dar karta";
							setTimeout(function(){this.router.navigate(['/']);}, 3000);	
						}
					}
					else {
						this.successMessage = "";
						this.errorMessage = "Atsiprašome įvyko klaida, bandykite dar karta";
						setTimeout(function(){this.router.navigate(['/']);}, 3000);	
					}
				}
				else {
					this.successMessage = "";
					this.errorMessage = "Atsiprašome įvyko klaida, bandykite dar karta";
					setTimeout(function(){this.router.navigate(['/']);}, 3000);	
				}
			}
			catch(error){
				this.successMessage = "";
				this.errorMessage = "Atsiprašome įvyko klaida, bandykite dar karta";
				setTimeout(function(){this.router.navigate(['/']);}, 3000);	
			}
		}
		else {
			this.successMessage = "";
			this.errorMessage = "Atsiprašome įvyko klaida, bandykite dar karta";
			setTimeout(function(){this.router.navigate(['/']);}, 3000);	
		}
	}
	ngOnInit(): void {
	}
}
