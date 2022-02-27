import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
 
@Component({
  selector: 'app-bloglist',
  templateUrl: './bloglist.component.html',
  styleUrls: ['./bloglist.component.css']
})
export class BloglistComponent implements OnInit {

  blogList = [];
  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.homeService.getAllBlog().subscribe(response => {
			if (response.success) {
				this.blogList = response.data;
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
