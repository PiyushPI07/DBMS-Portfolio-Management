import React from "react";
import ReactDOM from "react-dom";
import "./Register.css";

class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			pass: "",
			fname: "",
			lname: "",
			cpass: "",
		};
	}

	invalidDetails(response) {
		const node = ReactDOM.findDOMNode(this);
		var error = node.getElementsByTagName("p");
		if (response === "empty username") {
			error[0].innerHTML = "Username is required";
		} else if (response === "username exists") {
			error[0].innerHTML = "Username already exists";
		} else if (response === "empty firstname") {
			error[0].innerHTML = "Firstname is required";
		} else if (response === "empty password") {
			error[0].innerHTML = "Password can't be empty";
		} else if (response === "unmatching password") {
			error[0].innerHTML = "Passwords don't match";
		}
	}

	onUsernameChange = (event) => {
		this.setState({ username: event.target.value });
	};

	onFnameChange = (event) => {
		this.setState({ fname: event.target.value });
	};

	onLnameChange = (event) => {
		this.setState({ lname: event.target.value });
	};

	onPasswordChange = (event) => {
		this.setState({ pass: event.target.value });
	};

	onConfirmPasswordChange = (event) => {
		this.setState({ cpass: event.target.value });
	};

	onSubmitRegister = () => {
		fetch("http://localhost:3000/register", {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: this.state.username,
				password: this.state.pass,
				confirm_password: this.state.cpass,
				firstname: this.state.fname,
				lastname: this.state.lname,
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
			<div className="register-area">
				<center style={{ color: "black" }}>
					<h1 style={{ paddingTop: "30px", marginTop: "0px" }}>Sign Up</h1>
					<h3>Please fill in this form to create an account.</h3>
				</center>
				<article className="br3 ba b--black-10 mv4 w-100 w-50-m mw7 shadow-5 center">
					<main className="pa4 black-80">
						<fieldset id="signup" className="ba b--transparent ph0 mh0">
							<p></p>
							<h4 htmlFor="username">
								<b>Username</b>
							</h4>
							<input
								type="input"
								placeholder="Enter Username"
								name="username"
								onChange={this.onUsernameChange}
							/>
							<br></br>
							<h4 htmlFor="fname">
								<b>First name</b>
							</h4>
							<input
								type="input"
								placeholder="Enter First name"
								name="fname"
								onChange={this.onFnameChange}
							/>
							<br></br>
							<h4 htmlFor="lname">
								<b>Last name</b>
							</h4>
							<input
								type="input"
								placeholder="Enter Last name"
								name="lname"
								onChange={this.onLnameChange}
							/>
							<br></br>
							<h4 htmlFor="password">
								<b>Password</b>
							</h4>
							<input
								type="password"
								placeholder="Enter Password"
								name="password"
								onChange={this.onPasswordChange}
							/>
							<br></br>
							<h4 htmlFor="cpassword">
								<b>Confirm Password</b>
							</h4>
							<input
								type="password"
								placeholder="Enter Confirm Password"
								name="cpassword"
								onChange={this.onConfirmPasswordChange}
							/>
							<br />
							<br />
							<input
								type="submit"
								name="signup"
								value="Register"
								onClick={() => this.onSubmitRegister()}
							></input>
							<h4
								style={{ textAlign: "center" }}
								className="f3 link dim dark-blue underline black pa3 pointer"
								onClick={() => onRouteChange("signout")}
							>
								Already a member? Sign in
							</h4>
						</fieldset>
					</main>
				</article>
			</div>
		);
	}
}

export default Register;
