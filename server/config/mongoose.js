var mongoose = require('mongoose'), 
crypto = require('crypto');

module.exports = function(config){
	mongoose.connect(config.db);
	var db = mongoose.connection;
	db.on('error',console.error.bind(console, 'connection error...'));
	db.once('open', function callback(){
		console.log('DB connection opened')
	})

	var userSchema = mongoose.Schema({
		firstName: String,
		lastName: String,
		username: String,
		salt: String,
		hashed_pwd: String,
		roles: [String]

	})

	userSchema.methods = {
		authenticate: function(passwordToMatch){
			return hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
		}

	}

	var User = mongoose.model('User', userSchema);
 
	User.find({}).exec(function(err, collection){
		if(collection.length === 0){
			var salt, hash;
			salt = createSalt(); 
			hash = hashPwd(salt, 'jp')
			User.create({firstName:'jp',lastName:'Keisala',username:'jp', salt: salt, hashed_pwd: hash, roles: ['admin']});
			var salt, hash;
			hash = hashPwd(salt, 'diana')
			User.create({firstName:'Diana',lastName:'Rodrigues',username:'diana', salt: salt, hashed_pwd: hash, roles: ['user']});
			var salt, hash;
			hash = hashPwd(salt, 'greta')
			User.create({firstName:'Greta',lastName:'Keisala',username:'greta', salt: salt, hashed_pwd: hash });

		}
	})
}

function createSalt(){
	return crypto.randomBytes(128).toString('base64');
}

function hashPwd(salt, pwd){
	var hmac = crypto.createHmac('sha1', salt);
	return hmac.update(pwd).digest('hex');
}