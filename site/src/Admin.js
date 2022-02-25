class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.handle_click = this.handle_click.bind(this);
    }

    componentDidMount(){
        this.fetch_current_user();
    }

    async fetch_current_user() {
        const response = await fetch('/api/check_current_user');
        const data = await response.json();
        if (!data.isAdmin) {
            window.location.href = '/pages/login.html';
            alert("No access !");
        }
    }

    async handle_click() {
        const text = document.getElementById('send_message').value;
        const everyone = "everyone";

        const response = await fetch('/api/send_message',
            {
                method: 'POST',
                body: JSON.stringify({ text: text, friend_id: everyone }),
                headers: { 'Content-Type': 'application/json' }
            });
        if (response.status == 200) {
            alert("Your message has been sent !");
            document.getElementById('send_message').value = "";
        }

        else {
            const err = await response.text();
            alert(err);
        }
    }

    render() {
        return <div>
            <div className="writeBox ">
                <div>Send a message to all users</div>
                <textarea type="text" id="send_message" placeholder="Write a message" required></textarea>
                <br></br>
                <div className="btn">
                    <input type="button" value="Send" onClick={this.handle_click}></input>
                </div>

            </div>
            <div className="navigationBar">
                <ReactButton name='Approve Users' relocation='/pages/approve.html' />
                <ReactButton name='Suspend Users' relocation='/pages/suspend.html' />
                <ReactButton name='Restore Users' relocation='/pages/restore.html' />
                <ReactButton name='Delete Users' relocation='/pages/delete.html' />
            </div>

        </div>
    }
}