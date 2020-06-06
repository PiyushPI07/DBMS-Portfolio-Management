import React from "react";
import ReactDOM from "react-dom";
import "./Signin.css";
import avatar from "../../images/img_avatar.png";
class Signin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			signInUsername: "",
			signInPassword: "",
		};
	}

	invalidDetails(response) {
		const node = ReactDOM.findDOMNode(this);
		var error = node.getElementsByTagName("p");
		if (response === "Invalid username") {
			error[0].innerHTML = "Invalid username or password";
		} else if (response === "Wrong Password") {
			error[0].innerHTML = "Invalid form details";
		}
	}

	onUsernameChange = (event) => {
		this.setState({ signInUsername: event.target.value });
	};

	onPasswordChange = (event) => {
		this.setState({ signInPassword: event.target.value });
	};

	onSubmitSignIn = () => {
		fetch("http://localhost:3000/login", {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: this.state.signInUsername,
				password: this.state.signInPassword,
			}),
		})
			.then((response) => response.json())
			.then((user) => {
				if (user["UserID"]) {
					this.props.loadUser(user);
					this.props.onRouteChange("home");
				} else {
					this.invalidDetails(user);
				}
			});
	};

	render() {
		const { onRouteChange } = this.props;

		return (
			<div className="signin-area">
				<center>
					<h1 style={{ color: "black", paddingTop: "30px", marginTop: "0px" }}>
						Login
					</h1>
				</center>
				<div className="imgcontainer">
					<img
						src={avatar}
						alt="Avatar"
						className="avatar"
						style={{
							width: "100px",
							height: "100px",
						}}
					/>
				</div>
				<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw7 pa5 shadow-5 center">
					<main className="pa4 black-80">
						<fieldset id="signup" className="ba b--transparent ph0 mh0">
							<p></p>
							<h4 htmlFor="username" style={{ color: "black" }}>
								<b>Username</b>
							</h4>
							<input
								type="input"
								placeholder="Enter Username"
								name="username"
								onChange={this.onUsernameChange}
							/>
							<br></br>
							<h4 htmlFor="password" style={{ color: "black" }}>
								<b>Password</b>
							</h4>
							<input
								type="password"
								placeholder="Enter Password"
								name="password"
								onChange={this.onPasswordChange}
							/>
							<br />
							<br />
							<input
								type="submit"
								name="login"
								value="Login"
								onClick={this.onSubmitSignIn}
							></input>

							<p
								style={{ textAlign: "center" }}
								className="f3 link dim dark-blue underline black pa3 pointer"
								onClick={() => onRouteChange("register")}
							>
								Not a member? Sign Up
							</p>
						</fieldset>
					</main>
				</article>
			</div>
		);
	}
}

export default Signin;
