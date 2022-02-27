var dateFormat 			= require('dateformat');
var session             = require('express-session');
const Users             = require('../model/users');
const Booking           = require('../model/booking');
var jwtAuth             = require('../jwtAuth');
var jwtconfig = require('../config/config');
var jwt                 = require('jsonwebtoken');

const md5           = require('md5');
const keyPublishable 	= 'pk_live_QCE5jaV2kfInZXm3wjmopXCb00TvcYyyL2';
const keySecret 		= 'sk_live_pCGkhPtNVawx9qOlLjUOeaYK00Csd9pDQn';
//const keyPublishable 	= 'pk_test_rje2SYEyjpMA0YWdKpCypbZ600dX8lzuGI';
//const keySecret 		= 'sk_test_yheVbwiTn4Q4nadY4DOxP8K900Udr4BQKg';
const stripe 			= require("stripe")(keySecret);
var bookingController   = {};
const Mail           	= require('../model/mail');
var btoa = require('btoa');

bookingController.storeBooking = function(req,res){
	if(!req.body.booked_user_id){
		return res.status(200).send({success:true,message:'Būtina užsakyti vartotojo ID!'})
	}
	let userHireType  = 0;
	if(req.body.userHireId!=0){
		userHireType = 1;
	}
	let status = 0;
	Booking.storeBooking(req.id,req.body.booked_user_id,req.body.tnx_id,req.body.userHireId,'paypal',req.body.totalAmount,req.body.fees,userHireType,req.body.jobId,status).then(result =>{
		if (result) {
	        var json =  JSON.parse(JSON.stringify(result));
			return res.status(200).send({success:true,message:'Rezervacija sėkmingai',bookingId: json.insertId});
		}
		else{
			return res.status(500).send({success:false,message:'Kažkas negerai!'});
		}
	});
}
bookingController.storeBookingMessage = async function(req,res){
	console.log(req.body);
	let options = {
        day: "numeric",
        month: "long"
    };
	if(!req.body.bookingId){
		return res.status(200).send({success:true,message:'Reikalingas užsakymo ID!'});
	}
	let bookingId = req.body.bookingId;
	let message = req.body.message;
	Booking.getBookingDetailById(bookingId).then(response =>{
		if(response){
			let data = response[0];
			Booking.storeMessage(data.user_id,data.booked_user_id,message).then(response=>console.log(response));
		}
	});
	
			let bookingResult = await Booking.getBookingById(bookingId).then(bookingResult => {
				return bookingResult ? bookingResult[0] : [];
			});
			if (bookingResult) {
				let hireId = bookingResult.hire_id ? bookingResult.hire_id : 0;				
				let day =  await Booking.getUserHireDayByid(hireId).then(result => {
					if(result.length > 0){
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
							tempDats = new Date(minDate).toLocaleDateString("lt", options) + "-"+ new Date(maxDate).toLocaleDateString("lt", options);							
						}
						return tempDats;
					}
					else{
						return 0;
					}
				});
				
				let totalTime = await Booking.getUserHireDayByid(hireId).then(days =>{
					if(days.length>0){
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
						let dif = ( endDateTime - startDateTime ) / 1000 / 60 / 60;
						tempTotalTime += dif;
					});
						return tempTotalTime;
					}
					else{
						return 0;
					}
				});
				let price = await Users.getUserById(req.body.user_id).then(userRes =>{        
					return userRes[0].hourrate ? userRes[0].hourrate : 0;
				});
				let companyUser =  await Users.getUserById(req.id).then(result =>{
					return result ? result[0] : [];
				});
				let devloperUser = await Users.getUserById(req.body.user_id).then(result =>{
					return result ? result[0] : [];
				});
				if(bookingResult.userHireType==1){
					Mail.sendMailToDeveloper(companyUser,devloperUser,day,totalTime,price);
					Mail.sendMailToCompany(companyUser,devloperUser,day,totalTime,price);
				}
				else {
					Mail.sendMailToDeveloperDirectHire(companyUser,devloperUser,bookingResult);
					Mail.sendMailToCompanyDirectHire(companyUser,devloperUser,bookingResult);
				}
			}	
			Booking.storeBookingMessage(bookingId,message).then(result =>{
		if (result) {			
			return res.status(200).send({success:true,message:'Užsakymo pranešimas sėkmingai išsaugotas'});
		}
		else{
			return res.status(500).send({success:false,message:'Kažkas negerai!'});
		}
	});
}
bookingController.storeUserHireDay = function(req,res){
	if(!req.body.userid){
		return res.status(200).send({success:false,message:'Pasirinkta data reikalinga!'})
	}
	if(!req.body.selectedDate){
		return res.status(200).send({success:false,message:'Pasirinkta data reikalinga!'})
	}
	if(!req.body.selectedDate.length){
		return res.status(200).send({success:false,message:'Pasirinkta data reikalinga!'})
	}
	const userId = req.body.userid;
	const selectedDate = req.body.selectedDate;
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
	Booking.getUserDetailsById(userId).then(response=>{
		if(response) {
			user = response[0];
		}
	});
	Booking.getTimeSheetByUserId(userId).then(response=>{
		if(response) {
			response.forEach(element=>{
				timeSheet.push({date:element.date,start:element.start,end:element.end});
			});
		}
	});

	let userHired = 0;
	Booking.getAllHireList(userId).then(result=>{
		if(result){
			selectedDate.forEach((datelist,index)=>{
				result.forEach((ele)=>{
					const array = JSON.parse(ele.dates);
					array.forEach(element=> {
						if(datelist.date == element.date && datelist.start == element.start && datelist.end == element.end){
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
				return res.status(200).send({success:false,message:errorMessage});
			}
			else{
				Booking.storeUserHireDay(JSON.stringify(req.body.selectedDate)).then(result => {
					if (result) {
						return res.status(200).send({success:true,message:'Nuoma dieną sėkmingai išsaugokites',userHireId:result.insertId });
					}
					else{
						return res.status(500).send({success:false,message:'Kažkas negerai!'});
					}
				});		
			}
			
		}
	});	
}
bookingController.stripePayment = async function(req,res){
	if(!req.body.stripeToken){
		return res.status(200).send({success:false,message:"Įveskite juostos žetoną"});
	}
	if(!req.body.amount){
		return res.status(200).send({success:false,message:"Įveskite sumą"});
	}
	if(!req.body.fees){
		return res.status(200).send({success:false,message:"Įveskite mokesčius"});
	}
	if(!req.body.userId){
		return res.status(200).send({success:false,message:"Įveskite vartotojo ID"});
	}
	let userHireType  = 0;
	if(req.body.userHireId!=0){
		userHireType = 1;
	}
	try{
	let user = await Users.getUserById(req.body.userId);
	let totalAmount = Number(req.body.amount).toFixed(2);
	let amount = Number(totalAmount * 100).toFixed(0);
	stripe.customers.create({
        email: user[0].email, 
        source: req.body.stripeToken
    })
    .then(customer =>
        stripe.charges.create({ // charge the customer
        amount,
        description: "Asdirub įkrovimas",
            currency: "eur",
            customer: customer.id
        }))
    .then(charge => {
    	if(charge.status=="succeeded"){
    		let status = 0;
    		Booking.storeBooking(req.id,req.body.userId,charge.id,req.body.userHireId,'juostele',totalAmount,req.body.fees,userHireType,req.body.jobId,status).then(result =>{
				if (result) {
			        var json =  JSON.parse(JSON.stringify(result));
					return res.status(200).send({success:true,message:'Sėkmingai sumokėta',bookingId: json.insertId});
				}
				else{
					return res.status(500).send({success:false,message:'Kažkas negerai!'});
				}
			});
    	}
    	else{
			return res.status(200).send({success:false,message:"Kažkas negerai, bandykite vėliau dar kartą..."});
    	}
    }).catch(error=>{
    	return res.status(200).send({success:false,message:error.message});
    });
	}
	catch(error){
		console.log(error);
		return res.status(200).send({success:false,message:error.message});
	}
}
bookingController.opayPayment = async function(req,res){
	let bookedUserId = req.body.booked_user_id;
	let userHireId = req.body.userHireId;
	let totalAmount = req.body.totalAmount;
	let fees = req.body.fees;
	let jobId = req.body.jobId;
	let userHireType  = 0;
	let transctionId  = 0;
	if(userHireId!=0){
		userHireType = 1;
	}	
	let orderNumber = await Booking.getLastOrderNumber().then(response=>{
			return (response.length > 0)  ? response[0].orderNumber :  100000;
	});
	orderNumber  = orderNumber + 1;
	let opayEncodeCode = await  bookingController.getOpayEncodeCode(orderNumber,totalAmount);
	let status  = 0;
	let pedding = 1;
	Booking.storeOpayBooking(req.id,bookedUserId,transctionId,userHireId,'Opay',totalAmount,fees,userHireType,jobId,status,orderNumber,pedding).then(result =>{
		if (result) {
	        return res.status(200).send({success:true,message:'Rezervacija sėkmingai',encodeUrl: opayEncodeCode});
		}
		else{
			return res.status(500).send({success:false,message:'Kažkas negerai!'});
		}
	});
}
bookingController.changePaymentStatus = async function(req,res){
	let isLogin = false;
	// if(req.headers['x-access-token']!=undefined && req.headers['x-access-token']!='' && req.headers['x-access-token']!=null){
	// 	let tokenData = await jwt.verify(req.headers['x-access-token'], jwtconfig.secret);
	// 	if(tokenData){
	// 		isLogin = true;
	// 	}
	// }
	let order_nr = req.body.order_nr;
	let transaction_id = req.body.transaction_id;
	let data = await Booking.getBookingByOrderNo(order_nr).then(response=>{
		return (response.length > 0) ? response[0] : false; 
	});
	let transction = Booking.changePaymentStatus(order_nr,transaction_id,0);
	if(transction && data){
		let token = await jwtAuth.createToken(data.login_user_id);
        let tokenData = await jwt.verify(token,jwtconfig.secret);
        console.log(tokenData,"Login---------------------------------------------");
		let userdata = await Users.getUserById(data.login_user_id);
		if(userdata && userdata.length){	
			if(!isLogin){	
			 	let logindata = {
		            id          : userdata[0].id, 
		            email       : userdata[0].email, 
		            companyName : userdata[0].companyName ? userdata[0].companyName : '', 
		            companyCode : userdata[0].companyCode ? userdata[0].companyCode : '', 
		            sector          : userdata[0].sector ? userdata[0].sector : '', 
		            userType     : userdata[0].userType,
		            isJobPosted : 1,
		            _token      : token
	        	}
	        	data = {...data,...{"logindata":logindata}};
    		}
    	}
    	return res.status(200).send({success:true,message:'Rezervacija sėkmingai',data:data});
	}
	else{
		return res.status(500).send({success:false,message:'Kažkas negerai!'});
	}
}





	


bookingController.getOpayEncodeCode= async function(orderNumber,totalAmount){
	
	let signature = '8562cff37171c5b515718013b41df7ec';
	let amount = Number(totalAmount * 100).toFixed(0);
	let data = {
        'website_id':'8W22D86MMH',
        'order_nr' :orderNumber,
        'redirect_url' :'https://asdirbu.lt/payment-response/',
        'web_service_url' :'https://asdirbu.lt/payment-response/',
        'standard' :'opay_8.1',
        'country' :'LT',
        'language' :'LIT',
        'amount' :amount,
        'currency' :'EUR'
     //   'test' :'8U22G8V35A'
    };	
    let combieObjectString = "";
    for (let element in data){
	    if (data.hasOwnProperty(element)) {
	     	combieObjectString += element+data[element];
	    }
	}
	let password_signature = md5(combieObjectString + signature);
	data = {...data,...{"password_signature":password_signature}};
	let str = [];
    for (let element in data){
	    if (data.hasOwnProperty(element)) {
	      str.push(encodeURIComponent(element) + "=" + encodeURIComponent(data[element]));
	    }
	}
	console.log(str.join("&"));
	return ("https://gateway.opay.lt/pay/?encoded=" +  btoa(str.join("&")));
}

module.exports = bookingController;