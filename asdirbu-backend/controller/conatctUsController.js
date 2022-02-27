var nodemailer 			= require('nodemailer');
var conatactController  = {};

//const baseUrl  = "https://kretoss.com/project/asdirub/";
const baseUrl  = "https://www.asdirbu.lt/";
//const baseUrl  = "https://www.asdirbu.lt/testing/";
let logo 				= baseUrl + "assets/image/as_dirbu.png";
conatactController.conatctUs = function(req,res){
	var transporter 		= nodemailer.createTransport({
							  host: 'abrikosas.serveriai.lt',
							  port: 587,
							  auth: {
							    user: 'info@asdirbu.lt',
							    pass: 'P@ssw0rd123'
							  },
								tls: {rejectUnauthorized: false}

							});
	var mailOptions = {
	  from: req.body.email,
	  to: 'info@asdirbu.lt',
	  subject: 'Susisiekite su mumis',
	  html: "Vardas : "+req.body.name+" Žinutė: "+req.body.message +"<br><h3>''Aš dirbu'' komanda</h3><img src='${logo}' style='height:30px;' />"
	};
	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
		return res.status(500).send({success:true,message:'Kažkas negerai!'});
	  } else {
		return res.status(200).send({success:true,message:'El. Laiškas sėkmingai išsiųstas'});
	  }
	});
}
conatactController.sendMail = function(req,res){
	var transporter 		= nodemailer.createTransport({
							  host: 'abrikosas.serveriai.lt',
							  port: 587,
							  auth: {
							    user: 'info@asdirbu.lt',
							    pass: 'P@ssw0rd123'
							  },
							  tls: {rejectUnauthorized: false}
							});
	var mailOptions = {
	  from: "info@asdirbu.lt",
	  to: req.body.toMail,
	  subject: 'Testing',
	  html: "Testing"
	};
	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
		return res.status(500).send({success:false,message:error});
	  } else {
		return res.status(200).send({success:true,message:'El. Laiškas sėkmingai išsiųstas'});
	  }
	});
}
module.exports = conatactController;