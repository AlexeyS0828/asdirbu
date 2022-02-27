'user strict';
var nodemailer 			= require('nodemailer');
var randtoken 			= require('rand-token');
const Users             = require('../model/users');
const tax = 10;
const pvmTax = 21;

const baseUrl  = "https://www.asdirbu.lt/";
//const baseUrl  = "https://kretoss.com/project/asdirub/";
//const baseUrl  = "https://asdirbu.lt/testing/";

const emailUrl 			= baseUrl + 'account-active/';
const resetEmailUrl 	= baseUrl + 'reset-password/';
let  hireUserLink		= baseUrl + 'chat/';
let  reviewUserLink		= baseUrl + 'review/';
let  reviewsUserLink	= baseUrl + 'profilis/';
let  frelanceReviewLink	= baseUrl + 'view-review/';
let logo 				= baseUrl + "assets/image/as_dirbu.png";
var transporter 		= nodemailer.createTransport({
							  host: 'abrikosas.serveriai.lt',
							  port: 587,
							  auth: {
							    user: 'info@asdirbu.lt',
							    pass: 'P@ssw0rd123'
							  },
							  tls: {rejectUnauthorized: false}
							});
class Mail
{
	constructor(app)
	{
		
	}
	async activationMail(email,userId){
		try {	
			var token 			= randtoken.generate(39);
			Users.storeToken(userId,token).then(result =>{
            	var activationMail = {
				  	from: '"Aš dirbu" <info@asdirbu.lt>',
				  	to: email,
				  	subject: "Patvirtinkite savo el paštą",
					html:`<span>Labas,<br>mes tavęs laukėme! Džiaugiamės, kad prisijungei prie Aš dirbu bendruomenės. Talentingiausius specialistus vienijančios prekyvietės, skirtos papasakoti apie savo teikiamas paslaugas arba rasti, kas atliktų norimą darbą.  Taip pat – gauti užsakymus, saugiai už juos atsiskaityti ir įvertinti bei rekomenduoti paslaugų teikėjus ir užsakovus.<br>Pradėkime? <br><a href="${emailUrl}${token}">nuorodą</a></span><br><h3>''Aš dirbu'' komanda</h3><img src="${logo}" style="height:30px;" />`
				};
				transporter.sendMail(activationMail, function(error, info){
				  	if (error) {
				    	return true;
				  	} else {
				    	return false;
				  	}
				});
        	});
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async forgotPasswordMail(email,userId){
		try {	
			var token = randtoken.generate(39);
			console.log(token);
			Users.storeResetToken(userId,token).then(result =>{
            	var activationMail = {
				  	from: '"Aš dirbu" <info@asdirbu.lt>',
				  	to: email,
				  	subject: "Asdirbu Pamiršote slaptažodį!",
					html:`<span>Labas!,<br>Skaičių kombinacija „12345“ pernai atsidūrė blogiausių pasaulio slaptažodžių TOP 100 viršūnėje. Jei gavai šį laišką, džiaugiamės – konkurse nedalyvavai. Todėl nieko tokio, jog pamiršai savo slaptažodį: esame tam, kad tau padėtume.<br><a href="${resetEmailUrl}${token}"> Spausk žemiau esančią nuorodą ir dirbkime toliau.</a></span><br><h3>''Aš dirbu'' komanda</h3><img src="${logo}" style="height:30px;" />`
				};
				transporter.sendMail(activationMail, function(error, info){
				  	if (error) {
				  		console.log(error);
				    	return true;
				  	} else {
				  		console.log(info);
				    	return false;
				  	}
				});
        	});
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	
	async subscribe(email){
		try {	
			var activationMail = {
				  	from: '"Aš dirbu" <info@asdirbu.lt>',
				  	to: email,
				  	subject: "Kas naujo dirbantiems savarankiškai?",
					html:`<span>Labas!<br>Draugystę sutvirtina narystė – <b>Aš dirbu</b> paslaugų prekyvietė jau veikia: trūko tik tavęs. Džiaugiamės, jog prisijungei ir kviečiame atrasti talentingiausius specialistus, esančius visiškai šalia ir juos įvertinti. Taip pat – dirbi bei užsidirbti: patogiai, saugiai, nuolatos. Nuo šiol su tavimi pasidalinsime ir pranešime visas naujienas, kurias sužinosi akimirksniu!<br><b>Aš dirbu.</b> O tu?</span><br><h3>''Aš dirbu'' komanda</h3><img src="${logo}" style="height:30px;" />`
				};
				transporter.sendMail(activationMail, function(error, info){
				  	if (error) {
				  		console.log(error);
				    	return true;
				  	} else {
				  		console.log(info);
				    	return false;
				  	}
				});
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	jobPostMailToUser(toEmail,email,name,service,paslaugos_priemimo_laikas,skelbimo_pavadinimas,papasakok_plačiau,Raktažodžiai,paslaugos_kaina,paslaugos_suteikimo_vieta,distance,paslaugos_priėmimo_vieta,jobId,fromUserId,jobType,specialty,otherSpecialty,placeGoodsDelivery){
		specialty = specialty == 'Kitas' ? otherSpecialty : specialty;
		let link = hireUserLink + jobId + "/" + fromUserId + "/0"; 
		let message = `<html><body>
    	<p>Labas,<br>Puikios naujienos! Tavo paslaugą rezervavo / Gavai darbo pasiūlymą / Atkeliavo užklausa dėl paslaugos teikimo. Nekantriai laukiame patvirtinimo. Jį atlikus, tavo atlygis bus saugiai rezervuotas ir sumokėtas po paslaugos suteikimo. Primename – gerai atliktas darbas ir sulauktas teigiamas įvertinimas tik padidina galimybes gauti dar daugiau užsakymų.<br>
    	Žinome, kad dirbi puikiai – belieka tuo įsitikinti kitiems!</p>
        <table  border="1" style="border-collapse: collapse;border:1px solid #000;">
            <tr>
                <th>Vardas</th>
                <td>${name}</td>
            </tr>
            <tr>
                <th>Skelbimo pavadinimas</th>
                <td>${skelbimo_pavadinimas}</td>
            </tr>`;
            if(jobType==1){
	            message +=`<tr>
	                <th>Papasakok plačiau</th>
	                <td>${papasakok_plačiau}</td>
	            </tr>
	            <tr>
	                <th>Pasirink specialybe</th>
	                <td>${specialty}</td>
	            </tr>	            
	            <tr>
                	<th>Paslaugos suteikimo vieta</th>
                	<td>${paslaugos_suteikimo_vieta}</td>
            	</tr>
            	<tr>
	                <th>Paslaugos suteikimo data</th>
	                <td>${paslaugos_priėmimo_vieta}</td>
	            </tr>
	            <tr>
	                <th>Paslaugos atlikimo laikas</th>
	                <td>${paslaugos_priemimo_laikas}</td>
	            </tr>`;
        	}
        	else{
        		message +=`<tr>
	                <th>Siuntos pristatymo data</th>
	                <td>${placeGoodsDelivery}</td>
	            </tr>
	            <tr>
                	<th>Siuntos paėmimo vieta</th>
                	<td>${paslaugos_suteikimo_vieta}</td>
            	</tr>
            	<tr>
                	<th>Siuntos pristatymo vieta</th>
                	<td>${paslaugos_priėmimo_vieta}</td>
            	</tr>            	
	            <tr>
	                <th>Siuntos pristatymo laikas</th>
	                <td>${paslaugos_priemimo_laikas}</td>
	            </tr>`;
        	}
            message +=`<tr>
                <th>Paslaugos kaina</th>
                <td>${paslaugos_kaina}</td>
            </tr> 
            <tr>
                <th>Atstumas</th>
                <td>${distance}</td>
            </tr>
        </table><br/>
        <a href="${link}" target='_blank' style='color: #fff;padding: 5px 10px;border-radius: 25px;background: #E57D33;text-decoration:none'>Aš noriu dirbti</a>&nbsp;&nbsp;&nbsp;
        <a href="javascript:void(0)" style='color: #fff;padding: 5px 10px;border-radius: 25px;background: #E57D33;text-decoration:none'>Aš nenoriu dirbti</a><br>       
        <br><h3>''Aš dirbu'' komanda</h3><img src="${logo}" style="height:30px;" />     
    </body>
</html>`;

		let mail = {
		  	from: '"Aš dirbu" <info@asdirbu.lt>',
		  	to: toEmail,
		  	subject: "Asdirbu naujas pranešimas",
		  	html:message 
		};
		transporter.sendMail(mail, function(error, info){
		  	if (error) {
//		  		console.log(error);
		    	return true;
		  	} else {
//		  		console.log(info);
		    	return false;
		  	}
		});
	}

	validateCheck(value){
		if(value !="" && value !=null &&  value!="null" &&  value!=undefined &&  value!="undefined"){
			return value;
		} 	
		else{
			return "";
		}
	}

	sendMailToDeveloper(companyUser,developerUser,day,totalTime,price){
		try{
			let servicePrice = Number(totalTime * price).toFixed(2);
			let feesPrice = Number((servicePrice * tax) / 100).toFixed(2);
			let feesAmount = Number(Number(servicePrice) + Number(feesPrice));
			let taxPay = developerUser.taxPay; 
			let totalPrice = 0;
			
			let companyUserName = this.validateCheck(companyUser.name);
			let companyUserEmail = this.validateCheck(companyUser.email);
			let companyUserPhone = this.validateCheck(companyUser.phone);
			let companyUserAddress = this.validateCheck(companyUser.address);
			let developerUserCity = this.validateCheck(developerUser.city);
			let developerUserService = this.validateCheck(developerUser.service);

			let message = `<p>Labas,<br>
Gera žinia – turime tau užsakymą! Mokėjimas už paslaugas jau rezervuotas ir patikimai mūsų
saugomas. Siunčiame informaciją apie paslaugos pirkėją bei kviečiame bendrauti ir bendradarbiauti Ašdirbu platformos skiltyje Žinutės. 
Linkime sėkmės ir lauksime paslaugos pirkėjo įvertinimo.
Ir, žinoma, svarbiausia žinia: po paslaugos atlikimo bei pirkėjo įvertinimo, rezervuotą sumą
pervesime į tavo nurodytą sąskaitą. Darbas žmogų puošia, tiesa?</p><br/><table>
					  <tr>
					    <td><b>Vardas : </b></td>
					    <td>${companyUserName}</td>
					  </tr>
					  <tr>
					    <td><b>Pašto adresą : </b></td>
					    <td>${companyUser.email}</td>
					  </tr>
					  <tr>
					    <td><b>Telefonas : </b></td>
					    <td>${companyUserPhone}</td>
					  </tr>
					  <tr>
					    <td><b>Adresas : </b></td>
					    <td>${companyUserAddress}</td>
					  </tr>
					</table>
					<div style="width:49%; float:right; ">
						<h3>UŽSAKYMO DUOMENYS</h3>
						<table style="border: 1px solid;">
						<tr>
						    <td>${day+' '+(developerUserService)+' Paslaugos'}</td>
						  </tr>
						  <tr>
						    <td><b>Paslaugos : </b></td>
						    <td>${servicePrice}</td>
						  </tr>
						  <tr>
						    <td><b>Administravimo mokestis : </b></td>
						    <td>${feesPrice}</td>
						  </tr>`;
						  if(taxPay==1){
						  	message += `<tr>
							    <td><b>PVM mokestis : </b></td>
							    <td>0.00</td>
							  </tr>`;
							}

						message +=`<tr>
						    <td>
						    <b>Viso : </b></td>
						    <td>${feesAmount}</td>
						  </tr>
						</table>
					</div>
					<div style="width:49%;">
						<h3>Kaina</h3>
						<table style="border: 1px solid;">
						  <tr>
						    <td><b>Miestas : </b></td>
						    <td>${developerUserCity}</td>
						  </tr>
						  <tr>
						    <td><b>Diena : </b></td>
						    <td>${day}(${totalTime}hr)</td>
						  </tr>
						  <tr>
						    <td><b>Darbas : </b></td>
						    <td>${developerUserService}</td>
						  </tr>
						</table><br><h3>''Aš dirbu'' komanda</h3><img src="${logo}" style="height:30px;" />
					</div>`;

			let developerMailOptions = {
			  from: '"Aš dirbu" <info@asdirbu.lt>',
			  to: developerUser.email,
			  subject: "Puiki žinia: gavote užsakymą iš "+companyUserName,
			  html: message
			};
			transporter.sendMail(developerMailOptions, function(error, info){
			  if (error) {
			    console.log(error);
			  } else {
			    console.log('Email sent: ' + info.response);
			  }
			});
		}catch(error){
			console.log("Send Mail to developer",error);
		}
	}
	sendMailToCompany(companyUser,developerUser,day,totalTime,price){
		try{
			let servicePrice = Number(totalTime * price).toFixed(2);
			let feesPrice = Number((servicePrice * tax) / 100).toFixed(2);
			let feesAmount = Number(Number(servicePrice) + Number(feesPrice));
			let taxPay = developerUser.taxPay; 
			let developerUserName = this.validateCheck(developerUser.name);
			let developerUserEmail = this.validateCheck(developerUser.email);
			let developerUserPhone = this.validateCheck(developerUser.phone);
			let developerUserAddress = this.validateCheck(developerUser.address);
			let developerUserCity = this.validateCheck(developerUser.city);
			let developerUserService = this.validateCheck(developerUser.service);


			let message = `<p>Labas,<br>Dėkojame už atliktą užsakymą bei siunčiame informaciją apie paslaugos teikėją. Kviečiame
bendrauti ir bendradarbiauti Aš dirbu platformos skiltyje Žinutės.
Sėkmės ir lauksime paslaugos teikėjo įvertinimo!</p><br/><table>
					  <tr>
					    <td><b>Vardas : </b></td>
					    <td>${developerUserName}</td>
					  </tr>
					  <tr>
					    <td><b>Pašto adresą : </b></td>
					    <td>${developerUserEmail}</td>
					  </tr>
					  <tr>
					    <td><b>Telefonas : </b></td>
					    <td>${developerUserPhone}</td>
					  </tr>
					  <tr>
					    <td><b>Adresas : </b></td>
					    <td>${developerUserAddress}</td>
					  </tr>
					</table>
					<div style="width:49%; float:right; ">
						<h3>UŽSAKYMO DUOMENYS</h3>
						<table style="border: 1px solid;">
						<tr>
						    <td>${day+' '+(developerUserService)+' Paslaugos'}</td>
						  </tr>
						  <tr>
						    <td><b>Paslaugos : </b></td>
						    <td>${servicePrice}</td>
						  </tr>
						  <tr>
						    <td><b>Administravimo mokestis : </b></td>
						    <td>${feesPrice}</td>
						  </tr>`;
						 if(taxPay==1){ 
						message += `<tr>
						    <td><b>PVM mokestis : </b></td>
						    <td>0.00</td>
						  </tr>`;
						}

						message += `<tr>
						    <td><b>Viso : </b></td>
						    <td>${feesAmount}</td>
						  </tr>
						</table>
					</div>
					<div style="width:49%;">
						<h3>Kaina</h3>
						<table style="border: 1px solid;">
						  <tr>
						    <td><b>Miestas : </b></td>
						    <td>${developerUserCity}</td>
						  </tr>
						  <tr>
						    <td><b>Diena : </b></td>
						    <td>${day}(${totalTime}hr)</td>
						  </tr>
						  <tr>
						    <td><b>Darbas : </b></td>
						    <td>${developerUserService}</td>
						  </tr>
						</table>
						<br><h3>''Aš dirbu'' komanda</h3><img src="${logo}" style="height:30px;" />
					</div>`;
		var companyMailOptions = {
			  from: '"Aš dirbu" <info@asdirbu.lt>',
			  to: companyUser.email,
			  subject: "Puiki žinia: jūs išsiuntėte užsakymą "+developerUserName,
			  html: message
			};

			transporter.sendMail(companyMailOptions, function(error, info){
			  if (error) {
			    console.log(error);
			  } else {
			    console.log('Email sent: ' + info.response);
			  }
			});
		}
		catch(error){
			console.log("Send Mail to companyUser",error);
		
		}
	}
	sendMailToDeveloperDirectHire(companyUser,developerUser,bookingResult){
		try{
			let servicePrice = 0;
			let feesPrice = bookingResult.fees;
			let taxPay = developerUser.taxPay; 
			let totalPrice = bookingResult.totalAmount;
			servicePrice = Number(Number(totalPrice) - Number(feesPrice)).toFixed(2);
			
			let companyUserName = this.validateCheck(companyUser.name);
			let companyUserEmail = this.validateCheck(companyUser.email);
			let companyUserPhone = this.validateCheck(companyUser.phone);
			let companyUserAddress = this.validateCheck(companyUser.address);
			let developerUserCity = this.validateCheck(developerUser.city);
			let developerUserService = this.validateCheck(developerUser.service);

			let message = `<p>Labas!<br/>Gera žinia – turime tau užsakymą! Mokėjimas už paslaugas jau rezervuotas ir patikimai mūsų
saugomas. Siunčiame informaciją apie paslaugos pirkėją bei kviečiame bendrauti ir bendradarbiauti Ašdirbu platformos skiltyje Žinutės. 
Linkime sėkmės ir lauksime paslaugos pirkėjo įvertinimo.
Ir, žinoma, svarbiausia žinia: po paslaugos atlikimo bei pirkėjo įvertinimo, rezervuotą sumą
pervesime į tavo nurodytą sąskaitą. Darbas žmogų puošia, tiesa?</p><br/><table>
					  <tr>
					    <td><b>Vardas : </b></td>
					    <td>${companyUserName}</td>
					  </tr>
					  <tr>
					    <td><b>Pašto adresą : </b></td>
					    <td>${companyUserEmail}</td>
					  </tr>
					  <tr>
					    <td><b>Telefonas : </b></td>
					    <td>${companyUserPhone}</td>
					  </tr>
					  <tr>
					    <td><b>Adresas : </b></td>
					    <td>${companyUserAddress}</td>
					  </tr>
					</table>
					<div style="width:49%; float:right; ">
						<h3>UŽSAKYMO DUOMENYS</h3>
						<table style="border: 1px solid;">
						<tr>
						    <td>${(developerUserService)+' Paslaugos'}</td>
						  </tr>
						  <tr>
						    <td><b>Paslaugos : </b></td>
						    <td>${servicePrice}</td>
						  </tr>
						  <tr>
						    <td><b>Administravimo mokestis : </b></td>
						    <td>${feesPrice}</td>
						  </tr>`;
						if(taxPay==1){
							message +=  `<tr>
						    		<td><b>PVM mokestis : </b></td>
						    		<td>0.00</td>
						  		</tr>`;
						}
					
						message += `<tr>
						    <td><b>Viso : </b></td>
						    <td>${totalPrice}</td>
						  </tr>
						</table>
					</div>
					<div style="width:49%;">
						<h3>Kaina</h3>
						<table style="border: 1px solid;">
						  <tr>
						    <td><b>Miestas : </b></td>
						    <td>${developerUserCity}</td>
						  </tr>
						  <tr>
						    <td><b>Diena : </b></td>
						    <td>-</td>
						  </tr>
						  <tr>
						    <td><b>Darbas : </b></td>
						    <td>${developerUserService}</td>
						  </tr>
						</table>
						<br><h3>''Aš dirbu'' komanda</h3><img src="${logo}" style="height:30px;" />
					</div>`;

			let devloperMailOptions = {
			  from: '"Aš dirbu" <info@asdirbu.lt>',
			  to: developerUser.email,
			  subject: "Puiki žinia: gavote užsakymą iš "+companyUserName,
			  html: message
			};
			transporter.sendMail(devloperMailOptions, function(error, info){
			  if (error) {
			    console.log(error);
			  } else {
			    console.log('Email sent: ' + info.response);
			  }
			});
		}
		catch(error){
			console.log("Send Mail to developer direct",error);
		
		}
	}
	sendMailToCompanyDirectHire(companyUser,developerUser,bookingResult){
		try{
			let servicePrice = 0;
			let feesPrice = bookingResult.fees;
			let taxPay = developerUser.taxPay; 
			let totalPrice = bookingResult.totalAmount;
			servicePrice = Number(Number(totalPrice) - Number(feesPrice)).toFixed(2);
			let developerUserName = this.validateCheck(developerUser.name);
			let developerUserEmail = this.validateCheck(developerUser.email);
			let developerUserPhone = this.validateCheck(developerUser.phone);
			let developerUserAddress = this.validateCheck(developerUser.address);
			let developerUserCity = this.validateCheck(developerUser.city);
			let developerUserService = this.validateCheck(developerUser.service);
			
			let message = `<p>Labas!<br/>Dėkojame už atliktą užsakymą bei siunčiame informaciją apie paslaugos teikėją. Kviečiame
bendrauti ir bendradarbiauti Aš dirbu platformos skiltyje Žinutės.
Sėkmės ir lauksime paslaugos teikėjo įvertinimo!</p><br/><table>
					  <tr>
					    <td><b>Vardas : </b></td>
					    <td>${developerUserName}</td>
					  </tr>
					  <tr>
					    <td><b>Pašto adresą : </b></td>
					    <td>${developerUserEmail}</td>
					  </tr>
					  <tr>
					    <td><b>Telefonas : </b></td>
					    <td>${developerUserPhone}</td>
					  </tr>
					  <tr>
					    <td><b>Adresas : </b></td>
					    <td>${developerUserAddress}</td>
					  </tr>
					</table>
					<div style="width:49%; float:right; ">
						<h3>UŽSAKYMO DUOMENYS</h3>
						<table style="border: 1px solid;">
						<tr>
						    <td>${(developerUserService)+' Paslaugos'}</td>
						  </tr>
						  <tr>
						    <td><b>Paslaugos : </b></td>
						    <td>${servicePrice}</td>
						  </tr>
						  <tr>
						    <td><b>Administravimo mokestis : </b></td>
						    <td>${feesPrice}</td>
						  </tr>`;
						  if(taxPay==1){
						  message +=`<tr>
							    <td><b>PVM mokestis : </b></td>
							    <td>0.00</td>
							  </tr>`;}
						message +=`<tr>
						    <td><b>Viso : </b></td>
						    <td>${totalPrice}</td>
						  </tr>
						</table>
					</div>
					<div style="width:49%;">
						<h3>Kaina</h3>
						<table style="border: 1px solid;">
						  <tr>
						    <td><b>Miestas : </b></td>
						    <td>${developerUserCity}</td>
						  </tr>
						  <tr>
						    <td><b>Diena : </b></td>
						    <td> - </td>
						  </tr>
						  <tr>
						    <td><b>Darbas : </b></td>
						    <td>${developerUserService}</td>
						  </tr>
						</table>
						<br><h3>''Aš dirbu'' komanda</h3><img src="${logo}" style="height:30px;" />
					</div>`;
		var companyMailOptions = {
			  from: '"Aš dirbu" <info@asdirbu.lt>',
			  to: companyUser.email,
			  subject: "Puiki žinia: jūs išsiuntėte užsakymą "+developerUserName,
			  html: message
			};
			transporter.sendMail(companyMailOptions, function(error, info){
			  if (error) {
			    console.log(error);
			  } else {
			    console.log('Successfully send' + info);
			  }
			});
		}
		catch(error){
			console.log("Send Mail to developer direct",error);
		
		}
	}

	sendMailAfterOneDayToDeveloper(email) {		
		let mailoption = {
			from: '"Aš dirbu" <info@asdirbu.lt>',
			to: email,
			subject: `Asdirbu  Paštas`,
			html: `<p>Nuoširdžiai dėkojame už atliktą darbą bei tikimės, jog viskas vyko sklandžiai. Be galo vertiname ne tik tavo talentą, bet ir nuomonę, todėl kviečiame įvertinti paslaugos pirkėją. Šis atsiliepimas suteiks galimybes tavo kolegoms daugiau sužinoti apie užsakovą. </p><p>Turime netgi dvi geras žinias. Pirmoji – tavo uždirbti pinigai yra saugūs ir netrukus bus pervesti į nurodytą sąskaitą. Antroji – teikdamas paslaugas Aš dirbu platformoje, prisidedi prie senjorų užimtumo didinimo, verslumo regionuose skatinimo bei darbo kodekso reformų, suteiksiančių lankstesnes sąlygas dirbti ir užsidirbti.</p>
						<p>Ačiū, kad dirbi Lietuvoje ir dėl Lietuvos!</p><br><h3>''Aš dirbu'' komanda</h3><img src="${logo}" style="height:30px;" />`
		};
		transporter.sendMail(mailoption, function(error, info){
			if (error) {
			    console.log(error);
			} else {
			    console.log('Email sent: ' + info.response);
			}
		});
	}

	sendMailAfterOneDayToCompany(email) {
		let mailoption = {
			from: '"Aš dirbu" <info@asdirbu.lt>',
			to: email,
			subject: `Asdirbu  Paštas`,
			html: `<p>Nuoširdžiai dėkojame už paslaugos užsakymą ir tikimės, jog viskas vyko sklandžiai. Be galo vertiname ne tik tavo norą suteikti galimybes dirbti bei užsidirbti, bet ir nuomonę. Todėl kviečiame įvertinti paslaugos teikėją – tavo atsiliepimas leis kitiems daugiau sužinoti apie šį specialistą. </p><p>Turime gerą žinią – pirkdamas paslaugas Aš dirbu platformoje, prisidedi prie senjorų užimtumo didinimo, verslumo regionuose skatinimo bei lankstesnių darbo kodekso reformų iniciavimo. </p><p>
Ačiū, kad skatini dirbti Lietuvoje ir dėl Lietuvos!</p><br><h3>''Aš dirbu'' komanda</h3><img src="${logo}" style="height:30px;" />`
		};	
		transporter.sendMail(mailoption, function(error, info){
		  if (error) {
		    console.log(error);
		  } else {
		    console.log('Email sent: ' + info.response);
		  }
		});
	}
	async reviewMail(userId,bookingId,email){
		try {	
			let link = reviewUserLink + bookingId + "/" + userId;
			let activationMail = {
			  	from: '"Aš dirbu" <info@asdirbu.lt>',
			  	to: email,
			  	subject: "Asdirbu Apžvalga",
				html:`<span>
				Nuoširdžiai dėkojame už paslaugos užsakymą ir tikimės, jog viskas vyko sklandžiai. Be galo vertiname ne tik tavo norą suteikti galimybes dirbti bei užsidirbti, bet ir nuomonę. Todėl kviečiame įvertinti paslaugos teikėją – tavo atsiliepimas leis kitiems daugiau sužinoti apie šį specialistą.<br/>
Turime gerą žinią – pirkdamas paslaugas Aš dirbu platformoje, prisidedi prie senjorų užimtumo didinimo, verslumo regionuose skatinimo bei lankstesnių darbo kodekso reform iniciavimo.<br>Ačiū, kad skatini dirbti Lietuvoje ir dėl Lietuvos!<br/><br/><a href="${link}" style='color: #fff;padding: 5px 10px;border-radius: 25px;background: #E57D33;text-decoration:none' target="_blank">Įvertinti</a><br/></span><br><h3>''Aš dirbu'' komanda</h3><img src="${logo}" style="height:30px;" />`
			};
			transporter.sendMail(activationMail, function(error, info){
			  	if (error) {
			  		console.log(error);
			    	return true;
			  	} else {
			  		console.log(info);
			    	return false;
			  	}
			});
        } 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async sendFrelanceReviewMail(bookingId,email){
		try {	
			let link = frelanceReviewLink + bookingId;
			let activationMail = {
			  	from: '"Aš dirbu" <info@asdirbu.lt>',
			  	to: email,
			  	subject: "Asdirbu Apžvalga",
				html:`<span>Nuoširdžiai dėkojame už atliktą darbą bei tikimės, jog viskas vyko sklandžiai. Be galo vertiname ne tik tavo talentą, bet ir nuomonę, todėl kviečiame įvertinti paslaugos pirkėją. Šis atsiliepimas suteiks galimybes tavo kolegoms daugiau sužinoti apie užsakovą. Turime netgi dvi geras žinias. Pirmoji – tavo uždirbti pinigai yra saugūs ir netrukus bus pervesti į nurodytą sąskaitą. Antroji – teikdamas paslaugas Aš dirbu platformoje, prisidedi prie senjorų užimtumo didinimo, verslumo regionuose skatinimo bei darbo kodekso reformų, suteiksiančių lankstesnes sąlygas dirbti ir užsidirbti.<br/>
Ačiū, kad dirbi Lietuvoje ir dėl Lietuvos!<br/><br/><a href="${link}" style='color: #fff;padding: 5px 10px;border-radius: 25px;background: #E57D33;text-decoration:none' target="_blank">Įvertinti</a><br/></span><br><h3>''Aš dirbu'' komanda</h3><img src="${logo}" style="height:30px;" />`
			};
			transporter.sendMail(activationMail, function(error, info){
			  	if (error) {
			  		console.log(error);
			    	return true;
			  	} else {
			  		console.log(info);
			    	return false;
			  	}
			});
        } 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}

	profileApproveMail(email){
		try {	
		    	let activationMail = {
				  	from: '"Aš dirbu" <info@asdirbu.lt>',
				  	to: email,
				  	subject: "Profilis patvirtintas",
					html:`<span>Labas,<br/>mes tavęs laukėme! Džiaugiamės, kad prisijungei prie Aš dirbu bendruomenės.Džiaugiamės galėdami pranešti , kad tavo paskyra patvirtinta.<br/>Pradėkime?</span><br/><h3>''Aš dirbu'' komanda</h3><img src="${logo}" style="height:30px;" />`
				};
				//console.log(activationMail,enail);
				transporter.sendMail(activationMail, function(error, info){
				  	if (error) {
				  		console.log("error",error);
				  		return true;
				  	} else {
				  		console.log("info",info);
				    	return false;
				  	}
				});
       } 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	sendMailToPostJobUser(toEmail,name,service,paslaugos_priemimo_laikas,skelbimo_pavadinimas,papasakok_plačiau,Raktažodžiai,paslaugos_kaina,paslaugos_suteikimo_vieta,distance,paslaugos_priėmimo_vieta,jobType,specialty,otherSpecialty,placeGoodsDelivery){
		
		specialty = specialty == 'Kitas' ? otherSpecialty : specialty;
		let message = `<html><body>
    	<p>Labas,<br/>Puikios naujienos! Tavo užsakymas atliktas . Apačioje rasi savo užsakymo duomenis.</p>
        <table  border="1" style="border-collapse: collapse;border:1px solid #000;">
            <tr>
                <th>Vardas</th>
                <td>${name}</td>
            </tr>
            <tr>
                <th>Skelbimo pavadinimas</th>
                <td>${skelbimo_pavadinimas}</td>
            </tr>`;
            if(jobType==1){
	            message +=`<tr>
	                <th>Papasakok plačiau</th>
	                <td>${papasakok_plačiau}</td>
	            </tr>
	            <tr>
	                <th>Pasirink specialybe</th>
	                <td>${specialty}</td>
	            </tr>
	            <tr>
                	<th>Paslaugos suteikimo vieta</th>
                	<td>${paslaugos_suteikimo_vieta}</td>
            	</tr>
            	<tr>
	                <th>Paslaugos suteikimo data</th>
	                <td>${paslaugos_priėmimo_vieta}</td>
	            </tr>
	            <tr>
	                <th>Paslaugos atlikimo laikas</th>
	                <td>${paslaugos_priemimo_laikas}</td>
	            </tr>
	            `;
        	}
        	else{
        		 message +=`<tr>
	                <th>Siuntos pristatymo data</th>
	                <td>${placeGoodsDelivery}</td>
	            </tr>
	            <tr>
                	<th>Siuntos paėmimo vieta</th>
                	<td>${paslaugos_suteikimo_vieta}</td>
            	</tr>
            	<tr>
                	<th>Siuntos pristatymo vieta</th>
                	<td>${paslaugos_priėmimo_vieta}</td>
            	</tr>            	
	            <tr>
	                <th>Siuntos pristatymo laikas</th>
	                <td>${paslaugos_priemimo_laikas}</td>
	            </tr>`;
        	}

            message +=`<tr>
                <th>Paslaugos kaina</th>
                <td>${paslaugos_kaina}</td>
            </tr>
            <tr>
                <th>Atstumas</th>
                <td>${distance}</td>
            </tr>
        </table><br/>
     	<h3>''Aš dirbu'' komanda</h3><img src="${logo}" style="height:30px;" />     
    </body>
</html>`;

		let mail = {
		  	from: '"Aš dirbu" <info@asdirbu.lt>',
		  	to: toEmail,
		  	subject: "Asdirbu naujas pranešimas",
		  	html:message 
		};
		transporter.sendMail(mail, function(error, info){
		  	if (error) {
//		  		console.log(error);
		    	return true;
		  	} else {
//		  		console.log(info);
		    	return false;
		  	}
		});
	}
	async sendMessagePostJobUser(email,userId){

		try {	
			let link = reviewsUserLink + userId;
			var activationMail = {
				  	from: '"Aš dirbu" <info@asdirbu.lt>',
				  	to: email,
				  	subject: "Aš dirbu",
					html:`<span>Labas!<br/>Puikios naujienos! Atkeliavo užklausa dėl paslaugos teikimo. Nekantriai laukiame patvirtinimo. Patvirtinus tiekėją ir atlikus apmokėjimą už būsimą paslaugą, jis bus saugiai rezervuotas ir sumokėtas po paslaugos suteikimo.<br/>Sėkmės ir lauksime paslaugos teikėjo įvertinimo!<br/><br/><a href="${link}" target='_blank' style='color: #fff;padding: 5px 10px;border-radius: 25px;background: #E57D33;text-decoration:none'>Peržiūrėti profilį</a></span><br/><h3>''Aš dirbu'' komanda</h3><img src="${logo}" style="height:30px;" />`
				};
				transporter.sendMail(activationMail, function(error, info){
				  	if (error) {
				  		console.log(error);
				    	return true;
				  	} else {
				  		console.log(info);
				    	return false;
				  	}
				});
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async messageToUser(email){
		try {	
			console.log("email",email);
			var activationMail = {
				  	from: '"Aš dirbu" <info@asdirbu.lt>',
				  	to: email,
				  	subject: "Aš dirbu",
					html:`<span>Labas!<br/>Puikios naujienos! Atkeliavo užklausa dėl paslaugos teikimo. Nekantriai laukiame tavęs Aš dirbu platformoje Žinučių skiltyje, kur rasi naują žinutę.<br/>Sėkmės ir lauksime paslaugos teikėjo įvertinimo!</span><br><h3>''Aš dirbu'' komanda</h3><img src="${logo}" style="height:30px;" />`
				};
				transporter.sendMail(activationMail, function(error, info){
				  	if (error) {
				  		console.log(error);
				    	return true;
				  	} else {
				  		console.log(info);
				    	return false;
				  	}
				});
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async sendMailDeveloper(email,postId,fromUserId,timesheet){
		try {	
			let link = hireUserLink + "0/" + fromUserId +"/" + postId; 
			let message = `<span>Labas!<br/>
			<table border='1'>
				<tr>
					<th>Data</th>
					<th>Pradžios laikas</th>
					<th>Pabaigos laikas</th>
				</tr>`;
				timesheet.forEach(response=>{
					message+=`<tr><td>${response.date}</td><td>${response.start}</td><td>${response.end}</td></tr>`;
				});
				message +=`</table><br/><a href="${link}" target='_blank' style='color: #fff;padding: 5px 10px;border-radius: 25px;background: #E57D33;text-decoration:none'>Priimti darbo pasiūlyma</a><br><br></span><br><h3>''Aš dirbu'' komanda</h3><img src="${logo}" style="height:30px;" />`;

			var activationMail = {
				  	from: '"Aš dirbu" <info@asdirbu.lt>',
				  	to: email,
				  	subject: "Aš dirbu",
					html:message
				};
				transporter.sendMail(activationMail, function(error, info){
				  	if (error) {
				  		console.log(error);
				    	return false;
				  	} else {
				  		console.log(info);
				    	return true;
				  	}
				});
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}

}
module.exports = new Mail();