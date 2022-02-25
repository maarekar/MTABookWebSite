const StatusCodes = require('http-status-codes').StatusCodes;
const g_posts = []
const user = require('./user.js');
const posts_file = './files/posts.json';
const db = require('./database.js');

function Post(message, id, date, user_id, publisher) {
	this.message = message;
	this.id = id;
	this.date = date;
	this.user_id = user_id;
	this.status = 'published';
	this.publisher = publisher;
}

db.read_data(g_posts, posts_file).then(
	() => { console.log('Done reading users') }
).catch(reason => console.log('Failure:' + reason))


function publish_post(req, res) {
	const text = req.body.text;
	const user_status = req.body.user.status;
	
	if (!text) {
		res.status(StatusCodes.BAD_REQUEST);
		res.send("Missing text in request")
		return;
	}

	// Find max id 
	let max_id = 0;
	g_posts.forEach(
		item => { max_id = Math.max(max_id, item.id) }
	)

	const new_id = max_id + 1;

	const new_post = new Post(text, new_id, user.getFormattedDate(new Date()), req.body.user.id, req.body.user.name);
	g_posts.push(new_post);

	db.write_file(g_posts, posts_file);


	res.send(JSON.stringify(new_post));
}

function get_posts(req, res) {
	const posts = g_posts.filter(post => post.status == "published");
	const reverse_posts = posts.reverse();
	for(let i=0; i< reverse_posts.length; i++) {
		if(reverse_posts[i].user_id == req.body.user.id) {
			reverse_posts.unshift(reverse_posts[i]);
			reverse_posts.splice(i+1, 1);
			break;
		}
	}

	const current_user = user.g_users.find(user => user.id == req.body.user.id);
	current_user.last_post = posts.length;
	//user.g_users[req.body.user.id] = current_user;
	db.write_file(user.g_users, user.users_file);
	res.send(JSON.stringify(reverse_posts));
	
}

function delete_post(req, res) {
	const uesrPostId = req.body.post;
	let writer;
	let isPostExist = false;

	for (let i = 0; i < g_posts.length; i++) {
		if (g_posts[i].id == req.body.post) {
			writer = g_posts[i].user_id;
			isPostExist = true;
		}
	}

	if(!isPostExist){
		res.status(StatusCodes.BAD_REQUEST);
		res.send("Post not exists");
		return;
	}

	if (req.body.user.id != writer) {
		res.status(StatusCodes.UNAUTHORIZED);
		res.send("No access")
		return;
	}
	else {
		for (let i = 0; i < g_posts.length; i++) {
			if (g_posts[i].id == req.body.post) {
				g_posts[i].status = "deleted";
			}
		}
		db.write_file(g_posts, posts_file);
		res.send(JSON.stringify("You delete the post successfuly !"));
	}
}

function check_new_posts(req, res) {
	const posts = g_posts.filter(post => post.status == "published");
	const current_user = user.g_users.find(user => user.id == req.body.user.id);
	
	if(current_user.last_post != posts.length) {
		res.send(JSON.stringify({"new_posts" : true}));
	}
	else {
		res.send(JSON.stringify({"new_posts" : false}));
	}
	
	
}

module.exports = { posts_file, g_posts, publish_post, get_posts, delete_post, check_new_posts };