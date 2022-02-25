class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.handle_click = this.handle_click.bind(this);
    }

    componentDidMount() {
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

        const response = await fetch('/api/send_message', {
            method: 'POST',
            body: JSON.stringify({ text: text, friend_id: everyone }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.status == 200) {
            alert("Your message has been sent !");
            document.getElementById('send_message').value = "";
        } else {
            const err = await response.text();
            alert(err);
        }
    }

    render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'writeBox ' },
                React.createElement(
                    'div',
                    null,
                    'Send a message to all users'
                ),
                React.createElement('textarea', { type: 'text', id: 'send_message', placeholder: 'Write a message', required: true }),
                React.createElement('br', null),
                React.createElement(
                    'div',
                    { className: 'btn' },
                    React.createElement('input', { type: 'button', value: 'Send', onClick: this.handle_click })
                )
            ),
            React.createElement(
                'div',
                { className: 'navigationBar' },
                React.createElement(ReactButton, { name: 'Approve Users', relocation: '/pages/approve.html' }),
                React.createElement(ReactButton, { name: 'Suspend Users', relocation: '/pages/suspend.html' }),
                React.createElement(ReactButton, { name: 'Restore Users', relocation: '/pages/restore.html' }),
                React.createElement(ReactButton, { name: 'Delete Users', relocation: '/pages/delete.html' })
            )
        );
    }
}