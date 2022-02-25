class UserItem extends React.Component {
	constructor(props) {
		super(props);
		this.handle_click = this.handle_click.bind(this);
	}

	handle_click() {
		if (this.props.handle_suspend) this.props.handle_suspend(this.props.user.id);
	}

	render() {
		return <div className='UserItem' data-id={this.props.user.id}>
			<span id="username">{this.props.user.name}</span>

			<input type="button" value="Suspend" onClick={this.handle_click}></input>


		</div>
	}
}


class UserList extends React.Component {
	constructor(props) {
		super(props);
		this.handle_suspend = this.handle_suspend.bind(this);
		this.state = { users: [] }
	}

	async componentDidMount() {
		this.update_list();
	}

	async fetch_users() {
		const response = await fetch('/api/users');
		if (response.status != 200) {
			window.location.href = '/pages/login.html';
			alert("You have to log in !");
		}

		const data = await response.json();
		return data;
	}

	async handle_suspend(id) {
		const response = await fetch('/api/suspend/' + id,
			{
				method: 'PUT'
			});
		if (response.status == 200) {
			alert("User has been suspended !");
			this.update_list();
		}

		else {
			const err = await response.text();
			alert(err);
		}
	}

	async update_list() {
		const users = await this.fetch_users();
		const new_users = users.filter((item) => {
			if (item.status === "actived") {
				return item;
			};
		})
		this.setState({ users: new_users });
	}

	render() {
		return <div>
			<div id="user">
				{this.state.users.map((item, index) => {
					return <div className="user">
						<UserItem
							handle_suspend={this.handle_suspend} user={item} key={index} />
					</div>


				})}
			</div>
			<span style={{ display: (this.state.users.length ? 'none' : 'block') }}>
				You have no users to suspend!
			</span>
		</div>
	}
}



class Suspend extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <UserList />
	}
}