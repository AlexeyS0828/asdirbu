import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './components/layout/layout/layout.component';
import { HomeComponent } from './components/site/home/home.component';
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
import { AuthGuard } from './guards/auth.guard';
import { ChatComponent } from './components/site/chat/chat/chat.component';
import { ContactusComponent } from './components/site/contactus/contactus.component';
import { TermConditionComponent } from './components/site/term-condition/term-condition.component';
import { AccountActiveComponent } from './components/site/account-active/account-active.component';
import { ForgotPasswordComponent } from './components/site/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/site/reset-password/reset-password.component';
import { AboutusComponent } from './components/site/aboutus/aboutus.component';
import { PaymentComponent } from './components/site/payment/payment.component';
import { BlogComponent } from './components/site/blog/blog.component';
import { PrivacyPolicyComponent } from './components/site/privacy-policy/privacy-policy.component';
import { BloglistComponent } from './components/site/bloglist/bloglist.component';
import { JobdetailsComponent } from './components/site/jobdetails/jobdetails.component';
import { PaymentResponseComponent } from './components/site/payment-response/payment-response.component';
import { ViewReviewComponent } from './components/site/view-review/view-review.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'business', component: BusinessRegisterComponent },
            { path: 'individual/:type', component: IndividualRegisterComponent },
            { path: 'confirm/:type', component: ConfirmComponent },
            { path: 'registration-step', component: RegistrationStepComponent },
            { path: 'registration', component: RegistrationComponent },
            { path: 'review/:bookingId/:userId', component: MessagesComponent},
            { path: 'fast-posting', component: FastPostingComponent },
            { path: 'reservation/:bookingId/:userId', component: ReservationComponent, canActivate: [AuthGuard] },
            { path: 'profilis/:userId', component: ReviewsComponent },
            { path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuard] },
            { path: 'payment-details/:userHireId/:userId', component: PaymentDetailsComponent, canActivate: [AuthGuard] },
            { path: 'chat/:jobId/:userId/:postId', component: ChatComponent },
            { path: 'contactus', component: ContactusComponent },
            { path: 'term-condition', component: TermConditionComponent },
            { path: 'account-active/:token', component: AccountActiveComponent },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'reset-password/:token', component: ResetPasswordComponent },
            { path: 'aboutus', component: AboutusComponent },
            { path: 'payment/:jobId/:userId', component: PaymentComponent },
            { path: 'blog/:blogId', component: BlogComponent },
            { path: 'privacy-policy', component: PrivacyPolicyComponent },
            { path: 'bloglist', component: BloglistComponent },
            { path: 'job-details/:jobId', component: JobdetailsComponent },
            { path: 'payment-response', component: PaymentResponseComponent },
            { path: 'view-review/:bookingId', component: ViewReviewComponent },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule],
})

export class AppRoutingModule { }
