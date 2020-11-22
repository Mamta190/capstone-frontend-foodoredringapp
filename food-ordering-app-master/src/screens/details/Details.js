import React, {Component} from "react";
import Header from "../../common/header/Header";
import Typography from "@material-ui/core/Typography";
import './Details.css';
import DetailsRestaurants from "../../common/details/DetailsRestaurants";
import DetailsMenu from "../../common/details/DetailsMenu";
import DetailsCart from "../../common/details/DetailsCart";
import Notification from "../../common/notification/Notification";
import useMediaQuery from "@material-ui/core/useMediaQuery";

// Constants for verifying screen size
const withMediaQuery = () => Component => props => {
    const isSmallScreen = useMediaQuery('(max-width:700px)');
    const isMediumScreen = useMediaQuery('(max-width:1000px)');
    return <Component isSmallScreen={isSmallScreen} isMediumScreen={isMediumScreen} {...props} />;
};

// Rendering the Details page
class Details extends Component {
    constructor() {
        super();
        this.state = {
            restaurant: null,
            cartItem: {id:null, name:null, type:null, quantity:0, price:0, itemPrice:0},
            cartItems: [],
            totalAmount: 0,
            totalItems: 0,
            notificationOpen: false,
            loggedIn: sessionStorage.getItem("access-token") !== null,
        }
        this.handleAddMenuItem = this.handleAddMenuItem.bind(this);
        this.handleAddCartItem = this.handleAddCartItem.bind(this);
        this.handleRemoveCartItem = this.handleRemoveCartItem.bind(this);
        this.handleCheckoutClick = this.handleCheckoutClick.bind(this);
        this.closeNotification = this.closeNotification.bind(this);
        this.msgItemAdded = "Item added to cart!";
        this.msgItemRemoved = "item removed from cart!"
        this.msgItemIncreased = "Item quantity increased by 1!";
        this.msgItemDecreased = "Item quantity decreased by 1!";
        this.msgLoginNotOk = "Please login first!";
        this.msgEmptyCart = "Please add an item to your cart!";
    }

    handleAddMenuItem = (item) => this.addToCartHandler(item);
    handleAddCartItem = (item) => this.increaseCartItemHandler(item);
    handleRemoveCartItem = (item) => this.decreaseCartItemHandler(item);
    handleCheckoutClick = () => this.checkout();

    componentDidMount() {
        this.getRestaurant();
    }

    render() {
        return (
            <div>
                {this.state.loading === true ?
                    <Typography className="loading-spinner" variant="h4"
                                color="textSecondary">loading...</Typography>
                    : ""
                }
                {this.state.restaurant !== null ?
                    <div>
                        {/*Header section*/}
                        <Header searchHandler={this.searchHandler}/>

                        {/*Restaurant Details section*/}
                        <div className="restaurant-section">
                            <DetailsRestaurants restaurant={this.state.restaurant} isSmallScreen={this.props.isSmallScreen}/>
                        </div>
                        <div className={this.props.isSmallScreen ? "section2SM" : "section2" }>

                            {/*Restaurant Menu section*/}
                            <div className={this.props.isSmallScreen ? "item-sectionSM" : "item-section"}>
                                {this.state.restaurant.categories.map((category, index) => (
                                    <span key={category.id + "category"}>
                                        <DetailsMenu
                                        category={category}
                                                         handleAddMenuItem={this.handleAddMenuItem}
                                                         isSmallScreen={this.props.isSmallScreen}
                                                         isMediumScreen={this.props.isMediumScreen}/>
                                    </span>
                                ))
                                }
                            </div>

                            {/*Checkout Cart section*/}
                            <div className={this.props.isSmallScreen ? "cart-sectionSM" : (this.props.isMediumScreen ? "cart-sectionM" : "cart-section") }>
                                <DetailsCart cartItems={this.state.cartItems}
                                                 totalAmount={this.state.totalAmount}
                                                 totalItems={this.state.totalItems}
                                                 handleAddCartItem={this.handleAddCartItem}
                                                 handleRemoveCartItem={this.handleRemoveCartItem}
                                                 handleCheckoutClick={this.handleCheckoutClick}
                                                 isSmallScreen={this.props.isSmallScreen}
                                                 isMediumScreen={this.props.isMediumScreen}/>
                            </div>
                        </div>
                        {this.state.notificationOpen === true ?
                            <Notification messageText={this.state.messageText} open={this.state.notificationOpen}
                                          onClose={this.closeNotification}/>
                            : ""
                        }
                    </div>
                    : ""}
            </div>
        )
    }

    // Fetches the restaurant from backend
    getRestaurant() {
        const headers = {'Accept': 'application/json'};
        let that = this;
        let url = this.props.baseUrl + '/restaurant/' + this.props.match.params.restaurantId;
        that.setState({loading: true})
        return fetch(url,
            {method: 'GET', headers}
        ).then((response) => {
            return response.json();
        }).then((jsonResponse) => {
            this.setState({
                restaurant: jsonResponse,
                address: jsonResponse.address,
                categories: jsonResponse.categories,
                loading: false,
            })
        }).catch((error) => {
            console.log('error user data', error);
        });
    }

    // show notification on Snackerbar
    showNotification = (message) => this.setState({messageText: message, notificationOpen: true});
    // close Snackerbar notification
    closeNotification = () => this.setState({messageText: null, notificationOpen: false});

    // function to handle item into cart
    addToCartHandler = (item) => {
        let totalAmount = this.state.totalAmount;
        let totalItems = this.state.totalItems;
        totalAmount += item.price;
        totalItems += 1;

        let newItem =this.state.cartItem;
        newItem.id = item.id;
        newItem.name = item.item_name;
        newItem.type = item.item_type;
        newItem.quantity = 1;
        newItem.price = item.price * newItem.quantity;
        newItem.itemPrice = item.price;

        if(this.state.cartItems.length !== 0 && this.state.cartItems.some(cItem => (cItem.id === item.id))){
            const index = this.state.cartItems.findIndex(cItem => cItem.id === item.id);

            const updateItem = this.state.cartItems[index];
            updateItem.quantity = this.state.cartItems[index].quantity + 1;
            updateItem.price = this.state.cartItems[index].price + item.price;
        }
        else {
            this.setState({cartItem: newItem})
            this.setState({cartItem: {}});
            this.state.cartItems.push(this.state.cartItem);
        }
        this.setState({totalAmount: totalAmount})
        this.setState({totalItems: totalItems});
        this.showNotification(this.msgItemAdded);
    }

    // function to increase quantity of item in cart
    increaseCartItemHandler = (item) => {
        const index = this.state.cartItems.findIndex(cItem => cItem.id === item.id);
        const updateItem = this.state.cartItems[index];
        updateItem.quantity = this.state.cartItems[index].quantity + 1;
        updateItem.price = this.state.cartItems[index].price + item.itemPrice;
        this.setState(item);
        let totalAmount = this.state.totalAmount;
        let totalItems = this.state.totalItems;
        totalAmount += item.itemPrice;
        totalItems += 1;
        this.setState({totalAmount: totalAmount})
        this.setState({totalItems: totalItems});
        this.showNotification(this.msgItemIncreased);
    }

    // function to decrease quantity of item in cart
    decreaseCartItemHandler = (item) => {
        const index = this.state.cartItems.findIndex(cItem => cItem.id === item.id);
        const updateItem = this.state.cartItems[index];
        if(updateItem.quantity === 1){
            this.state.cartItems.splice(index, 1);
            this.showNotification(this.msgItemRemoved);
        }else if(updateItem.quantity > 1) {
            updateItem.quantity = this.state.cartItems[index].quantity - 1;
            updateItem.price = this.state.cartItems[index].price - item.itemPrice;
            this.setState(item);
            this.showNotification(this.msgItemDecreased);
        }
        let totalAmount = this.state.totalAmount;
        let totalItems = this.state.totalItems;
        totalAmount -= item.itemPrice;
        totalItems -= 1;
        this.setState({totalAmount: totalAmount})
        this.setState({totalItems: totalItems});
    }

    // function to navigate to checkout page
    checkout = () => {
        if(this.state.cartItems.length === 0){
            this.showNotification(this.msgEmptyCart);
        }
        else if(this.state.cartItems.length > 0 && sessionStorage.getItem("access-token") == null){
            this.showNotification(this.msgLoginNotOk);
        }
        else {
            this.props.history.push({
                pathname: '/checkout/',
                state: {
                    orderItems: this.state.cartItems,
                    totalAmount: this.state.totalAmount, restaurant: this.state.restaurant
                }
            });
        }
    }
}

export default (withMediaQuery() (Details));