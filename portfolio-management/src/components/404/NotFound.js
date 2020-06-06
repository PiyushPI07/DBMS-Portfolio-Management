import React from "react";
import { Helmet } from "react-helmet";
import "./NotFound.css";
class NotFound extends React.Component {
	render() {
		return (
			<div className="error">
				<Helmet>
					<title>404 Error</title>
				</Helmet>
				<h1>404, Oops!</h1>
				<p>Page not found</p>
			</div>
		);
	}
}

export default NotFound;
