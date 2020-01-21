import React from "react"
import ReactDOM from "react-dom"

const props = window.props

const Title = () => (
    <div id='welcome' key='title'>
        Welcome to FSM (The Factorio Server Manager)
    </div>
)

const LoginForm = ({ msg, username }) => (
    <form id='login_form' method='post' action='/auth/login' key='form'>
        <div id='login_msg'>{msg}</div>
        <label>
            Username{" "}
            <input id='username' type='text' name='username' defaultValue={username} />
        </label>
        <label>
            Password <input id='password' type='password' name='password' />
        </label>
        <input id='login_button' type='submit' value='Log in' />
    </form>
)

const App = () => (
    <div>
        <Title />
        <LoginForm msg={props.message} username={props.username} />
    </div>
)

export let login = () => {
    ReactDOM.render(<App />, document.getElementById("app"))
}
