import React, { Component } from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import Header from './common/header/Header';

class Controller extends Component {
    constructor() {
        super();
        this.baseUrl = "http://localhost:8080/api/";
    }
    render(){
        return(
            <div>
                <Router>
                    <Route exact path="/" render={()=><Header/>}/>
                </Router>
            </div>
        );
    }

}
export default Controller;
