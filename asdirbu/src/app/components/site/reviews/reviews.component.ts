import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ProfileService } from 'src/app/services/profile.service';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ModalManager } from 'ngb-modal';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ltLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import Swal from 'sweetalert2';
defineLocale("lt", ltLocale);

@Component({
    selector: 'app-reviews',
    templateUrl: './reviews.component.html',
    styleUrls: ['./reviews.component.scss']
})

export class ReviewsComponent implements OnInit {
    hourrate: number = 0;
    selectedDateList = [];
    imagePreview1 = "assets/image/as_dirbu.png";
    bsInlineRangeValue: Date[];
    maxDate = new Date();
    specialty = "";
    profileImage = '';
    name: string = '';
    aboutus: string = '';
    rating: number = 0;
    reviewList = [];
    timesheet = [];
    userid: string;
    dateCustomClasses = [];
    enabledDates = [];
    isReadonly = true;
    today: Date = new Date();
    minDate: Date;
    startDate = '';
    endDate = '';
    displayDummyReviewText: boolean = false;
    daysSelected: any[] = [];
    event: any;
    selectedDate = [];
    bsInlineValue: Date;
    firstTime: boolean = true;
    pageNumber: number = 1;
    totalPageNumber: number = 0;
    @ViewChild('bsDatePicker') bsDatePicker;
    displayMore: boolean = false;
    displayPrevious: boolean = false;
    initialDates: number = 0;
    endDates: number = 10;
    timeSheetDetails: any = [];
    calendarForm: FormGroup;
    allSelected: boolean = true;
    imageList = [];
    errorMessage1 = "";
    previewImage = "";
    private timesheetModelReferance;
    private customTimesheetModelReferance;
    selectedStartDate = new Date();
    selectedEndDate = new Date();
    selectedTextDate = "";
    selectedDateCount: number = 0;
    totalHourRatePrice: number = 0;
    totalCustomHourRatePrice: number = 0;
    dateSelectFirstTime: boolean = false;
    dayList = ["Sek", "Pir", "Ant", "Tre", "Ket", "Pen", "Šeš"];
    monthList = ["sausis", "vasaris", "kovas", "balandis", "gegužė", "birželis", "liepa", "rugpjūtis", "rugsėjis", "spalis", "lapkritis", "gruodis"];
    selectedDateWiseTableHeading = [
        { "day": "", "date": new Date() },
        { "day": "", "date": new Date() },
        { "day": "", "date": new Date() },
        { "day": "", "date": new Date() },
        { "day": "", "date": new Date() },
        { "day": "", "date": new Date() },
        { "day": "", "date": new Date() },
    ];
    customTimesheet = [];
    timesheetDateSelected = false;
    selectCustomDate: Date;
    customCalendarForm: FormGroup;
    @ViewChild("timesheetModal", { static: false }) timesheetModal;
    @ViewChild("customTimesheetModal", { static: false }) customTimesheetModal;
    address:string = "";
    constructor(private authService: AuthService,
        private profileService: ProfileService,
        private router: Router,
        private modalService: ModalManager,
        private route: ActivatedRoute,
        private bsLocaleService: BsLocaleService,
        private formBuilder: FormBuilder) {
        this.bsLocaleService.use('lt');
    }


    ngOnInit() {
        // for(let i=6;i < 22; i++) {
        // 	this.customTimesheet.push({"check":false,"start":new DatePipe('en-US').transform(new Date().setHours(i,0),"HH:mm"),"end":new DatePipe('en-US').transform(new Date().setHours(i,30),"HH:mm")});
        // 	this.customTimesheet.push({"check":false,"start":new DatePipe('en-US').transform(new Date().setHours(i,30),"HH:mm"),"end":new DatePipe('en-US').transform(new Date().setHours(i+1,0),"HH:mm")});			
        // }
        this.calendarForm = this.formBuilder.group({
            "0": this.formBuilder.array([]),
            "1": this.formBuilder.array([]),
            "2": this.formBuilder.array([]),
            "3": this.formBuilder.array([]),
            "4": this.formBuilder.array([]),
            "5": this.formBuilder.array([]),
            "6": this.formBuilder.array([]),
        });
        this.customCalendarForm = this.formBuilder.group({
            "0": this.formBuilder.array([]),
            "1": this.formBuilder.array([]),
            "2": this.formBuilder.array([]),
            "3": this.formBuilder.array([]),
            "4": this.formBuilder.array([]),
            "5": this.formBuilder.array([]),
            "6": this.formBuilder.array([]),
        });
        this.maxDate.setDate(this.maxDate.getDate() + 7);
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            this.userid = paramMap.get('userId');
            this.getTimesheetData();
            this.getUserProfileDetails();
            this.getReview(this.pageNumber);
        });
    }
    pageChanged(event: any): void {
        this.pageNumber = event.page;
        this.getReview(event.page);
        window.scrollTo({
            top: document.getElementById("review").offsetTop - 150,
            left: 0,
            behavior: 'smooth'
        });
    }
    getReview(page) {
        const userid = this.authService.getUser();
        const params = { "user_id": this.userid, "page": page };
        this.profileService.getReview(params).subscribe(response => {
            if (response.success) {
                this.reviewList = response.data
                this.totalPageNumber = response.pagination * 10;
                document.getElementById("errorMessageSection2").style.display = "none";
            }
            else {
                document.getElementById("errorMessageSection2").style.display = "block";
                document.getElementById("errorMessage2").innerHTML = response.message;
            }
        }, error => {
            document.getElementById("errorMessageSection2").style.display = "block";
            document.getElementById("errorMessage2").innerHTML = "Klaida, bandykite dar kartą.";
        });
    }

    getUserProfileDetails() {
        this.authService.getUserProfileDetails(this.userid).subscribe(response => {
            if (response.success) {
                console.log("response",response);
                this.profileImage = response.data.profile_image;
                this.name = response.data.name;
                this.hourrate = response.data.hourrate;
                this.specialty = response.data.specialty;
                this.rating = response.data.rating;
                this.aboutus = response.data.about;
                this.reviewList = response.data.review;
                this.imageList = response.data.imageList;
                this.address = response.data.address;
                if (this.reviewList.length === 0) {
                    this.displayDummyReviewText = true;
                }
                document.getElementById("errorMessageSection").style.display = "none";
            }
            else {
                document.getElementById("errorMessageSection").style.display = "block";
                document.getElementById("errorMessage").innerHTML = response.message;
            }
        }, error => {
            document.getElementById("errorMessageSection").style.display = "block";
            document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
        });
    }

    getTimesheetData() {
        const params = { user_id: this.userid };
        this.authService.getTimesheetData(params).subscribe(response => {
            if (response.success) {
                response.data.forEach((value, index) => {
                    this.daysSelected.push(value.date);
                    //  console.log(new Date(value.date));
                    this.dateCustomClasses.push({ date: new Date(value.date), classes: ['', 'text-primary font-weight-bold'] });
                    this.enabledDates.push(new Date(value.date));
                });
                this.bsInlineValue = new Date();
                document.getElementById("errorMessageSection").style.display = "none";
            }
            else {
                document.getElementById("errorMessageSection").style.display = "block";
                document.getElementById("errorMessage").innerHTML = response.message;
            }
        }, error => {
            document.getElementById("errorMessageSection").style.display = "block";
            document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
        });
    }

    onCalendarValueChange(value: Date) {
        this.selectedStartDate = new Date(value);
        const date = new DatePipe('en-US').transform(value, 'yyyy-MM-dd');
        if (this.daysSelected.includes(date)) {
            this.timesheetDateSelected = true;
            if (this.firstTime === false) {
                const index1 = this.selectedDate.findIndex(x => x == this.selectedDate[0]);
                this.dateCustomClasses.forEach((element, index) => {
                    let currentElementDate = new DatePipe('en-US').transform(element.date, 'yyyy-MM-dd');
                    if (currentElementDate == this.selectedDate[0]) {
                        this.dateCustomClasses[index].classes = ['', 'text-primary font-weight-bold'];
                    }
                });
                this.selectedDate = [];
                this.selectedDate.push(date);
                this.dateCustomClasses.forEach((element, index) => {
                    let currentElementDate = new DatePipe('en-US').transform(element.date, 'yyyy-MM-dd');
                    if (currentElementDate == date) {
                        this.dateCustomClasses[index].classes = ["", "date-selected"];
                    }
                });
            }
            else {
                this.selectedDate.push(date);
                this.dateCustomClasses.forEach((element, index) => {
                    let currentElementDate = new DatePipe('en-US').transform(element.date, 'yyyy-MM-dd');
                    if (currentElementDate == date) {
                        this.dateCustomClasses[index].classes = ["", "date-selected"];
                    }
                });
                this.firstTime = false;
            }
        }
        else if (this.dateSelectFirstTime) {
            this.setCustomSelectedDate();
            this.selectedDateList = [];
            this.customTimesheetModelReferance = this.modalService.open(this.customTimesheetModal, { size: "lg" });

        }
        this.dateSelectFirstTime = true;
    }

    onRedirectPaymentPage() {
        if (this.timesheetDateSelected) {
            this.selectedDateList = [];
            this.setSelectedDate();
            this.timesheetModelReferance = this.modalService.open(this.timesheetModal, { size: "lg" });
        } else {
            document.getElementById("errorMessageSection").style.display = "block";
            document.getElementById("errorMessage").innerHTML = "Pasirinkite datą";
        }
    }
    changeDateFormat(date) {
        return new DatePipe('en-US').transform(date, 'yyyy-MM-dd');
    }
    onSubmitCalendarform() {
        if (this.calendarForm.invalid) {
            return;
        }
        if (this.selectedDateList.length == 0) {
            this.errorMessage1 = "Pasirinkta data reikalinga!";
            return;
        }
        const params = { "selectedDate": this.selectedDateList, "userid": this.userid };
        this.authService.storeUserHireDay(params).subscribe(response => {
            if (response.success) {
                this.allSelected = true;
                this.modalService.close(this.timesheetModelReferance);
                const hireId = response.userHireId;
                if (!this.authService.getToken()) {
                    this.authService.userHireId = Number(this.userid);
                    this.authService.hireId = hireId;
                    this.router.navigate(['/registration']);
                } else {
                    this.authService.userHireId = 0;
                    this.authService.hireId = 0;
                    this.router.navigate(['payment-details', hireId, this.userid]);
                }
            } else {
                this.errorMessage1 = response.message;
            }
        }, error => {
            this.errorMessage1 = "Klaida, bandykite dar kartą.";
        });
    }

    openPriviewImage(openModel, imageUrl): void {
        this.previewImage = imageUrl;
        openModel.click();
    }

    addUserChat(): void {
        const params = { "userId": this.userid, "postJobId": 0 };
        if (this.authService.getToken()) {
            this.authService.addUserChat(params).subscribe(response => {
                if (response.success) {
                    this.router.navigate(["/chat", 0, this.userid, 0]);
                }
                else {
                    document.getElementById("errorMessageSection").style.display = "block";
                    document.getElementById("errorMessage").innerHTML = response.message;
                }
            }, error => {
                document.getElementById("errorMessageSection").style.display = "block";
                document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
            });
        }
        else {
            this.authService.chatUserId = Number(this.userid);
            this.router.navigate(["/registration"]);
        }
    }


    setSelectedDate(): void {
        this.selectedDateWiseTableHeading.forEach((element, index) => {
            let selectedCurrentDate = new Date(new Date(this.selectedStartDate).setDate(this.selectedStartDate.getDate() + index));
            this.selectedDateWiseTableHeading[index].date = selectedCurrentDate;
            this.selectedDateWiseTableHeading[index].day = this.dayList[selectedCurrentDate.getDay()];
            if (index == (this.selectedDateWiseTableHeading.length - 1)) {
                this.selectedEndDate = selectedCurrentDate;
            }
        });
        this.selectedTextDate = this.selectedStartDate.getFullYear() + " " + this.monthList[this.selectedStartDate.getMonth()] + " " + this.selectedStartDate.getDate() + " d. - " + this.selectedEndDate.getDate() + " d.";
        const params = { "startDate": new DatePipe('en-US').transform(this.selectedStartDate, 'yyyy-MM-dd'), "userId": this.userid };
        this.authService.getTimeSheetByStartDate(params).subscribe(response => {
            if (response) {
                this.selectedDateCount = 0;
                response.data.forEach(element => {
                    this.selectedDateCount = element.length > this.selectedDateCount ? element.length : this.selectedDateCount;
                });
                response.data.forEach((element, index) => {
                    let form = this.calendarForm.get(index.toString()) as FormArray;
                    let lastIndex = element.length;
                    form.clear();
                    element.forEach((ele) => {
                        let findElement = this.selectedDateList.find(ele1 => (ele1.start == ele.start && ele1.date == this.changeDateFormat(this.selectedDateWiseTableHeading[index].date)));
                        form.push(this.formBuilder.group({
                            check: new FormControl({ value: ((findElement != undefined) ? true : ele.isDisable), disabled: ele.isDisable }),
                            from: ele.start,
                            to: ele.end,
                            isDisable: ele.isDisable,
                            isExist: ele.isExist
                        }));
                    });
                    for (let i = lastIndex; i < this.selectedDateCount; i++) {
                        form.push(this.formBuilder.group({
                            check: [false],
                            from: "",
                            to: "",
                            isDisable: false,
                            isExist: false
                        }));
                    }
                });
            }
            else {
                document.getElementById("errorMessageSection").style.display = "block";
                document.getElementById("errorMessage").innerHTML = response.message;
            }
        }, error => {
            document.getElementById("errorMessageSection").style.display = "block";
            document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
        });
    }

    setCustomSelectedDate(): void {
        this.selectedDateWiseTableHeading.forEach((element, index) => {
            let selectedCurrentDate = new Date(new Date(this.selectedStartDate).setDate(this.selectedStartDate.getDate() + index));
            this.selectedDateWiseTableHeading[index].date = selectedCurrentDate;
            this.selectedDateWiseTableHeading[index].day = this.dayList[selectedCurrentDate.getDay()];
            if (index == (this.selectedDateWiseTableHeading.length - 1)) {
                this.selectedEndDate = selectedCurrentDate;
            }
        });
        this.selectedTextDate = this.selectedStartDate.getFullYear() + " " + this.monthList[this.selectedStartDate.getMonth()] + " " + this.selectedStartDate.getDate() + " d. - " + this.selectedEndDate.getDate() + " d.";
        const params = { "startDate": new DatePipe('en-US').transform(this.selectedStartDate, 'yyyy-MM-dd'), "userId": this.userid };
        this.authService.getTimeSheetByStartDate(params).subscribe(response => {
            if (response) {
                this.selectedDateCount = 32;
                response.data.forEach((element, index) => {
                    let form = this.customCalendarForm.get(index.toString()) as FormArray;
                    let lastIndex = element.length;
                    form.clear();
                    element.forEach((ele) => {
                        let findElement = this.selectedDateList.find(ele1 => (ele1.start == ele.start && ele1.date == this.changeDateFormat(this.selectedDateWiseTableHeading[index].date)));
                        form.push(this.formBuilder.group({
                            check: new FormControl({ value: ((findElement != undefined) ? true : ele.isDisable), disabled: ele.isDisable }),
                            from: ele.start,
                            to: ele.end,
                            isDisable: ele.isDisable,
                            isExist: ele.isExist
                        }));
                    });
                    if (lastIndex == 0) {
                        for (let i = 6; i < 22; i++) {
                            let start     = new DatePipe('en-US').transform(new Date().setHours(i, 0), "HH:mm");
                            let end     = new DatePipe('en-US').transform(new Date().setHours(i, 30), "HH:mm");
                            let findElement = this.selectedDateList.find(ele1 => (ele1.start == start && ele1.date == this.changeDateFormat(this.selectedDateWiseTableHeading[index].date)));
                            form.push(this.formBuilder.group({
                                check: new FormControl({ value: ((findElement != undefined) ? true : false), disabled: false }),
                                from: start,
                                to: end,
                                isDisable: false,
                                isExist: true
                            }));
                            start     = new DatePipe('en-US').transform(new Date().setHours(i, 30), "HH:mm");
                            end     = new DatePipe('en-US').transform(new Date().setHours(i+1, 0), "HH:mm");
                            findElement = this.selectedDateList.find(ele1 => (ele1.start == start && ele1.date == this.changeDateFormat(this.selectedDateWiseTableHeading[index].date)));
                            console.log("findeElement",findElement);
                            form.push(this.formBuilder.group({
                                check: new FormControl({ value: ((findElement != undefined) ? true : false), disabled: false }),
                                from: start,
                                to: end,
                                isDisable: false,
                                isExist: true
                            }));
                        }
                    } else {
                        for (let i = lastIndex; i < this.selectedDateCount; i++) {
                            form.push(this.formBuilder.group({
                                check: [false],
                                from: "",
                                to: "",
                                isDisable: false,
                                isExist: false
                            }));
                        }
                    }

                    console.log(this.customCalendarForm);
                });
            }
            else {
                document.getElementById("errorMessageSection").style.display = "block";
                document.getElementById("errorMessage").innerHTML = response.message;
            }
        }, error => {
            document.getElementById("errorMessageSection").style.display = "block";
            document.getElementById("errorMessage").innerHTML = "Klaida, bandykite dar kartą.";
        });
    }


    changeDate(value: string): void {
        if (value == "increment") {
            this.selectedStartDate = new Date(new Date(this.selectedStartDate).setDate(new Date(this.selectedStartDate).getDate() + 7));
        } else {
            this.selectedStartDate = new Date(new Date(this.selectedStartDate).setDate(new Date(this.selectedStartDate).getDate() - 7));
        }
        this.setSelectedDate();
    }
    changeCustomDate(value: string): void {
        if (value == "increment") {
            this.selectedStartDate = new Date(new Date(this.selectedStartDate).setDate(new Date(this.selectedStartDate).getDate() + 7));
        } else {
            this.selectedStartDate = new Date(new Date(this.selectedStartDate).setDate(new Date(this.selectedStartDate).getDate() - 7));
        }
        this.setCustomSelectedDate();
    }
    isChecked(isCheck: boolean, index: number, start: string, end: string) {
        if (!isCheck) {
            const findElement = this.selectedDateList.findIndex(element => (element.date == this.changeDateFormat(this.selectedDateWiseTableHeading[index].date) && element.start == start && element.end == end));
            if (findElement > -1) {
                this.selectedDateList.splice(findElement, 1);
            }
        }
        else {
            this.selectedDateList.push({
                date: this.changeDateFormat(this.selectedDateWiseTableHeading[index].date),
                start: start,
                end: end
            })
        }
        this.calculateHourRate();
    }

    onCustomSelection(isChecked, index) {
        this.customTimesheet[index].check = isChecked;
        this.calculateCuatomTimeHourRate();
    }
    clearCustomTimesheet() {
        this.customTimesheet.forEach((element, index) => {
            this.customTimesheet[index].check = false;
        });
        this.totalCustomHourRatePrice = 0;
    }
    customTimesheetFormSubmit() {
        if (this.selectedDateList.length == 0) {
            this.errorMessage1 = "Pasirinkta data reikalinga!";
            return;
        }        
        let fromUserId = this.authService.getUser();
        let toUserId = this.userid;            
        const params = { fromUserId, toUserId,timesheet:this.selectedDateList };
        this.authService.addCustomTime(params).subscribe(response => {
            if (response.success) {
                this.modalService.close(this.customTimesheetModelReferance);
                document.getElementById("errorMessageSection").style.display = "none";
                document.getElementById("successMessageSection").style.display = "block";
                document.getElementById("successMessage").innerHTML = response.message;
               this.errorMessage1 = '';
            }
            else {
                this.errorMessage1 = response.message;
            }
        });
        
    }
    calculateHourRate() {
        let halfHourRate = Number(Number(this.hourrate / 2).toFixed(2));
        let price = 0;
        this.selectedDateList.forEach(element => {
            price += Number(halfHourRate);
        });
        this.totalHourRatePrice = Number(Number(price).toFixed(2));
    }
    calculateCuatomTimeHourRate() {
        let halfHourRate = Number(Number(this.hourrate / 2).toFixed(2));
        let price = 0;
        this.customTimesheet.forEach(element => {
            if (element.check) {
                price += Number(halfHourRate);
            }
        });
        this.totalCustomHourRatePrice = Number(Number(price).toFixed(2));
    }
}
