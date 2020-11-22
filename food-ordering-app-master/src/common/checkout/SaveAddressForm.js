import React from "react";

import {Box,FormControl,FormHelperText,Input, InputLabel,Select,MenuItem,Button,Typography} from '@material-ui/core';

import {makeStyles} from '@material-ui/core/styles';

//Use Styles
const useStyles = makeStyles({
    show: {
        display: 'block'
    },
    hide: {
        display: 'none'
    },
    options: {
        maxHeight: "40%",
        marginTop: "3%",
    },
});

// Component for Save Address
export default function SaveAddressForm(props) {
    const [flatname, setFlatname] = React.useState("");
    const [locality, setLocality] = React.useState("");
    const [city, setCity] = React.useState("");
    const [state, setState] = React.useState("");
    const [pincode, setPincode] = React.useState("");
    const [isSaveClicked, setSaveClicked] = React.useState(false);
    const classes = useStyles();
    const onFlatnameChanged = (e) => setFlatname(e.target.value);
    const onLocalityChanged = (e) => setLocality(e.target.value);
    const onCityChanged = (e) => setCity(e.target.value);
    const onStateChanged = (e) => setState(e.target.value);
    const onPincodeChanged = (e) => setPincode(e.target.value);
    const display = (field) => (isSaveClicked && (field === null || field === "")) ? classes.show : classes.hide;
    const validate = (field) => (isSaveClicked && field && (field.length !== 6 || isNaN(field))) ? classes.show : classes.hide;
    const reset = (isOK) => {
        if (isOK) {
            setFlatname("");
            setLocality("");
            setCity("");
            setState("");
            setPincode("");
            setSaveClicked(false);
        }
    }
    /*Display Saved Address */
    const onSave = (e) => {
        setSaveClicked(true);
        if (flatname && locality && city && state &&
            pincode && pincode.length === 6 && !isNaN(pincode)) {
            props.handleSaveAddressOK({
                'city': city,
                'flat_building_name': flatname,
                'locality': locality,
                'pincode': pincode,
                'state_uuid': state,
            }, reset);
        }
    };
    const menuProps = {
        'PaperProps': {
            style: {
                maxHeight: "24%"
            }
        }
    };
    return (
        <Box width="60%" display="flex" flexDirection="column" padding="2%" margin="0%">
            <FormControl required margin="normal" size="small" variant="standard">
                <InputLabel htmlFor="flatname">Flat / Building No</InputLabel>
                <Input id="flatname" type="text" value={flatname} onChange={onFlatnameChanged}/>
                <FormHelperText error className={display(flatname)}>required</FormHelperText>
            </FormControl>
            <FormControl required margin="normal" size="small" variant="standard">
                <InputLabel htmlFor="locality">Locality</InputLabel>
                <Input id="locality" type="text" value={locality} onChange={onLocalityChanged}/>
                <FormHelperText error className={display(locality)}>required</FormHelperText>
            </FormControl>
            <FormControl required margin="normal" size="small" variant="standard">
                <InputLabel htmlFor="city">City</InputLabel>
                <Input id="city" type="text" value={city} onChange={onCityChanged}/>
                <FormHelperText error className={display(city)}>required</FormHelperText>
            </FormControl>
            <FormControl required margin="normal" size="small" variant="standard">
                <InputLabel htmlFor="state">State</InputLabel>
                <Select id='state' MenuProps={menuProps} value={state} onChange={onStateChanged}>
                    {props.states && props.states.map((state, index) => (
                        <MenuItem key={state.id} value={state.id} index={index}>{state.state_name}</MenuItem>
                    ))}
                </Select>
                <FormHelperText error className={display(state)}>required</FormHelperText>
            </FormControl>
            <FormControl required margin="normal" size="small" variant="standard">
                <InputLabel htmlFor="pincode">Pincode</InputLabel>
                <Input id="pincode" type="text" value={pincode} onChange={onPincodeChanged}/>
                <FormHelperText error className={display(pincode)}>required</FormHelperText>
                <FormHelperText error className={validate(pincode)}>Pincode must contain only numbers and must be 6
                    digits long</FormHelperText>
            </FormControl>
            <FormControl margin="normal" size="small" variant="standard">
                <Typography variant="h2" gutterBottom/>
                <Button variant="contained" color="secondary" id="btn-save" onClick={onSave}>SAVE ADDRESS</Button>
            </FormControl>
        </Box>
    );
}
