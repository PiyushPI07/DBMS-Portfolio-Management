import React from "react";
import "./WatchList.css";

class WatchList extends React.Component {
	constructor() {
		super();
		this.state = {
			isLoading: true,
			watchlist: [],
		};
	}

	getList() {
		fetch("http://localhost:3000/watch-list", {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: this.props.id,
			}),
		})
			.then((response) => response.json())
			.then((shares) => {
				this.setState({ watchlist: shares, isLoading: false });
			});
	}

	deleteShare = (symbol) => {
		this.setState({ isLoading: true });
		fetch("http://localhost:3000/remove", {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: this.props.id,
				symbol: symbol,
			}),
		}).then((response) => response.json());
		var filtered = this.state.watchlist.filter(function (value, index, arr) {
			return value["Symbol"] !== symbol;
		});
		this.setState({ watchlist: filtered, isLoading: false });
	};

	setStock(symbol) {
		this.props.loadSymbol(symbol);
		this.props.onRouteChange("stock");
	}

	componentDidMount() {
		this.getList();
	}

	render() {
		return (
			<div>
				<h1 style={{ color: "white", paddingTop: "70px" }}>My Watch List</h1>
				<div id="link">
					<table className="container">
						<tbody>
							{this.state.isLoading === true ? (
								<tr>
									<td>
										<h1 style={{ color: "white" }}>Loading...</h1>
									</td>
								</tr>
							) : (
								this.state.watchlist.map((share) => {
									return (
										<tr key={share["Symbol"]}>
											<td style={{ fontSize: "17px" }} key="1">
												{share["ShareName"]}
											</td>
											<td key="2">
												<h1>
													<p>
														<button
															style={{
																borderRadius: "20px",
																marginLeft: "65%",
															}}
															onClick={() => this.setStock(share["Symbol"])}
														>
															View
														</button>
													</p>
													<p>
														<button
															style={{
																borderRadius: "20px",
																marginLeft: "65%",
															}}
															name="symbol"
															value={share["Symbol"]}
															onClick={() => this.deleteShare(share["Symbol"])}
														>
															Remove
														</button>
													</p>
												</h1>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

export default WatchList;
