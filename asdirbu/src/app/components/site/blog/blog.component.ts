import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { ParamMap, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-blog',
	templateUrl: './blog.component.html',
	styleUrls: ['./blog.component.css']
})

export class BlogComponent implements OnInit {

	blog = {
		name: "",
		image: "",
		description: "",
	};
	blogId: number;
	constructor(private homeService: HomeService, private route: ActivatedRoute) { }
	ngOnInit(): void {
		this.route.paramMap.subscribe((paramMap: ParamMap) => {
			this.blogId = Number(paramMap.get('blogId'));
			this.getBlogById();
		});
	}

	getBlogById() {
		const params = { "blogId": this.blogId };
		this.homeService.getBlogById(params).subscribe(response => {
			if (response.success) {
				this.blog.name = response.data.name;
				this.blog.image = response.data.image;
				this.blog.description = response.data.description;
				document.getElementById("errorMessageSection").style.display = 'done';
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
