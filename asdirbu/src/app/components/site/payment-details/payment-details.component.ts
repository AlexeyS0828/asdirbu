import { Component, OnInit, ViewChild, ElementRef,NgZone } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from 'src/environments/environment';
import { ModalManager } from 'ngb-modal';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-payment-details',
    templateUrl: './payment-details.component.html',
    styleUrls: ['./payment-details.component.scss']
})

export class PaymentDetailsComponent implements OnInit {

    opayEncodeCode:string = "";
    userId: string;
    bookingId: string;
    profileImage: string;
    name: string;
    rating: number;
    termCondition: string;
    city: string = '';
    day: string = '';
    work: string = '';
    fees: string = '0';
    servicePrice: string = '0';
    totalPrice: string =  '0';
    taxPay:string = '0';
    paymentForm: FormGroup;
    serviceName: string = '';
    submitted: boolean = false;
    cardType = ['Visa', 'MasterCard', 'AmericanExpress'];
    paymentType: number = 1;
    userHireId: string = "";
    totalHour: number = 0;
    public paypalPlanConfig?: IPayPalConfig;
    private paymentModalRef;
    @ViewChild("paymentModal", { static: false }) paymentModal: ElementRef;
    handler: any = null;
    constructor(private router: Router,
        private authService: AuthService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private paymentService: PaymentService,
        private modalService: ModalManager,
        private spinner: NgxSpinnerService,
        private ngZone: NgZone) { }

    ngOnInit() {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            this.userId = paramMap.get('userId');
            this.userHireId = paramMap.get('userHireId');
            const params = { "user_id": this.userId, "hireId": this.userHireId };
            this.authService.getUserDetails(params).subscribe(response => {
                if (response.success) {
                    this.profileImage = response.data.profile_image;
                    this.name = response.data.name;
                    this.rating = response.data.ratings;
                    this.termCondition = response.data.termCondition;
                    this.city = response.data.city;
                    this.day = response.data.day;
                    this.work = response.data.work;
                    this.serviceName = response.data.service_name;
                    this.fees = response.data.fee,
                    this.servicePrice = response.data.service_price;
                    this.totalPrice = response.data.price;
                    this.totalHour = response.data.totalHour;
                    this.taxPay = response.data.taxPay;
					document.getElementById("errorMessageSection").style.display = "none";
				}
				else {
					document.getElementById("errorMessageSection").style.display = "block";
					document.getElementById("errorMessage").innerHTML = response.message;
				}
			},error=>{
				document.getElementById("errorMessageSection").style.display = "block";
				document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
			});
        });
        this.loadStripe();
        this.paymentForm = this.formBuilder.group({
            'cardNumber': [null, [Validators.required, Validators.minLength(16), Validators.maxLength(16), Validators.pattern('[0-9]+')]],
            'month': [null, [Validators.required,Validators.minLength(6), Validators.maxLength(6)]],
            'cvv': [null, [Validators.required, Validators.minLength(3), Validators.maxLength(4), Validators.pattern('[0-9]+')]],
            'country': [null, Validators.required],
            'termCondition': [false]
        });
    }

    closePaymentModel(): void {
        this.modalService.close(this.paymentModalRef);
    }

    onSelectPaymentType(paymentType: number):void {
        if (paymentType == 1) {
            this.paymentType = 1;
        }
        else {
            this.openPaymentModel();
            this.paymentType = 2;
        }
    }

    openPaymentModel() :void {
        this.paymentModalRef = this.modalService.open(this.paymentModal, { size: "md" });
        setTimeout(() => {
            this.paypalPlanConfig = {
                currency: 'EUR',
                clientId: environment.paypal_client_id,
                createOrderOnClient: (data) => <ICreateOrderRequest>{
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            amount: {
                                currency_code: 'EUR',
                                value: this.totalPrice.toString(),
                                breakdown: {
                                    item_total: {
                                        currency_code: 'EUR',
                                        value: this.totalPrice.toString()
                                    }
                                }
                            },
                            items: [
                                {
                                    name: 'Enterprise Subscription',
                                    quantity: '1',
                                    category: 'DIGITAL_GOODS',
                                    unit_amount: {
                                        currency_code: 'EUR',
                                        value: this.totalPrice.toString(),
                                    },
                                }
                            ]
                        }
                    ]
                },
                advanced: {
                    commit: 'true'
                },
                onApprove: (data, actions) => {
                    actions.order.get().then(details => {
                        const params = {
                            "booked_user_id": this.userId,
                            "tnx_id": details.id,
                            "userHireId": this.userHireId,
                            "totalAmount":this.totalPrice,
                            "fees":this.fees,
                            "jobId":0
                        };
                        this.paymentService.transaction(params).subscribe(response => {
                            if (response.success) {
                                this.closePaymentModel();
                                this.bookingId = response.bookingId.toString();
                                this.authService.setViewReservation(true);
                                this.router.navigate(["/reservation", this.bookingId, this.userId]);
                            }
                            else {
                                document.getElementById("errorMessageSection").style.display = "block";
                                document.getElementById("errorMessage").innerHTML = response.message;
                            }
                        },error=>{
                            document.getElementById("errorMessageSection").style.display = "block";
                            document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
                        });
                    });
                },
                onClientAuthorization: (data) => {
                    console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
                },
                onCancel: (data, actions) => {
                    console.log('OnCancel', data, actions);
                },
                onError: err => {
                    console.log('OnError', err);
                    document.getElementById("errorMessageSection").style.display = "block";
                    document.getElementById("errorMessage").innerHTML = 'Kažkas negerai, bandykite vėliau dar kartą ...';
                },
                onClick: (data, actions) => {
                    console.log('onClick', data, actions);
                },
            };
        }, 1000);
    }

    onPaymentFormSubmit() :void {
        return ;
        this.authService.setViewReservation(true);
        this.submitted = true;
        if (this.paymentForm.invalid) {
            return;
        }
        this.getToken();       
    }
    getToken():void {
        this.spinner.show();
        const month = this.paymentForm.value.month.substr(0,2);
        const year = this.paymentForm.value.month.substr(2,this.paymentForm.value.month.length);
        (<any>window).Stripe.card.createToken({
            number: this.paymentForm.value.cardNumber,
            exp_month: month,
            exp_year: year,
            cvc: this.paymentForm.value.cvv
        }, (status: number, response: any) => {
            if (status === 200) {
                const params = {
                    "stripeToken":response.id,
                    "amount":this.totalPrice,
                    "fees":this.fees,
                    "userId":this.userId,
                    "userHireId":this.userHireId,
                    "jobId":0
                };
                this.paymentService.stripePayment(params).subscribe(response=>{
                    if(response.success) {
                        this.bookingId = response.bookingId.toString();
                        this.authService.setViewReservation(true);
                        this.ngZone.run(()=>{ this.spinner.hide();this.router.navigate(["/reservation",this.bookingId,this.userId]);});
                    }
                    else {
                        document.getElementById("errorMessageSection").style.display = "block";
                        document.getElementById("errorMessage").innerHTML = response.message;
                        this.ngZone.run(()=>{ this.spinner.hide();});
                    }
                },error=> {
                    document.getElementById("errorMessageSection").style.display = "block";
                    document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
                    this.ngZone.run(()=>{ this.spinner.hide();});
                });
            } else {
                document.getElementById("errorMessageSection").style.display = "block";
                document.getElementById("errorMessage").innerHTML = response.error.message;
                this.ngZone.run(()=>{ this.spinner.hide();});
            }
        });
    }
    
    loadStripe():void {
        if (!window.document.getElementById('stripe-script')) {
            var s = window.document.createElement("script");
            s.id = "stripe-script";
            s.type = "text/javascript";
            s.src = "https://checkout.stripe.com/checkout.js";
            window.document.body.appendChild(s);
        }
    }
    opayPayment(type){
        this.paymentType = type;
        const params = {
            "booked_user_id": this.userId,
            "userHireId": this.userHireId,
            "totalAmount":this.totalPrice,
            "fees":this.fees,
            "jobId":0
        };
        this.ngZone.run(()=>{ this.spinner.show();});
        this.paymentService.opayPayment(params).subscribe(response=>{
            if(response.success){
                this.ngZone.run(()=>{ this.spinner.hide();});
                window.location.href = response.encodeUrl;
                document.getElementById("errorMessageSection").style.display = "none";    
            }
            else{
                document.getElementById("errorMessageSection").style.display = "block";
                document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
                this.ngZone.run(()=>{ this.spinner.hide();});
            }
        });
    }
}
