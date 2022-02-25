class UserItem extends React.Component {
	constructor(props) {
		super(props);
		this.handle_click = this.handle_click.bind(this);
	}

	handle_click() {
		if (this.props.handle_delete) this.props.handle_delete(this.props.user.id);
	}

	render() {
		return <div className='UserItem' data-id={this.props.user.id}>
			<span id="username">{this.props.user.name}</span>

			<input type="button" value="Delete" onClick={this.handle_click}></input>

		</div>
	}
}


class UserList extends React.Component {
	constructor(props) {
		super(props);
		this.handle_delete = this.handle_delete.bind(this);
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

	async handle_delete(id) {
		const response = await fetch('/api/delete_user_by_admin/',
			{
				method: 'DELETE',
				body: JSON.stringify({ id: id }),
				headers: { 'Content-Type': 'application/json' }
			});
		if (response.status == 200) {
			alert("User has been deleted !");
			this.update_list();
		}

		else {
			const err = await response.text();
			alert(err);
		}
	}

	async update_list() {
		const users = await this.fetch_users();
		this.setState({ users: users });
	}

	render() {
		return <div>
			<div id="user">
				{this.state.users.map((item, index) => {
					return <div className="user">
						<UserItem
							handle_delete={this.handle_delete} user={item} key={index} />
					</div>


				})}
			</div>
			<span style={{ display: (this.state.users.length ? 'none' : 'block') }}>
				You have no users to delete!
			</span>
		</div>
	}
}



class Delete extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <UserList />
	}
}