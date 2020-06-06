import React from "react";
import "./Navbar.css";
function Navbar({ isSignedIn, onRouteChange }) {
	if (isSignedIn === true) {
		return (
			<nav style={{ height: "20%", paddingBottom: "0px" }}>
				<nav className="navbar navbar-inverse" style={{ marginBottom: "0px" }}>
					<div
						className="container-fluid"
						style={{ display: "inline-block", float: "left" }}
					>
						<div className="navbar-header">
							<h5
								className="navbar-brand"
								style={{
									marginBottom: "0px",
									marginTop: "0px",
									fontSize: "20px",
								}}
							>
								Portfolio Manager
							</h5>
						</div>
						<ul
							className="nav navbar-nav"
							style={{ display: "inline-block", float: "left" }}
						>
							<li
								id="my-profile"
								style={{
									display: "inline-block",
									float: "left",
									marginLeft: "25px",
									marginTop: "7px",
									marginBottom: "0px",
								}}
							>
								<h5
									style={{ fontSize: "17px" }}
									className="navbar-link"
									onClick={() => onRouteChange("home")}
								>
									My Profile
								</h5>
							</li>
							<li
								id="my-watch-list"
								style={{
									display: "inline-block",
									float: "left",
									marginLeft: "25px",
									marginTop: "7px",
									marginBottom: "0px",
								}}
							>
								<h5
									style={{ fontSize: "17px" }}
									className="navbar-link"
									onClick={() => onRouteChange("watchlist")}
								>
									Watch List
								</h5>
							</li>
							<li
								id="my-stock-list"
								style={{
									display: "inline-block",
									float: "left",
									marginLeft: "25px",
									marginTop: "7px",
									marginBottom: "0px",
								}}
							>
								<h5
									style={{ fontSize: "17px" }}
									className="navbar-link"
									onClick={() => onRouteChange("stocklist")}
								>
									Stock List
								</h5>
							</li>
						</ul>
						<ul
							className="nav navbar-nav navbar-right"
							style={{
								display: "inline-block",
								float: "left",
							}}
						>
							<li
								id="update-profile"
								style={{
									display: "inline-block",
									float: "left",
									marginLeft: "25px",
									marginTop: "7px",
									marginBottom: "0px",
								}}
							>
								<h5
									style={{ fontSize: "17px" }}
									className="navbar-link"
									onClick={() => onRouteChange("update")}
								>
									<span className="glyphicon glyphicon-user"></span>
									Update Profile
								</h5>
							</li>
							<li
								id="logout"
								style={{
									display: "inline-block",
									float: "left",
									marginLeft: "25px",
									marginTop: "7px",
									marginBottom: "0px",
								}}
							>
								<h5
									style={{ fontSize: "17px" }}
									className="navbar-link"
									onClick={() => onRouteChange("signout")}
								>
									<span className="glyphicon glyphicon-log-in"></span>Logout
								</h5>
							</li>
						</ul>
					</div>
				</nav>
			</nav>
		);
	} else {
		return (
			<nav
				style={{
					display: "flex",
					justifyContent: "flex-end",
					paddingBottom: "0px",
					paddingTop: "20px",
					backgroundColor: "white",
				}}
			>
				<h1 style={{ marginRight: "475px", color: "black" }}>
					Welcome to our Portfolio Manager
				</h1>
				<h4
					onClick={() => onRouteChange("signout")}
					className="link dim black underline pa3 pointer"
				>
					Sign In
				</h4>
				<h4
					onClick={() => onRouteChange("register")}
					className="link dim black underline pa3 pointer"
				>
					Register
				</h4>
				<br />
			</nav>
		);
	}
}

export default Navbar;
