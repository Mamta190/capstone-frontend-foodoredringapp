import React, {Component} from "react";
import './Home.css';
import RestaurantCard from "../../common/restaurants/RestaurantCard";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Header from "../../common/header/Header";
import "../../../node_modules/font-awesome/css/font-awesome.css"
import useMediaQuery from "@material-ui/core/useMediaQuery";

/* varifying the screen size*/
const withMediaQuery = () => Component => props => {
    const isExtraSmallScreen = useMediaQuery('(max-width:650px)');
    const isSmallScreen = useMediaQuery('(max-width:1000px)');
    const isMediumScreen = useMediaQuery('(max-width:1350px)');
    return <Component isSmallScreen={isSmallScreen} isMediumScreen={isMediumScreen}
                      isExtraSmallScreen={isExtraSmallScreen} {...props} />;
};

/* Providing HomePage*/
class Home extends Component {

    constructor() {
        super();
        this.state = {
            restaurants: [],
            loading: false
        }
        this.handleRestaurantNavigation = this.handleRestaurantNavigation.bind(this);
    }

    handleRestaurantNavigation = (restaurantId) => this.restaurantDetails(restaurantId);


    componentDidMount() {
        this.mounted = true;
        this.getRestaurants();
    }

    render() {
        return (
            <div>
                {/* Provide components only after mounted is true */}
                {this.mounted === true ?
                    <div>
                        {/* Provide Header component */}
                        <Header searchHandler={this.searchHandler} showSearch={true}/>
                        {this.state.loading === true ?
                            <Typography className="loading-spinner" variant="h4"
                                        color="textSecondary">loading...</Typography>
                            : ""
                        }
                        <div className={this.state.restaurants.length === 0 ? "noRestaurantMsg" : "card-container"}>
                            {
                                this.state.restaurants.length === 0 && this.state.loading !== true ?
                                    <Typography variant="h6">
                                        No restaurant with the given name.
                                    </Typography>
                                    :
                                    this.state.restaurants.map(restaurant => (
                                        <Box key={restaurant.id}
                                             className={this.props.isExtraSmallScreen ? "card-mainXSM" :
                                                 (this.props.isSmallScreen ? "card-mainSM" :
                                                     (this.props.isMediumScreen ? "card-mainM" : "card-main"))}>
                                            {/* Provide Restaurant cards components */}
                                            <RestaurantCard restaurant={restaurant}
                                                       handleRestaurantNavigation={this.handleRestaurantNavigation}/>
                                        </Box>
                                    ))}
                        </div>
                    </div>
                    : ""}
            </div>
        );
    }

    /* Fetching the details of restaurants from backend*/
    getRestaurants = () => {
        const headers = {'Accept': 'application/json'}
        let that = this;
        let url = "http://localhost:8080/api/restaurant";
        that.setState({loading: true})
        return fetch(url,
            {method: 'GET', headers}
        ).then((response) => {
            return response.json();
        }).then((jsonResponse) => {
            that.setState({
                restaurants: jsonResponse.restaurants,
                loading: false
            })
        }).catch((error) => {
            console.log('error user data', error);
        });
    }

    /* Takes to Restaurant page with restaurantID*/
    restaurantDetails = (restaurantId) => {
        this.props.history.push("/restaurant/" + restaurantId);
    }

    /* Function for Restaurant search*/
    searchHandler = (event) => {
        let that = this;
        const headers = {'Accept': 'application/json'}
        let url = 'http://localhost:8080/api/restaurant/name/' + event.target.value;
        that.setState({loading: true})
        if (event.target.value === "") {
            this.getRestaurants();
        } else {
            return fetch(url,
                {method: 'GET', headers}
            ).then((response) => {
                return response.json();
            }).then((jsonResponse) => {
                this.setState({
                    restaurants: jsonResponse.restaurants,
                    loading: false
                })
            }).catch((error) => {
                console.log('error user data', error);
            });
        }
    }
}

export default (withMediaQuery() (Home));