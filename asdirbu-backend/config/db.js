
const mysql = require('mysql');

class Db {
	constructor(config) {
		this.connection = mysql.createPool({
			connectionLimit: 100,
			host: 'localhost',
			user: 'asdirbu_db',
			password: 'Grk9g834ngRaZ62',
			database: 'asdirbu_db',
			debug: false
		});
	}
	query(sql, args) 
	{
		return new Promise((resolve, reject) => {
			this.connection.query(sql, args, (err, rows) => {
				if (err)
					return reject(err);
				resolve(rows);
			});
		});
	}
	close() {
		return new Promise((resolve, reject) => {
			this.connection.end(err => {
				if (err)
					return reject(err);
				resolve();
			});
		});
	}
}
module.exports = new Db();