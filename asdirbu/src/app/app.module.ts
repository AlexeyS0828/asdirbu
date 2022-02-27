import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxPayPalModule } from 'ngx-paypal';
import { AgmCoreModule } from '@agm/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';

// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeComponent } from './components/site/home/home.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { LayoutComponent } from './components/layout/layout/layout.component';
import { BusinessRegisterComponent } from './components/site/business-register/business-register.component';
import { IndividualRegisterComponent } from './components/site/individual-register/individual-register.component';
import { ConfirmComponent } from './components/site/confirm/confirm.component';
import { RegistrationStepComponent } from './components/site/registration-step/registration-step.component';
import { RegistrationComponent } from './components/site/registration/registration.component';
import { MessagesComponent } from './components/site/messages/messages.component';
import { FastPostingComponent } from './components/site/fast-posting/fast-posting.component';
import { ReservationComponent } from './components/site/reservation/reservation.component';
import { ReviewsComponent } from './components/site/reviews/reviews.component';
import { MyProfileComponent } from './components/site/my-profile/my-profile.component';
import { PaymentDetailsComponent } from './components/site/payment-details/payment-details.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ToastrModule } from 'ngx-toastr';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RatingModule } from 'ngx-bootstrap/rating';
import { AuthInterceptor } from './interceptors/auth-interceptor';
// import { RatingModule } from 'ngx-bootstrap/rating';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { NgXCreditCardsModule } from 'ngx-credit-cards';
import { environment } from 'src/environments/environment';
import { ModalModule } from 'ngb-modal';
import { ChatComponent } from './components/site/chat/chat/chat.component';
import { ContactsListComponent } from './components/site/chat/contacts-list/contacts-list.component';
import { MessagesViewComponent } from './components/site/chat/messages-view/messages-view.component';
import { ContactusComponent } from './components/site/contactus/contactus.component';
import { TermConditionComponent } from './components/site/term-condition/term-condition.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AccountActiveComponent } from './components/site/account-active/account-active.component';
import { ForgotPasswordComponent } from './components/site/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/site/reset-password/reset-password.component';
import { TagInputModule } from 'ngx-chips';
import { AboutusComponent } from './components/site/aboutus/aboutus.component';
import { PaymentComponent } from './components/site/payment/payment.component';
import { BlogComponent } from './components/site/blog/blog.component';
import { PrivacyPolicyComponent } from './components/site/privacy-policy/privacy-policy.component';
import { BloglistComponent } from './components/site/bloglist/bloglist.component';
import { AuthServiceConfig,FacebookLoginProvider, AuthService, SocialLoginModule, GoogleLoginProvider } from 'angularx-social-login';
import { JobdetailsComponent } from './components/site/jobdetails/jobdetails.component';
import { PaymentResponseComponent } from './components/site/payment-response/payment-response.component';
import { ViewReviewComponent } from './components/site/view-review/view-review.component';

const config: SocketIoConfig = { url: environment.socket_url, options: {} };
let configration = new AuthServiceConfig([
	{
		id: FacebookLoginProvider.PROVIDER_ID,
		provider: new FacebookLoginProvider(environment.FACEBOOK_APP_ID, environment.FACEBOOK_LOGIN_OPTIONS)
	},
	{
		id: GoogleLoginProvider.PROVIDER_ID,
		provider: new GoogleLoginProvider(environment.GOOGLE_CLIENT_ID)
	}
]);

export function provideConfig() {
	return configration;
}


@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		FooterComponent,
		HeaderComponent,
		LayoutComponent,
		BusinessRegisterComponent,
		IndividualRegisterComponent,
		ConfirmComponent,
		RegistrationStepComponent,
		RegistrationComponent,
		MessagesComponent,
		FastPostingComponent,
		ReservationComponent,
		ReviewsComponent,
		MyProfileComponent,
		PaymentDetailsComponent,
		ChatComponent,
		ContactsListComponent,
		MessagesViewComponent,
		ContactusComponent,
		TermConditionComponent,
		AccountActiveComponent,
		ForgotPasswordComponent,
		ResetPasswordComponent,
		AboutusComponent,
		PaymentComponent,
		BlogComponent,
		PrivacyPolicyComponent,
		BloglistComponent,
		JobdetailsComponent,
		PaymentResponseComponent,
		ViewReviewComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		BsDatepickerModule.forRoot(),
		TimepickerModule.forRoot(),
		ToastrModule.forRoot(),
		PaginationModule.forRoot(),
		RatingModule.forRoot(),
		NgxSpinnerModule,
		SocketIoModule.forRoot(config),
		GooglePlaceModule,
		NgxPayPalModule,
		ModalModule,
		SocialLoginModule,
		AgmCoreModule.forRoot({
			apiKey: environment.google_api_key
		}),
		SharedModule,
		NgxMaskModule.forRoot(),
		TagInputModule
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
		{ provide: AuthServiceConfig,useFactory: provideConfig }
	],
	bootstrap: [AppComponent],
	exports: [HeaderComponent, FooterComponent],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})

export class AppModule { }
