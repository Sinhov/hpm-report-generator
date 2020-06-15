import React from 'react';
import Home from "./Home";
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Views from "./Views";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import TopNav from "./TopNav";
import DataFrame from "dataframe-js";

export default function App() {
  const [dfServices, setDfServices] = React.useState(new DataFrame([],[]));
  // const [dfReservations, setDfReservations] = React.useState(new DataFrame([],[]));

  return (
    <div>
      <CssBaseline />
      <Router>
        <TopNav/>
        <Switch>
          <Route exact path="/">
            <Home dfServices={dfServices} setDfServices={setDfServices}/>
          </Route>
          <Route exact path="/views">
            <Views dfServices={dfServices}/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
