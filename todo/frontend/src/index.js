import React from "react";
import ReactDom from "react-dom/client";
import "./index.css";
import App from "./App";

// importing css stylesheet to use the bootstrap class
// add this line only in this file
import "bootstrap/dist/css/bootstrap.min.css";

const container = document.getElementById('root');

// Create a root.
const root = ReactDom.createRoot(container);

root.render(
<React.StrictMode>
	<App />
</React.StrictMode>);

