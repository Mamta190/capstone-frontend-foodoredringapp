import React from "react";
import Typography from "@material-ui/core/Typography";

// Component for Details Restaurant details Card section
export default function DetailsRCard(props) {
    return (
        <div className={props.isSmallScreen ? "rcard-mainSM" : "rcard-main"}>
            <div className={props.isSmallScreen ? "rcard-leftSM" : "rcard-left"}>
                <img src={props.restaurant.photo_URL} alt={props.restaurant.restaurant_name} className="rcard-img"/>
            </div>
            <div className={props.isSmallScreen ? "rcard-rightSM" : "rcard-right"}>
                <Typography variant="h4" className="rcard-name">{props.restaurant.restaurant_name}</Typography>
                <Typography variant="h6" className="rcard-locality upper-case">{props.restaurant.address.locality}</Typography>
                <br/>
                <Typography variant="body1">
                    {
                        props.restaurant.categories.map((category, index) =>
                            (
                                <span key={category.id + "category"}> {category.category_name}
                                    {index < props.restaurant.categories.length - 1 ? ',' : ''}
                                    </span>
                            ))
                    }
                </Typography>
                <br/>
                <div className="rcard-right-bottom">
                    <div>
                        <Typography variant="body1" color="textPrimary">
                            <i className="fa fa-star" aria-hidden="true"/> {props.restaurant.customer_rating}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" className="upper-case">
                            Average Rating By <br/> {props.restaurant.number_customers_rated} customers
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="body1" color="textPrimary">
                            <i className="fa fa-inr" aria-hidden="true"/> {props.restaurant.average_price}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" className="upper-case">
                            Average Cost For <br/> Two People
                        </Typography>
                    </div>

                </div>
            </div>
        </div>
    )
}