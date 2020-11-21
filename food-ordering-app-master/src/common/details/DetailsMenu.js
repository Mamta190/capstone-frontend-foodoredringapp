import React from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import AddIcon from '@material-ui/icons/Add';
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";

// Component for Details Restaurant Menu Card section
export default function DetailsMenuCard(props) {
    let variant = props.isSmallScreen ? "subtitle2" : (props.isMediumScreen ? "subtitle1" : "body1") ;

    return (
        <div className="mcard-main">
            <Typography variant="button" color="textSecondary"
                        className="mcard-category"> {props.category.category_name} </Typography>
            <Divider/>
            {props.category.item_list.map((item) => (
                <span key={item.id + "item"} className="item-menu">
                    <Grid item xs={1} lg={1}>
                        <Typography>
                            {item.item_type === "VEG" ?
                                <i className="fa fa-circle item-veg" aria-hidden="true"/>
                                : <i className="fa fa-circle item-nonveg" aria-hidden="true"/>
                            }
                        </Typography>
                    </Grid>
                    <Grid item xs={6} lg={7}>
                        <Typography variant={variant} className="item-name"> {item.item_name} </Typography>
                    </Grid>
                    <Grid item lg={1}/>
                    <Grid item xs={3} lg={2}>
                        <Typography variant={variant}> <i className="fa fa-inr"
                                                        aria-hidden="true"/> {(item.price).toFixed(2)} </Typography>
                    </Grid>
                    <Grid item xs={1} lg={1}/>
                    <Grid item xs={1} lg={1}>
                        <IconButton className="item-add" value={item}
                                    onClick={props.handleAddMenuItem.bind(this, item)}>
                            <AddIcon/>
                        </IconButton>
                    </Grid>
                </span>
            ))
            }
        </div>
    )
}