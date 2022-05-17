import { Fragment } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import OtherPage from "./OtherPage";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  return (
    <Router>
      <Fragment>
        <header className="header">
          <div className="header-logo">Scrape stackoverflow</div>
          <div className="menu-bar">
            <Link className="menu" to="/">Home</Link>
            <Link className="menu" to="/otherpage">Other page</Link>
          </div>
        </header>

        <div className="main">
          <Route exact path="/" component={Dashboard} />
          <Route path="/otherpage" component={OtherPage} />
        </div>
      </Fragment>
    </Router>
  );
}

export default App;
