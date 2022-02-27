const http = require('http');
const https = require('https');
const app = require('express')();
const fs = require('fs');
const options = {
  key: fs.readFileSync('/var/www/ssl/asdirbu_lt.key'),
  cert: fs.readFileSync('/var/www/ssl/asdirbu_lt.crt')
};
const server = https.Server(options,app);
//const server = http.Server(app);
const io = require('socket.io').listen(server);
const helper = require('./helper');
const path = require('path');
const moment = require('moment');
let nodemailer = require('nodemailer');
let logo = "https://www.asdirbu.lt/assets/image/as_dirbu.png";
let transporter 	= nodemailer.createTransport({
							  host: 'abrikosas.serveriai.lt',
							  port: 587,
							  auth: {
							    user: 'info@asdirbu.lt',
							    pass: 'P@ssw0rd123'
							  },
							  tls: {rejectUnauthorized: false}
							});

function getCurrentTime() {
    return moment().format("h:mm A");  
}

function getCurrentDateTime()  {
    return moment().format('YYYY-MM-DD H:mm:ss');  
}
var userList =[];

io.on('connection', (socket) =>{ 
    socket.on('join', (userid)=>{
    	socket.userid = userid;
        helper.loginUser(userid,socket.id,getCurrentDateTime()).then();
        let findElementIndex = userList.findIndex(element=>(element.userid==userid));
        if(findElementIndex > -1){	
        	userList[findElementIndex].user_socket_id = socket.id;
        }
        else {
        	userList.push({"userid":userid,"user_socket_id":socket.id});
        }
        socket.broadcast.emit('userjoinedthechat',userid);
    }); 

    socket.on('activeuser', ()=>{
    	socket.broadcast.emit('activeuserlist',userList);
    }); 

     
    socket.on('messagedetection', (data) =>{
        data.time = getCurrentTime();
        let messageData = JSON.parse(JSON.stringify(data));
        if(messageData.receiver_id!="") {
            helper.getSocketId(messageData.receiver_id).then(result=> {
                if(result[0]) {
                	if(result[0].email !="" && result[0].email!=null && result[0].email!=undefined && result[0].email!="undefined"){
		                let activationMail = {
						  	from: '"Aš dirbu" <info@asdirbu.lt>',
						  	to: result[0].email,
						  	subject: "Žinutė",
							html:`<span>${messageData.message}</span><br><h3>''Aš dirbu'' komanda</h3><img src="${logo}" style="height:30px;" />`
						};
						transporter.sendMail(activationMail, function(error, info){
						  	if (error) {
						  		console.log("Error",error);
						  	}						  	
						});
					}
	                io.to(result[0].user_socket_id).emit('message',data);
                }   
            });            
        }
        helper.addUserMessage(messageData.sender_id,messageData.receiver_id,messageData.message,getCurrentDateTime()).then();
    });        
    socket.on('disconnect',(data)=>{
        helper.logoutUser(socket.userid,getCurrentDateTime()).then();
       // socket.emit("userdisconnect"," user has left ");
        io.emit('disconnect',socket.userid); 
        let findElementIndex = userList.findIndex(element=>(element.userid==socket.userid));
        if(findElementIndex > -1){	
        	userList.splice(findElementIndex,1);
        }
    });
});
server.listen(3015,()=>{
    console.log('Node app is running on port 3015');
});


