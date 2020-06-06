import React from "react";
import "./App.css";
import Register from "./components/Register/Register";
import Signin from "./components/Signin/Signin";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./components/Profile/Profile";
import Stock from "./components/Stock/Stock";
import StockList from "./components/StockList/StockList";
import WatchList from "./components/WatchList/WatchList.js";
import UpdateProfile from "./components/UpdateProfile/UpdateProfile";
import NotFound from "./components/404/NotFound";

const initialState = {
	route: "signout",
	isSignedIn: false,
	user: {
		id: 0,
	},
	symbol: "",
};

class App extends React.Component {
	constructor() {
		super();
		this.state = initialState;
	}

	onRouteChange = (route) => {
		if (route === "signout") {
			this.setState(initialState);
		} else if (route === "home") {
			this.setState({ isSignedIn: true });
		}
		this.setState({ route: route });
	};

	loadUser = (user) => {
		this.setState({
			user: {
				id: user["UserID"],
			},
		});
	};

	loadSymbol = (symbol) => {
		this.setState({ symbol: symbol });
	};

	render() {
		return (
			<div className="App">
				<link
					rel="stylesheet"
					href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
				/>
				<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
				<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
				<Navbar
					onRouteChange={this.onRouteChange}
					isSignedIn={this.state.isSignedIn}
				/>
				{this.state.route === "home" ? (
					<div>
						<Profile id={this.state.user["id"]} />
					</div>
				) : this.state.route === "watchlist" ? (
					<WatchList
						id={this.state.user["id"]}
						onRouteChange={this.onRouteChange}
						loadSymbol={this.loadSymbol}
					/>
				) : this.state.route === "stock" ? (
					<Stock
						symbol={this.state.symbol}
						id={this.state.user["id"]}
						onRouteChange={this.onRouteChange}
					/>
				) : this.state.route === "stocklist" ? (
					<StockList
						onRouteChange={this.onRouteChange}
						loadSymbol={this.loadSymbol}
					/>
				) : this.state.route === "update" ? (
					<UpdateProfile
						id={this.state.user["id"]}
						onRouteChange={this.onRouteChange}
					/>
				) : this.state.route === "register" ? (
					<Register
						onRouteChange={this.onRouteChange}
						loadUser={this.loadUser}
					/>
				) : this.state.route === "signout" ? (
					<Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
				) : (
					<NotFound />
				)}
			</div>
		);
	}
}

export default App;
