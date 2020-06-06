import React from "react";
import ReactDOM from "react-dom";
import "./UpdateProfile.css";
class UpdateProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			opass: "",
			pass: "",
			fname: "",
			lname: "",
			cpass: "",
			flag: false,
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
		} else if (response === "incorrect old password") {
			error[0].innerHTML = "Old password is incorrect";
		} else if (response === "empty new password") {
			error[0].innerHTML = "New password can't be empty";
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

	onOldPasswordChange = (event) => {
		this.setState({ opass: event.target.value });
	};

	onPasswordChange = (event) => {
		this.setState({ pass: event.target.value });
	};

	onConfirmPasswordChange = (event) => {
		this.setState({ cpass: event.target.value });
	};

	onUpdateProfile = () => {
		fetch("http://localhost:3000/save", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: this.state.username,
				old_password: this.state.opass,
				new_password: this.state.pass,
				confirm_password: this.state.cpass,
				firstname: this.state.fname,
				lastname: this.state.lname,
				id: this.props.id,
			}),
		})
			.then((response) => response.json())
			.then((user) => {
				if (user["affectedRows"]) {
					this.props.onRouteChange("home");
				} else {
					this.invalidDetails(user);
				}
			});
	};

	fetchData = () => {
		fetch("http://localhost:3000/update-profile", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: this.props.id,
			}),
		})
			.then((response) => response.json())
			.then((user) => {
				this.setState({
					username: user["username"],
					fname: user["firstname"],
					lname: user["lastname"],
					flag: true,
				});
			});
	};

	componentDidMount() {
		this.fetchData();
	}

	render() {
		return (
			<div style={{ backgroundColor: "white" }}>
				{this.state.flag === false ? (
					<h1>Loading...</h1>
				) : (
					<div className="update-area">
						<center style={{ color: "black" }}>
							<h1 style={{ paddingTop: "40px", marginTop: "0px" }}>
								Update Profile
							</h1>
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
										value={this.state.username}
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
										value={this.state.fname}
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
										value={this.state.lname}
										onChange={this.onLnameChange}
									/>
									<br></br>
									<h4 htmlFor="opassword">
										<b>Old Password</b>
									</h4>
									<input
										type="password"
										placeholder="Enter Old Password"
										name="opassword"
										onChange={this.onOldPasswordChange}
									/>
									<br></br>
									<h4 htmlFor="password">
										<b>Password</b>
									</h4>
									<input
										type="password"
										placeholder="Enter New Password"
										name="password"
										onChange={this.onPasswordChange}
									/>
									<br></br>
									<h4 htmlFor="cpassword">
										<b>Confirm Password</b>
									</h4>
									<input
										type="password"
										placeholder="Enter Confirm New Password"
										name="cpassword"
										onChange={this.onConfirmPasswordChange}
									/>
									<br />
									<br />
									<input
										type="submit"
										name="update"
										value="Update Profile"
										onClick={() => this.onUpdateProfile()}
									></input>
								</fieldset>
							</main>
						</article>
					</div>
				)}
			</div>
		);
	}
}

export default UpdateProfile;
