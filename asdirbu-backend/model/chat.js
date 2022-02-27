'user strict';
const DB = require('../config/db');

class Chat
{
	constructor(app)
	{
		this.db = DB;
	}
	async getUsers(userId){
		try 
		{	
			let query = `SELECT DISTINCT
IF(bookings.booked_user_id=${userId},bookings.user_id,bookings.booked_user_id) AS booked_user_id,
IF(bookings.booked_user_id=${userId},toUser.id,fromUser.id)  AS id,
IF(bookings.booked_user_id=${userId},toUser.user_active,fromUser.user_active) as user_active,
IF(bookings.booked_user_id=${userId},toUser.profile_image,fromUser.profile_image) as profile_image,
IF(bookings.booked_user_id=${userId},toUser.name,fromUser.name) AS name
FROM bookings
LEFT JOIN users as fromUser ON fromUser.id = bookings.booked_user_id 
LEFT JOIN users as toUser ON toUser.id = bookings.user_id 
WHERE user_id = ${userId} OR booked_user_id=${userId}`;
			return await this.db.query(query);
		} 		
		catch (error) 
		{
			console.log(error);
			return false;
		}	

		
	}	
	async getNearestUserList(userId){
		try 
		{	
			let query = `SELECT DISTINCT
					IF(nearest_user.from_user_id=${userId},toUser.id,fromUser.id) AS id,
					IF(nearest_user.from_user_id=${userId},toUser.user_active,fromUser.user_active) as user_active,
					IF(nearest_user.from_user_id=${userId},toUser.profile_image,fromUser.profile_image) as profile_image,
					IF(nearest_user.from_user_id=${userId},toUser.name,fromUser.name) AS name
					FROM nearest_user
					LEFT JOIN users as fromUser ON fromUser.id = nearest_user.from_user_id 
					LEFT JOIN users as toUser ON toUser.id = nearest_user.to_user_id 
					WHERE (from_user_id = ${userId} OR to_user_id=${userId}) AND nearest_user.status=1`;
			return await this.db.query(query);
		} 		
		catch (error) 
		{
			console.log(error);
			return false;
		}
	}

	async getUserChat(userId,reciverId){
		try 
		{	
			return await this.db.query(`select * from user_chat where ( sender_id = ? AND reciver_id = ? ) OR ( sender_id = ? AND reciver_id = ?  )`, [userId,reciverId,reciverId,userId]);
		} 		
		catch (error) 
		{
			console.log(error);
			return false;
		}	
	}
	async readMessageById(userId,reciverId){
		try 
		{	console.log(reciverId,userId,"Id");
			return await this.db.query(`UPDATE user_chat SET is_read=? WHERE sender_id = ? AND reciver_id = ?`, [1,reciverId,userId]);
		} 		
		catch (error) 
		{
			console.log(error);
			return false;
		}	
	}
	async countMessage(userId){
		try {
			return await this.db.query(`SELECT count(*) as total,sender_id as userId FROM user_chat WHERE reciver_id = ? AND is_read = ? GROUP BY sender_id`, [userId,0]);
		} 		
		catch (error) 
		{
			console.log(error);
			return false;
		}	
	}
}

module.exports = new Chat();