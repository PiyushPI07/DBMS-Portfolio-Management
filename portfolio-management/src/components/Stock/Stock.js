import React from "react";
import { Helmet } from "react-helmet";
import "./Stock.css";
import createPlotlyComponent from "react-plotlyjs";
import Plotly from "plotly.js-basic-dist";
const PlotlyComponent = createPlotlyComponent(Plotly);

class Stock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			name: "",
			inWatchList: false,
			current: 0,
			invested: 0,
			returns: 0,
			Plotly: {},
			xdata: [],
			y: [],
			price: 0,
			isLoading: true,
			buyValue: 0,
			sellValue: 0,
		};
	}

	fetchData() {
		fetch("http://localhost:3000/share", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: this.props.id,
				symbol: this.props.symbol,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data["name"]) {
					var price;
					for (var key in data["data"]["Time Series (1min)"]) {
						price = data["data"]["Time Series (1min)"][key]["4. close"];
						break;
					}
					this.setState({
						data: data["data"],
						name: data["name"],
						inWatchList: data["inWatchList"],
						current: data["current"],
						invested: data["invested"],
						returns: data["returns"],
						Plotly: data["Plotly"],
						xdata: data["xdata"],
						price: price,
						y: data["y"],
						isLoading: false,
						buyValue: 0,
						sellValue: 0,
					});
				} else {
					this.props.onRouteChange("anything");
				}
			});
	}

	onBuyValueChange = (event) => {
		this.setState({ buyValue: event.target.value });
	};

	onSellValueChange = (event) => {
		this.setState({ sellValue: event.target.value });
	};

	addToList() {
		fetch("http://localhost:3000/add", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: this.props.id,
				symbol: this.props.symbol,
			}),
		}).then((response) => response.json());
		this.setState({ inWatchList: true });
		this.props.onRouteChange("watchlist");
	}

	removeFromList() {
		fetch("http://localhost:3000/remove", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: this.props.id,
				symbol: this.props.symbol,
			}),
		}).then((response) => response.json());
		this.setState({ inWatchList: false });
	}

	buyShare = (event) => {
		event.preventDefault();
		fetch("http://localhost:3000/buy", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: this.props.id,
				symbol: this.props.symbol,
				quantity: this.state.buyValue,
				price: this.state.price,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				this.fetchData();
			});
	};

	sellShare = (event) => {
		event.preventDefault();
		fetch("http://localhost:3000/sell", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: this.props.id,
				symbol: this.props.symbol,
				quantity: this.state.sellValue,
				price: this.state.price,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				this.fetchData();
			});
	};

	componentDidMount() {
		this.fetchData();
	}

	render() {
		const { symbol } = this.props;
		var X = [];
		var Y = [];
		var plotData;
		if (this.state.data) {
			for (var key in this.state.xdata) {
				X.push(this.state.xdata[key]);
			}
			Y = this.state.y;
			var trace = {
				x: X,
				y: Y,
				type: "scatter",
			};
			plotData = [trace];
		}
		return (
			<div>
				<Helmet>
					<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
					<title>{symbol}</title>
				</Helmet>
				{this.state.isLoading === true ? (
					<h1 style={{ color: "white" }}>Loading...</h1>
				) : (
					<div className="stock-white-box">
						<center>
							<p style={{ fontSize: "40px" }}>{this.state.name}</p>
						</center>
						<div className="container">
							<div style={{ width: "30%", float: "left" }}>
								<p style={{ fontSize: "25px" }}>Symbol : {symbol}</p>
								<p style={{ fontSize: "17px" }}>
									Current price : $ {this.state.price}
								</p>
								<p style={{ fontSize: "17px" }}>
									Current holdings : {this.state.current} share
									{this.state.current !== 1 ? "s" : ""}
								</p>
								<p style={{ fontSize: "17px" }}>
									Net Worth : ${" "}
									{(this.state.current * this.state.price).toFixed(2)}
								</p>
								<p style={{ fontSize: "17px" }}>
									Total Invested : $ {this.state.invested.toFixed(2)}
								</p>
								<p style={{ fontSize: "17px" }}>
									Total Returns : $ {this.state.returns.toFixed(2)}
								</p>
								<p style={{ fontSize: "17px" }}>
									Total Profit/Loss (Including Net Worth) : $
									{(
										this.state.current * this.state.price +
										this.state.returns -
										this.state.invested
									).toFixed(2)}
								</p>
								<br></br>
								{this.state.inWatchList === false ? (
									<p style={{ fontSize: "17px" }}>
										Add to Watch List
										<button
											className="watchlist"
											name="symbol"
											value={symbol}
											onClick={() => this.addToList()}
										>
											+
										</button>
									</p>
								) : (
									<p style={{ fontSize: "17px" }}>
										Remove from Watch List
										<button
											className="watchlist"
											name="symbol"
											value={symbol}
											onClick={() => this.removeFromList()}
										>
											-
										</button>
									</p>
								)}
								<br></br>
								<form className="buy-form" onSubmit={this.buyShare}>
									<input
										style={{ width: "37%" }}
										type="number"
										name="quantity"
										min="1"
										value={this.state.buyValue}
										onChange={this.onBuyValueChange}
									/>
									&nbsp;
									<input
										type="hidden"
										name="symbol"
										value={symbol}
										onChange={this.onBuyValueChange}
									/>
									<input
										type="hidden"
										name="price"
										value={this.state.price}
										onChange={this.onBuyValueChange}
									/>
									<input
										style={{ backgroundColor: "green" }}
										type="submit"
										name="buy"
										value="Buy"
									/>
								</form>
								<br></br>
								<form className="sell-form" onSubmit={this.sellShare}>
									<input
										style={{ width: "37%" }}
										type="number"
										name="quantity"
										min="1"
										value={this.state.sellValue}
										onChange={this.onSellValueChange}
									/>
									&nbsp;
									<input
										type="hidden"
										name="symbol"
										value={symbol}
										onChange={this.onSellValueChange}
									/>
									<input
										type="hidden"
										name="price"
										value={this.state.price}
										onChange={this.onSellValueChange}
									/>
									<input
										style={{ backgroundColor: "#cc0000" }}
										type="submit"
										name="sell"
										value="Sell"
									/>
								</form>
							</div>
							<div style={{ width: "50%", float: "right" }}>
								<div id="tester" style={{ width: "450px", height: "250px" }}>
									<PlotlyComponent
										className="whatever"
										data={plotData}
										layout={{ width: 400, height: 300 }}
										config={{
											showLink: false,
											displayModeBar: true,
										}}
									/>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default Stock;
