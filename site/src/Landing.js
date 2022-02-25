class Landing extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return <div className="wrapper">
            <div className="title-text">
                <div className="title login">
                    Landing
                </div>
            </div>
            <div className="form-inner">
                    <div className="btn">
                        <ReactButton name='Log in' relocation='/pages/login.html'></ReactButton>
                    </div>
                    <div className="btn">
                        <ReactButton name='Sign in' relocation='/pages/register.html'></ReactButton>
                    </div>
            </div>

        </div>
    }
}



