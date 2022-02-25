class Landing extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return React.createElement(
            "div",
            { className: "wrapper" },
            React.createElement(
                "div",
                { className: "title-text" },
                React.createElement(
                    "div",
                    { className: "title login" },
                    "Landing"
                )
            ),
            React.createElement(
                "div",
                { className: "form-inner" },
                React.createElement(
                    "div",
                    { className: "btn" },
                    React.createElement(ReactButton, { name: "Log in", relocation: "/pages/login.html" })
                ),
                React.createElement(
                    "div",
                    { className: "btn" },
                    React.createElement(ReactButton, { name: "Sign in", relocation: "/pages/register.html" })
                )
            )
        );
    }
}