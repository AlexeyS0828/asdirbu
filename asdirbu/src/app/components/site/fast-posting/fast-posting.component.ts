import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Component, OnInit,ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ltLocale } from 'ngx-bootstrap/locale';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
defineLocale("lt", ltLocale);

@Component({
  selector: 'app-fast-posting',
  templateUrl: './fast-posting.component.html',
  styleUrls: ['./fast-posting.component.scss']
})

export class FastPostingComponent implements OnInit {
  imagePreview: string;
  registerData: any;
  formTypeQuick: FormGroup;
  formTypePost: FormGroup;
  formTypeQuickSubmitted = false;
  formTypePostSubmitted = false;
  imagePreview1: string;
  imagePreview2: string;
  imagePreview3: string;
  imagePreview4: string;
  token: string;
  errorMessage: string = "";
  latitude:string = "";
  longitude:string = "";
  latitude2:string = "";
  longitude2:string = "";
  tagInputPlaceholder:string = "IT aptarnavimas, automobilių plovykla ir kt";
  currentLatitude = 0;
  currentLongitude = 0;
  currentDate:Date = new Date();
  @ViewChild('placesRef', { static: false }) placesRef: GooglePlaceDirective;
  constructor(public authService: AuthService, private formBuilder: FormBuilder, private router: Router, private toastr: ToastrService,private bsLocaleService: BsLocaleService) {
    this.bsLocaleService.use('lt');
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position)=>{
      this.currentLatitude = position.coords.latitude;
      this.currentLongitude = position.coords.longitude;
    }); 

    this.formTypeQuick = this.formBuilder.group({
      skelbimo_pavadinimas: new FormControl(null, {
        validators: [Validators.required]
      }),
      papasakok_placiau: new FormControl(null, {
        validators: [Validators.required]
      }),
      paslaugos_kaina: new FormControl(null, {
        validators: [Validators.required]
      }),
      paslaugos_suteikimo_vieta: new FormControl(null, {
        validators: [Validators.required]
      }),
      distance: new FormControl(null, {
        validators: [Validators.required]
      }),
      paslaugos_priėmimo_vieta: new FormControl(null, {
        validators: [Validators.required]
      }),
      paslaugos_priemimo_laikas: new FormControl(null, {
        validators: [Validators.required]
      }),
      image1: new FormControl(null, {}),
      image2: new FormControl(null, {}),
      image3: new FormControl(null, {}),
      image4: new FormControl(null, {}),
      allowRegister: new FormControl(false, {
        validators: [Validators.required],
      }),      
      specialty: new FormControl("", {
        validators: [Validators.required]
      }),
      otherSpecialty: new FormControl("")
    });

    this.formTypePost = this.formBuilder.group({
      skelbimo_pavadinimas: new FormControl(null, {
        validators: [Validators.required]
      }),
      paslaugos_kaina: new FormControl(null, {
        validators: [Validators.required]
      }),
      distance: new FormControl(null, {
        validators: [Validators.required]
      }),
      paslaugos_suteikimo_vieta: new FormControl(null, {
        validators: [Validators.required]
      }),
      paslaugos_priėmimo_vieta: new FormControl(null, {
        validators: [Validators.required]
      }),
      paslaugos_priemimo_laikas: new FormControl(null, {
        validators: [Validators.required]
      }),
      allowRegister: new FormControl(false, {
        validators: [Validators.required],
      }),
      placeGoodsDelivery:new FormControl(null, {
        validators: [Validators.required],
      })
    });

    const otherSpecialty = this.formTypeQuick.get('otherSpecialty');
    this.formTypeQuick.get('specialty').valueChanges.subscribe(change => {
        if (change==='Kitas') {
            otherSpecialty.setValidators(Validators.required);
        } else {
            otherSpecialty.setValidators(null);
        }
        otherSpecialty.updateValueAndValidity();
    });
  }
  onChangeAddress(address: any): void {
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
    this.formTypeQuick.patchValue({ paslaugos_suteikimo_vieta: address.formatted_address});
 }
 onChange(address: any): void {
   this.latitude2 = address.geometry.location.lat();
   this.longitude2 = address.geometry.location.lng();
   this.formTypePost.patchValue({ paslaugos_suteikimo_vieta: address.formatted_address});
}

  onImagePicked(event: Event, image: number) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
      document.getElementById("errorMessageSection").style.display = 'block';
      document.getElementById("errorMessage").innerHTML = 'Įkelkite galiojantį vaizdo failą.';
      return;
    }
    else if(file.size>10000000){
      document.getElementById("errorMessageSection").style.display = "block";
      document.getElementById("errorMessage").innerHTML = "Didžiausias įkeliamo failo dydis - 10 mb";
      return;
   }
    document.getElementById("errorMessageSection").style.display = 'none';
    const reader = new FileReader();
    if (image === 1) {
      this.formTypeQuick.patchValue({ image1: file });
      this.formTypeQuick.get('image1').updateValueAndValidity();
      reader.onload = () => {
        this.imagePreview1 = reader.result as string;
      };
    } else if (image === 2) {
      this.formTypeQuick.patchValue({ image2: file });
      this.formTypeQuick.get('image2').updateValueAndValidity();
      reader.onload = () => {
        this.imagePreview2 = reader.result as string;
      };
    } else if (image === 3) {
      this.formTypeQuick.patchValue({ image3: file });
      this.formTypeQuick.get('image3').updateValueAndValidity();
      reader.onload = () => {
        this.imagePreview3 = reader.result as string;
      };
    } else if (image === 4) {
      this.formTypeQuick.patchValue({ image4: file });
      this.formTypeQuick.get('image4').updateValueAndValidity();
      reader.onload = () => {
        this.imagePreview4 = reader.result as string;
      };
    }
    reader.readAsDataURL(file);
  }

  onQuickSubmit() {
    this.formTypeQuickSubmitted = true;
    if (this.formTypeQuick.invalid) {
      return;
    }
    if (!this.formTypeQuick.value.allowRegister) {
      return;
    }
    if((this.latitude =="" && this.longitude=="") || (this.latitude =="0" && this.longitude=="0")){
      document.getElementById("errorMessageSection").style.display = "block";
      document.getElementById("errorMessage").innerHTML = "Prašome pasirinkti Paslaugos suteikimo vieta";
      return;
    }
    this.token = this.authService.getToken();
    if (!this.token) {
      const fastPostingData = {
        paslaugos_priemimo_laikas: this.formTypeQuick.value.paslaugos_priemimo_laikas,
        skelbimo_pavadinimas: this.formTypeQuick.value.skelbimo_pavadinimas,
        papasakok_placiau: this.formTypeQuick.value.papasakok_placiau,
        paslaugos_kaina: this.formTypeQuick.value.paslaugos_kaina,
        paslaugos_suteikimo_vieta: this.formTypeQuick.value.paslaugos_suteikimo_vieta,
        distance: this.formTypeQuick.value.distance,
        paslaugos_priėmimo_vieta: this.formTypeQuick.value.paslaugos_priėmimo_vieta,
        jobType: 1,
        image1: this.formTypeQuick.value.image1,
        image2: this.formTypeQuick.value.image2,
        image3: this.formTypeQuick.value.image3,
        image4: this.formTypeQuick.value.image4,
        latitude:this.latitude,
        longitude:this.longitude,
        currentLongitude:this.currentLongitude,
        currentLatitude:this.currentLatitude,
        specialty: this.formTypeQuick.value.specialty,
        otherSpecialty: this.formTypeQuick.value.otherSpecialty
      };
      this.authService.quickJobData(fastPostingData);
    } else {
      const jobPostingData = {
        paslaugos_priemimo_laikas: this.formTypeQuick.value.paslaugos_priemimo_laikas,
        skelbimo_pavadinimas: this.formTypeQuick.value.skelbimo_pavadinimas,
        papasakok_placiau: this.formTypeQuick.value.papasakok_placiau,
        paslaugos_kaina: this.formTypeQuick.value.paslaugos_kaina,
        paslaugos_suteikimo_vieta: this.formTypeQuick.value.paslaugos_suteikimo_vieta,
        distance: this.formTypeQuick.value.distance,
        paslaugos_priėmimo_vieta: this.formTypeQuick.value.paslaugos_priėmimo_vieta,
        jobType: 1,
        image1: this.formTypeQuick.value.image1,
        image2: this.formTypeQuick.value.image2,
        image3: this.formTypeQuick.value.image3,
        image4: this.formTypeQuick.value.image4,
        latitude:this.latitude,
        longitude:this.longitude,
        currentLongitude:this.currentLongitude,
        currentLatitude:this.currentLatitude,
        specialty: this.formTypeQuick.value.specialty,
        otherSpecialty: this.formTypeQuick.value.otherSpecialty
      };
      this.authService.jobPosting(jobPostingData);
    }
  }

  onPostSubmit() {
    this.formTypePostSubmitted = true;
    if (this.formTypePost.invalid) {
      return;
    }
    if (!this.formTypePost.value.allowRegister) {
      return;
    }
    if((this.latitude2 =="" && this.longitude2=="") || (this.latitude2 =="0" && this.longitude2=="0")){
      document.getElementById("errorMessageSection").style.display = "block";
      document.getElementById("errorMessage").innerHTML = "Prašome pasirinkti Paslaugos suteikimo vieta";
      return;
    }
 
    this.token = this.authService.getToken();

    if (!this.token) {
      const fastPostingData = {
        placeGoodsDelivery: this.formTypePost.value.placeGoodsDelivery,
        paslaugos_kaina: this.formTypePost.value.paslaugos_kaina,
        skelbimo_pavadinimas: this.formTypePost.value.skelbimo_pavadinimas,
        distance: this.formTypePost.value.distance,
        paslaugos_priemimo_laikas: this.formTypePost.value.paslaugos_priemimo_laikas,
        paslaugos_suteikimo_vieta: this.formTypePost.value.paslaugos_suteikimo_vieta,
        paslaugos_priėmimo_vieta: this.formTypePost.value.paslaugos_priėmimo_vieta,
        jobType: 2,        
        latitude:this.latitude2,
        longitude:this.longitude2,
        currentLongitude:this.currentLongitude,
        currentLatitude:this.currentLatitude
      };
      this.authService.quickJobData(fastPostingData);
    } else {
      const jobPostingData = {
        placeGoodsDelivery: this.formTypePost.value.placeGoodsDelivery,
        paslaugos_kaina: this.formTypePost.value.paslaugos_kaina,
        skelbimo_pavadinimas: this.formTypePost.value.skelbimo_pavadinimas,
        distance: this.formTypePost.value.distance,
        paslaugos_priemimo_laikas: this.formTypePost.value.paslaugos_priemimo_laikas,
        paslaugos_suteikimo_vieta: this.formTypePost.value.paslaugos_suteikimo_vieta,
        paslaugos_priėmimo_vieta: this.formTypePost.value.paslaugos_priėmimo_vieta,
        jobType: 2,        
        latitude:this.latitude2,
        longitude:this.longitude2,
        currentLongitude:this.currentLongitude,
        currentLatitude:this.currentLatitude
      };
      this.authService.jobPosting(jobPostingData);
    }
  }
}
