CREATE DATABASE Portfolio;
USE Portfolio;

-- ###########################################################################

CREATE TABLE User (
	UserID INT PRIMARY KEY AUTO_INCREMENT,
	Username VARCHAR(50) UNIQUE NOT NULL,
	Password VARCHAR(50),
	FirstName VARCHAR(50) NOT NULL,
	LastName VARCHAR(50)
);

CREATE TABLE Shares (
	Symbol VARCHAR(50) PRIMARY KEY,
	ShareName VARCHAR(100) NOT NULL,
	Information VARCHAR(2000)
);

-- ###########################################################################

CREATE TABLE ShareHistory (
	TimeLog TIMESTAMP,
	ShareSymbol VARCHAR(50) REFERENCES Shares(Symbol) ON DELETE CASCADE ON UPDATE CASCADE,
	Price FLOAT(7, 2) NOT NULL CHECK (CurrentPrice > 0),
	CONSTRAINT primeKey PRIMARY KEY (ShareSymbol, TimeLog)
);

CREATE TABLE WatchList (
	UserID INT REFERENCES User(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
	ShareSymbol VARCHAR(50) REFERENCES Shares(Symbol) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT primeKey PRIMARY KEY (UserID, ShareSymbol)
);

CREATE TABLE BuyShare (
	TimeLog TIMESTAMP,
	UserID INT REFERENCES User(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
	Quantity INT CHECK (Quantity > 0),
	Price FLOAT,
	ShareSymbol VARCHAR(50) REFERENCES Shares(Symbol) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT primeKey PRIMARY KEY (UserID, TimeLog)
);

CREATE TABLE SellShare (
	TimeLog TIMESTAMP,
	UserID INT REFERENCES User(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
	Quantity INT CHECK (Quantity > 0),
	Price FLOAT,
	ShareSymbol VARCHAR(50) REFERENCES Shares(Symbol) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT primeKey PRIMARY KEY (UserID, TimeLog)
);

-- BuySellFlag = 0 => Buy
-- BuySellFlag = 1 => Sell
CREATE TABLE UserHistory (
	UserID INT REFERENCES User(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
	Quantity INT CHECK (Quantity > 0),
	TimeLog TIMESTAMP,
	Price FLOAT NOT NULL,
	BuySellFlag INT CHECK (BuySellFlag = 0 OR BuySellFlag = 1),
	ShareSymbol VARCHAR(50) REFERENCES Shares(Symbol) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT primeKey PRIMARY KEY (UserID, TimeLog)
);

-- ###########################################################################
-- All Stored Procedures

-- delimiter //

-- Get login details of user
-- CREATE PROCEDURE loginDetails(IN name VARCHAR(50))
-- BEGIN
-- SELECT UserID,Password FROM User WHERE Username=name;
-- END//

-- Check if User exists in database
-- CREATE PROCEDURE checkUser(IN name VARCHAR(50))
-- BEGIN
-- SELECT Username FROM User WHERE Username=name;
-- END//

-- Insert user in database 
-- CREATE PROCEDURE insertUser(IN name VARCHAR(50),IN pass VARCHAR(50),IN fname VARCHAR(50),IN lname VARCHAR(50))
-- BEGIN
-- INSERT INTO User (Username,Password,FirstName,LastName) VALUES (name,pass,fname,lname);
-- END//

-- Get ID from Username
-- CREATE PROCEDURE getId(IN name VARCHAR(50))
-- BEGIN
-- SELECT UserID FROM User WHERE Username=name;
-- END//

-- Check if user exists with same username
-- CREATE PROCEDURE updateCheck(IN name VARCHAR(50),IN id INT)
-- BEGIN
-- SELECT Username FROM User WHERE Username=name AND (NOT(UserID=id));
-- END//

-- Get password of User
-- CREATE PROCEDURE getPassword(IN id INT)
-- BEGIN
-- SELECT Password FROM User where UserID = id;
-- END//

-- Update details of a user
-- CREATE PROCEDURE updateUser(IN name VARCHAR(50),IN pass VARCHAR(50),IN fname VARCHAR(50),IN lname VARCHAR(50),IN id INT)
-- BEGIN
-- UPDATE User SET Username=name,Password=pass,FirstName=fname,LastName=lname WHERE UserID=id ;
-- END//

-- List of all the Stocks
-- CREATE PROCEDURE stockList()
-- BEGIN
-- SELECT ShareName, Symbol FROM Shares;
-- END//

-- Stocks in WatchList of a user
-- CREATE PROCEDURE watchList(IN id INT)
-- BEGIN
-- SELECT ShareName, Symbol FROM WatchList, Shares WHERE Shares.Symbol=WatchList.ShareSymbol and UserID=id;
-- END//

-- Details of all the shares bought
-- CREATE PROCEDURE bought(IN id INT)
-- BEGIN
-- SELECT SUM(Quantity) AS bought, SUM(Price*Quantity) AS invested FROM UserHistory WHERE UserID=id AND BuySellFlag=0;
-- END//

-- Details of all the shares sold
-- CREATE PROCEDURE sold(IN id INT)
-- BEGIN
-- SELECT SUM(Quantity) AS sold, SUM(Price*Quantity) AS returns FROM UserHistory WHERE UserID=id AND BuySellFlag=1;
-- END//

-- Get user info FROM UserID
-- CREATE PROCEDURE userInfo(IN id INT)
-- BEGIN
-- SELECT Username, FirstName, LastName FROM User WHERE UserID=id;
-- END//

-- Get Sharename for symbol
-- CREATE PROCEDURE shareName(IN sym VARCHAR(50))
-- BEGIN
-- SELECT Sharename FROM Shares WHERE Symbol=sym;
-- END//

-- Details of Shares bought of specific company
-- CREATE PROCEDURE boughtShare(IN id INT,IN sym VARCHAR(50))
-- BEGIN
-- SELECT SUM(Quantity) AS bought, SUM(Price*Quantity) AS invested FROM UserHistory WHERE UserID=id AND BuySellFlag=0 AND ShareSymbol=sym;
-- END//

-- Details of Shares sold of specific company
-- CREATE PROCEDURE soldShare(IN id INT,IN sym VARCHAR(50))
-- BEGIN
-- SELECT SUM(Quantity) AS sold, SUM(Price*Quantity) AS returns FROM UserHistory WHERE UserID=id AND BuySellFlag=1 AND ShareSymbol=sym;
-- END//

-- Check if share exists in WatchList
-- CREATE PROCEDURE inWatchList(IN id INT,IN sym VARCHAR(50))
-- BEGIN
-- SELECT ShareSymbol FROM WatchList WHERE UserID=id AND ShareSymbol=sym;
-- END//

-- Insert into BuyShare
-- CREATE PROCEDURE buyQuery(IN time TIMESTAMP,IN id INT,IN quant INT,IN price FLOAT,IN sym VARCHAR(50))
-- BEGIN
-- INSERT INTO BuyShare VALUES (time,id,quant,price,sym);
-- END//

-- Insert into SellShare
-- CREATE PROCEDURE sellQuery(IN time TIMESTAMP,IN id INT,IN quant INT,IN price FLOAT,IN sym VARCHAR(50))
-- BEGIN
-- INSERT INTO SellShare VALUES (time,id,quant,price,sym);
-- END//

-- Insert into User History
-- CREATE PROCEDURE userHistory(IN time TIMESTAMP,IN id INT,IN quant INT,IN price FLOAT,IN flag INT,IN sym VARCHAR(50))
-- BEGIN
-- INSERT INTO UserHistory VALUES (id,quant,time,price,flag,sym);
-- END//

-- Insert in WatchList
-- CREATE PROCEDURE insertList(IN id INT,IN sym VARCHAR(50))
-- BEGIN
-- INSERT INTO WatchList VALUES (id,sym);
-- END//

-- Delete FROM WatchList
-- CREATE PROCEDURE deleteList(IN id INT,IN sym VARCHAR(50))
-- BEGIN
-- DELETE FROM WatchList WHERE UserID=id AND ShareSymbol=sym; 
-- END//

-- ###########################################################################
-- Deleting all tables

-- DROP TABLE User;
-- DROP TABLE Shares;
-- DROP TABLE Currency;
-- DROP TABLE ShareHistory;
-- DROP TABLE WatchList;
-- DROP TABLE BuyShare;
-- DROP TABLE SellShare;
-- DROP TABLE UserHistory;