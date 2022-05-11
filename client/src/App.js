import { Fragment } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import TestComponent from "./TestComponent";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <Fragment>
        <header className="header">
          <div>Scrape Stackoverflow</div>
          <div>
            <Link to="/">Dashboard</Link>
            <Link to="/about">About</Link>
          </div>

        </header>
        <div className="main">
          <Route exact path="/" component={Dashboard} />
          <Route path="/about" component={TestComponent} />
        </div>
      </Fragment>
    </Router>
  );
}

export default App;
