'user strict';
const DB = require('./db');

class Helper
{
	constructor(app)
	{
		this.db = DB;
	}
	async loginUser(userid,socketid,date){
		try 
		{	
			return await this.db.query(`UPDATE 	users SET user_socket_id = ?, user_active = ?,updatedAt = ?  WHERE id = ?`, [socketid,'1',date,userid]);
		} 		
		catch (error) 
		{
			return null;
		}	
	}
	async addUserMessage(fromUserId,toUserId,message,date){
		try 
		{	
			await this.db.query(`UPDATE user_chat SET status = ?  WHERE reciver_id = ? AND sender_id = ?`, ['1',fromUserId,toUserId]);	
			return await this.db.query(`INSERT INTO user_chat(sender_id,reciver_id,message,status,createdAt) VALUES(?,?,?,?,?)`, [fromUserId,toUserId,message,'0',date]);
		} 		
		catch (error) 
		{
			return null;
		}	
	}
	async updateStatus(fromUserId,toUserId){
		try 
		{	
			return await this.db.query(`UPDATE user_chat SET status = ?  WHERE sender_id = ? AND reciver_id = ?`, ['1',fromUserId,toUserId]);
		} 		
		catch (error) 
		{
			return null;
		}	
	}

	async logoutUser(userid,date){
		try 
		{	
			return await this.db.query(`UPDATE users SET user_socket_id = ?, user_active = ?, updatedAt = ? WHERE id = ?`, ['','0',date,userid]);
		} 		
		catch (error) 
		{
			return null;
		}	
	}
	async getSocketId(userid){
		try 
		{	
			return await this.db.query(`SELECT user_socket_id,email FROM users WHERE id = ?`, [userid]);
		} 		
		catch (error) 
		{
			return null;
		}	
	}

}
module.exports = new Helper();