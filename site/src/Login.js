class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handle_submit = this.handle_submit.bind(this);
    }

    async handle_submit() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/api/login',
            {
                method: 'POST',
                body: JSON.stringify({ email: email, password: password }),
                headers: { 'Content-Type': 'application/json' }
            });
        if (response.status == 200) {
            window.location.href = '/pages/home.html';
        }

        else {
            const err = await response.text();
            alert(err);
        }
    }

    render() {
        return <div>
            <div className="title-text">
                <div className="title login">
                    Log in
                </div>
            </div>
            <div className="form-inner">
                <input type="text" id="email" placeholder="Email" required />
                <input type="password" id="password" placeholder="Password" required />
                <div className="btn">
                    <input type="button" onClick={this.handle_submit} value="Log  in"></input>
                </div>
               
            </div>

        </div>
    }
}
