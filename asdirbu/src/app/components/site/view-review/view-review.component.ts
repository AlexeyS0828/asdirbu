import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
	selector: 'app-view-review',
	templateUrl: './view-review.component.html',
	styleUrls: ['./view-review.component.css']
})
export class ViewReviewComponent implements OnInit {

	errorMessage: string = "";
	bookingId: string = "";
	isReadonly: boolean = true;
	review = {
		name: "",
		image: "",
		rating: "",
		message: "",
	};
	constructor(private authService: AuthService, private route: ActivatedRoute) { }

	ngOnInit(): void {
		this.route.paramMap.subscribe((paramMap: ParamMap) => {
			this.bookingId = paramMap.get('bookingId');
			const params = { bookingId: this.bookingId };
			this.authService.getJobReviewById(params).subscribe(response => {
				if (response.success) {
					this.errorMessage = "";
					this.review.name = response.data.name;
					this.review.image = response.data.image;
					this.review.rating = response.data.rating;
					this.review.message = response.data.review;
				}
				else {
					this.errorMessage = response.message;
				}
			});
		});
	}
}
