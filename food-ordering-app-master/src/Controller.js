import React, { Component } from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import Home from "./screens/home/Home";
import Details from "./screens/details/Details";
import Checkout from "./screens/checkout/Checkout"
import Profile from "./screens/profile/Profile"

class Controller extends Component {
    constructor() {
        super();
        this.baseUrl = "http://localhost:8080/api";
    }
    render(){
        return(
            <div>
                <Router>
                <Route exact path="/" render={(props) => <Home {...props} baseUrl={this.baseUrl}/>} />
                <Route exact path='/restaurant/:restaurantId' render={(props) => <Details {...props} baseUrl={this.baseUrl}/>}/>
                <Route exact path="/checkout" render={(props) => <Checkout {...props} baseUrl={this.baseUrl}/>}/>
                <Route exact path='/profile' render={(props) => <Profile {...props} />}/>
                </Router>
            </div>
        );
    }

}
export default Controller;
