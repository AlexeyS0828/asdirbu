'user strict';
const DB = require('../config/db');


class Admin
{
	constructor(app)
	{
		this.db = DB;
	}
	async login(email,password){
		try {	
			return await this.db.query(`SELECT * FROM admin WHERE email = ? AND password = ?`, [email,password]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}	
	async getTotalUserCount(){
		try {	
			return await this.db.query(`SELECT COUNT(id) as users FROM users`, []);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getIndividualUserCount(){
		try {	
			return await this.db.query(`SELECT COUNT(id) as users FROM users WHERE userType = ? `, [1]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getBusinessUserCount(){
		try {	
			return await this.db.query(`SELECT COUNT(id) as users FROM users WHERE userType = ? `, [2]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getTotalJobCount(){
		try {	
			return await this.db.query(`SELECT COUNT(id) as jobs FROM greitas_skelbimas `, []);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getUserListByType(userType){
		try {	
			return await this.db.query(`SELECT id,name,email,phone,hourrate,city,isApproved,IF(companyName IS NULL,'',companyName) AS companyName,IF(companyCode IS NULL,'',companyCode) AS companyCode FROM users WHERE userType = ? ORDER BY id DESC `, [userType]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getUserDetailsById(userId){
		try {	
			return await this.db.query(`SELECT * FROM users WHERE id = ? `, [userId]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getDocumentById(userId){
		try {	
			return await this.db.query(`SELECT document,name FROM user_documents WHERE user_id = ? `, [userId]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getTimeSheetDetailsById(userId){
		try {	
			return await this.db.query(`SELECT date,start,end FROM user_timesheet WHERE user_id = ? `, [userId]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async deleteUserById(userId){
		try {	
			return await this.db.query(`DELETE FROM users WHERE id = ?`, [userId]);
		} 		
		catch (error) {
			return false;
		}	
	}
	async getQuickJobList(){
		try {	
			return await this.db.query(`SELECT greitas_skelbimas.id AS id,name,email,skelbimo_pavadinimas,paslaugos_priemimo_laikas,papasakok_plačiau,Raktažodžiai,paslaugos_kaina,paslaugos_suteikimo_vieta,distance,paslaugos_priėmimo_vieta,job_type  FROM users INNER JOIN greitas_skelbimas ON greitas_skelbimas.user_id = users.id ORDER BY greitas_skelbimas.id DESC`);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async deleteQuickJobById(quickJobId){
		try {	
			return await this.db.query(`DELETE FROM greitas_skelbimas WHERE id = ?`, [quickJobId]);
		} 		
		catch (error) {
			return false;
		}	
	}
	
	async getQuickJobDetailById(quickJobId){
		try {	
			return await this.db.query(`SELECT greitas_skelbimas.*,name,email FROM users INNER JOIN greitas_skelbimas ON greitas_skelbimas.user_id = users.id WHERE greitas_skelbimas.id = ?`,[quickJobId]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getBlogList(){
		try {	
			return await this.db.query(`SELECT id,name,image,description FROM blog ORDER BY id DESC`);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async storeBlog(name,image,description){
		try {	
			return await this.db.query(`INSERT INTO blog(name,image,description) VALUE(?,?,?)`,[name,image,description]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async deleteBlogById(blogId){
		try {	
			return await this.db.query(`DELETE FROM blog WHERE id = ?`,[blogId]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}	
	async getBlogDetailsById(blogId){
		try {	
			return await this.db.query(`SELECT * FROM blog WHERE id = ?`,[blogId]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async updateBlog(name,image,description,blogId){
		try {	
			if(image!=""){
				return await this.db.query(`UPDATE blog SET name = ?,description = ?,image = ? WHERE id = ?`,[name,description,image,blogId]);
			}
			else{
				return await this.db.query(`UPDATE blog SET name = ?,description = ? WHERE id = ?`,[name,description,blogId]);
			}
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getLatestBlog(){
		try {	
			return await this.db.query(`SELECT  * FROM blog ORDER BY id DESC LIMIT 3`);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getTransactionHistroy() {
		try {	
			//return await this.db.query(`SELECT IF(developer.taxPay IS NULL,0,developer.taxPay) AS taxPay,bookings.fees AS fees,bookings.id AS id,bookings.tnx_id AS transctionId,CONCAT(client.name," ",client.last_name) AS clientName,CONCAT(developer.name," ",developer.last_name) AS developerName,bookings.totalAmount AS amount,developer.bank_ac_no AS bankAccountNumber,bookings.flag AS paymentType,bookings.status AS status  FROM bookings LEFT JOIN users AS client ON client.id = bookings.user_id  LEFT JOIN users AS developer ON developer.id = bookings.booked_user_id ORDER BY bookings.id DESC`);
			return await this.db.query(`SELECT DATE_FORMAT(bookings.createdAt,"%d/%m/%Y") AS date,bookings.fees AS fees,CONCAT(client.name," ",client.last_name) AS clientName,CONCAT(developer.name," ",developer.last_name) AS developerName,bookings.totalAmount AS amount,developer.bank_ac_no AS bankAccountNumber,IF(developer.taxPay IS NULL,0,developer.taxPay) AS taxPay,bookings.flag as paymentType,bookings.id AS id,bookings.tnx_id AS transctionId,bookings.flag AS paymentType,bookings.status AS status FROM bookings LEFT JOIN users AS client ON client.id = bookings.user_id  LEFT JOIN users AS developer ON developer.id = bookings.booked_user_id WHERE bookings.isPending=? ORDER BY bookings.id DESC`,[0]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async changeTransactionStatus(transctionId,status) {
		try {	
			return await this.db.query(`UPDATE bookings SET status = ? WHERE id = ?`,[status,transctionId]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}

	async getTotalPayment(){
		try {	
			return await this.db.query(`SELECT  IF(SUM(totalAmount) IS NULL,0,SUM(totalAmount)) as totalEuro,IF(SUM(fees) IS NULL,0,SUM(fees)) as feesEuro,IF(SUM(totalAmount-fees) IS NULL,0,SUM(totalAmount-fees)) as employeesEuro FROM bookings WHERE isPending=?`,[0]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getTotalPayementByDate(startDate,endDate){
		try {	
			return await this.db.query(`SELECT IF(SUM(totalAmount) IS NULL,0,SUM(totalAmount)) as totalEuro,IF(SUM(fees) IS NULL,0,SUM(fees)) as feesEuro,IF(SUM(totalAmount-fees) IS NULL,0,SUM(totalAmount-fees)) as employeesEuro FROM bookings WHERE isPending=? AND DATE_FORMAT(createdAt,"%Y-%m-%d") BETWEEN ? AND ?`,[0,startDate,endDate]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getTransactionByDate(startDate,endDate){
		try {	
			return await this.db.query(`SELECT DATE_FORMAT(bookings.createdAt,"%d/%m/%Y") AS date,bookings.fees AS fees,CONCAT(client.name," ",client.last_name) AS clientName,CONCAT(developer.name," ",developer.last_name) AS developerName,bookings.totalAmount AS amount,developer.bank_ac_no AS bankAccountNumber,IF(developer.taxPay IS NULL,0,developer.taxPay) AS taxPay,bookings.flag as paymentType,bookings.id AS id,bookings.tnx_id AS transctionId,bookings.flag AS paymentType,bookings.status AS status FROM bookings LEFT JOIN users AS client ON client.id = bookings.user_id  LEFT JOIN users AS developer ON developer.id = bookings.booked_user_id WHERE isPending=? AND DATE_FORMAT(bookings.createdAt,"%Y-%m-%d") BETWEEN ? AND ? ORDER BY bookings.id DESC`,[0,startDate,endDate]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async updateUserStatus(isApproved,userId){
		try {	
			console.log(isApproved,userId)
			return await this.db.query(`UPDATE users SET isApproved = ? WHERE id = ? `,[isApproved,userId]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}

	async getTotalByDateUserType(startDate,endDate,userType){
		try {	
			return await this.db.query(`SELECT COUNT(id) as totalUser FROM users WHERE userType = ? AND DATE_FORMAT(createAt,"%Y-%m-%d") BETWEEN ? AND ? `, [userType,startDate,endDate]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	async getTotalJobByDate(startDate,endDate){
		try {	
			return await this.db.query(`SELECT COUNT(id) as totalJobs FROM greitas_skelbimas WHERE DATE_FORMAT(createdAt,"%Y-%m-%d") BETWEEN ? AND ? `, [startDate,endDate]);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}
	
	async getAllBlog(){
		try {	
			return await this.db.query(`SELECT id,name,image,description FROM blog ORDER BY id DESC`);
		} 		
		catch (error) {
			console.log(error);
			return false;
		}	
	}

	
}

module.exports = new Admin();