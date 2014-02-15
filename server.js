var express = require('express'),
	stylus = require('stylus'),
	mongoose = require('mongoose');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

function compile(str, path){
	return stylus(str).set('filename',path);
}

app.configure(function(){

	app.set('views', __dirname + '/server/views');
	app.set('view engine','jade');
	// logger
	app.use(express.logger('dev'));
	//
	app.use(express.bodyParser());
	app.use(stylus.middleware({
		src: __dirname + '/public',
		compile: compile
	}));
	app.use(express.static(__dirname + '/public'));
});

if(env === 'development'){
	mongoose.connect('mongodb://localhost/mean-sandbox');
}
else{
	mongoose.connect('mongodb://jpkeisala:mean-sandbox@ds027489.mongolab.com:27489/mean-sandbox');
}
var db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection error...'));
db.once('open', function callback(){
	console.log('DB connection opened')
})

var messageSchema = mongoose.Schema({message: String});
var Message = mongoose.model('Message', messageSchema);
var mongoMessage;

Message.findOne().exec(function(err,messageDoc){
	mongoMessage = messageDoc.message;
})


app.get('/partials/:partialsPath', function(req,res){
	res.render('partials/' + req.params.partialsPath);
});

app.get('*', function(req, res) {
	res.render('index', {mongoMessage:mongoMessage})
});


var port = process.env.PORT || 3030;
app.listen(port);
console.log('Listening on port ' + port + '...');