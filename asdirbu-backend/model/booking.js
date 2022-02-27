'user strict';
const DB = require('../config/db');

class Booking
{
	constructor(app)
	{
		this.db = DB;
	}
	async getBookingById(Id){
		try {	
			return await this.db.query(`SELECT * FROM bookings WHERE id = ?`, [Id]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getAllHireList(userId){
		try {	
			return await this.db.query('SELECT DISTINCT hire_day.*,IF(bookings.id IS NULL,false,true) as isHired FROM hire_day LEFT JOIN bookings ON bookings.hire_id = hire_day.id AND booked_user_id = ? ',[userId]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}	
	async getAllHire(userId){
		try {	
			return await this.db.query('SELECT hire_day.dates FROM bookings INNER JOIN hire_day ON hire_day.id = bookings.hire_id WHERE booked_user_id = ?',[userId]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async storeBooking(userId,bookedUserId,tnxId,hireId,flag,totalAmount,fees,userHireType,jobId,status){
		try {	
			return await this.db.query(`INSERT INTO bookings(user_id,booked_user_id,tnx_id,hire_id,flag,totalAmount,fees,userHireType,jobId,status) VALUES(?,?,?,?,?,?,?,?,?,?)`, [userId,bookedUserId,tnxId,hireId,flag,totalAmount,fees,userHireType,jobId,status]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async storeOpayBooking(userId,bookedUserId,tnxId,hireId,flag,totalAmount,fees,userHireType,jobId,status,orderNumber,isPending){
		try {	
			return await this.db.query(`INSERT INTO bookings(user_id,booked_user_id,tnx_id,hire_id,flag,totalAmount,fees,userHireType,jobId,status,orderNumber,isPending) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`, [userId,bookedUserId,tnxId,hireId,flag,totalAmount,fees,userHireType,jobId,status,orderNumber,isPending]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async storeBookingMessage(bookId,message){
		try {	
			return await this.db.query(`UPDATE bookings SET req_message = ? WHERE id = ?`, [message,bookId]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getBookingDetailById(bookingId){
		try {	
			return await this.db.query(`SELECT * FROM bookings WHERE id = ?`, [bookingId]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}

	async storeMessage(fromUserId,toUserId,message){
		try {	
			return await this.db.query(`INSERT INTO user_chat(sender_id,reciver_id,message) VALUES(?,?,?)`, [fromUserId,toUserId,message]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async storeUserHireDay(dates){
		try {	
			return await this.db.query(`INSERT INTO hire_day(dates) VALUES(?)`, [dates]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getUserHireDayByid(id){
		try {	
			return await this.db.query(`SELECT * FROM hire_day WHERE id = ?`, [id]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async checkUserHire(hireIdList){
		try {	
			return await this.db.query(`SELECT hire_id FROM bookings WHERE hire_id IN(?)`, [hireIdList]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getUserDetailsById(id){
		try {	
			return await this.db.query(`SELECT id,name FROM users WHERE id = ?`,[id]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getTimeSheetByUserId(userid){
		try {	
			return await this.db.query(`SELECT * FROM user_timesheet WHERE user_id = ?`,[userid]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getLastOrderNumber(){
			try {	
		return await this.db.query("SELECT orderNumber FROM bookings WHERE orderNumber !='' && orderNumber IS NOT NULL ORDER BY id DESC LIMIT 1");
		}catch (error) {
			console.log(error);
			return false;
		}	
	}	
	async changePaymentStatus(order_nr,transaction_id,isPending){
		try {	
			return await this.db.query(`UPDATE bookings SET  tnx_id = ?,isPending = ? WHERE orderNumber = ?`,[transaction_id,isPending,order_nr]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getBookingByOrderNo(order_nr){
		try {	
			return await this.db.query(`SELECT booked_user_id as userId,user_id as login_user_id,id as bookingId FROM bookings WHERE orderNumber = ?`,[order_nr]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
}


module.exports = new Booking();