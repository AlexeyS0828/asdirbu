import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

	totalNewUserPage=0;
	totalJobPage=0;
	pagination = 0;
	jobPage = 1;
	newUserPage = 1;
	perHour = 0;
	distance = 0;
	newUserData = [];
	jobList = [];
	lat = 54.687157;
	lng = 25.279652;
	zoom = 8;
	locationList: any = [];
	currentInfoWindowIndex = 0;
	markerUrl = {};
	isReadonly = true;
	submitted = false;
	filterForm: FormGroup;
	userId: string = "0";
	latitude = '';
	longitude = '';
	currentLatitude = '';
	currentLongitude = '';
	blogList = [];
	selectedSearch = "";
	@ViewChild('memberTab', { static: false }) memberTab: HTMLDivElement;
	@ViewChild('placesRef', { static: false }) placesRef: GooglePlaceDirective;
	constructor(private homeService: HomeService, private formBuilder: FormBuilder) { }
	ngOnInit() {
		// navigator.geolocation.getCurrentPosition((position) => {
		// 	this.currentLatitude = position.coords.latitude;
		// 	this.currentLongitude = position.coords.longitude;
		// });
		//this.getBlogList();
		//this.getHomePageDetails();
		this.getAllLocation();
		this.markerUrl = {
			url: 'assets/image/marker.png',
			scaledSize: {
				width: 40,
				height: 60
			}
		};
		this.filterForm = this.formBuilder.group({
			specialty: new FormControl('', {}),
			otherSpecialty: new FormControl(null, {}),
			serviceName: new FormControl('', {}),
			otherServiceName: new FormControl(null, {}),
			city: new FormControl(null, {})
		});
	}

	pageChanged(event: any, name: string): void {
		if (name === 'job') {
			this.jobPage = event.page;
		} else {
			this.newUserPage = event.page;
		}
		if(this.selectedSearch=="range-filter"){
			this.rangeFilter();
		}
		else if(this.selectedSearch=="search-filter"){
			this.onSearchFilter();
		}
		else {
			this.getHomePageDetails();
		}
		window.scrollTo({
			top: document.getElementById("member-tab-list").offsetTop - 150,
			left: 0,
			behavior: 'smooth'
		});
	}


	
	getAllLocation() {
		const params = {
			jobPage: this.jobPage,
			newUserPage: this.newUserPage,
		};
		this.homeService.getAllLocation(params).subscribe(responseData => {
			if (responseData.success) {			
				this.locationList = responseData.data.locationList;
				this.newUserData = responseData.data.newUser;
				this.jobList = responseData.data.jobList;
				this.totalJobPage = responseData.data.totalJobPage * 10;
				this.totalNewUserPage = responseData.data.totalNewUserPage * 10;
				this.blogList = responseData.data.blogList;
				document.getElementById("errorMessageSection1").style.display = 'none';
			}
			else {
				document.getElementById("errorMessageSection1").style.display = 'block';
				document.getElementById("errorMessage1").innerHTML = "Klaida, bandykite dar kartą.";
			}
		}, error => {
			document.getElementById("errorMessageSection1").style.display = 'block';
			document.getElementById("errorMessage1").innerHTML = "Klaida, bandykite dar kartą.";
		});
	}
getHomePageDetails() {
		const params = {
			jobPage: this.jobPage,
			newUserPage: this.newUserPage,
		};
		this.homeService.getHomePageDetails(params).subscribe(responseData => {
			if (responseData.success) {
				this.newUserData = responseData.data.newUser;
				this.jobList = responseData.data.jobList;
				this.totalJobPage = responseData.data.totalJobPage * 10;
				this.totalNewUserPage = responseData.data.totalNewUserPage * 10;
				document.getElementById("errorMessageSection1").style.display = 'none';
			}
			else {
				document.getElementById("errorMessageSection1").style.display = 'block';
				document.getElementById("errorMessage1").innerHTML = "Klaida, bandykite dar kartą.";
			}
		}, error => {
			document.getElementById("errorMessageSection1").style.display = 'block';
			document.getElementById("errorMessage1").innerHTML = "Klaida, bandykite dar kartą.";
		});
	}

	onRangeFilter(event: any, name: string) {
		if(this.selectedSearch !== "range-filter"){
			this.jobPage = 1;
			this.newUserPage = 1;			
		}
		this.selectedSearch = "range-filter";
		if (name === 'perHour') {
			this.perHour = event.target.value;
		} else {
			this.distance = event.target.value;
		}
		this.rangeFilter();
	}

	rangeFilter(){
		const params = {
			jobPage: this.jobPage,
			newUserPage: this.newUserPage,
			perHour: this.perHour,
			distance: this.distance,
			latitude: this.currentLatitude,
			longitude: this.currentLongitude
		};
		this.homeService.getRangeFilterHomePageDetails(params).subscribe(responseData => {
			if(responseData.success) {
				this.newUserData = responseData.data.newUser;
				this.jobList = responseData.data.jobList;
				//this.locationList = this.newUserData;
				this.totalJobPage = responseData.data.totalJobPage * 10;
				this.totalNewUserPage = responseData.data.totalNewUserPage * 10;
				this.submitted = false;
				document.getElementById("errorMessageSection1").style.display = 'none';
			}
			else {
				document.getElementById("errorMessageSection1").style.display = 'block';
				document.getElementById("errorMessage1").innerHTML = "Klaida, bandykite dar kartą.";
			}
		},error=> {
			document.getElementById("errorMessageSection1").style.display = 'block';
			document.getElementById("errorMessage1").innerHTML = "Klaida, bandykite dar kartą.";
		});
	}

	onSearchFilter() {
		if(this.selectedSearch !== "search-filter"){
			this.jobPage = 1;
			this.newUserPage = 1;			
		}
		this.selectedSearch = "search-filter";
		this.submitted = true;
		const params = {
			jobPage: this.jobPage,
			newUserPage: this.newUserPage,
			specialty: this.filterForm.value.specialty,
			otherSpecialty: this.filterForm.value.otherSpecialty,
			serviceName: this.filterForm.value.serviceName,
			otherServiceName: this.filterForm.value.otherServiceName,
			city: this.filterForm.value.city,
			latitude: this.latitude,
			longitude: this.longitude
		};
		this.homeService.getSearchFilterHomePageDetails(params).subscribe(responseData => {
			if (responseData.success) {
				this.newUserData = responseData.data.newUser;
				this.jobList = responseData.data.jobList;
	//			this.locationList = this.newUserData;
				this.totalJobPage = responseData.data.totalJobPage * 10;
				this.totalNewUserPage = responseData.data.totalNewUserPage * 10;
				this.submitted = false;
				document.getElementById("errorMessageSection1").style.display = 'none';
			}
			else {
				document.getElementById("errorMessageSection1").style.display = 'block';
				document.getElementById("errorMessage1").innerHTML = "Klaida, bandykite dar kartą.";
			}
		}, error => {
			document.getElementById("errorMessageSection1").style.display = 'block';
			document.getElementById("errorMessage1").innerHTML = "Klaida, bandykite dar kartą.";
		});
	}

	markerClick(index: number) {
		this.currentInfoWindowIndex = index;
	}

	onChangeAddress(address: any): void {
		this.latitude = address.geometry.location.lat();
		this.longitude = address.geometry.location.lng();
	}

	getBlogList() {
		this.homeService.getBlogList().subscribe(response => {
			if (response.success) {
				this.blogList = response.data;
				document.getElementById("errorMessageSection").style.display = 'none';
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
}
