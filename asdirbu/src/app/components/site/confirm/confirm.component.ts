import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  type: string;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.type = paramMap.get('type');
    });
  }

  redirectToHome() {
    localStorage.setItem('userType', '1');
    localStorage.setItem('userLogin', '1');
    this.router.navigate(['/my-profile']);
  }

}
