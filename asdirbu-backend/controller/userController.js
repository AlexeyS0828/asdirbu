var session             = require('express-session');
var cron 				= require('node-cron');
var jwt                 = require('jsonwebtoken');
var md5                 = require('md5');
var formidable          = require('formidable');
var fs                  = require('fs');
var path                = require('path');
var dateFormat 			= require('dateformat');
var nodemailer 			= require('nodemailer');
const Users             = require('../model/users');
const Booking           = require('../model/booking');
const Mail           	= require('../model/mail');
var config              = require('../config/config');
var jwtAuth             = require('../jwtAuth');
const compress_images 	= require('compress-images');
var btoa = require('btoa');
var userController      = {};
const imagePublicPath   = path.join(__dirname, '../public/images/');
const tempImagePath   = path.join(__dirname, '../public/temp_image/');
const tax = 10;
const pvmTax = 21;
userController.register = function (req, res) {
	    let userType        = req.body.userType;
	    let companyName     = req.body.companyName;
	    let companyCode     = req.body.companyCode;
	    let sector          = "";    
	    let email           = req.body.email;
	    let password        = req.body.password;
	    let name            = req.body.name;
	    let lastname        = req.body.lastname;
	    let service         = "";
	    let dob             = req.body.dob;
	    if(!email){
	        return res.status(200).send({success:false,message:"Įveskite el. Pašto adresą"});
	    }
	    if(!password){
	        return res.status(200).send({success:false,message:"Įveskite slaptažodį"});
	    }
	    if (userType) {
	        if (userType == 1) {
				if(!name){
	               return  res.status(200).send({success:false,message:"Įveskite vardą"});
	            }
	            if(!lastname){
	               return  res.status(200).send({success:false,message:"Pavardės laukas yra būtinas."});
	            }
	            if(!dob){
	               return  res.status(200).send({success:false,message:"Įveskite gimimo datą"});
	            }
	        }
	        else{
	            
	            if(!companyName){
	               return  res.status(200).send({success:false,message:"Įveskite įmonės pavadinimą"});
	            }
	            if(!companyCode){
	                return res.status(200).send({success:false,message:"Įveskite įmonės kodą"});
	            }	           
	        }
	    }
	    else{
	        return res.status(200).send({success:false,message:"Reikalingas naudojimo tipas!"});
	    }
	    Users.isEmailUniue(email).then(result=>{
	        if(result.length > 0){
	            return res.status(200).send({success:false,message:"El. Paštas jau registruotas"});
	        }
	        else{
	            password = md5(password);
	            if (userType == 1) {
	                Users.registerIndividual(name,service,dob,userType,email,password,lastname)
	                    .then(result=>{
	                    if(result){
	                    	Mail.activationMail(email,result.insertId);
		                    res.status(200).send({success:true,message:"Sėkmingai užsiregistruoti"});
	                    }   
	                    else{
	                       res.status(500).send({success:false,message:"Kažkas negerai"});
	                    }   
	                });
	            }
	            else{
	                Users.registerBusiness(companyName,companyCode,sector,userType,email,password)
	                    .then(result=>{
	                    if(result){
	                    	Mail.activationMail(email,result.insertId);
	                       res.status(200).send({success:true,message:"Sėkmingai užsiregistruoti"});
	                    }   
	                    else{
	                       res.status(500).send({success:false,message:"Kažkas negerai"});
	                    }   
	                });
	            }
		    }
	    });
}
userController.login = function(req,res){
    var email       = req.body.email;
    var password    = req.body.password;
    if(!email){
        return res.status(200).send({success:false,message:"Įveskite el. Pašto adresą"});
    }
    if(!password){
        return res.status(200).send({success:false,message:"Įveskite slaptažodį"});
    }

    var password = md5(req.body.password);
    Users.login(email, password).then(results=>{
        if (results.length > 0) { 
            var string=JSON.stringify(results);
            var json =  JSON.parse(string);
        	if (json[0].is_user_verified == 1) {	        		
	            jwtAuth.createToken(json[0].id).then(result=>{
	            	Users.getjobsByUserId(json[0].id).then(jobRes =>{
		               let data = {
		                    id          : json[0].id, 
		                    email       : json[0].email, 
		                    companyName : json[0].companyName ? json[0].companyName : '', 
		                    companyCode : json[0].companyCode ? json[0].companyCode : '', 
		                    sector      : json[0].sector ? json[0].sector : '', 
		                    userType    : json[0].userType,
		                    isJobPosted	: jobRes.length == 0 ? 0 : 1,
		                    _token      : result
		                };
		                res.status(200).send({success:true,message:"Prisijungimas sėkmingai!", data:data});
	            	});
	            });
        	}      
        	else{
        		res.status(200).send({success:false,message:"Prašome aktyvuoti Jūsų paskyrą."});
        	}
            
        } else {
            res.status(200).send({success:false,message:"Neteisingas slaptažodis arba el paštas"});
        } 
    });
}
userController.profile = async function(req,res){
	var mediaUlr 			= req.protocol+"://"+req.headers.host+'/media/';
    if(req.id){
		let userdata = await Users.getUserById(req.id).then(result=>{
				            var string      = JSON.stringify(result);
				            var UserArray   = JSON.parse(string);
				            return UserArray[0];
				        });
    	let userDocs = await Users.getUserDocument(req.id).then(result => {
			            	let temp_docs = [];
			            	result.forEach(element =>{
			            		temp_docs.push({
			            			id:element.id,
			            			name : element.name ? element.name : '',
			            			document : mediaUlr+element.document
			            		});	
			            	});
			            	return temp_docs;
				    	});
    	let review = await Users.getUserReview(req.id).then(review => {
						let tempReview = [];
						review.forEach(element => {
							tempReview.push({
								id 		: element.id,
								image 	: mediaUlr+'user.png',
								name  	: element.name,
								rating 	:element.ratings,
								review 	:element.review
							});
						});
						return tempReview;
		});
		let imageList = [];
		let image = [];
		let images = [];
		if(userdata.image){
			image = JSON.parse(userdata.image);
			image.forEach(element=>{
				if(element!=""){
					imageList.push(mediaUlr + element);
					images.push(element);
				}
			});
		}		
    	let data = {
	                id          	: userdata.id,
	                profileimage 	: userdata.profile_image ? mediaUlr+userdata.profile_image : mediaUlr+'user.png',
	                name        	: userdata.name ? userdata.name : '',
	                lastName    	: userdata.last_name ? userdata.last_name : '',
	                email       	: userdata.email ? userdata.email : '',
	                phone       	: userdata.phone ? userdata.phone : '',
	                address     	: userdata.address ? userdata.address : '',
	                city 	    	: userdata.city ? userdata.city : '',
	                houseNumber    	: userdata.houseNumber ? userdata.houseNumber : '',
	                bank_ac_no		: userdata.bank_ac_no ? userdata.bank_ac_no : '',
	                specialty		: userdata.specialty ? userdata.specialty : '',
	                otherSpecialty	: userdata.otherSpecialty ? userdata.otherSpecialty : '',
	                serviceName		: userdata.serviceName ? userdata.serviceName : '',
	                otherServiceName : userdata.otherServiceName ? userdata.otherServiceName : '',
	                uploaded_docs 	: userDocs,
	                review 			: review,
	                taxPay 			: userdata.taxPay ? userdata.taxPay : '0' ,
                	aboutMe 		: userdata.about_me ? userdata.about_me : '',
					service 		: userdata.service ? userdata.service : '',
					hourlyRate 		: userdata.hourrate ? userdata.hourrate : '0',
					type 			: userdata.type ? userdata.type : '',
					imageList       : imageList,	
					imageNameList   : images,
					latitude 		: userdata.latitude ? userdata.latitude : "",
					longitude 		: userdata.longitude ? userdata.longitude : "",
	            }
        res.status(200).send({success:true,message:"Vartotojas sėkmingai persikėlė",data:data});
    }
    else{
        res.status(401).send({success:false,message:"Kažkas negerai!"});
    }
}
userController.update = function(req,res){
    var form = new formidable.IncomingForm();
    let id           	 = req.id;
    let profileImage 	 = req.profile_image;
    let name 		 	 = '';
    let lastName 	 	 = '';
    let email 		 	 = '';
    let phone 		 	 = '';
    let address 	 	 = '';
    let city 		 	 = '';
    let bank_ac_no 	 	 = '';
    let lat 		 	 = '';
    let long 		 	 = '';
    let taxPay 		 	 = 0;
    let serviceName  	 = '';
    let specialty 	 	 = '';
    let otherServiceName = '';
    let otherSpecialty 	 = '';
	let aboutMe 		 = '';
	let service 		 = '';
	let hourlyRate 		 = 0;
	let type 			 = '';
	let houseNumber = "";
    form.parse(req, function (err, fields, files) {
        email 	= fields.email;
        lat 	= req.latitude;
        long 	= req.longitude;
      	aboutMe = fields.aboutMe;
		houseNumber = fields.houseNumber;
		hourlyRate = fields.hourlyRate;
		type = fields.type;
		taxPay = Number(fields.taxPay);
		if(!fields.email) {
	        return  res.send({success:false,message:"Įveskite el. Pašto adresą"});
	    }
        if (fields.name && fields.name!="undefined" && fields.name!=undefined && fields.name!=null) {
	        name = fields.name;
	    }
	    if (fields.lastName && fields.lastName!="undefined" && fields.lastName!=undefined && fields.lastName!=null) {
	        lastName = fields.lastName;
	    }
	    if (fields.phone && fields.phone!="undefined" && fields.phone!=undefined && fields.phone!=null) {
	        phone = fields.phone;
	    }
	    if (fields.address && fields.address!="undefined" && fields.address!=undefined && fields.address!=null) {
	        address = fields.address;
	    }
	    if (fields.city && fields.city!="undefined" && fields.city!=undefined && fields.city!=null) {
	        city = fields.city;
	    }
	    if (fields.bank_ac_no && fields.bank_ac_no!="undefined" && fields.bank_ac_no!=undefined && fields.bank_ac_no!=null) {
	        bank_ac_no = fields.bank_ac_no;
	    }
	    if (fields.latitude && fields.latitude!="undefined" && fields.latitude!=undefined && fields.latitude!=null) {
	        lat = fields.latitude;
	    }
	 	if (fields.longitude && fields.longitude!="undefined" && fields.longitude!=undefined && fields.longitude!=null) {
	        long = fields.longitude;
	    }
	    if (fields.specialty && fields.specialty!="undefined" && fields.specialty!=undefined && fields.specialty!=null) {
	        specialty = fields.specialty;
	    }
	    if (fields.otherSpecialty && fields.otherSpecialty!="undefined" && fields.otherSpecialty!=undefined && fields.otherSpecialty!=null) {
	        otherSpecialty = fields.otherSpecialty;
	    }
	    let imageList = [];
	    let itemList = [];
	    Users.isEmailUniue(email,req.id).then(result=>{
	        if(result.length>0){
	            return res.status(200).send({success:false,message:"El. Paštas jau registruotas"});
	        }
	        else{
	        	Object.keys(files).forEach(element=>{
		        	let image = new Date().getTime() + Math.floor(Math.random() * Math.floor(100)) + files[element].name;
		        	let oldpath = files[element].path;
			        let temp_newpath = tempImagePath + image;
			        if(files[element].name){
				        if(element == 'profile_image') {
				        	profileImage = image;
				        }
				        else if(element.startsWith("image")) {
				        	imageList.push(image);
							itemList.push(element);
				        }
				        else {
				        	Users.InsertUserDocument(req.id,image,files[element].name);
				        }
				        fs.rename(oldpath, temp_newpath,(err)=>{});
				        userController.compressImage(temp_newpath,imagePublicPath);
			        }
		        });
		        for(let i = 0; i < 4; i++) { 
					if(!itemList.includes("image["+i+"]")){
						if(fields["image["+i+"]"] != 'null' && fields["image["+i+"]"]!=""){
							imageList.push(fields["image["+i+"]"]);	
						}
					}
				}
	       		Users.update(id,name,lastName,email,phone,address,city,profileImage,bank_ac_no,lat,long,serviceName,specialty,otherServiceName,otherSpecialty,aboutMe,service,hourlyRate,JSON.stringify(imageList),type,taxPay,houseNumber).then(async (result)=>{	       			
		        	if (result) {
		            	let isApproved = await Users.getUserById(id).then(result=>{
		          			let approved = 0;
		          			if(result.length > 0){
		          				approved = result[0].isApproved;
		          			}				 
		          			return approved;         			
				        });
			            if(isApproved==1) {
				            res.status(200).send({success:true,message:"Informacija atnaujinta sėkmingai"});
			            }else {
				            res.status(200).send({success:false,message:"Laukiama patvirtinimo"});
			            }
			        }
			        else {
			            res.status(200).send({success:false,message:"Klaida, bandykite dar kartą."});
			        }
			    });     
	        }
	    });
	});
}
userController.deleteDocument = function (req,res){
	if(!req.body.document_id){
		return res.send({success:false, message:'Reikia dokumento ID!'});
	}
	Users.deleteUserDocument(req.body.document_id).then(result => {
		if(result){
			res.status(200).send({success:true , message:'Dokumentas ištrintas'});
		}
		else{
			res.status(500).send({success:false, message:'Kažkas negerai!'});
		}
	});	
}
userController.isEmailExist = function (req,res){
	if(!req.body.email){
		return res.status(200).send({success:false , message:'Įveskite el. Pašto adresą'});
	}
	Users.isEmailUniue(req.body.email,req.body.userId).then(result=>{
	    if(result.length > 0){
	     	return res.status(200).send({success:false,message:"El. Paštas jau registruotas"});
     	}
     	else {
     		return res.status(200).send({success:true,message:"El. Paštas neregistruotas"});
	    }
	});
}
userController.storeUserTimeStore = async function(req,res){
	try {
		let timesheet = req.body.timesheet;
		let selectedDates = req.body.selectedDates;
		let userId = req.body.userId;
		Users.deleteTimeSheetDateWise(selectedDates,userId).then(result=>{
			if(result){
				timesheet.forEach(element => {
					Users.insertUserTimesheet(userId,element.date,element.start,element.end);			
				});		
				res.send({success:true, message: "Valandos išsaugotos sėkmingai"})
			}
			else{
				res.send({success:false, message: "Klaida, bandykite dar kartą."})
			}
		});
	}catch(error){
		console.log(error);
		res.send({success:false, message: "Klaida, bandykite dar kartą."})
	}	
}
userController.getUserTimeStore = function(req,res){
	if(req.body.startDate && req.body.endDate){
		let startDate	= dateFormat(req.body.startDate, "yyyy-mm-dd");
		let endDate 	= dateFormat(req.body.endDate, "yyyy-mm-dd");
		let sheet = [];
		Users.getUserTimesheet(req.id,startDate,endDate).then(findRes =>{
			findRes.forEach(element => {
				sheet.push({
					date : element.date,
					start : element.start,
					end:element.end
				});
			});
			res.send({success:true, message: "Vartotojo laiko apskaitos žiniaraštis buvo grąžintas",data:sheet});
		});
	}
	else{
		let sheet = [];
		Users.getUserFullTimesheet(req.id).then(findRes =>{
			findRes.forEach(element => {
				sheet.push({
					date : element.date,
					start : element.start,
					end:element.end
				});
			});
			res.send({success:true, message: "Vartotojo laiko apskaitos žiniaraštis buvo grąžintas",data:sheet});
		});
	}
}
userController.getUserTimeSheetbyId = function(req,res) {
	if(!req.body.user_id){
		return res.status(200).send({success:false, message:'Reikalingas vartotojo ID!'});
	}
	if(req.body.startDate && req.body.endDate){
		let startDate	= dateFormat(req.body.startDate, "yyyy-mm-dd");
		let endDate 	= dateFormat(req.body.endDate, "yyyy-mm-dd");
		let sheet = [];
		Users.getUserTimesheet(req.body.user_id,startDate,endDate).then(findRes =>{
			findRes.forEach(element => {
				sheet.push({
					date : element.date,
					start : element.start,
					end:element.end
				});
			});
			res.send({success:true, message: "Vartotojo laiko apskaitos žiniaraštis buvo grąžintas",data:sheet});
		});
	}
	else{
		let sheet = [];
		Users.getUserFullTimesheet(req.body.user_id).then(findRes =>{
			findRes.forEach(element => {
				sheet.push({
					date : element.date,
					start : element.start,
					end:element.end
				});
			});
			res.send({success:true, message: "Vartotojo laiko apskaitos žiniaraštis buvo grąžintas",data:sheet});
		});
	}
}
userController.getUserTimeSheetHour = async function(req,res){
	if(!req.body.user_id){
		return res.status(200).send({success:false, message:'Reikalingas vartotojo ID!'});
	}
	if(!req.body.date){
		return res.status(200).send({success:false, message:'Būtina data!'});
	}

	let dates = req.body.date;
	let datesArr = [];
	let dateExist = [];
	let idList = [];
	let user = {};
	let timeSheet = [];
	let hireDates = [];
	let errorMessage = "";
	let options = {
	    day: "numeric",
	    month: "long"
	};
	let userHired = 0;
	Booking.getUserDetailsById(req.body.user_id).then(response=>{
		if(response) {
			user = response[0];
		}
	});
	Booking.getTimeSheetByUserId(req.body.user_id).then(response=>{
		if(response) {
			response.forEach(element=>{
				timeSheet.push({date:element.date,start:element.start,end:element.end});
			});
		}
	});

			Booking.getAllHireList().then(result=>{
				if(result){
					dates.forEach((datelist)=>{
						result.forEach((ele)=>{
							const array = JSON.parse(ele.dates);
							array.forEach(element=> {
								if(datelist == element.date){
									if(hireDates[element.date]){
										hireDates[element.date].push({"id":ele.id,"isHired":ele.isHired,"date":element.date,"start":element.start,"end":element.end});
									}
									else{
										hireDates[element.date] = []; 
										hireDates[element.date].push({"id":ele.id,"isHired":ele.isHired,"date":element.date,"start":element.start,"end":element.end});
									}
									if(ele.isHired) {
										userHired = 1;
									}
								}
							});
						});
					});
					if(userHired){
						for(const index in hireDates){	
							const timeSheetDetails = timeSheet.find(element=>element.date==hireDates[index][0].date);
							const availableStartTime = timeSheetDetails.start.split(":");
							const availableEndTime = timeSheetDetails.end.split(":");
							const tempDats = new Date(timeSheetDetails.date).toLocaleDateString("lt", options);
							errorMessage += user.name + " gali dirbti " + tempDats + " nuo " + availableStartTime[0] + ":" + availableStartTime[1] +  " į " + availableEndTime[0] + ":" + availableEndTime[1] + " tačiau turi užsakymą nuo ";
							hireDates[index].forEach((element,index)=>{
								if(element.isHired) {
									let selectedStartTime = element.start.split(":");
									let selectedEndTime = element.end.split(":");
									errorMessage +=  selectedStartTime[0] + ":" + selectedStartTime[1] + " iki " + selectedEndTime[0] + ":" + selectedEndTime[1] + ",";	
								}		
							});	
						}
					}
				}
			});


	dates.forEach(async (element) => {
		await Users.UserTimesheetCheck(req.body.user_id,element).then(checkRes =>{
			if (checkRes.length > 0) {
				datesArr.push({
					date 		: checkRes[0].date ? checkRes[0].date : '',
					fromTime 	: checkRes[0].start ? checkRes[0].start : '',
					toTime 		: checkRes[0].end ? checkRes[0].end : '',
				});
			}
		});
	});
	setTimeout(()=>{
		return res.status(200).send({success:true , message:errorMessage, data : datesArr});
	},3000);
}
userController.getUser = async function(req,res){
	var mediaUlr 			= req.protocol+"://"+req.headers.host+'/media/';
	if(!req.body.user_id){
		return res.status(200).send({success:false , message:'Įveskite vartotojo ID'});
	}
	let user = await Users.getUserById(req.body.user_id).then(result => {
		if(result){
			if(result.length > 0){
				var string      = JSON.stringify(result);
	            var result   = JSON.parse(string)[0];
	            return result;
			}
		}
		else{
			return res.status(500).send({success:false , message:'Kažkas negerai!'});
		}
	});
	if(user){
		let imageList = [];
		if(user.image){
			const images = JSON.parse(user.image);
			images.forEach((element,value)=>{
				if(element!=""){
					imageList.push(mediaUlr + element);
				}
			});
		}
		let rating = await Users.getUserAvgRatings(user.id).then(rates => {
							var string  = JSON.stringify(rates);
			           		var rates   = JSON.parse(string)[0];
							return rates.rating;
						});
		let review = await Users.getUserReview(user.id).then(review => {
						let tempReview = [];
						review.forEach(element => {
							tempReview.push({
								id 		: element.id,
								image 	: (element.profile_image ? (mediaUlr + element.profile_image) : (mediaUlr+'user.png')),
								name  	: element.name,
								rating 	:element.ratings,
								review 	:element.review
							});
						});
						return tempReview;
		});
		let specialty = "";
		if(user.specialty=='Kitas') {
			if(user.otherSpecialty !="" && user.otherSpecialty !="null" && user.otherSpecialty !="undefined" && user.otherSpecialty !=undefined && user.otherSpecialty !=null) {
				specialty = user.otherSpecialty; 
			}
		}
		else {
			if(user.specialty !="" && user.specialty !="null" && user.specialty !="undefined" && user.specialty !=undefined && user.specialty !=null) {
				specialty =user.specialty; 
			}	
		}

		address = "";
		if(user.address){
			address = user.address;
		}
		// if(user.city){
		// 	if(address == ""){
		// 		address = user.city;
		// 	}
		// 	else {
		// 		address +=", "+user.city;
		// 	}
		// }

		let fees = 0;
		let hourrate = 0;
		fees = Number((user.hourrate * tax ) / 100);
		hourrate = Number(Number(Number(user.hourrate) + Number(fees)).toFixed(2));
		let firstname = user.name ? user.name : ''; 	
		let lastname = user.last_name ? user.last_name : ''; 	
		let companyName = user.companyName ? user.companyName : ''; 	
		let name = firstname ? (firstname + " "+ lastname) : companyName;
		let data = {
			profile_image 	: user.profile_image ? mediaUlr+user.profile_image : mediaUlr+'user.png',
			name 			: name,
			rating 			: rating ? rating : 0,
			about			: user.about_me ? user.about_me : '',
			review 			: review,
			imageList       : imageList,
			specialty       : specialty,
			hourrate        : hourrate,
			address:address
		}
		return res.status(200).send({success:true , message:'Vartotojas sėkmingai grįžta atgal',data:data});
	}
	else{
		return res.status(200).send({success:false , message:'Vartotojas nerastas!'});	
	}
}
userController.getAboutMe = async function(req,res){
	let mediaURL = req.protocol+"://"+req.headers.host+'/media/';
	let user = await Users.getUserById(req.id).then(result => {
					if(result){
						var string      = JSON.stringify(result);
			            var result   = JSON.parse(string)[0];
			            return result;
					}
					else{
						return res.status(500).send({success:false , message:'Kažkas negerai!'});
					}
				});
				let imageList = [];
				let image = [];
				let images = [];
				if(user.image){
					image = JSON.parse(user.image);
					image.forEach(element=>{
						if(element!=""){
							imageList.push(mediaURL + element);
							images.push(element);
						}
					});
				}
				setTimeout(()=>{
					let data = {
						aboutMe : user.about_me,
						service : user.service,
						hourlyRate : user.hourrate,
						type : user.type,
						imageList:imageList,	
						imageNameList:images
					}
					return res.status(200).send({success:true , message:'Apie mane sėkmingai grįžti',data:data});			
				},1000);	
}
userController.saveAboutMe = function(req,res){
	/*let aboutMe = req.body.aboutMe;
	let service = req.body.service;
	let hourlyPrice = req.body.hourlyRate;
	if (isNaN(hourlyPrice)) {
		return res.status(200).send({success:true , message:'Valandos įkainis turi būti skaičius'});
	}*/
	    let imageList = [];
		let form = new formidable.IncomingForm();
    	let itemList = [];
    	form.parse(req, (err, fields, files) => {    		
    		Object.keys(files).forEach(element=> {
				let image = new Date().getTime()+ Math.floor(Math.random() * Math.floor(100)) + files[element].name;
				let oldpath = files[element].path;
				let newpath = imagePublicPath + image;
				imageList.push(image);
				fs.rename(oldpath, newpath,(err)=>{});
				itemList.push(element);
			});
    		for(let i = 0; i < 4; i++) { 
    			if(!itemList.includes("image["+i+"]")){
    				if(fields["image["+i+"]"] != 'null'){
    					imageList.push(fields["image["+i+"]"]);	
    				}
    			}
    		}
    		let aboutMe = fields.aboutMe;
    		let service = fields.service;
    		let hourlyRate = fields.hourlyRate;
    		let type = fields.type;
    		let taxPay = Number(fields.taxPay);
    		Users.saveAboutMe(req.id,aboutMe,service,hourlyRate,JSON.stringify(imageList),type,taxPay).then(result => {
				if (result) {
					return res.status(200).send({success:true , message:'Informacija atnaujinta sėkmingai'});
				}
				else{
					return res.status(500).send({success:false , message:'Kažkas negerai!'});
				}
			});
    	});


	
}
userController.getUserdetails =  async function(req,res){
	var mediaUlr 			= req.protocol+"://"+req.headers.host+'/media/';
	if(!req.body.user_id){
		return res.status(200).send({success:false,message:'Reikalingas vartotojo ID'});
	}
	if(!req.body.hireId){
		return res.status(200).send({success:false,message:'Reikia samdyti ID'});
	}
	let userAvgRating = await Users.getUserAvgRatings(req.body.user_id).then(rates => {
		var string  = JSON.stringify(rates);
   		var rates   = JSON.parse(string)[0];
		return rates;
	});
	 var options = {
        day: "numeric",
        month: "long"
    };
	let day =  await Booking.getUserHireDayByid(req.body.hireId).then(result => {
		result = JSON.parse(result[0].dates);
		let tempDats = '';
		if(result.length == 1){
			tempDats = new Date(result[0].date).toLocaleDateString("lt", options);
		}
		else{
			let minDate = result[0].date;
			let maxDate = result[0].date;
			result.forEach(element =>{
				maxDate = element.date > maxDate ? element.date : maxDate;
				minDate = element.date < minDate ? element.date : minDate;
			});
			tempDats = new Date(minDate).toLocaleDateString("lt", options) +' - '+ new Date(maxDate).toLocaleDateString("lt", options);
			
		}
		return tempDats;
	});
	let price = await Users.getUserById(req.body.user_id).then(userRes =>{        
		return userRes[0].hourrate ? userRes[0].hourrate : 0;
	});
	let totalTime = await Booking.getUserHireDayByid(req.body.hireId).then(days =>{
		result = days[0].dates;
		let jsonResult = JSON.parse(result);
		let tempTotalTime = 0;
		jsonResult.forEach(async (element) => {
			let startTime = element.start.split(":");
			let endTime = element.end.split(":");
			let startDateTime = new Date();
			let endDateTime = new Date();
			startDateTime.setHours(startTime[0],startTime[1]);	
			endDateTime.setHours(endTime[0],endTime[1]);	
			var dif = ( endDateTime - startDateTime ) / 1000 / 60 / 60;
			tempTotalTime += dif;
		});
		return tempTotalTime;
	});

	const userDetails = await Users.getUserById(req.body.user_id).then(result =>{
		return result.length > 0 ? result[0] : false;  
	});
	if(userDetails){

	}
	let servicePrice = Number(totalTime * price).toFixed(2);
	let feesPrice = Number((servicePrice * tax) / 100).toFixed(2);
	let feesAmount = Number(Number(servicePrice) + Number(feesPrice)).toFixed(2);
	let taxPay = 0; 
	let totalPrice = 0;
	Users.getUserById(req.body.user_id).then(result =>{
		if(result){
			if (result.length > 0) {
				var string  	= JSON.stringify(result);
				var result   	= JSON.parse(string)[0];			
				let data = {
						user_id 		: result.id,
						name 			: result.name ? result.name : '',
						profile_image 	: result.profile_image ? mediaUlr+result.profile_image : mediaUlr+'user.png',
						ratings 		: userAvgRating.rating ? userAvgRating.rating : 0 ,
						city			: result.city ? result.city : '',
						day				: day,
						work			: result.service ? result.service : '',
						service_name	: day+' '+(result.service ? result.service : ''),
						fee				: feesPrice,
						service_price	: servicePrice,
						totalHour		: totalTime,
						price			: feesAmount,
						taxPay			: result.taxPay ? result.taxPay : '0',
						termCondition 	: "N/A"
						//opayEncodeCode  : opayEncodeCode
					}					
				return res.status(200).send({success:true,message:'Vartotojo informacija buvo atgauta',data:data});
			}
			else {
				return res.status(200).send({success:true,message:'Vartotojas nerastas!'});
			}
		}
		else {
			return res.status(500).send({success:false,message:'Kažkas nutiko'});
		}
	});
}
userController.getUserReview =  async function(req,res){
	var mediaUlr 			= req.protocol+"://"+req.headers.host+'/media/';
	let offset = 0;
	if(!req.body.user_id){
		return res.status(200).send({success:false,message:'Reikalingas vartotojo ID!'});
	}
	if(req.body.page && req.body.page > 0){
		offset = (req.body.page-1)*10;
	}
	let totalReview = await Users.getUserReview(req.body.user_id);
	let totalPage = Math.ceil(totalReview.length/10);

	Users.getUserReviewPaginate(req.body.user_id,10,offset).then(review => {
		if (review) {
			let tempReview = [];
			review.forEach(element => {
				tempReview.push({
					id 		: element.id,
					image 	: element.profile_image ? (mediaUlr + element.profile_image) : mediaUlr+'user.png',
					name  	: element.name,
					rating 	:element.ratings,
					review 	:element.review
				});
			});			
			return res.status(200).send({success:true,message:'Peržiūra gauta',data:tempReview, pagination: totalPage});
		}
		else{
			return res.status(500).send({success:false,message:'Kažkas nutiko'});
		}
	});

}
userController.storeUserReview =  async function(req,res){
	if(!req.body.user_id){
		return res.status(200).send({success:false,message:'Reikalingas vartotojo ID!'});
	}
	if(!req.body.message){
		return res.status(200).send({success:false,message:'Įveskite apžvalgą!'});
	}
	if(!req.body.ratings){
		return res.status(200).send({success:false,message:'Prašome pasirinkti įvertinimus!'});
	}
	if (!Number(req.body.ratings)) {
		return res.status(200).send({success:false,message:'Įvertinimas turi būti skaičiuojamas!'});
	}
	if (!req.body.bookingId) {
		return res.status(200).send({success:false,message:'Būtina rezervuoti ID!'});
	}
	Booking.getBookingById(req.body.bookingId).then(result =>{
		if (result.length > 0) {
			if(result[0].hasReview==0){
				if(result[0].user_id==req.id){
					Users.updateReviewStatus(req.body.bookingId).then(res=>{console.log("response",res)});
					Users.storeUserReview(req.body.bookingId,result[0].booked_user_id,result[0].user_id,req.body.ratings,req.body.message).then(result => {
						if (result) {
							return res.status(200).send({success:true,message:'Išsaugoti sėkmingai'});
						}
						else {
							return res.status(500).send({success:false,message:'Kažkas negerai!'});
						}
					});
				}
				else {
					return res.status(200).send({success:false,message:'Netinkamas vartotojas'});
				}
			}
			else {
				return res.status(200).send({success:false,message:'Apžvalga jau egzistuoja'});
			}
		}
		else {
			return res.status(500).send({success:false,message:'Kažkas negerai!'});
		}
	});
}
userController.subcribe =  async function(req,res){
	if(!req.body.email){
		return res.status(200).send({success:false,message:'Prašau atsiųsti el. laišką!'});
	}
	Users.subscribe(req.body.email).then(result =>{
		if(result){
			Mail.subscribe(req.body.email);
			res.status(200).send({success:true,message:'Prenumerata sėkminga'});
		}
		else{
			res.status(500).send({success:true,message:'Kažkas negerai!'});
		}
	});
}
userController.verifyToken =  async function(req,res){
	if(!req.body.token){
		return res.status(200).send({success:false,message:'Būtina naudoti prieigos raktą!'});
	}
	Users.getToken(req.body.token).then(result => {
		if (result.length) {
			Users.activateUser(result[0].user_id).then(resultUser => {
				if (resultUser) {
					Users.deleteToken(result[0].id);
					return res.status(200).send({success:true,message:'Paskyra aktyvuota sėkmingai!'});
				}
				else{
					return res.status(500).send({success:false,message:'Kažkas negerai!'});
				}
			});
		}
		else{
			return res.status(200).send({success:false,message:'Netinkamas prieigos raktas!'});
		}
	});
}
userController.forgotPassword =  async function(req,res){
	if (!req.body.email) {
		return res.status(200).send({success:false,message:'Būtinas el. paštas!'});
	}
	Users.getUserByEmail(req.body.email).then(user => {
		if (user) {
			if (user.length) {
				Mail.forgotPasswordMail(user[0].email,user[0].id);
				return res.status(200).send({success:true,message:'El. Laiškas išsiųstas sėkmingai!'});
			}
			else{
				return res.status(200).send({success:false,message:'Vartotojas nerastas!'});
			}
		}
		else{
			return res.status(500).send({success:false,message:'Kažkas negerai!'});
		}
	});
}
userController.resetPassword =  async function(req,res){
	if (!req.body.token) {
		return res.status(200).send({success:false,message:'Reikalingas prieigos raktas!'});
	}
	if (!req.body.newpassword) {
		return res.status(200).send({success:false,message:'Reikalingas naujas slaptažodis!'});
	}
	let password = md5(req.body.newpassword);
	Users.getResetToken(req.body.token).then(token =>{
		if (token) {
			if (token.length) {
				Users.changePassword(token[0].user_id,password).then(user => {
					if (user) {
						Users.deleteResetToken(token[0].id);
						return res.status(200).send({success:true,message:'Slaptažodis sėkmingai pakeistas!'});
					}
					else{
						return res.status(500).send({success:false,message:'Kažkas negerai!'});
					}
				});
			}
			else{
				return res.status(200).send({success:false,message:'Netinkamas iš naujo nustatyti prieigos raktą!'});
			}
		}
		else{
			return res.status(500).send({success:false,message:'Kažkas negerai!'});
		}
	});
}

userController.getUserAllDetails =  async function(req,res){
	try{
		console.log("req",req.headers['x-access-token']);
	let mediaUrl   = req.protocol+"://"+req.headers.host+'/media/';
	let offset = 0;
	if(!req.body.user_id){
		return res.status(200).send({success:false,message:'Reikalingas vartotojo ID!'});
	}
	if(req.body.page && req.body.page > 0){
		offset = (req.body.page-1)*10;
	}
    if(req.id){
    	let userdata = await Users.getUserById(req.body.user_id).then(result=>{
            let string      = JSON.stringify(result);
            let UserArray   = JSON.parse(string);
            return UserArray[0];
        });

		let imageList = [];
		let image = [];
		let images = [];
		if(userdata.image){
			image = JSON.parse(userdata.image);
			image.forEach(element=>{
				if(element !=""){
					imageList.push(mediaUrl + element);
					images.push(element);
				}
			});
		}
    	let userDocs = await Users.getUserDocument(req.body.user_id).then(result => {
			            	let temp_docs = [];
			            	result.forEach(element =>{
			            		temp_docs.push({
			            			id:element.id,
			            			name : element.name ? element.name : '',
			            			document : mediaUrl + element.document
			            		});	
			            	});
			            	return temp_docs;
				    	});
    	let totalReview = await Users.getUserReview(req.body.user_id);
		let totalPage = Math.ceil(totalReview.length/10);
		let reviewList = await Users.getUserReviewPaginate(req.body.user_id,10,offset).then(review => {
				let tempReview = [];
				if (review) {
					review.forEach(element => {
						tempReview.push({
							id 		: element.id,
							image 	: element.profile_image ? mediaUrl + element.profile_image  : mediaUrl + 'user.png',
							name  	: element.name,
							rating 	: element.ratings,
							review 	: element.review
						});
					});
				}
				return tempReview;	
		});
		let timesheetDateList =  await Users.getUserFullTimesheet(req.body.user_id).then(findRes =>{
			let timeSheet = [];
			findRes.forEach(element => {
				timeSheet.push({
					date : element.date,
					start : element.start,
					end:element.end
				});
			});	
			return timeSheet;	
		});		
		let data = {
            id          	: userdata.id,
            profileimage 	: userdata.profile_image ? mediaUrl+userdata.profile_image : mediaUrl+'user.png',
            name        	: userdata.name ? userdata.name : '',
            lastName    	: userdata.last_name ? userdata.last_name : '',
            email       	: userdata.email ? userdata.email : '',
            phone       	: userdata.phone ? userdata.phone : '',
            address     	: userdata.address ? userdata.address : '',
            city 	    	: userdata.city ? userdata.city : '',
            houseNumber    	: userdata.houseNumber ? userdata.houseNumber : '',
            taxPay 	    	: userdata.taxPay ? userdata.taxPay : '0',
            aboutMe 	    : userdata.about_me ? userdata.about_me : '',
            service 	    : userdata.service ? userdata.service : '',
            serviceName     : userdata.serviceName ? userdata.serviceName : '',
            otherServiceName : userdata.otherServiceName ? userdata.otherServiceName : '',
            specialty 	    : userdata.specialty ? userdata.specialty : '',
            otherSpecialty 	: userdata.otherSpecialty ? userdata.otherSpecialty : '',
            hourlyRate 	    : userdata.hourrate ? userdata.hourrate : '',
            type 	    	: userdata.type ? userdata.type : '',
            bank_ac_no		: userdata.bank_ac_no ? userdata.bank_ac_no : '',
            uploaded_docs 	: userDocs,
            reviewList 		: reviewList,
            pagination      : totalPage,
            imageList       : imageList,	
			imageNameList   : images,
            timesheetDateList : timesheetDateList,
            latitude 		: userdata.latitude ? userdata.latitude : "",
			longitude 		: userdata.longitude ? userdata.longitude : "",
	    }
	    return res.status(200).send({success:true,message:'sėkmingai gauti informaciją',data:data});
	}
	else{
		return res.status(200).send({success:false,message:'Kažkas negerai!'});
	}
	}catch(error){
		console.log("Error",error);
		return res.status(200).send({success:false,message:'Kažkas negerai!'});
	}
}

userController.checkUserJobPost =  async function(req,res){
	try {
		if(req.id){
			Users.getjobsByUserId(req.id).then(result=>{
				if(result.length > 0) {
					return res.status(200).send({success:true,message:'Sėkmingai gaukite vartotoją',isJobPosted:true});
				}
				else {
					return res.status(200).send({success:true,message:'Sėkmingai gaukite vartotoją',isJobPosted:false});
				}
			});	
		}
	}
	catch(error) {
		return res.status(200).send({success:false,message:'Kažkas negerai!'});
	}
}

userController.addUserChat = async function(req,res){
	if (!req.body.userId) {
		return res.status(200).send({success:false,message:'Reikalingas vartotojo ID'});
	}
	try {
		Users.checkUserChat(req.id,req.body.userId,req.body.postJobId).then(result=>{
			if(result.length>0) {
				Users.getUserById(req.body.userId).then(result=>{
					if(result.length > 0){
						Mail.messageToUser(result[0].email);
					}
				});	
				return res.status(200).send({success:true,message:'Sėkmingai saugoti'});
			}
			else {
				Users.addUserChat(req.id,req.body.userId,req.body.postJobId).then(result=>{
					console.log("result add user",result);
					if(result) {
						Users.getUserById(req.body.userId).then(result=>{
							if(result.length > 0){
								Mail.messageToUser(result[0].email);
							}
						});	
						return res.status(200).send({success:true,message:'Sėkmingai saugoti'});
					}
					else {
						return res.status(200).send({success:false,message:'Kažkas negerai!'});
					}
				});
			}
		});
	}
	catch(error) {
		return res.status(200).send({success:false,message:'Kažkas negerai!'});
	}
}

userController.socialLogin = function(req,res){
    try{
    let email     = req.body.email;
    let appId     = req.body.appId;
    let name      = req.body.name;
    let loginType = req.body.loginType;
    let userType  = req.body.userType;
	Users.checkSocialLogin(appId).then(json=>{
		if(json.length > 0) {
			jwtAuth.createToken(json[0].id).then(result=>{
               let data = {
                    id          : json[0].id, 
                    email       : json[0].email, 
                    companyName : json[0].companyName ? json[0].companyName : '', 
                    companyCode : json[0].companyCode ? json[0].companyCode : '', 
                    sector      : json[0].sector ? json[0].sector : '', 
                    userType    : json[0].userType,
                    isJobPosted	: 0,
                    _token      : result
                };
                res.status(200).send({success:true,message:"Prisijungimas sėkmingai!", data:data});
        	});	       
		}
		else {
			Users.socialLogin(name,appId,userType,email,loginType).then(result=>{
				if(result) {
					Users.getUserById(result.insertId).then(json=>{
						if(json.length > 0){
							jwtAuth.createToken(json[0].id).then(result=>{
				               let data = {
				                    id          : json[0].id, 
				                    email       : json[0].email, 
				                    companyName : json[0].companyName ? json[0].companyName : '', 
				                    companyCode : json[0].companyCode ? json[0].companyCode : '', 
				                    sector      : json[0].sector ? json[0].sector : '', 
				                    userType    : json[0].userType,
				                    isJobPosted	: 0,
				                    _token      : result
				                };
				                res.status(200).send({success:true,message:"Prisijungimas sėkmingai!", data:data});
				        	});	
						}
						else{
							return res.status(200).send({success:false,message:'Klaida, bandykite dar kartą.'});
						}
		        	});	
	        	}
	        	else {
					return res.status(200).send({success:false,message:'Klaida, bandykite dar kartą.'});
	        	}	
			});
		}
	});    
    }
	catch(error) {
		return res.status(200).send({success:false,message:'Klaida, bandykite dar kartą.'});
	}
}

userController.compressImage = function(inputPath,outputPath){
	 compress_images(inputPath,outputPath,{compress_force: false, statistic: true, autoupdate: true}, false,
        {jpg: {engine: 'mozjpeg', command: ['-quality', '20']}},
        {png: {engine: 'pngquant', command: ['--quality=20']}},
        {svg: {engine: 'svgo', command: '--multipass'}},
        {gif: {engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']}}, function(error, completed, statistic){
    });
}



userController.checkUserOneDay = function(){
	previousDate = new Date();
	previousDate.setDate(previousDate.getDate() - 1);
	Users.getBookingByDate(previousDate).then(result=>{
		if(result.length>0){
			result.forEach(element=>{
				Mail.sendMailAfterOneDayToDeveloper(element.developerEmail);
				Mail.sendMailAfterOneDayToCompany(element.companyEmail);
			});
		}
	});
	date = dateFormat(previousDate, "yyyy-mm-dd");
	Users.getAllBookingJobWise(date).then(result=>{
		if(result.length>0){
			result.forEach(element=>{
				Mail.sendFrelanceReviewMail(element.bookingId,element.frelancerEmail);
				Mail.reviewMail(element.userId,element.bookingId,element.email);
			});
		}
	});
	Users.getBookingByDayWise().then(result=>{
		if(result.length>0){
			result.forEach(ele=>{
				let datelist = JSON.parse(ele.hireList);
				let maxDate = datelist[0].date;
				datelist.forEach(element =>{
					maxDate = element.date > maxDate ? element.date : maxDate;
				});
				if(maxDate==date){
					Mail.sendFrelanceReviewMail(ele.bookingId,ele.frelancerEmail);
					Mail.reviewMail(ele.userId,ele.bookingId,ele.email);
				}
			});
		}
	});
}
userController.getTimeSheetByStartDate = async function(req,res){
	try{    
		if(!req.body.startDate){
			return res.status(200).send({success:false,message:'Reikalinga pradžios date.'});
		}
		if(!req.body.userId){
			return res.status(200).send({success:false,message:'Reikalingas vartotojo ID'});
		}
		let date = new Date(req.body.startDate);
		let datelist = [];
		let datetimelist = [];
		let data = [];
		for(let i=0;i < 7; i++) {
			datelist.push(dateFormat(new Date(new Date(date).setDate(date.getDate() + i)),"yyyy-mm-dd"));
		}
		let hirelist = await Booking.getAllHire(req.body.userId).then(result=>{
			return result.length > 0 ? result : [];
		});
		let timesheetlist = await Users.getTimeSheetList(datelist,req.body.userId).then(result=>{
			return result.length > 0 ? result : [];		
		});
		let isExist = false;
		let isDisable = false;
		timesheetlist.forEach((element,index)=>{
			if(Array.isArray(datetimelist[element.date])){
				datetimelist[element.date].push({"date":element.date,"start":element.start,"end":element.end}); 
			}	
			else {
				datetimelist[element.date] = [];
				datetimelist[element.date].push({"date":element.date,"start":element.start,"end":element.end});
			}	
		});		
		datelist.forEach((element,index)=>{
			data[index] = [];
			if(Array.isArray(datetimelist[element])) {
				datetimelist[element].forEach(ele=>{
					isDisable = false;
					hirelist.forEach((hireelement)=>{
						const array = JSON.parse(hireelement.dates);
						array.forEach(dateelement=> {
							if(dateelement.date == element && dateelement.start == ele.start && dateelement.end == ele.end) {
								isDisable = true;						
							}
						});
					});				
					data[index].push({start:ele.start,end:ele.end,isDisable:isDisable,isExist:true});				
				});
			}
		});
		return res.status(200).send({success:true,message:'Sėkmingai įsigykite laiko saugyklą',data:data});
	}
	catch(error) {
		console.log(error);
		return res.status(200).send({success:false,message:'Klaida, bandykite dar kartą.'});
	}
}


userController.getUserTimesheet = async function(req,res){
	try{    
		if(!req.body.startDate){
			return res.status(200).send({success:false,message:'Reikalinga pradžios date.'});
		}
		if(!req.body.userId){
			return res.status(200).send({success:false,message:'Reikalingas vartotojo ID'});
		}
		let date = new Date(req.body.startDate);
		let datelist = [];
		let datetimelist = [];
		let data = [];
		for(let i=0;i < 7; i++) {
			datelist.push(dateFormat(new Date(new Date(date).setDate(date.getDate() + i)),"yyyy-mm-dd"));
		}
		for(let i=6;i < 22; i++) {
			datetimelist.push({"start":dateFormat(new Date().setHours(i,0),"HH:MM"),"end":dateFormat(new Date().setHours(i,30),"HH:MM")});
			datetimelist.push({"start":dateFormat(new Date().setHours(i,30),"HH:MM"),"end":dateFormat(new Date().setHours(i+1,0),"HH:MM")});			
		}
		let timesheetlist = await Users.getTimeSheetList(datelist,req.body.userId).then(result=>{
			return result.length > 0 ? result : [];		
		});
		let isExist = false;
		timesheetlist.forEach((element,index)=>{
			if(Array.isArray(datetimelist[element.date])){
				datetimelist[element.date].push({"date":element.date,"start":element.start,"end":element.end}); 
			}	
			else {
				datetimelist[element.date] = [];
				datetimelist[element.date].push({"date":element.date,"start":element.start,"end":element.end});
			}	
		});		
		let check = false;
		datelist.forEach((element,index)=>{
			data[index] = [];
			datetimelist.forEach(ele=>{
				check = false;
				if(Array.isArray(datetimelist[element])){
					if(datetimelist[element].findIndex(datetimeelement=>(datetimeelement.start == ele.start && datetimeelement.end == ele.end)) > -1){
						check = true;
					}
				}
				data[index].push({start:ele.start,end:ele.end,check:check});
			});
		});
		return res.status(200).send({success:true,message:'Sėkmingai įsigykite laiko saugyklą',data:data});
	}
	catch(error) {
		console.log(error);
		return res.status(200).send({success:false,message:'Klaida, bandykite dar kartą.'});
	}
}
userController.addCustomTime = async function(req,res){
	if(!req.body.fromUserId) {
		return res.status(200).send({success:false,message:'Prašau prisijungti, kad galėtumėte pasiūlyti laiką'});
	}
	if(!req.body.toUserId) {
		return res.status(200).send({success:false,message:'Prašau prisijungti, kad galėtumėte pasiūlyti laiką'});
	}
	if(!req.body.timesheet) {
		return res.status(200).send({success:false,message:'Pasirinkite laiką'});
	}
	Users.getUserById(req.body.toUserId).then(result=>{
		if(result.length > 0){
			Users.addUserChat(req.body.fromUserId,req.body.toUserId,0,0).then(response=>{
				if(result){
					Mail.sendMailDeveloper(result[0].email,response.insertId,req.body.fromUserId,req.body.timesheet);
					///return res.status(200).send({success:true,message:'Sėkmingai išsiųsti pranešimą'});
					return res.status(200).send({success:true,message:'Pasiūlymas sėkmingai išsiustas'});

				}
				else{
					return res.status(200).send({success:false,message:'Klaida, bandykite dar kartą.'});
				}
			});
			
			//return res.status(200).send({success:true,message:'Sėkmingai išsiųsti pranešimą'});
		}
		else{
			return res.status(200).send({success:false,message:'Klaida, bandykite dar kartą.'});
		}
	});
}
userController.changeUserChatStatus = async function(req,res){
	if(!req.body.postId) {
		return res.status(200).send({success:false,message:'Pasirinkite vartotojo ID'});
	}
	Users.changeUserChatStatus(req.body.postId,1).then(result=>{
		if(result){
			return res.status(200).send({success:true,message:'Sėkmingai pakeiskite būseną'});
		}
		else{
			return res.status(200).send({success:false,message:'Klaida, bandykite dar kartą.'});
		}
	});
}
userController.getJobReviewById = async function(req,res){
	let mediaURL 	= req.protocol+"://"+req.headers.host+'/media/';
	if(!req.body.bookingId) {
		return res.status(200).send({success:false,message:'Įveskite darbo ID'});
	}
	Users.getJobReviewById(req.body.bookingId).then(response=>{
		if(response.length>0){
			let element = response[0];
			let image = (element.profile_image !=undefined && element.profile_image !=null) ? (mediaURL + element.profile_image) : (mediaURL + 'user.png'); 
			let data = {
				name:(element.name !=undefined && element.name !=null) ? element.name : '',
				image:image,
				rating:element.ratings,
				review:(element.review !=undefined && element.review !=null) ? element.review : '',
			};
			return res.status(200).send({success:true,message:'Sėkmingai gaukite apžvalgą',data:data});
		}
		else{
			return res.status(200).send({success:false,message:'Apžvalga nerasta'});
		}
	});
}


cron.schedule('0 0 * * *', async (req, res, next) => {
	try{
		userController.checkUserOneDay();
	}
	catch(error){
		console.log(error);
	}
}); 

// cron.schedule('* * * * *', async (req, res, next) => {
// 	try{
// 		console.log("Demo",new Date());
// 		userController.checkUserOneDay();
// 	}
// 	catch(error){
// 		console.log(error);
// 	}
// }); 
module.exports = userController;