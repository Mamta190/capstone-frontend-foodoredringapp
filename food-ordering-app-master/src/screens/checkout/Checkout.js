import React from 'react';

import {Box, Stepper, Step, useMediaQuery , StepContent, Tabs, Button , Typography, AppBar,
    Tab, StepLabel } from "@material-ui/core";

import {withStyles} from '@material-ui/core/styles';

import {Redirect} from "react-router-dom";
import AddressesGrid from "../../common/checkout/AddressGrid";
import PaymentOptions from "../../common/checkout/PaymentOptions";
import SaveAddressForm from "../../common/checkout/SaveAddressForm";
import OrderSummaryCard from "../../common/checkout/OrderSummaryCard";
import Notification from "../../common/notification/Notification";
import Header from "../../common/header/Header";

import Config from "./Config";


const useStyles = (theme) => ({
    checkoutContainer: {
        flexDirection: 'row',
    },
    checkoutContainerSm: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tab: {
        maxWidth: "50%"
    },
    stepper: {
        padding: "0%"
    },
    summaryCardContainer: {
        width: '28%',
    },
    summaryCardContainerSm: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '5%',
    },
    workflowStepperContainer: {
        width: '72%',
        padding: '1%'
    },
    workflowStepperContainerSm: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '1%'
    }
});

//media query for all screens response
const withMediaQuery = () => Component => props => {
    const isSmallScreen = useMediaQuery('(max-width:650px)');
    return <Component isSmallScreen={isSmallScreen} {...props} />;
};


class Checkout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            activeTab: 0,
            addresses: null,
            states: null,
            paymentMethods: null,
            messageText: null,
            notificationOpen: false,
            addressIndex: -1,
            order: null,
            restaurantName: null,
            orderItems: null,
            netAmount: 0
        }
        /* Binding all the functions and writing the appropriate messages  */
        this.OrderConfirmationHandler = this.OrderConfirmationHandler.bind(this);
        this.placeOrder = this.placeOrder.bind(this);
        this.closeNotification = this.closeNotification.bind(this);
        this.setAddressId = this.setAddressId.bind(this);
        this.setPaymentMethodId = this.setPaymentMethodId.bind(this);
        this.setPaymentMethods = this.setPaymentMethods.bind(this);
        this.setStates = this.setStates.bind(this);
        this.setAddresses = this.setAddresses.bind(this);
        this.saveAddress = this.saveAddress.bind(this);
        this.unableToPlaceOrderMessage = "Unable to place your order! Please try again!";
        this.orderIncompleteMessage = "Please select delivery address & payment method before placing an order!";
        this.orderPlacedMessage = "Order placed successfully! Your order ID is $orderId.";
        this.saveAddressFailedMessage = "Unable to save address! Please try again!";
        this.savedAddressSuccessMessage = "Address saved successfully!";
        this.addressNotSelectedMessage = "Please select an address for delivery!";
        this.paymentNotSelectedMessage = "Please select a payment method!";
    }



    getSteps = () => ['Delivery', 'Payment'];
    handleNext = () => {
        if (this.state.activeStep === 0 && !this.state.order.address_id) {
            this.showNotification(this.addressNotSelectedMessage);
        } else if (this.state.activeStep === 1 && !this.state.order.payment_id) {
            this.showNotification(this.paymentNotSelectedMessage);
        } else {
            this.setState({activeStep: this.state.activeStep + 1});
        }
    }
    handleBack = () => this.setState({activeStep: this.state.activeStep - 1});
    handleReset = () => this.setState({activeStep: 0});
    handleSwitch = (e, v) => this.setState({activeTab: v});
    handleSaveAddress = (result) => {
        if (result) {
            this.setState({activeTab: 0});
            this.showNotification(this.savedAddressSuccessMessage);
            this.getAddresses();
        } else {
            this.showNotification(this.saveAddressFailedMessage);
        }
    }
    /* Confirm the Order */
    OrderConfirmationHandler = (result, response) => {
        if (result) {
            this.showNotification(this.orderPlacedMessage.replace("$orderId", response.id));
            setTimeout(() => {
                this.props.history.push("/");
            }, 3000);
        } else {
            this.showNotification(this.unableToPlaceOrderMessage);
        }

    }
    showNotification = (message) => this.setState({messageText: message, notificationOpen: true});
    closeNotification = () => this.setState({messageText: null, notificationOpen: false});
    setAddressId = (id) => {
        let order = JSON.parse(JSON.stringify(this.state.order));
        order.address_id = id;
        this.setState({
            addressIndex: this.state.addresses.findIndex(address => address.id === id),
            order: order
        });
    }
    /* Set the payment method, address that the user has chosen */
    setPaymentMethodId = (id) => {
        let order = JSON.parse(JSON.stringify(this.state.order));
        order.payment_id = id;
        this.setState({order: order});
    }

    setAddresses = (result, response) => {
        if (result) {
            this.setState({addresses: response.addresses});
        } else {
            this.setState({addresses: null});
        }
    }

    getAddresses = () => CallApi(GetEndpointURI('Get Addresses'),
        GetHttpHeaders('GET', "Bearer " + window.sessionStorage.getItem("access-token")),
        this.setAddresses);

    setStates = (result, response) => {
        if (result) {
            this.setState({states: response.states});
        } else {
            this.setState({states: null});
        }
    }

    getStates = () => CallApi(GetEndpointURI('Get States'),
        GetHttpHeaders('GET'), this.setStates);

    setPaymentMethods = (result, response) => {
        if (result) {
            this.setState({paymentMethods: response.paymentMethods});
        } else {
            this.setState({paymentMethods: null});
        }
    }

    getPaymentOptions = () => CallApi(GetEndpointURI('Get Payment Modes'),
        GetHttpHeaders('GET'), this.setPaymentMethods);

    saveAddress = (address, callback) => CallApi(GetEndpointURI('Save Address'),
        GetHttpHeaders('POST', "Bearer " + window.sessionStorage.getItem("access-token"),
            JSON.stringify(address)), callback, this.handleSaveAddress);

    placeOrder = () => {
        if(this.state.activeStep === 2) {
            CallApi(GetEndpointURI('Save Order'),
                GetHttpHeaders('POST', "Bearer " + window.sessionStorage.getItem("access-token"),
                    JSON.stringify(this.state.order)), this.OrderConfirmationHandler);
        }else {
            this.showNotification(this.orderIncompleteMessage);
        }
    }

    getStepContent = (step) => {
        const {classes} = this.props;
        switch (step) {
            case 0:
                return (
                    <Box><AppBar position="static">
                        <Tabs value={this.state.activeTab} onChange={this.handleSwitch}>
                            <Tab className={classes.tab} label="EXISTING ADDRESSES"/>
                            <Tab className={classes.tab} label="NEW ADDRESS"/>
                        </Tabs>
                    </AppBar>
                        <Box display={this.state.activeTab === 0 ? "block" : "none"}>
                            <AddressesGrid addresses={this.state.addresses} cols={(this.props.isSmallScreen) ? 2 : 3}
                                           setAddressId={this.setAddressId}
                                           selectedIndex={this.state.addressIndex}/>
                        </Box>
                        <Box display={this.state.activeTab === 1 ? "block" : "none"}>
                            <SaveAddressForm states={this.state.states} handleSaveAddressOK={this.saveAddress}/>
                        </Box>
                    </Box>
                );
            case 1:
                return (<PaymentOptions paymentModes={this.state.paymentMethods}
                                        setPaymentModeId={this.setPaymentMethodId}
                                        selectedPaymentMode={(!this.state.order) ? null : this.state.order.payment_id}/>);
            default:
                return 'Unknown step';
        }
    }

    /* Create Order */
    createOrder = () => {
        let newOrder = {
            address_id: null,
            bill: this.props.location.state.totalAmount,
            item_quantities: [],
            payment_id: null,
            restaurant_id: this.props.location.state.restaurant.id
        };
        this.props.location.state.orderItems && (this.props.location.state.orderItems.length > 0) &&
        this.props.location.state.orderItems.map(orderItem =>
            newOrder.item_quantities.push({
                item_id: orderItem.id,
                quantity: orderItem.quantity,
                price: orderItem.price
            })
        );
        this.setState({order: newOrder});
        this.setState({restaurantName: this.props.location.state.restaurant.restaurant_name});
        this.setState({netAmount: this.props.location.state.totalAmount});
        this.setState({orderItems: JSON.parse(JSON.stringify(this.props.location.state.orderItems))});

    }

    componentDidMount() {
        if (this.props.location.state && this.props.location.state.restaurant &&
            this.props.location.state.totalAmount &&
            this.props.location.state.orderItems) {
            this.createOrder();
            this.getAddresses();
            this.getStates();
            this.getPaymentOptions();
        }
    }

    render() {
        const {classes} = this.props;
        if (this.props.location.state && this.props.location.state.restaurant &&
            this.props.location.state.totalAmount &&
            this.props.location.state.orderItems) {
            return (
                <Box>
                    <Header showSearch={false}/>
                    <Box display="flex"
                         className={(this.props.isSmallScreen) ? classes.checkoutContainerSm : classes.checkoutContainer}
                         width="100%" mt="1%">
                        <Box
                            className={(this.props.isSmallScreen) ? classes.workflowStepperContainerSm : classes.workflowStepperContainer}>
                            <Stepper className={classes.stepper} activeStep={this.state.activeStep}
                                     orientation="vertical">
                                {this.getSteps().map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                        <StepContent>
                                            {this.getStepContent(index)}
                                            <Typography variant="h2" gutterBottom/>
                                            <Box>
                                                <Button disabled={this.state.activeStep === 0}
                                                        onClick={this.handleBack}>Back</Button>
                                                <Button variant="contained" color="primary" onClick={this.handleNext}>
                                                    {this.state.activeStep === this.getSteps().length - 1 ? 'Finish' : 'Next'}
                                                </Button>
                                            </Box>
                                        </StepContent>
                                    </Step>
                                ))}
                            </Stepper>
                            {(this.state.activeStep === this.getSteps().length) ? (
                                <Box padding="2%"><Typography variant="body1">View the summary and place your order
                                    now!</Typography>
                                    <Button onClick={this.handleReset}>
                                        CHANGE
                                    </Button>
                                </Box>) : ""
                            }
                        </Box>
                        <Box
                            className={(this.props.isSmallScreen) ? classes.summaryCardContainerSm : classes.summaryCardContainer}
                            padding="1%">
                            <OrderSummaryCard restaurantName={this.state.restaurantName}
                                              netAmount={this.state.netAmount}
                                              orderItems={this.state.orderItems} order={this.state.order}
                                              handlePlaceOrder={this.placeOrder}/>
                        </Box>
                    </Box>
                    <Notification messageText={this.state.messageText} open={this.state.notificationOpen}
                                  onClose={this.closeNotification}/>
                </Box>
            );
        } else {
            return <Redirect to='/'/>;
        }


    }
}

/* function to make rest call*/
const CallApi = async (endpoint, headers, ...callbacks) => {
    let response = await fetch(endpoint, headers);
    let jsonResponse = await response.json();
    callbacks.map(callback => (response.ok) ?
        callback(true, jsonResponse) : callback(false, null));
}

/* function to get endpoint uri*/
const GetEndpointURI = (name, param, value) => {
    let uri = Config.endpointPrefix + Config.endpoints.find(endpoint => endpoint.name === name).uri;
    if (param && value) {
        return uri.replace(param, value);
    } else {
        return uri;
    }
}

/* function to get headers*/
const GetHttpHeaders = (httpMethod, accessToken, content) => {
    let settings = {
        method: httpMethod,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: accessToken
        },
        body: content
    };
    if(!settings.headers.authorization)
        delete settings.headers.authorization;
    if(!settings.body)
        delete settings.body;
    return settings;
}

export default withStyles(useStyles)(withMediaQuery()(Checkout));
