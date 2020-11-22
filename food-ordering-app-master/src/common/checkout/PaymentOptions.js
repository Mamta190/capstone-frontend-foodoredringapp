import React from 'react';

import {Box,FormControl,FormLabel,Radio,RadioGroup,FormControlLabel,Typography} from '@material-ui/core';

export default function PaymentOptions(props) {
    const [paymentMode, setPaymentMode] = React.useState(props.selectedPaymentMode);
    const onPaymentModeChanged = (e) => {
        setPaymentMode(e.target.value);
        props.setPaymentModeId(e.target.value);
    }
    return (
        <Box padding="1%" margin="0%">
            <FormControl component="fieldset">
                <FormLabel
                    children={<Typography variant="body1" color="textSecondary">Select Mode of Payment</Typography>}/>
                <RadioGroup name="Payment" value={paymentMode} onChange={onPaymentModeChanged}>
                    {props.paymentModes.map(paymentMode => (
                        <FormControlLabel key={paymentMode.id} value={paymentMode.id} control={<Radio size="small"/>}
                                          label={<Typography className="payment-method"
                                                             variant="subtitle2">{paymentMode.payment_name}</Typography>}/>
                    ))}
                </RadioGroup>
            </FormControl>
        </Box>
    );
}
