import React from "react";
import "./Profile.css";

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			username: "",
			fname: "",
			lname: "",
			current: 0,
			invested: 0,
			returns: 0,
		};
	}

	fetchUser() {
		fetch("http://localhost:3000/profile", {
			method: "post",
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
					current: user["current"],
					invested: user["invested"],
					returns: user["returns"],
					isLoading: false,
				});
			});
	}

	componentDidMount() {
		this.fetchUser();
	}

	render() {
		return (
			<div className="profile-white-box">
				<div
					className="container"
					style={{
						textAlign: "center",
						paddingRight: "650px",
						paddingTop: "50px",
					}}
				>
					<p style={{ fontSize: "48px" }}>My Profile</p>
					<br />
					{this.state.isLoading === true ? (
						<h1>Loading...</h1>
					) : (
						<div>
							<p>Username : {this.state.username}</p>
							<p>
								Name : {this.state.fname} {this.state.lname}
							</p>
							<p>
								Current holdings : {this.state.current} share
								{this.state.current !== 1 ? "s" : ""}
							</p>
							<p>Total Invested : $ {this.state.invested.toFixed(2)}</p>
							<p>Total Returns : $ {this.state.returns.toFixed(2)}</p>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default Profile;
