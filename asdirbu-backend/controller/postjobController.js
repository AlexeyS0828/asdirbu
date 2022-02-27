var formidable 				= require('formidable');
var fs 						= require('fs');
var md5 					= require('md5');
var path                	= require('path');
var dateFormat 				= require('dateformat');
const Mail           		= require('../model/mail');
const Postjobs 				= require('../model/postjob');
const Users 				= require('../model/users');
const userCtrl 	= require('./userController');
const imagePublicPath   	= path.join(__dirname, '../public/images/');
const tempImagePath   = path.join(__dirname, '../public/temp_image/');
var postjobController 		= {};
const tax = 10;
const pvmTax = 21;

const url = "https://www.asdirbu.lt/payment/";
//const url = "https://kretoss.com/project/asdirub/payment/";
//const url = "https://asdirbu.lt/testing/payment/";

postjobController.getUserList = async function(distance,currentLatitude,currentLongitude,jobType,specialty,otherSpecialty){
	return await Postjobs.getUserListBylatlong(distance,currentLatitude,currentLongitude,jobType,specialty,otherSpecialty);	
}
postjobController.getUserById = async function(userid){
	return await Postjobs.getUserListByid(userid);
}

postjobController.createjob = async function (req, res) { 
	var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) =>{
	    let email           = fields.email;
	    let password        = fields.password;
	    let name            = fields.name;
	    let lastname        = fields.lastname;
	    let service         = "";
	    let dob             = fields.dob;
	    let paslaugos_priemimo_laikas 	= fields.paslaugos_priemimo_laikas ? fields.paslaugos_priemimo_laikas : '';
	    let latitude 	= fields.latitude ? fields.latitude : '';
	    let longitude 	= fields.longitude ? fields.longitude : '';
	    let skelbimo_pavadinimas 	= fields.skelbimo_pavadinimas ? fields.skelbimo_pavadinimas : '';
		let papasakok_plačiau 		= fields.papasakok_placiau ? fields.papasakok_placiau : '';
		let Raktažodžiai 			= fields.Raktažodžiai ? fields.Raktažodžiai : '';
		let paslaugos_kaina 		= fields.paslaugos_kaina ? fields.paslaugos_kaina : 0;
		let paslaugos_suteikimo_vieta= fields.paslaugos_suteikimo_vieta ? fields.paslaugos_suteikimo_vieta : '';
		let distance 				= fields.distance ? parseInt(fields.distance) : '';
		let paslaugos_priėmimo_vieta= fields.paslaugos_priėmimo_vieta ? fields.paslaugos_priėmimo_vieta : '';
		let job_type 				= fields.job_type ? fields.job_type : '';
	    let currentLongitude		= fields.currentLongitude ? fields.currentLongitude : 0;
		let currentLatitude 		= fields.currentLatitude ? fields.currentLatitude : 0;
		let specialty 				= fields.specialty ? fields.specialty : '';
		let otherSpecialty 			= fields.otherSpecialty ? fields.otherSpecialty : '';
		let placeGoodsDelivery 		= fields.placeGoodsDelivery ? fields.placeGoodsDelivery : '';
		let pridėk_nuotrauką 		= [];
		let userList = [];
		if(job_type){
			if (job_type == 1) {
				if (!paslaugos_suteikimo_vieta) {
					return res.status(200).send({success:false,message:"Įveskite paslaugų suteikimo vietą"});
				}
				if (!distance) {
					return res.status(200).send({success:false,message:"Įveskite atstumą"});
				}
				if (!paslaugos_priėmimo_vieta) {
					return res.status(200).send({success:false,message:"Įveskite paslaugų priėmimo vietą"});
				}
			}
			else{
				if (!skelbimo_pavadinimas) {
					return res.status(200).send({success:false,message:"Įveskite skelbimo pavadinimą"});
				}
				if (!papasakok_plačiau) {
					return res.status(200).send({success:false,message:"Prašome įvesti papasakok plačiau"});
				}
				if (!paslaugos_suteikimo_vieta) {
					return res.status(200).send({success:false,message:"Įveskite paslaugų suteikimo vietą"});
				}
				if (!distance) {
					return res.status(200).send({success:false,message:"Įveskite atstumą"});
				}
				if (!paslaugos_priėmimo_vieta) {
					return res.status(200).send({success:false,message:"Įveskite paslaugų priėmimo vietą"});
				}
			}
		}
		else{
			return res.status(200).send({success:false,message:"Reikalingas darbo tipas"});
		}

	    if(!email){
	        return res.status(200).send({success:false,message:"Įveskite el. Pašto adresą"});
	    }
	    if(!password){
	        return res.status(200).send({success:false,message:"Įveskite slaptažodį"});
	    }
	    if(!name){
           return  res.status(200).send({success:false,message:"Įveskite vardą"});
        }
	    if(!lastname){
           return  res.status(200).send({success:false,message:"Pavardės laukas yra būtinas"});
        }
        if(!dob){
           return  res.status(200).send({success:false,message:"Įveskite gimimo datą"});
        }
        if (!Number.isInteger(distance)) {
        	return  res.status(200).send({success:false,message:"Atstumas turi būti skaičius"});
        }
        if(paslaugos_priėmimo_vieta!=""){
        	paslaugos_priėmimo_vieta = dateFormat(paslaugos_priėmimo_vieta,"yyyy-mm-dd");
        }
		if(distance!=0 && latitude!=0 && longitude!=0){
			postjobController.getUserList(distance,latitude,longitude,job_type,specialty,otherSpecialty).then(response=>{
				userList = response;
			});
		}
		
		let fromUserId = 0;
	    skelbimo_pavadinimas = skelbimo_pavadinimas === "undefined" ? "" : skelbimo_pavadinimas; 
	    placeGoodsDelivery = placeGoodsDelivery === "undefined" ? "" : placeGoodsDelivery; 
        papasakok_plačiau = papasakok_plačiau === "undefined" ? "" : papasakok_plačiau; 
        Raktažodžiai = Raktažodžiai === "undefined" ? "" : Raktažodžiai; 
		specialty = specialty === "undefined" ? "" : specialty;
		otherSpecialty = otherSpecialty === "undefined" ? "" : otherSpecialty;
		
	    Users.isEmailUniue(email).then(result=>{
	        if(result.length > 0){
	            return res.status(200).send({success:false,message:"El. Paštas jau registruotas"});
	        }
	        else{
	            password = md5(password);
	            Users.registerIndividual(name,service,dob,1,email,password,lastname).then(result=>{
                  	if(result){
                    	fromUserid = result.insertId;
                    	Mail.activationMail(email,result.insertId);
						Object.keys(files).forEach(element=>{
				        	let image = new Date().getTime() + Math.floor(Math.random() * Math.floor(100)) + files[element].name;
					       	let oldpath = files[element].path;
					      	let newpath = tempImagePath + image;
					      	pridėk_nuotrauką.push(image);
					       	fs.rename(oldpath, newpath,(err)=>{});
				        	userCtrl.compressImage(newpath,imagePublicPath);
				        });
				        pridėk_nuotrauką = JSON.stringify(pridėk_nuotrauką);
						Postjobs.createjob(result.insertId,skelbimo_pavadinimas,papasakok_plačiau,Raktažodžiai,paslaugos_kaina,paslaugos_suteikimo_vieta,distance,pridėk_nuotrauką,paslaugos_priėmimo_vieta,job_type,paslaugos_priemimo_laikas,latitude,longitude,specialty,otherSpecialty,placeGoodsDelivery).then(result=>{
					    	if(result){
					    		Mail.sendMailToPostJobUser(email,name,service,paslaugos_priemimo_laikas,skelbimo_pavadinimas,papasakok_plačiau,Raktažodžiai,paslaugos_kaina,paslaugos_suteikimo_vieta,distance,paslaugos_priėmimo_vieta,job_type,specialty,otherSpecialty,placeGoodsDelivery);
					    		if(userList){
					    			userList.forEach((element,index)=>{
					    				Mail.jobPostMailToUser(element.email,email,name,service,paslaugos_priemimo_laikas,skelbimo_pavadinimas,papasakok_plačiau,Raktažodžiai,paslaugos_kaina,paslaugos_suteikimo_vieta,distance,paslaugos_priėmimo_vieta,result.insertId,element.id,job_type,specialty,otherSpecialty,placeGoodsDelivery);	
						   			});
					    		}
					    		res.status(200).send({success:true,message:"Darbas buvo sukurtas sėkmingai"});
					    	}	
					        else{
					    		res.status(500).send({success:false,message:"Kažkas negerai"});
					    	}	
					    });
                    }   
                    else{
                       res.status(500).send({success:false,message:"Kažkas negerai"});
                    }   
                });
	        }
	    });
	});
}


postjobController.postjob = function(req,res){
	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
	    let email = "";
	    let username = "";
	    let service = "";
	    let paslaugos_priemimo_laikas 	= fields.paslaugos_priemimo_laikas ? fields.paslaugos_priemimo_laikas : '';
	    let latitude 	= fields.latitude ? fields.latitude : '';
	    let longitude 	= fields.longitude ? fields.longitude : '';	    
	  	let skelbimo_pavadinimas 	= fields.skelbimo_pavadinimas ? fields.skelbimo_pavadinimas : '';
		let papasakok_plačiau 		= fields.papasakok_placiau ? fields.papasakok_placiau : '';
		let Raktažodžiai 			= fields.Raktažodžiai ? fields.Raktažodžiai : '';
		let paslaugos_kaina 		= fields.paslaugos_kaina ? fields.paslaugos_kaina : 0;
		let paslaugos_suteikimo_vieta= fields.paslaugos_suteikimo_vieta ? fields.paslaugos_suteikimo_vieta : '';
		let distance 				= fields.distance ? parseInt(fields.distance) : '';
		let paslaugos_priėmimo_vieta= fields.paslaugos_priėmimo_vieta ? fields.paslaugos_priėmimo_vieta : '';
		let job_type 				= fields.job_type ? fields.job_type : '';
		let currentLongitude		= fields.currentLongitude ? fields.currentLongitude : 0;
		let currentLatitude 		= fields.currentLatitude ? fields.currentLatitude : 0;
		let specialty 				= fields.specialty ? fields.specialty : '';
		let otherSpecialty 			= fields.otherSpecialty ? fields.otherSpecialty : '';
		let placeGoodsDelivery 		= fields.placeGoodsDelivery ? fields.placeGoodsDelivery : '';
		let userList = [];
		let pridėk_nuotrauką 		= [];
		let user = [];
		postjobController.getUserById(req.id).then(user=>{
			email = (user[0].email) ? user[0].email : "";
			username = (user[0].name) ? user[0].name : "";
			service = (user[0].service) ? user[0].service : "";	
		});
		if(job_type){
			if (job_type == 1) {
				if (!paslaugos_suteikimo_vieta) {
					return res.status(200).send({success:false,message:"Įveskite paslaugų suteikimo vietą"});
				}
				if (!distance) {
					return res.status(200).send({success:false,message:"Įveskite atstumą"});
				}
				if (!paslaugos_priėmimo_vieta) {
					return res.status(200).send({success:false,message:"Įveskite paslaugų priėmimo vietą"});
				}
			}
			else {
				if (!skelbimo_pavadinimas) {
					return res.status(200).send({success:false,message:"Įveskite skelbimo pavadinimą"});
				}
				if (!papasakok_plačiau) {
					return res.status(200).send({success:false,message:"Prašome įvesti papasakok plačiau"});
				}
				if (!paslaugos_suteikimo_vieta) {
					return res.status(200).send({success:false,message:"Įveskite paslaugų suteikimo vietą"});
				}
				if (!distance) {
					return res.status(200).send({success:false,message:"Įveskite atstumą"});
				}
				if (!paslaugos_priėmimo_vieta) {
					return res.status(200).send({success:false,message:"Įveskite paslaugų priėmimo vietą"});
				}
			}
		}
		else{
			return res.status(200).send({success:false,message:"Reikalingas darbo tipas"});
		}
		if(distance!=0 && latitude!=0 && longitude!=0){
			postjobController.getUserList(distance,latitude,longitude,job_type,specialty,otherSpecialty).then(response=>{
				userList = response;
			});
		}
		Object.keys(files).forEach(element=>{
        	let image = new Date().getTime()+ Math.floor(Math.random() * Math.floor(100)) + files[element].name;
	       	let oldpath = files[element].path;
	      	let newpath = tempImagePath + image;
	      	pridėk_nuotrauką.push(image);
	       	fs.rename(oldpath, newpath,(err)=>{});
	       	userCtrl.compressImage(newpath,imagePublicPath);
        });
        pridėk_nuotrauką = JSON.stringify(pridėk_nuotrauką);		
        if(paslaugos_priėmimo_vieta!="") {
        	paslaugos_priėmimo_vieta = dateFormat(paslaugos_priėmimo_vieta,"yyyy-mm-dd");
        }
	    skelbimo_pavadinimas = skelbimo_pavadinimas === "undefined" ? "" : skelbimo_pavadinimas; 
	    placeGoodsDelivery = placeGoodsDelivery === "undefined" ? "" : placeGoodsDelivery; 
        papasakok_plačiau = papasakok_plačiau === "undefined" ? "" : papasakok_plačiau; 
        Raktažodžiai = Raktažodžiai === "undefined" ? "" : Raktažodžiai; 
		specialty = specialty === "undefined" ? "" : specialty;
		otherSpecialty = otherSpecialty === "undefined" ? "" : otherSpecialty;
		Postjobs.createjob(req.id,skelbimo_pavadinimas,papasakok_plačiau,Raktažodžiai,paslaugos_kaina,paslaugos_suteikimo_vieta,distance,pridėk_nuotrauką,paslaugos_priėmimo_vieta,job_type,paslaugos_priemimo_laikas,latitude,longitude,specialty,otherSpecialty,placeGoodsDelivery).then(result=>{
	    	if(result){
				if(userList){
					Mail.sendMailToPostJobUser(email,username,service,paslaugos_priemimo_laikas,skelbimo_pavadinimas,papasakok_plačiau,Raktažodžiai,paslaugos_kaina,paslaugos_suteikimo_vieta,distance,paslaugos_priėmimo_vieta,job_type,specialty,otherSpecialty,placeGoodsDelivery);    		
					userList.forEach((element,index)=>{
						if(element.email != email){
							Mail.jobPostMailToUser(element.email,email,username,service,paslaugos_priemimo_laikas,skelbimo_pavadinimas,papasakok_plačiau,Raktažodžiai,paslaugos_kaina,paslaugos_suteikimo_vieta,distance,paslaugos_priėmimo_vieta,result.insertId,element.id,job_type,specialty,otherSpecialty,placeGoodsDelivery);	
						}
					});
				}
	    		res.status(200).send({success:true,message:"Darbas buvo sukurtas sėkmingai"});
	    	}	
	        else{
	    		res.status(500).send({success:false,message:"Kažkas negerai"});
	    	}	
	    });
    });
}
postjobController.storeMessageByJobId =  async function(req,res){
	try{
		if (!req.body.jobId) {
			return res.status(200).send({success:false,message:"Įveskite darbo id"});
		}
		if (!req.body.userId) {
			return res.status(200).send({success:false,message:"Įveskite vartotojo id"});
		}
		let jobId = req.body.jobId;
		let userId = req.body.userId;
		Postjobs.getJobDetailsById(jobId).then(response=>{
			if(response.length > 0) {
				let element = response[0];
				let link = url + element.id + "/" + userId; 
				let checkMessageStore = false;
				Postjobs.checkMessageStore(element.user_id,userId,jobId).then(result=>{
					if(!(result.length>0)){
						Postjobs.storeNearestUser(element.user_id,userId,jobId).then(result=>{console.log(result)});
						let specialty = element.specialty == 'Kitas' ? element.otherSpecialty : element.specialty;
						let message = `<html>
						<body>
							<table style=" border: none !important; width:100%">
								<tr>
									<th>Vardas : </th>
									<td>${element.name}</td>
								</tr>
								<tr>
									<th>Skelbimo pavadinimas : </th>
									<td>${element.skelbimo_pavadinimas}</td>
								</tr>`;
						if(element.job_type==1){
							message += `
							<tr>
								<th>Papasakok plačiau : </th><td>${element.papasakok_plačiau}</td>
							</tr>
							<tr>
								<th>Pasirink specialybe : </th><td>${specialty}</td>
							</tr>
							 <tr>
								<th>Paslaugos suteikimo vieta</th>
								<td>${element.paslaugos_suteikimo_vieta}</td>
							</tr>
							<tr>
								<th>Paslaugos suteikimo data</th>
								<td>${element.paslaugos_priėmimo_vieta}</td>
							</tr>
							<tr>
								<th>Paslaugos atlikimo laikas</th>
								<td>${element.paslaugos_priemimo_laikas}</td>
							</tr>`;
						}
						else{
			        		message +=`<tr>
				                <th>Siuntos pristatymo data</th>
				                <td>${element.placeGoodsDelivery}</td>
				            </tr>
				            <tr>
			                	<th>Siuntos paėmimo vieta</th>
			                	<td>${element.paslaugos_suteikimo_vieta}</td>
			            	</tr>
			            	<tr>
			                	<th>Siuntos pristatymo vieta</th>
			                	<td>${element.paslaugos_priėmimo_vieta}</td>
			            	</tr>            	
				            <tr>
				                <th>Siuntos pristatymo laikas</th>
				                <td>${element.paslaugos_priemimo_laikas}</td>
				            </tr>`;
			        	}
						message +=`
						<tr>
							<th>Paslaugos kaina : </th>
							<td>${element.paslaugos_kaina}</td>
						</tr>
						<tr>
							<th>Atstumas : </th>
							<td>${element.distance}</td>
						</tr>
						<tr>
							<th colspan="2" style="text-align:center;"><br/><a href="${link}" class='custom-button btn'>Mokėti ${element.paslaugos_kaina}EUR</a></th></tr></table></body></html>`;
						Postjobs.storeMessage(element.user_id,userId,message).then(response=>{
							if(response) {
								return res.status(200).send({success:true,message:"Sėkmingai išsaugoti pranešimą"});
							}
							else {
								return res.status(200).send({success:false,message:"Kažkas negerai"});
							}	
						});
					}
					else{
						return res.status(200).send({success:true,message:"Sėkmingai išsaugoti pranešimą"});
					}
				});
			}
			else {
				return res.status(200).send({success:false,message:"Kažkas negerai"});
			}
		});	
	}
	catch(error){
		return res.status(500).send({success:false,message:"Kažkas negerai"});
	}	
}



postjobController.getUserDetailsByJobId = async function(req,res){
	var mediaUrl = req.protocol+"://"+req.headers.host+'/media/';
	try{
		if (!req.body.jobId) {
			return res.status(200).send({success:false,message:"Įveskite darbo id"});
		}
		if (!req.body.userId) {
			return res.status(200).send({success:false,message:"Įveskite vartotojo id"});
		}
		let jobId = req.body.jobId;
		let userId = req.body.userId;
		let userAverageRating = await Users.getUserAvgRatings(userId).then(rates => {
			let rating = 0;
			if(rates.length) {
				rating =rates[0].rating;
			}
			return rating;
		});
		let serive_price = await Postjobs.getUserDetailsByJobId(jobId).then(result=>{
			let price = 0;
			if(result.length > 0) {
				price = result[0].paslaugos_kaina;
			}
			return price;
		});
		let userdetails = await Postjobs.getUserDetailsById(userId).then(result=>{
			let userdetails = {};
			if(result.length > 0) {
				userdetails = result[0];
			}
			return userdetails;
		});
		let taxPay = 0;
		let totalPrice = 0;
		serive_price = Number(serive_price).toFixed(2);
		let fees = Number((serive_price * tax) / 100).toFixed(2);
		let feesamount = Number(Number(serive_price) + Number(fees)).toFixed(2);
		/*if(userdetails.taxPay) {
			taxPay = Number((feesamount * pvmTax) / 100).toFixed(2);
			totalPrice = Number(Number(serive_price) + Number(fees) + Number(taxPay)).toFixed(2);
		}
		else {
			taxPay = Number((fees * pvmTax) / 100).toFixed(2);
			totalPrice = Number(Number(serive_price) + Number(fees) + Number(taxPay)).toFixed(2);
		}*/
		let data = {
			profile_image : userdetails.profile_image ? (mediaUrl + userdetails.profile_image) : (mediaUrl + "user.png"),
			name : userdetails.name ?  userdetails.name : "",
			ratings : userAverageRating ? userAverageRating : 0,
			termCondition : "N/A",
			city : userdetails.city ? userdetails.city : " - ",
			day : " - ",
			work : userdetails.service ? userdetails.service : '',
			service_name : userdetails.service ? userdetails.service : "",
			fee : fees,
			service_price : serive_price,
			price : feesamount,
			totalHour : " - ",
			taxPay : userdetails.taxPay ? userdetails.taxPay : '0' 
		};
		return res.status(200).send({success:true,message:"Sėkmingai gaukite vartotojo informaciją",data:data});
	}
	catch(error){
		console.log(error);
		return res.status(200).send({success:false,message:"Kažkas negerai"});	
	}	
}

postjobController.getJobDetailsById = async function(req,res){
	var mediaUrl = req.protocol+"://"+req.headers.host+'/media/';
	try{
		if (!req.body.jobId) {
			return res.status(200).send({success:false,message:"Įveskite darbo id"});
		}
		Postjobs.getJobDetailsById(req.body.jobId).then(result=>{
			if(result.length > 0){
				let image = mediaUrl + 'default-job-image.svg';
				let jobImage = [];
				if(result[0]["pridėk_nuotrauką"] != ""){
					let documentImage = JSON.parse(result[0]["pridėk_nuotrauką"]);
					if(documentImage.length > 0){
						image = mediaUrl + documentImage[0];
						documentImage.forEach(element=>{
							jobImage.push(mediaUrl + element);
						});
					}
				}
				let data = {
					image:image,
					address:result[0].paslaugos_suteikimo_vieta ? result[0].paslaugos_suteikimo_vieta : "",
					date:result[0].paslaugos_priėmimo_vieta ? dateFormat(result[0].paslaugos_priėmimo_vieta,"mm.dd.yyyy") : "",
					time:result[0].paslaugos_priemimo_laikas ? result[0].paslaugos_priemimo_laikas : "",
					placeGoodsDelivery:result[0].placeGoodsDelivery ? result[0].placeGoodsDelivery : "",
					jobTitle:result[0].skelbimo_pavadinimas ? result[0].skelbimo_pavadinimas : "",
					jobDescription:result[0].papasakok_plačiau ? result[0].papasakok_plačiau  : "",
					servicePrice:result[0].paslaugos_kaina ? result[0].paslaugos_kaina  : 0,
					jobImage:jobImage,
					jobType:result[0].job_type,
					userId:result[0].user_id
				};				
				return res.status(200).send({success:true,message:"Sėkmingai gaukite vartotojo informaciją",data:data});
			}
			else {
				return res.status(200).send({success:false,message:"Klaida, bandykite dar kartą."});	
			}
		});
	}
	catch(error){
		console.log(error);
		return res.status(200).send({success:false,message:"Klaida, bandykite dar kartą."});	
	}	
}


postjobController.sendMessagePostJobUser = async function(req,res){
	var mediaUrl = req.protocol+"://"+req.headers.host+'/media/';
	try{
		if (!req.body.jobId) {
			return res.status(200).send({success:false,message:"Įveskite darbo id"});
		}
		Postjobs.getJobDetailsById(req.body.jobId).then(result=>{
			if(result.length > 0){
				Mail.sendMessagePostJobUser(result[0].email,req.id);
				return res.status(200).send({success:true,message:"Sėkmingai išsiųsti"});	
			}
			else{
				return res.status(200).send({success:false,message:"Klaida, bandykite dar kartą."});		
			}
		});	
	}
	catch(error){
		console.log(error);
		return res.status(200).send({success:false,message:"Kažkas negerai"});	
	}	
}
module.exports = postjobController;

