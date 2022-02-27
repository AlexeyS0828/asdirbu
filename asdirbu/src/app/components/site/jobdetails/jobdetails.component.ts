import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-jobdetails',
	templateUrl: './jobdetails.component.html',
	styleUrls: ['./jobdetails.component.css']
})
export class JobdetailsComponent implements OnInit {

	imagePreview = "assets/image/as_dirbu.png";
	image = "";
	jobId = "";
	jobDetails = {
		userId: "",
		jobTitle: "",
		servicePrice: 0,
		address: "",
		date: "",
		time: "",
		jobImage: [],
		jobDescription: "",
		jobType: 0,
		placeGoodsDelivery:""
	}
	constructor(private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute,
	) { }

	ngOnInit(): void {
		this.route.paramMap.subscribe((paramMap: ParamMap) => {
			this.jobId = paramMap.get('jobId');
			this.getJobDetailsById();
		});
	}

	getJobDetailsById() {
		const params = { "jobId": this.jobId };
		this.authService.getJobDetailsById(params).subscribe(response => {
			if (response.success) {
				this.imagePreview = response.data.image;
				this.jobDetails.address = response.data.address;
				this.jobDetails.date = response.data.date;
				this.jobDetails.jobImage = response.data.jobImage;
				this.jobDetails.jobTitle = response.data.jobTitle;
				this.jobDetails.servicePrice = response.data.servicePrice;
				this.jobDetails.jobDescription = response.data.jobDescription;
				this.jobDetails.jobType = response.data.jobType;
				this.jobDetails.time = response.data.time;
				this.jobDetails.placeGoodsDelivery = response.data.placeGoodsDelivery;
				this.jobDetails.userId = response.data.userId;
				document.getElementById("errorMessageSection").style.display = "none";
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
	openPriviewImage(openModel, imageUrl): void {
		this.image = imageUrl;
		openModel.click();
	}
	sendMessage(openModel): void {
	//	console.log("Demo");
		const params = { "jobId": this.jobId };
		if (this.authService.getToken()) {
			this.authService.sendMessagePostJobUser(params).subscribe(response => {
				if (response.success) {
					openModel.click();
					document.getElementById("errorMessageSection").style.display = "none";
				}
				else {
					document.getElementById("errorMessageSection").style.display = "block";
					document.getElementById("errorMessage").innerHTML = response.message;
				}
			}, error => {
				//console.log(error);
				document.getElementById("errorMessageSection").style.display = "block";
				document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
			});
		}
		else {
			this.router.navigate(["/registration"]);
		}
	}
}
