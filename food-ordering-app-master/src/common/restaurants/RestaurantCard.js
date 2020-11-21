import React from "react";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import "font-awesome/css/font-awesome.css"


// Home restaurant card component created
export default function HomeRCard(props) {

    return (
            <Card className="restaurant-card-main" onClick={props.handleRestaurantNavigation.bind(this, props.restaurant.id)}>
                <CardActionArea className="restaurant-card">
                    <CardMedia
                        component="img"
                        alt={props.restaurant.restaurant_name}
                        height="140"
                        image={props.restaurant.photo_URL}
                        title={props.restaurant.restaurant_name}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {props.restaurant.restaurant_name}
                        </Typography>
                        <br/>
                        <Typography variant="body2" component="p">
                            {props.restaurant.categories}
                        </Typography>
                        <br/>
                    </CardContent>
                    <CardContent className="card-section2">
                        <Typography variant="body1" className="card-rating">
                            <i className="fa fa-star"/> {props.restaurant.customer_rating} ({props.restaurant.number_customers_rated})
                        </Typography>
                        <Typography variant="body1" className="card-price">
                            <i className="fa fa-inr" aria-hidden="true"/>{props.restaurant.average_price} for two
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
    );
}