import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-account-active',
	templateUrl: './account-active.component.html',
	styleUrls: ['./account-active.component.css']
})

export class AccountActiveComponent implements OnInit {

	token: string;
	errorMessage: string = "";
	constructor(
		private authService: AuthService, 
		private router: Router, 
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.route.paramMap.subscribe((paramMap: ParamMap) => {
			this.token = paramMap.get('token');
			this.tokenVerify();
		});
	}

	tokenVerify() {
		const params = { "token": this.token };
		this.authService.tokenVerify(params).subscribe(response => {
			if (response.success) {
				// this.authService.showSuccessMessage(response.message);
				this.router.navigate(['/registration']);
			}
			else {
				// this.authService.showErrorMessage(response.message);
				document.getElementById("errorMessageSection").style.display = 'block';
				document.getElementById("errorMessage").innerHTML = response.message;
				this.router.navigate(['/registration']);
			}
		}, error => {
			document.getElementById("errorMessageSection").style.display = 'block';
			document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
			// this.authService.showErrorMessage(error.message);
		});
	}
}
