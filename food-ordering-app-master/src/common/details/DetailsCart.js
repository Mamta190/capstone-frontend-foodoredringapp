import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Badge from "@material-ui/core/Badge";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Typography from "@material-ui/core/Typography";
import CartItem from "../order/CartItem";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

// Component for Details Cart section
export default function DetailsCartCard(props) {
    let variant = props.isSmallScreen ? "subtitle2" : (props.isMediumScreen ? "subtitle1" : "body1") ;
    return(
        <div>
            <Card>
                <CardContent className="cart-main">
                    <div className="cart-header">
                        <i>
                            <Badge className="badge" badgeContent={props.totalItems} color="primary" showZero>
                                <ShoppingCartIcon/>
                            </Badge>
                        </i> <span className="cart-title">My Cart</span>
                    </div>
                    {
                        props.cartItems.length !== 0 ?
                        <span>
                            {props.cartItems.map(cartItem =>
                                <span key={cartItem.id}>
                                    <CartItem cartItem={cartItem} handleAddCartItem={props.handleAddCartItem}
                                              handleRemoveCartItem={props.handleRemoveCartItem}
                                              editable={true}
                                              variant={variant}/>
                                </span>
                            )}
                        </span>
                        : ""
                    }
                    <div className="cart-total">
                        <Grid item xs={6} lg={6}>
                            <Typography>TOTAL AMOUNT</Typography>
                        </Grid>
                        <Grid item xs={2} lg={3}/>
                        <Grid item xs={4} lg={3} className="amount">
                            <Typography><i className="fa fa-inr" aria-hidden="true"/> {(props.totalAmount).toFixed(2)} </Typography>
                        </Grid>
                    </div>
                    <div className="cart-button">
                        <Button variant="contained" color="primary" className="cButton"
                                onClick={props.handleCheckoutClick}>
                            CHECKOUT
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}