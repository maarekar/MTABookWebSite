class MessageItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return React.createElement(
			"div",
			{ className: "MessageItem", "data-id": this.props.message.id },
			React.createElement(
				"span",
				{ className: "topPart", id: "from" },
				"From ",
				this.props.message.sender_name,
				", ",
				this.props.message.date
			),
			React.createElement("br", null),
			React.createElement(
				"span",
				null,
				this.props.message.message
			)
		);
	}
}

class MessageList extends React.Component {
	constructor(props) {
		super(props);
		this.handle_click = this.handle_click.bind(this);
		this.state = { messages: [], friends: [] };
	}

	async componentDidMount() {
		this.update_list();
		this.update_friends();
	}

	async fetch_messages() {
		const response = await fetch('/api/get_messages');
		if (response.status != 200) {
			window.location.href = '/pages/login.html';
			alert("You have to log in !");
		}
		const data = await response.json();
		return data;
	}

	async update_list() {
		const messages = await this.fetch_messages();
		const reverse_messages = messages.reverse();
		this.setState({ messages: reverse_messages.slice(0, 20) });
	}

	async fetch_friends() {
		const response = await fetch('/api/get_friends');
		if (response.status != 200) {
			// window.location.href = '/pages/login.html';
			// alert("You have to log in !");
		}
		const data = await response.json();
		return data;
	}

	async update_friends() {
		const friends = await this.fetch_friends();
		this.setState({ friends: friends });

		for (let i = 0; i < friends.length; i++) {
			const newOption = document.createElement('option');
			const optionText = document.createTextNode(friends[i].name);

			newOption.appendChild(optionText);

			newOption.setAttribute('id', friends[i].id);
			document.getElementById('friend-select').appendChild(newOption);
		}
	}

	async handle_click() {
		const text = document.getElementById('send_message').value;
		const selected_option = document.getElementById('friend-select').selectedIndex;
		const friend_id = document.getElementById('friend-select')[selected_option].getAttribute("id");

		const response = await fetch('/api/send_message', {
			method: 'POST',
			body: JSON.stringify({ text: text, friend_id: friend_id }),
			headers: { 'Content-Type': 'application/json' }
		});
		if (response.status == 200) {
			alert("Your message has been sent !");
			document.getElementById('friend-select').selectedIndex = 0;
			document.getElementById('send_message').value = "";
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
				React.createElement(
					"select",
					{ id: "friend-select" },
					React.createElement(
						"option",
						{ value: "" },
						"--Please choose a friend--"
					)
				),
				React.createElement("br", null),
				React.createElement("textarea", { type: "text", id: "send_message", placeholder: "Write a message", required: true }),
				React.createElement("br", null),
				React.createElement(
					"div",
					{ className: "btn" },
					React.createElement("input", { type: "button", value: "Send", onClick: this.handle_click })
				)
			),
			React.createElement(
				"div",
				null,
				this.state.messages.map((item, index) => {
					return React.createElement(
						"div",
						{ className: "textBox" },
						React.createElement(MessageItem, {
							message: item, key: index })
					);
				}),
				React.createElement(
					"span",
					{ style: { display: this.state.messages.length ? 'none' : 'block' } },
					"You have no messsages!"
				)
			)
		);
	}
}

class Messages extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return React.createElement(MessageList, null);
	}
}