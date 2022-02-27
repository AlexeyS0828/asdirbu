import { HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	constructor(private authService: AuthService, private spinner: NgxSpinnerService, private router: Router) { }

	intercept(req: HttpRequest<unknown>, next: HttpHandler)  {
		const authToken = this.authService.getToken();
		this.spinner.show();
  		if (authToken) {
			const authRequest = req.clone({
				headers: req.headers.set('x-access-token', authToken)
			});
			return next.handle(authRequest).pipe(
				finalize(() => {
					this.spinner.hide();
				}),
				catchError((error: any) => {
					if (error instanceof HttpErrorResponse) {
						if (error.status === 401) {
							this.authService.logout();
							this.router.navigate(['/']);
						}
					}
					return of(error);
				})
			);
		}
		return next.handle(req).pipe(
			finalize(() => {
				this.spinner.hide();
			})
		);
	}
}
