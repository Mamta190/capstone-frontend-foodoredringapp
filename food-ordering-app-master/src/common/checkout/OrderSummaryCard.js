import React from 'react';

import {Card,CardContent,Button,Typography,FormControl,CardActions,Divider,Box} from '@material-ui/core';

import OrderItem from "../order/CartItem";
import "font-awesome/css/font-awesome.css"


export default function OrderSummaryCard(props) {

    return (
        /*Card oredr summary*/
        <Card className="order-summary-card">
            <CardContent>
                <Box display="flex" flexDirection="column">
                    <FormControl fullWidth margin="normal" size="small" variant="standard">
                        <Typography className="summary-title" variant="h6" color="textPrimary">
                            Summary
                        </Typography>
                    </FormControl>
                    <FormControl fullWidth margin="dense" size="small" variant="standard">
                        <Typography className="restaurant-name" variant="body1" color="textPrimary" component="p">
                            {props.restaurantName}
                        </Typography>
                    </FormControl>
                    <FormControl fullWidth margin="dense" size="small" variant="standard">
                        {
                            props.orderItems && props.orderItems.length > 0 &&
                            props.orderItems.map( orderItem => (
                                /* Cart Item component */
                                <OrderItem key={orderItem.id} cartItem={orderItem} variant={"subtitle2"}/>
                            ))
                        }
                        <Typography variant="h3" gutterBottom/>
                    </FormControl>
                    <Divider variant="fullWidth"/>
                    <FormControl fullWidth margin="normal" size="small" variant="standard">
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <Typography className="net-amount" variant="body2" color="textPrimary">
                                Net Amount
                            </Typography>
                            <Typography variant="body2"><i className="fa fa-inr"/> {Number(props.netAmount).toFixed(2)}
                            </Typography>
                        </Box>
                    </FormControl>
                </Box>
            </CardContent>
            <CardActions>
                <FormControl fullWidth margin="normal" size="small" variant="standard">
                    <Button variant="contained" color="primary" id="btn-place" onClick={props.handlePlaceOrder}>PLACE
                        ORDER</Button>
                </FormControl>
            </CardActions>
        </Card>
    );
}
