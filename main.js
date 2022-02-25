// External modules
const express = require('express')
const cookieParser = require('cookie-parser');
const path = require('path');
const StatusCodes = require('http-status-codes').StatusCodes;
const package = require('./package.json');
const post = require('./src/post.js');
const message = require('./src/message.js');
const admin = require('./src/admin.js');
const user = require('./src/user.js');


const app = express()
let  port = 2718;

const reExt = /\.([a-z]+)/i;

function content_type_from_extension( url)
{
	const m = url.match( reExt );
	if ( !m ) return 'application/json'
	const ext = m[1].toLowerCase();

	switch( ext )
	{
		case 'js': return 'text/javascript';
		case 'css': return 'text/css';
		case 'html': return 'text/html';
	}

	return 'text/plain'
}

// General app settings
const set_content_type = function (req, res, next) 
{
	const content_type = req.baseUrl == '/api' ? "application/json; charset=utf-8" : content_type_from_extension( req.url)
	res.setHeader("Content-Type", content_type);
	next()
}

app.use(  set_content_type );
app.use(express.json());  // to support JSON-encoded bodies
app.use(express.urlencoded( // to support URL-encoded bodies
{  
  extended: true
}));

app.use(cookieParser());

// Routing
const router = express.Router();

router.get('/users', user.check_validation_token, (req, res) => { user.list_users(req, res) })
router.get('/get_friends', user.check_validation_token, (req, res) => { user.get_friends(req, res) })
router.post('/login', (req, res) => { user.log_in(req, res) })
router.delete('/logout', user.check_validation_token, (req, res) => { user.log_out(req, res) })
router.post('/register', (req, res) => { user.register(req, res) })
router.delete('/delete_user', user.check_validation_token, (req, res) => { admin.delete_user(req, res) })
router.delete('/delete_user_by_admin', user.check_validation_token, admin.check_admin, (req, res) => { admin.delete_user_by_admin(req, res) })
router.put('/approve/:id', user.check_validation_token, admin.check_admin, admin.check_id, (req, res) => { admin.approve_user(req, res) })
router.put('/suspend/:id', user.check_validation_token, admin.check_admin, admin.check_id, (req, res) => { admin.suspend_user(req, res) })
router.put('/restore/:id', user.check_validation_token, admin.check_admin, admin.check_id, (req, res) => { admin.restore_user(req, res) })
router.post('/publish', user.check_validation_token, (req, res) => { post.publish_post(req, res) })
router.delete('/delete_post', user.check_validation_token, (req, res) => { post.delete_post(req, res) })
// router.get('/get_posts', user.verifyToken, user.check_validation_token, (req, res) => { post.get_posts(req, res) })
router.get('/get_posts', user.check_validation_token, (req, res) => { post.get_posts(req, res) })
// router.get('/get_messages', user.verifyToken, user.check_validation_token, (req, res) => { message.get_messages(req, res) })
router.get('/get_messages', user.check_validation_token, (req, res) => { message.get_messages(req, res) })
router.post('/send_message', user.check_validation_token, (req, res) => { message.send_message(req, res) })

router.get('/check_current_user', user.check_validation_token, (req, res) => { user.check_current_user(req, res) })

router.get('/new_posts', user.check_validation_token, (req, res) => { post.check_new_posts(req, res) })
router.get('/new_messages', user.check_validation_token, (req, res) => { message.check_new_messages(req, res) })


app.use(express.static(path.join(__dirname, 'site')));

app.use('/api',router)

app.get('/', function(req, res){	
	res.redirect("/pages/landing.html")
});



// Init 

let msg = `${package.description} listening at port ${port}`
app.listen(port, () => { console.log( msg ) ; })



