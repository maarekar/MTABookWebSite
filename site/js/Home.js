class PostItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return React.createElement(
			"div",
			{ className: "PostItem", "data-id": this.props.post.id },
			React.createElement(
				"span",
				{ className: "topPart", id: "from" },
				"From ",
				this.props.post.publisher,
				", ",
				this.props.post.date
			),
			React.createElement("br", null),
			React.createElement(
				"span",
				null,
				this.props.post.message
			)
		);
	}
}

class PostList extends React.Component {
	constructor(props) {
		super(props);
		this.handle_click = this.handle_click.bind(this);
		this.state = { posts: [], isNewPost: false };
	}

	async componentDidMount() {
		this.update_list();
	}

	async fetch_posts() {
		const response = await fetch('/api/get_posts');

		if (response.status != 200) {
			window.location.href = '/pages/login.html';
			alert("You have to log in !");
		}

		const data = await response.json();
		return data;
	}

	async update_list() {
		const posts = await this.fetch_posts();
		this.setState({ posts: posts.slice(0, 20) });
	}

	async handle_click() {
		const text = document.getElementById('post_message').value;

		const response = await fetch('/api/publish', {
			method: 'POST',
			body: JSON.stringify({ text: text }),
			headers: { 'Content-Type': 'application/json' }
		});
		if (response.status == 200) {
			alert("Your post is published !");
			this.update_list();
			document.getElementById('post_message').value = "";
		} else {
			const err = await response.text();
			alert(err);
		}
	}

	render() {
		return React.createElement(
			"div",
			null,
			React.createElement(
				"div",
				{ className: "writeBox " },
				React.createElement("textarea", { type: "text", id: "post_message", placeholder: "Write a post", required: true }),
				React.createElement("br", null),
				React.createElement(
					"div",
					{ className: "btn" },
					React.createElement("input", { type: "button", value: "Post", onClick: this.handle_click })
				)
			),
			React.createElement("br", null),
			React.createElement(
				"div",
				{ id: "post" },
				this.state.posts.map((item, index) => {
					return React.createElement(
						"div",
						{ className: "textBox" },
						React.createElement(PostItem
						// post={item} key={index} />
						, { post: item })
					);
				})
			)
		);
	}
}

class Home extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return React.createElement(PostList, null);
	}
}