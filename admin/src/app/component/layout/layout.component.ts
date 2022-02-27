import { Component, OnInit } from '@angular/core';
import { NavigationEnd , Router} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  currentUrl = '';
  constructor(
    private router: Router,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.router.events.subscribe((event: any) => {
			if (event instanceof NavigationEnd){
        this.currentUrl = event.url;
  		}
		});
  }
  logout(): void {
		this.authService.logout();
		this.router.navigate(['/']);
	}
}
