// ################################################################### MySQL

var mysql = require("mysql");
var config = require("./config");

var dbms = mysql.createConnection(config);

var pool = mysql.createPool(config);

dbms.connect(function (err) {
	if (err) throw err;

	dbms.query("USE Portfolio;", function (err, result) {
		if (err) throw err;
		else {
			console.log(">> Successfully connected to Portfolio Database");
		}
	});
});

// ################################################################# Server

var express = require("express");
var app = express();
var getJSON = require("get-json");
var bodyParser = require("body-parser");
var plotly = require("plotly")("portfolioRocks", "bep3vNK5mmXCFdFb9zBa");
var cors = require("cors");

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.json());
app.use(cors());

// List of users
app.get("/", function (req, res) {
	var query = "SELECT * from User";
	dbms.query(query, function (err, result) {
		res.json(result);
	});
});

// Login
app.post("/login", function (req, res) {
	// Get login details of user
	var query = "CALL loginDetails(?)";
	dbms.query(query, req.body.username, function (err, result, fields) {
		if (err) throw err;
		if (result[0].length == 0) {
			res.status(400).json("Invalid username");
		} else if (req.body.password != result[0][0]["Password"]) {
			res.status(400).json("Wrong Password");
		} else {
			res.json(result[0][0]);
		}
	});
});

// Register
app.post("/register", function (req, res) {
	// Check if User exists in database
	var query = `CALL checkUser(?)`;
	dbms.query(query, req.body.username, function (err, result, fields) {
		if (err) throw err;
		if (req.body.username === "") {
			res.status(400).json("empty username");
		} else if (result[0].length === 1) {
			res.status(400).json("username exists");
		} else if (req.body.firstname === "") {
			res.status(400).json("empty firstname");
		} else if (req.body.password === "") {
			res.status(400).json("empty password");
		} else if (req.body.password !== req.body.confirm_password) {
			res.status(400).json("unmatching password");
		} else {
			pool.getConnection(function (err, connection) {
				if (err) {
					console.log(1);
					connection.release();
					throw err;
				}
				connection.query("USE Portfolio;", function (err, result) {
					if (err) {
						connection.release();
						throw err;
					}
				});
				connection.beginTransaction(function (err) {
					if (err) {
						connection.release();
						throw err;
					}
					var insertQuery = `CALL insertUser(?,?,?,?)`;
					connection.query(
						insertQuery,
						[
							req.body.username,
							req.body.password,
							req.body.firstname,
							req.body.lastname,
						],
						function (err, result, fields) {
							if (err) {
								connection.rollback(function () {
									connection.release();
									throw err;
								});
							}
							var IDquery = "CALL getId(?)";
							connection.query(IDquery, req.body.username, function (
								err,
								result,
								fields
							) {
								if (err) {
									connection.rollback(function () {
										connection.release();
										throw err;
									});
								}
								connection.commit(function (err) {
									if (err) {
										connection.rollback(function () {
											connection.release();
											throw err;
										});
									}
									res.json(result[0][0]);
									console.log("success!");
									connection.release();
								});
							});
						}
					);
				});
			});
			// dbms.query("START TRANSACTION", function (err, result) {
			// 	if (err) {
			// 		dbms.query("ROLLBACK");
			// 		throw err;
			// 	}
			// 	var insertQuery = `CALL insertUser(?,?,?,?)`;
			// 	dbms.query(
			// 		insertQuery,
			// 		[
			// 			req.body.username,
			// 			req.body.password,
			// 			req.body.firstname,
			// 			req.body.lastname,
			// 		],
			// 		function (err, result, fields) {
			// 			dbms.query("ROLLBACK", function (error, result) {
			// 				throw err;
			// 			});
			// 			var IDquery = "CALL getId(?)";
			// 			dbms.query(IDquery, req.body.username, function (
			// 				err,
			// 				result,
			// 				fields
			// 			) {
			// 				dbms.query("ROLLBACK", function (error, result) {
			// 					throw err;
			// 				});
			// 				dbms.query("COMMIT", function (err) {
			// 					if (err) {
			// 						dbms.query("ROLLBACK", function (error, result) {
			// 							throw err;
			// 						});
			// 					}
			// 					res.json(result[0][0]);
			// 					console.log("success!");
			// 					// dbms.query("END");
			// 				});
			// 			});
			// 		}
			// 	);
			// });
			// var insertQuery = `CALL insertUser(?,?,?,?)`;
			// dbms.query(
			// 	insertQuery,
			// 	[
			// 		req.body.username,
			// 		req.body.password,
			// 		req.body.firstname,
			// 		req.body.lastname,
			// 	],
			// 	function (err, result, fields) {
			// 		if (err) {
			// 			throw err;
			// 		}
			// 		if (result["affectedRows"] == 1) {
			// 			// Get ID from Username
			// 			var IDquery = "CALL getId(?)";
			// 			dbms.query(IDquery, req.body.username, function (
			// 				err,
			// 				result,
			// 				fields
			// 			) {
			// 				if (err) {
			// 					throw err;
			// 				}
			// 				res.json(result[0][0]);
			// 			});
			// 		}
			// 	}
			// );
		}
	});
});

// Profile
app.post("/profile", function (req, res) {
	// Details of all the shares bought
	var bought = "CALL bought(?)";

	dbms.query(bought, req.body.id, function (err, bght, fields) {
		if (err) throw err;
		// Details of all the shares sold
		var sold = "CALL sold(?)";
		dbms.query(sold, req.body.id, function (err, sld, fields) {
			if (err) throw err;

			var current = Number(bght[0][0]["bought"] - sld[0][0]["sold"]);
			// Get user info FROM UserID
			var userInfoQuery = "CALL userInfo(?)";

			dbms.query(userInfoQuery, req.body.id, function (err, userInfo, fields) {
				const val = {
					current: current,
					invested: Number(bght[0][0]["invested"]),
					returns: Number(sld[0][0]["returns"]),
					username: userInfo[0][0]["Username"],
					firstname: userInfo[0][0]["FirstName"],
					lastname: userInfo[0][0]["LastName"],
				};
				res.json(val);
			});
		});
	});
});

// Watch List
app.post("/watch-list", function (req, res) {
	// Stocks in WatchList of a user
	var query = "CALL watchList(?)";
	dbms.query(query, req.body.id, function (err, result, fields) {
		if (err) throw err;
		res.json(result[0]);
	});
});

// Stock List
app.get("/stock-list", function (req, res) {
	// List of all the Stocks
	var query = "CALL stockList";
	dbms.query(query, function (err, result, fields) {
		if (err) throw err;
		res.json(result[0]);
	});
});

// Stock page
app.post("/share", function (req, res) {
	getJSON(
		"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" +
			req.body.symbol +
			"&interval=1min&apikey=BK1MTDFW41PPGR9P",
		function (err, data) {
			if (err) throw err;
			if (data["Error Message"]) {
				res.status(400).json("Unable to fetch data");
			} else {
				// Get Sharename for symbol
				var query = "CALL shareName(?)";
				dbms.query(query, req.body.symbol, function (err, resultname, fields) {
					if (err) throw err;
					// Check if share exists in WatchList
					var existsQuery = "CALL inWatchList(?,?)";

					dbms.query(existsQuery, [req.body.id, req.body.symbol], function (
						err,
						result,
						fields
					) {
						if (err) throw err;

						// Details of Shares bought of specific company
						var bought = "CALL boughtShare(?,?)";

						dbms.query(bought, [req.body.id, req.body.symbol], function (
							err,
							bght,
							fields
						) {
							if (err) throw err;
							// Details of Shares sold of specific company
							var sold = "CALL soldShare(?,?)";
							dbms.query(sold, [req.body.id, req.body.symbol], function (
								err,
								sld,
								fields
							) {
								if (err) throw err;

								var current = Number(bght[0][0]["bought"] - sld[0][0]["sold"]);
								var xdata = [],
									y = [];
								for (x in data["Time Series (1min)"]) {
									xdata.push(x);
									y.push(Number(data["Time Series (1min)"][x]["4. close"]));
								}
								var val = {
									data: data,
									name: resultname[0][0]["Sharename"],
									inWatchList: result[0].length > 0,
									current: current,
									invested: Number(bght[0][0]["invested"]),
									returns: Number(sld[0][0]["returns"]),
									Plotly: plotly,
									xdata: xdata,
									y: y,
								};
								res.json(val);
							});
						});
					});
				});
			}
		}
	);
});

// Buy share
app.post("/buy", function (req, res) {
	var now = new Date();
	var timestamp =
		now.toISOString().substr(0, 10) + " " + now.toISOString().substr(11, 8);
	// Insert into BuyShare
	var buyQuery = "CALL buyQuery(?,?,?,?,?)";

	dbms.query(
		buyQuery,
		[
			timestamp,
			req.body.id,
			req.body.quantity,
			req.body.price,
			req.body.symbol,
		],
		function (err, result, fields) {
			if (err) throw err;
			// Insert into User History
			var historyQuery = "call userHistory(?,?,?,?,?,?)";

			dbms.query(
				historyQuery,
				[
					timestamp,
					req.body.id,
					req.body.quantity,
					req.body.price,
					0,
					req.body.symbol,
				],
				function (err, result, fields) {
					if (err) throw err;
					res.json(result);
				}
			);
		}
	);
});

// Sell share
app.post("/sell", function (req, res) {
	var now = new Date();
	var timestamp =
		now.toISOString().substr(0, 10) + " " + now.toISOString().substr(11, 8);
	// Insert into SellShare
	var sellQuery = "CALL sellQuery(?,?,?,?,?)";

	dbms.query(
		sellQuery,
		[
			timestamp,
			req.body.id,
			req.body.quantity,
			req.body.price,
			req.body.symbol,
		],
		function (err, result, fields) {
			if (err) throw err;
			// Insert into User History
			var historyQuery = "CALL userHistory(?,?,?,?,?,?)";
			dbms.query(
				historyQuery,
				[
					timestamp,
					req.body.id,
					req.body.quantity,
					req.body.price,
					1,
					req.body.symbol,
				],
				function (err, result, fields) {
					if (err) throw err;
					res.json(result);
				}
			);
		}
	);
});

// Add to watch list
app.post("/add", function (req, res) {
	// Insert into Watch list
	var query = "CALL insertList(?,?)";

	dbms.query(query, [req.body.id, req.body.symbol], function (
		err,
		result,
		fields
	) {
		if (err) throw err;
		res.json(result);
	});
});

// Remove from watch list
app.post("/remove", function (req, res) {
	// Delete from Watch list
	var query = "CALL deleteList(?,?)";
	dbms.query(query, [req.body.id, req.body.symbol], function (
		err,
		result,
		fields
	) {
		if (err) throw err;
		if (result["affectedRows"]) {
			// Stocks in WatchList of a user
			var query = "CALL watchList(?)";
			dbms.query(query, req.body.id, function (err, result, fields) {
				if (err) throw err;
				res.json(result[0]);
			});
		}
	});
});

// Update Profile
app.post("/update-profile", function (req, res) {
	// Get user info FROM UserID
	var userInfoQuery = `CALL userInfo(?)`;
	dbms.query(userInfoQuery, req.body.id, function (err, result, fields) {
		if (err) throw err;
		const value = {
			username: result[0][0]["Username"],
			firstname: result[0][0]["FirstName"],
			lastname: result[0][0]["LastName"],
		};
		res.json(value);
	});
});

// Update Profile
app.post("/save", function (req, res) {
	// Check if user exists with same username
	var query = "CALL updateCheck(?,?)";
	dbms.query(query, [req.body.username, req.body.id], function (
		err,
		result,
		fields
	) {
		if (err) throw err;
		// Get password of User
		var currentPasswordQuery = "CALL getPassword(?)";
		dbms.query(currentPasswordQuery, req.body.id, function (err, pass, fields) {
			if (err) throw err;
			if (req.body.username == "") {
				res.status(400).json("empty username");
			} else if (result[0].length == 1) {
				res.status(400).json("username exists");
			} else if (req.body.firstname == "") {
				res.status(400).json("empty firstname");
			} else if (req.body.old_password != pass[0][0]["Password"]) {
				res.status(400).json("incorrect old password");
			} else if (req.body.new_password === "") {
				res.status(400).json("empty new password");
			} else if (req.body.new_password !== req.body.confirm_password) {
				res.status(400).json("unmatching password");
			} else {
				// Update details of a user
				var updateQuery = "CALL updateUser(?,?,?,?,?)";
				dbms.query(
					updateQuery,
					[
						req.body.username,
						req.body.new_password,
						req.body.firstname,
						req.body.lastname,
						req.body.id,
					],
					function (err, result, fields) {
						if (err) throw err;
						res.json(result);
					}
				);
			}
		});
	});
});

app.listen(3000);
console.log("Connect to http://127.0.0.1:3000/");

// Alpha-Vantage API Key : ZQBDTSMTGR1O70Q9
// https://www.alphavantage.co/documentation/
