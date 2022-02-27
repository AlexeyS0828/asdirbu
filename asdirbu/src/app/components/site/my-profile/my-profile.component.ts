import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ltLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { element } from 'protractor';
defineLocale("lt", ltLocale);

@Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.scss']
})

export class MyProfileComponent implements OnInit {
    selectedDateList = [];
    selectedWeekDateList = [];
    selectedStartDateList = [];
    imagePreview: string;
    today: Date = new Date();
    maxDate: Date;
    minDate: Date;
    bsInlineRangeValue: Date;
    updateProfileForm: FormGroup;
    calendarForm: FormGroup;
    submitted = false;
    fortTwoSubmitted = false;
    uploadedDocumentList: any = [];
    timeSheetDetails: any;
    displayMore = false;
    displayPrevious = false;
    initialDates = 0;
    EndDates = 10;
    reviewList: any = [];
    latitude = '';
    longitude = '';
    disabledDates: any = [];
    dateCustomClasses = [];
    displayDummyReviewText: boolean = false;
    pageNumber: number = 1;
    totalPageNumber: number = 1;
    errorMessage: string = "";
    successMessage: string = "";
    imagePreview1: string;
    imagePreview2: string;
    imagePreview3: string;
    imagePreview4: string;
    imageNameList= [];
    taxPay:number = 0;
    checkAll:boolean=false;
    currentDate:Date = new Date();
    @ViewChild('placesRef', { static: false }) placesRef: GooglePlaceDirective;
    timesheetDateSelected:boolean = false;
    selectedStartDate = new Date();
    selectedEndDate = new Date();
    selectedTextDate = "";
    selectedDateCount = 0;
    isAddressChange=0;
    documentTypes: Array<string> = ['pdf', 'docx', 'doc', 'jpg','jpeg'];
    dayWiseCheck:Array<boolean> = [false,false,false,false,false,false,false];
    dayList:Array<string> = ["Sek","Pir","Ant","Tre","Ket","Pen","Šeš"];
    monthList:Array<string> = ["sausis","vasaris","kovas","balandis","gegužė","birželis","liepa","rugpjūtis","rugsėjis","spalis","lapkritis","gruodis"];
    selectedDateWiseTableHeading = [
        {"day":"","date":new Date()},
        {"day":"","date":new Date()},
        {"day":"","date":new Date()},
        {"day":"","date":new Date()},
        {"day":"","date":new Date()},
        {"day":"","date":new Date()},
        {"day":"","date":new Date()},
    ];
    constructor(private formBuilder: FormBuilder,private bsLocaleService: BsLocaleService, private profileService: ProfileService, private authService: AuthService) {
        this.bsLocaleService.use('lt');
    }

    ngOnInit() {
        this.getUserAllDetails();
        this.updateProfileForm = this.formBuilder.group({
            name: [null, Validators.required],
            lastName: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            phone: [null, [Validators.required,Validators.pattern('[3706]{4}[0-9]{7}')],this.startWithCharacter.bind(this)],
            houseNumber: [''],
            address: [null, Validators.required],
            city: [null, Validators.required],
            bank_ac_no: [null, Validators.required],
            specialty: ["", Validators.required],
            otherSpecialty: [""],
            profile_image: [null],
            documentList: this.formBuilder.array([]),
            aboutMe:["",Validators.required],
            hourlyRate:["",Validators.required],
            type:["0",Validators.required],
            taxPay:["0"],
            image1:[""],
            image2:[""],
            image3:[""],
            image4:[""]            
        });
        const otherSpecialty = this.updateProfileForm.get('otherSpecialty');
        this.updateProfileForm.get('specialty').valueChanges.subscribe(change => {
            if (change==='Kitas') {
                otherSpecialty.setValidators(Validators.required);
            } else {
                otherSpecialty.setValidators(null);
            }
            otherSpecialty.updateValueAndValidity();
        });
        this.addDocument();
        this.calendarForm = this.formBuilder.group({
            "0": this.formBuilder.array([]),
            "1": this.formBuilder.array([]),
            "2": this.formBuilder.array([]),
            "3": this.formBuilder.array([]),
            "4": this.formBuilder.array([]),
            "5": this.formBuilder.array([]),
            "6": this.formBuilder.array([]),
        });
    }
    getUserAllDetails() {
        const userid = this.authService.getUser();
        const params = { "user_id": userid, "page": this.pageNumber };
        this.authService.getUserAllDetails(params).subscribe(response=>{
                if(response.success){
                    this.updateProfileForm.patchValue({
                        name: response.data.name,
                        lastName: response.data.lastName,
                        email: response.data.email,
                        phone: response.data.phone,
                        address: response.data.address,
                        houseNumber: response.data.houseNumber,
                        city: response.data.city,
                        bank_ac_no: response.data.bank_ac_no,
                        specialty:response.data.specialty,  
                        otherSpecialty:response.data.otherSpecialty,  
                        aboutMe: response.data.aboutMe,
                        hourlyRate: response.data.hourlyRate,
                        type: response.data.type,
                        taxPay: response.data.taxPay.toString()
                    });
                    this.latitude = response.data.latitude;
                    this.longitude = response.data.longitude;
                    if (response.data.profileimage != '' && response.data.profileimage != null) {
                        this.imagePreview = response.data.profileimage;
                    }
                    this.uploadedDocumentList = response.data.uploaded_docs;
                    this.reviewList = response.data.reviewList;
                    this.totalPageNumber = response.data.pagination * 10;
                    this.imageNameList = response.data.imageNameList;
                    if (this.reviewList.length === 0) {
                        this.displayDummyReviewText = true;
                    }
                    response.data.timesheetDateList.forEach((o, i) => {
                        this.dateCustomClasses.push({ date: new Date(o.date), classes: ['', 'text-primary font-weight-bold'] });
                        this.minDate = new Date();
                        this.maxDate = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);
                        this.bsInlineRangeValue = new Date();
                    });
                    response.data.imageList.forEach((value,index) =>{
                        if(index==0) {
                            this.imagePreview1 = value;
                            this.updateProfileForm.patchValue({ image1: this.imageNameList[index] });
                            this.updateProfileForm.get('image1').updateValueAndValidity();
                        } if(index==1) {
                            this.imagePreview2 = value;
                            this.updateProfileForm.patchValue({ image2: this.imageNameList[index] });
                            this.updateProfileForm.get('image2').updateValueAndValidity();
                        } if(index==2) {
                            this.imagePreview3 = value;
                            this.updateProfileForm.patchValue({ image3: this.imageNameList[index] });
                            this.updateProfileForm.get('image3').updateValueAndValidity();
                        } if(index==3) {
                            this.imagePreview4 = value;
                            this.updateProfileForm.patchValue({ image4: this.imageNameList[index] });
                            this.updateProfileForm.get('image4').updateValueAndValidity();
                        }
                    });      
                    document.getElementById("errorMessageSection2").style.display = 'none';
                }
                else{
                    document.getElementById("errorMessageSection2").style.display = 'block';
                    document.getElementById("errorMessage2").innerHTML = response.message;
                }
        },error=>{
            document.getElementById("errorMessageSection2").style.display = 'block';
            document.getElementById("errorMessage2").innerHTML = "Klaida, bandykite dar kartą.";
        });  
    }

    startWithCharacter(control: FormControl) {
        const _element = new Promise((resolve, reject) => {          
            if (control.value !== undefined && !control.value.startsWith("3706")) {
                resolve({ 'match': true });
            }
            else {
                resolve(null);
            }
        });
        return _element;
    }

    getProfile() {
        this.authService.getProfile().subscribe(response => {
            if (response.success) {
                this.updateProfileForm.patchValue({
                    name: response.data.name,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    phone: response.data.phone,
                    houseNumber: response.data.houseNumber,
                    address: response.data.address,
                    city: response.data.city,
                    bank_ac_no: response.data.bank_ac_no,
                    specialty:response.data.specialty,
                    otherSpecialty:response.data.otherSpecialty,  
                    service: response.data.service,
                    aboutMe: response.data.aboutMe,
                    hourlyRate: response.data.hourlyRate,
                    type: response.data.type,
                    taxPay: response.data.taxPay.toString()
                });
                this.latitude = response.data.latitude;
                this.longitude = response.data.longitude;
                if (response.data.profileimage != '' && response.data.profileimage != null) {
                    this.imagePreview = response.data.profileimage;
                }
                this.uploadedDocumentList = response.data.uploaded_docs;
                this.imageNameList = response.data.imageNameList;
                response.data.imageList.forEach((value,index) =>{
                    if(index==0) {
                        this.imagePreview1 = value;
                        this.updateProfileForm.patchValue({ image1: this.imageNameList[index] });
                        this.updateProfileForm.get('image1').updateValueAndValidity();
                    } if(index==1) {
                        this.imagePreview2 = value;
                        this.updateProfileForm.patchValue({ image2: this.imageNameList[index] });
                        this.updateProfileForm.get('image2').updateValueAndValidity();
                    } if(index==2) {
                        this.imagePreview3 = value;
                        this.updateProfileForm.patchValue({ image3: this.imageNameList[index] });
                        this.updateProfileForm.get('image3').updateValueAndValidity();
                    } if(index==3) {
                        this.imagePreview4 = value;
                        this.updateProfileForm.patchValue({ image4: this.imageNameList[index] });
                        this.updateProfileForm.get('image4').updateValueAndValidity();
                    }
                });
                document.getElementById("errorMessageSection2").style.display = 'none';
            }
            else {
                document.getElementById("errorMessageSection2").style.display = 'block';
                document.getElementById("errorMessage2").innerHTML = response.message;
            }
        },error=>{
            document.getElementById("errorMessageSection2").style.display = 'block';
            document.getElementById("errorMessage2").innerHTML = "Klaida, bandykite dar kartą.";
        });  
    }

    get documentList(): FormArray {
        return this.updateProfileForm.get('documentList') as FormArray;
    }

    addDocument() {
        this.documentList.push(this.formBuilder.group({ documentFile: [''], documentFileName: [''] }));
    }

    deleteDocument(index: number) {
        this.documentList.removeAt(index);
    }
    onImageSelect(event: Event, image: number) {
        const file = (event.target as HTMLInputElement).files[0];
        if (!(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
            document.getElementById("errorMessageSection2").style.display = "block";
            document.getElementById("errorMessage2").innerHTML = "Įkelkite galiojantį vaizdo failą";
          return;
        }
        else if(file.size>10000000){
            document.getElementById("errorMessageSection2").style.display = "block";
            document.getElementById("errorMessage2").innerHTML = "Didžiausias įkeliamo failo dydis - 10 mb";
            return;
        }
        document.getElementById("errorMessageSection2").style.display = "none";
        const reader = new FileReader();
        if (image === 1) {
          this.updateProfileForm.patchValue({ image1: file });
          this.updateProfileForm.get('image1').updateValueAndValidity();
          reader.onload = () => {
            this.imagePreview1 = reader.result as string;
          };
        } else if (image === 2) {
          this.updateProfileForm.patchValue({ image2: file });
          this.updateProfileForm.get('image2').updateValueAndValidity();
          reader.onload = () => {
            this.imagePreview2 = reader.result as string;
          };
        } else if (image === 3) {
          this.updateProfileForm.patchValue({ image3: file });
          this.updateProfileForm.get('image3').updateValueAndValidity();
          reader.onload = () => {
            this.imagePreview3 = reader.result as string;
          };
        } else if (image === 4) {
          this.updateProfileForm.patchValue({ image4: file });
          this.updateProfileForm.get('image4').updateValueAndValidity();
          reader.onload = () => {
            this.imagePreview4 = reader.result as string;
          };
        }
        reader.readAsDataURL(file);
      }

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        if (!(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
            document.getElementById("errorMessageSection1").style.display = "block";
            document.getElementById("errorMessage1").innerHTML = "Įkelkite galiojantį vaizdo failą";
            return;
        }        
        else if(file.size>10000000){
            document.getElementById("errorMessageSection1").style.display = "block";
            document.getElementById("errorMessage1").innerHTML = "Didžiausias įkeliamo failo dydis - 10 mb";
            return;
        }
        document.getElementById("errorMessageSection1").style.display = "none";
        this.updateProfileForm.patchValue({ profile_image: file });
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    onFileSelect(event: Event, index: number) {
        const file = (event.target as HTMLInputElement).files[0];
        if(file.size>10000000){
            document.getElementById("errorMessageSection1").style.display = "block";
            document.getElementById("errorMessage1").innerHTML = "Didžiausias įkeliamo failo dydis - 10 mb";
            return;
        }
        if (file) {
            const extension = file.name.split('.').pop().toLowerCase();
            if (this.documentTypes.indexOf(extension) > -1) {
                this.documentList.controls.forEach((control, elementIndex) => {
                    if (index === elementIndex) {
                        control.patchValue({
                            documentFile: file,
                            documentFileName: file.name
                        });
                    }
                });
                document.getElementById("errorMessageSection1").style.display = 'none';
            } else {
                document.getElementById("errorMessageSection1").style.display = 'block';
                document.getElementById("errorMessage1").innerHTML = 'Pasirinkite tik pdf, doc,jpg failą';
            }
        }
    }

    removeDocumentName(index: number) {
        this.authService.deleteDocument(this.uploadedDocumentList[index].id).subscribe(response => {
            if (!response.success) {
                document.getElementById("errorMessageSection2").style.display = 'block';
                document.getElementById("errorMessage2").innerHTML = response.message;
            }
        },error=>{
            document.getElementById("errorMessageSection2").style.display = 'block';
            document.getElementById("errorMessage2").innerHTML = "Klaida, bandykite dar kartą.";
        });
        this.uploadedDocumentList.splice(index, 1);
    }

    onSubmit() {
        this.submitted = true;
        if (this.updateProfileForm.invalid) {
            return;
        }
        if((this.latitude =="" && this.longitude=="") || (this.latitude =="0" && this.longitude=="0") || this.isAddressChange==1) {
            document.getElementById("errorMessageSection1").style.display = 'block';
            document.getElementById("errorMessage1").innerHTML = 'Prašome pasirinkti Gatvės pavadinimas';            
            return false;
        }
        const form = new FormData();
        const profileData = this.updateProfileForm.value;
        form.append('name', profileData.name);
        form.append('lastName', profileData.lastName);
        form.append('email', profileData.email);
        form.append('phone', profileData.phone);
        form.append('address', profileData.address);
        form.append('houseNumber', profileData.houseNumber);
        form.append('city', profileData.city);
        form.append('bank_ac_no', profileData.bank_ac_no);
        form.append('specialty', profileData.specialty);
        form.append('otherSpecialty', profileData.otherSpecialty);
        form.append('latitude', this.latitude);
        form.append('longitude', this.longitude);
        form.append("aboutMe",profileData.aboutMe);
        form.append("service",profileData.service);
        form.append("hourlyRate",profileData.hourlyRate);
        form.append("type",profileData.type);
        form.append("image[0]",profileData.image1);
        form.append("image[1]",profileData.image2);
        form.append("image[2]",profileData.image3);
        form.append("image[3]",profileData.image4);
        form.append("taxPay",profileData.taxPay);   
        if (profileData.profile_image != null) {
            form.append('profile_image', profileData.profile_image);
        }
        profileData.documentList.forEach((control, index) => {
            form.append('doc[' + index + ']', control.documentFile);
        });
        this.authService.updateProfile(form).subscribe(response => {
            if (response.success) {
                this.submitted = false;
                document.getElementById("errorMessageSection1").style.display = 'none';
                document.getElementById("errorMessageSection2").style.display = 'none';
                document.getElementById("successMessageSection2").style.display = 'block';
                document.getElementById("successMessage2").innerHTML = response.message;
                this.updateProfileForm.reset();
                (this.updateProfileForm.get('documentList') as FormArray).clear();
                this.addDocument();
                this.getProfile();
            } else {
                document.getElementById("successMessageSection2").style.display = 'none';
                document.getElementById("errorMessageSection2").style.display = 'block';
                document.getElementById("errorMessage2").innerHTML = response.message;
            }
        }, error => {
            document.getElementById("successMessageSection2").style.display = 'none';
            document.getElementById("errorMessageSection2").style.display = 'block';
            document.getElementById("errorMessage2").innerHTML = "Klaida, bandykite dar kartą.";
        });
    }
    onCalendarValueChange(value: Date) {
        this.timesheetDateSelected = true;
        this.selectedStartDate = new Date(value);        
    }
    
    onChangeAddress(address: any): void {
        this.latitude = address.geometry.location.lat();
        this.longitude = address.geometry.location.lng();
        let cityArray = address.address_components.filter(element =>element.types.some(typesItem => typesItem === "administrative_area_level_2"));
		const city = (cityArray !== null && cityArray.length > 0) ? cityArray[0].short_name : ''; 
        this.updateProfileForm.patchValue({ address: address.formatted_address });
        this.isAddressChange =0;        
    }

    onSelectAll(isChecked: boolean) {
        for(let i=0;i<7;i++) {
            for(let j=0;j<this.calendarForm.controls[i]['controls'].length;j++) {
                if(j>=8 && j<=23){
                    this.calendarForm.controls[i]['controls'][j].patchValue({check:isChecked});  
                    this.isChecked(isChecked,Number(i),this.calendarForm.controls[i]['controls'][j].value.from,this.calendarForm.controls[i]['controls'][j].value.to);
                }
            }
        }
        this.dayWiseCheck.forEach((element,index)=>{
            this.dayWiseCheck[index] = isChecked;
        });      
    }
    onSelectIndexWise(isChecked: boolean,index:number){
        for(let j=0;j<this.calendarForm.controls[index]['controls'].length;j++) {
            if(j>=8 && j<=23){
                this.calendarForm.controls[index]['controls'][j].patchValue({check:isChecked});  
                this.isChecked(isChecked,Number(index),this.calendarForm.controls[index]['controls'][j].value.from,this.calendarForm.controls[index]['controls'][j].value.to);
            }
        }
    }

    onSubmitCalendarform() {
        if (this.calendarForm.invalid) {
            return;
        }
        const userId = this.authService.getUser();
        let datelist = [];
        this.selectedWeekDateList.forEach((element) => {
            element.forEach(ele => {
                datelist.push(ele);    
            }); 
        });
        const params = {"selectedDates":datelist,"timesheet":this.selectedDateList,"userId":userId};
        this.profileService.storeTimeSheets(params).subscribe((response) => {
            if (response.success) {
                document.getElementById("errorMessageSection3").style.display = 'none';
                document.getElementById("successMessageSection3").style.display = 'block';
                document.getElementById("successMessage3").innerHTML = response.message;   
                this.getTimesheetData();
            } else {
               document.getElementById("successMessageSection3").style.display = 'none';
               document.getElementById("errorMessageSection3").style.display = 'block';
               document.getElementById("errorMessage3").innerHTML = response.message;   
            }
        }, error => {
           document.getElementById("successMessageSection3").style.display = 'none';
           document.getElementById("errorMessageSection3").style.display = 'block';
           document.getElementById("errorMessage3").innerHTML = "Klaida, bandykite dar kartą.";   
        });
    }

    getTimesheetData() {
        this.profileService.getTimesheets().subscribe((responseData) => {
            this.dateCustomClasses = [];
            responseData.data.forEach((o, i) => {
                this.dateCustomClasses.push({ date: new Date(o.date), classes: ['', 'text-primary font-weight-bold'] });
            });
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

    changeAddress(i){
       this.isAddressChange=i;    
    }

    getReview(page) {
        const userid = this.authService.getUser();
        const params = { "user_id": userid, "page": page };
        this.profileService.getReview(params).subscribe(response => {
            if (response.success) {
                this.reviewList = response.data;
                this.totalPageNumber = response.pagination * 10;
                document.getElementById("errorMessageSection4").style.display = 'none';
            } else {
                document.getElementById("errorMessageSection4").style.display = 'block';
                document.getElementById("errorMessage4").innerHTML = response.message;   
            }
        }, error => {
            document.getElementById("errorMessageSection4").style.display = 'block';
            document.getElementById("errorMessage4").innerHTML = "Klaida, bandykite dar kartą.";   
        });
    } 

    openModal(exampleModalScrollable){
        this.selectedStartDateList = [];
        this.selectedDateList = [];
        this.selectedWeekDateList = [];
        this.dayWiseCheck.forEach((element,index)=>{
            this.dayWiseCheck[index] = false;
        });
        if(this.timesheetDateSelected){
            this.setSelectedDate();
            exampleModalScrollable.click();
            document.getElementById("errorMessageSection3").style.display = 'none';
        }
        else{
            document.getElementById("successMessageSection3").style.display = 'none';
            document.getElementById("errorMessageSection3").style.display = 'block';
            document.getElementById("errorMessage3").innerHTML = "Pasirinkite datą"; 
        }        
    }

    setSelectedDate() :void{
        (<HTMLInputElement>document.getElementById("checkAll")).checked  = false;
        let array = [];
        this.selectedDateWiseTableHeading.forEach((element,index)=>{
            let selectedCurrentDate = new Date(new Date(this.selectedStartDate).setDate(this.selectedStartDate.getDate() + index));
            this.selectedDateWiseTableHeading[index].date = selectedCurrentDate;
            this.selectedDateWiseTableHeading[index].day = this.dayList[selectedCurrentDate.getDay()];
            if(index==(this.selectedDateWiseTableHeading.length-1)){
                this.selectedEndDate = selectedCurrentDate;
            }
            array.push(this.changeDateFormat(selectedCurrentDate));            
        });
        const find = this.selectedStartDateList.findIndex(element=>element==this.changeDateFormat(this.selectedDateWiseTableHeading[0].date)); 
        if(!(find>-1)){
            this.selectedWeekDateList.push(array);
            this.selectedStartDateList.push(this.changeDateFormat(this.selectedDateWiseTableHeading[0].date));
        }
        this.selectedTextDate = this.selectedStartDate.getFullYear() + " " + this.monthList[this.selectedStartDate.getMonth()] + " " + this.selectedStartDate.getDate() + " d. - " + this.selectedEndDate.getDate() +" d.";    
        const userId = this.authService.getUser();
        const params = {"startDate":this.changeDateFormat(this.selectedStartDate),"userId":userId};
        this.authService.getUserTimesheet(params).subscribe(response=>{
            if(response.success) {
                this.selectedDateCount = 0;
                response.data.forEach(element=>{
                    this.selectedDateCount = element.length > this.selectedDateCount ? element.length : this.selectedDateCount;
                });
                response.data.forEach((element,index)=>{
                    let form = this.calendarForm.get(index.toString()) as FormArray;
                    form.clear();                    
                    element.forEach((ele)=>{
                        let findElement = this.selectedDateList.find(ele1=>(ele1.start==ele.start && ele1.date==this.changeDateFormat(this.selectedDateWiseTableHeading[index].date)));
                        if(findElement==undefined && ele.check){
                            this.selectedDateList.push({
                                date:this.changeDateFormat(this.selectedDateWiseTableHeading[index].date),
                                start:ele.start,
                                end:ele.end
                            });
                        }
                        form.push(this.formBuilder.group({ 
                            check: (findElement!=undefined) ? true : ele.check, 
                            from: ele.start,
                            to: ele.end
                        }));                        
                    });     
                });               
            }
            else {
                document.getElementById("errorMessageSection3").style.display = "block";
                document.getElementById("errorMessage3").innerHTML = response.message;
            }
        },error=>{
            document.getElementById("errorMessageSection3").style.display = "block";
            document.getElementById("errorMessage3").innerHTML = "Klaida, bandykite dar kartą.";
        });   
    }

    changeDate(value:string) : void{
        this.dayWiseCheck.forEach((element,index)=>{
            this.dayWiseCheck[index] = false;
        });
        if(value=="increment"){
            this.selectedStartDate = new Date(new Date(this.selectedStartDate).setDate(new Date(this.selectedStartDate).getDate() + 7));
        } else {
            this.selectedStartDate = new Date(new Date(this.selectedStartDate).setDate(new Date(this.selectedStartDate).getDate() - 7));
        }
        this.setSelectedDate(); 
    }

    changeDateFormat(date){
        return new DatePipe('en-US').transform(date,'yyyy-MM-dd');
    }
    
    isChecked(isCheck:boolean,index:number,start:string,end:string){
        if(!isCheck){
            const findElement = this.selectedDateList.findIndex(element=>(element.date==this.changeDateFormat(this.selectedDateWiseTableHeading[index].date) && element.start == start && element.end == end));
            if(findElement>-1) {
                this.selectedDateList.splice(findElement,1);
            }
        }        
        else {
            this.selectedDateList.push({
                date:this.changeDateFormat(this.selectedDateWiseTableHeading[index].date),
                start:start,
                end:end
            });
        }
    }
}
