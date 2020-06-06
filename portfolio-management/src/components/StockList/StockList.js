import React from "react";

class StockList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			stocks: [],
			isLoading: true,
		};
	}

	fetchStocks() {
		fetch("http://localhost:3000/stock-list")
			.then((response) => response.json())
			.then((result) => {
				this.setState({ stocks: result, isLoading: false });
			});
	}

	setStock(symbol) {
		this.props.loadSymbol(symbol);
		this.props.onRouteChange("stock");
	}

	componentDidMount() {
		this.fetchStocks();
	}

	render() {
		return (
			<div>
				<h1 style={{ color: "white", paddingTop: "70px" }}>List of Stocks</h1>
				<table className="container">
					<tbody>
						{this.state.isLoading === true ? (
							<tr>
								<td>
									<h1 style={{ color: "white" }}>Loading...</h1>
								</td>
							</tr>
						) : (
							this.state.stocks.map((stock) => {
								return (
									<tr key={stock["Symbol"]} style={{ fontSize: "17px" }}>
										<td>{stock["ShareName"]}</td>
										<td>
											<h1>
												<p>
													<button
														style={{ borderRadius: "20px", marginLeft: "65%" }}
														onClick={() => this.setStock(stock["Symbol"])}
													>
														View
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
		);
	}
}

export default StockList;
