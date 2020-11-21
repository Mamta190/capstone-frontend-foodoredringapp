import React,{Component} from "react";
import {
    ThemeProvider,
    createMuiTheme,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Icon from "@material-ui/core/Icon";
import Input from "@material-ui/core/Input/Input";
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from "@material-ui/core/InputAdornment";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Modal from "react-modal";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from "@material-ui/core/Menu";
import * as PropTypes from "prop-types";
import './Header.css'
import * as EmailVaildator from "email-validator";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {Link} from 'react-router-dom';
import Notification from "../notification/Notification";



const theme = createMuiTheme({
    palette: {
        primary:  {
            main: '#ffffff',
        }
    },
});

//css for header bar
const css  =  {
    appBar: {
        backgroundColor: '#263238',
        boxShadow: 'none',
        display: 'block',
    },

    toolBar:{
        display: 'flex',
        flexDirection:'row',
        justifyContent : 'space-between',
    },
    toolBarSM:{
        display: 'flex',
        flexDirection:'column',
        alignItems: 'flex-start',
    },
    inputSearch:{
        color:'#ffffff',
        width: '250px'
    },
    user:{
        textTransform:'unset',
        backgroundColor:'#263238',
        boxShadow: 'none',
        color:'#e0e0e0',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'start',
        padding:'0px'
    },
    userDiv:{
        alignContent:'center',
    },
    loginButton:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'start',
    }
}

//css for modal
const costumStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
}


//media query for responsiveness
const withMediaQuery = () => Component => props => {
    const isSmallScreen = useMediaQuery('(max-width:650px)');
    return <Component isSmallScreen={isSmallScreen} {...props} />;
};

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

// Header section rendering
class Header extends Component{

    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            value:0,
            //state variables for login
            contactno:"",
            contactnoRequired:'dispNone',
            loginContactInvalid:'dispNone',
            password:"",
            passwordRequired:'dispNone',
            contactInvalid:'dispNone',
            loginError:{},
            loginErrorSpan:'dispNone',
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true,

            //state variables for sign up
            firstName:"",
            firstNameRequired:'dispNone',
            lastName:"",
            email:"",
            emailRequired:'dispNone',
            emailInvalid:'dispNone',
            signUpContactno:"",
            signUpcontactnoRequired:'dispNone',
            signUpcontactInvalid:'dispNone',
            signUpPassword:"",
            signUpPasswordRequired:'dispNone',
            signUpPasswordInvalid:'dispNone',
            signUpError:{},
            signUpErrorSpan:'dispNone',

            messageText:null,
            notificationOpen:false,

        }
        this.loggedinMessage ="Logged in successfully!";
        this.signedUpMessage="Registered successfully! Please login now!";
        this.closeNotification = this.closeNotification.bind(this);
    }


    //function to reset the state variables once the modal is closed and reopened
    openModalHandler = () => {
            this.setState({
                modalIsOpen: true,contactno:"",
                contactnoRequired:'dispNone',
                loginContactInvalid:'dispNone',
                contactInvalid:'dispNone',
                password:"",
                passwordRequired:'dispNone',
                signUpPassword:"",
                signUpPasswordRequired:'dispNone',
                signUpPasswordInvalid:'dispNone',
                signUpContactno:"",
                signUpcontactnoRequired:'dispNone',
                signUpcontactInvalid:'dispNone',
                firstName:"",
                firstNameRequired:'dispNone',
                lastName:"",
                email:"",
                emailRequired:'dispNone',
                emailInvalid:'dispNone',
                signUpError:{},
                signUpErrorSpan:'dispNone',
                loginError:{},
                loginErrorSpan:'dispNone',
            })
    }

     //closing modal
    closeModal =()=>{
        this.setState({ modalIsOpen: false })
    }

    //changing the tab on modal
    onTabChange=(event,value)=>{
        this.setState({value});
    }


    openMenuHandler = (event) => {
        this.setState({anchorEl:event.currentTarget});
    };

    handleMenuClose=()=>{
        this.setState({anchorEl:null});
    }

    //clearing the session variables on logout
    logout=()=>{
        sessionStorage.removeItem('access-token');
        sessionStorage.removeItem('uuid');
        sessionStorage.removeItem('first-name');
        this.setState({
            loggedIn: false
        })
        this.handleMenuClose();
    }

    onLoginClick=()=>{
        let isAnyRequiredFieldEmpty=false;
        //checking if contact number is empty
        if(this.isContactNumberEmptyForLogin(this.state.contactno)){
            isAnyRequiredFieldEmpty=true;
        }
        //check is the password is empty
        if(this.isPasswordEmptyForLogin(this.state.password)){
            isAnyRequiredFieldEmpty=true;
        }

        //Do further validation of user input only if both input fields are not empty
        if(isAnyRequiredFieldEmpty===false){
            //try to login only if the contact number is valid
            if(this.isValidContactNoForLogin(this.state.contactno)){
                let that= this;
                const headers={'Accept':'application/json','authorization':"Basic " + window.btoa(this.state.contactno + ":" + this.state.password)}
                fetch("http://localhost:8080/api/customer/login",{method:'POST',headers}).then(function (response){
                    if(response.status === 200){
                        //set session variable access token.
                        sessionStorage.setItem("access-token",  response.headers.get('access-token'));
                        return response.json();
                    }else{
                        //throw error if login fails
                        throw response;
                    }
                }).then(function(data){
                    //on successful login set other session variables
                    sessionStorage.setItem("uuid", data.id);
                    sessionStorage.setItem("first-name", data.first_name)
                    //set state variables in case of successful login
                    that.showNotification(that.loggedinMessage);
                    that.setState({loginErrorSpan:'dispNone'})
                    that.setState({value:0});
                    that.setState({ loggedIn: true });
                    that.closeModal();

                }).catch( err => {
                    err.text().then( errorMessage => {
                        //display error in case of failure to login
                        that.setState({loginErrorSpan:'dispBlock'})
                        that.setState({loginError:JSON.parse(errorMessage)})
                    })
                })
            }
        }
    }
    onSignUpClick=()=> {
        //check if any required input field is empty
        let isAnyRequiredFieldEmpty=false;
        let isAnyValidationFailed=true;
        if (this.isFirstNameEmpty(this.state.firstName)) {
            isAnyRequiredFieldEmpty = true;
        }
        if (this.isPasswordEmpty(this.state.signUpPassword)) {
            isAnyRequiredFieldEmpty = true;
        }
        if (this.isContactNumberEmpty(this.state.signUpContactno)) {
            isAnyRequiredFieldEmpty = true;
        }
        if (this.isEmailEmpty(this.state.email)) {
            isAnyRequiredFieldEmpty = true;
        }
        //check if user inputs are valid
        if (!this.isEmailIdValid(this.state.email)) {
            isAnyValidationFailed = false;
        }
        if (!this.isPasswordValid(this.state.signUpPassword)) {
            isAnyValidationFailed = false;
        }
        if (!this.isValidContactNo(this.state.signUpContactno)) {
            isAnyValidationFailed = false;
        }
        //try to register the user only when are required inout fields are not empty and are valid inputs
        if(isAnyValidationFailed===false && isAnyRequiredFieldEmpty===false){
            let that=this;
            let dataSignUp = JSON.stringify({
                "email_address": this.state.email,
                "first_name": this.state.firstName,
                "last_name": this.state.lastName,
                "contact_number": this.state.signUpContactno,
                "password": this.state.signUpPassword,
            })
            const headers = {'Accept': 'application/json','Content-Type': 'application/json'}
            fetch("http://localhost:8080/api/customer/signup",{method:'POST',headers,body:dataSignUp}).then(function (response){
                if(response.status === 201){
                    //set state variables on successful registration
                    that.setState({signUpErrorSpan:'dispNone'})
                    that.setState({signUpError:{}})
                    that.setState({value:0});
                    that.showNotification(that.signedUpMessage);
                    return response.json();
                }else{
                    throw response;
                }
            }).catch( err => {
                ////set state variables on failure to register the user
                err.text().then( errorMessage => {
                    that.setState({signUpErrorSpan:'dispBlock'})
                    that.setState({signUpError:JSON.parse(errorMessage)})
                })
            })
        }
    }


    isFirstNameEmpty =(firstname) =>{
        if(firstname===""){
            this.setState({firstNameRequired:'dispBlock'})
            return true;
        }else{
            this.setState({firstNameRequired:'dispNone'})
            return false;
        }
    }

    isEmailEmpty =(email)=>{
        if(email===""){
            this.setState({emailRequired:'dispBlock'})
            return true;
        }else{
            this.setState({emailRequired:'dispNone'})
            return false;
        }
    }

    isContactNumberEmpty =(contactno)=>{
        if(contactno===""){
            this.setState({signUpcontactnoRequired:'dispBlock'})
            return true;
        }else{
            this.setState({signUpcontactnoRequired:'dispNone'})
            return false;
        }
    }
    isContactNumberEmptyForLogin =(contactno)=>{
        if(contactno===""){
            this.setState({contactnoRequired:'dispBlock'})
            return true;
        }else{
            this.setState({contactnoRequired:'dispNone'})
            return false;
        }
    }
    isPasswordEmpty=(password)=>{
        if(password===""){
            this.setState({signUpPasswordRequired:'dispBlock'})
            return true;
        }else{
            this.setState({signUpPasswordRequired:'dispNone'})
            return false;
        }
    }

    isPasswordEmptyForLogin=(password)=>{
        if(password===""){
            this.setState({passwordRequired:'dispBlock'})
            return true;
        }else{
            this.setState({passwordRequired:'dispNone'})
            return false;
        }
    }
    isEmailIdValid = (email) =>{
        let isValid = EmailVaildator.validate(email)
        if(!isValid && !this.isEmailEmpty(email)){
            this.setState({emailInvalid:'dispBlock'})
            return false;
        }else{
            this.setState({emailInvalid:'dispNone'})
            return true;
        }
    }

    isValidContactNo =(contactno)=>{
        const isValidContactNo = new RegExp('^\\d{10}$');
        if(!isValidContactNo.test(contactno) && !this.isContactNumberEmpty(contactno)){
            this.setState({signUpcontactInvalid:'dispBlock'})
            return true;
        }else{
            this.setState({signUpcontactInvalid:'dispNone'})
            return false;
        }
    }

    isValidContactNoForLogin =(contactno)=>{
        const isValidContactNo = new RegExp('^\\d{10}$');
        if(isValidContactNo.test(contactno)){
            this.setState({loginContactInvalid:'dispNone'});
            return true;
        }else{
            this.setState({loginContactInvalid:'dispBlock'});
            return false;
        }
    }

    isPasswordValid =(password) =>{
        const isValidPassword = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
        if(!isValidPassword.test(password) && !this.isPasswordEmpty(password)){
            this.setState({signUpPasswordInvalid:'dispBlock'})
            return false;
        }else{
            this.setState({signUpPasswordInvalid:'dispNone'})
            return true;
        }
    }

    onContactNumberChange=(e)=>{
        this.setState({contactno:e.target.value})
    }
    onSignUpContactNumberChange=(e)=>{
        this.setState({signUpContactno:e.target.value})
    }
    onPasswordChange=(e)=>{
        this.setState({password:e.target.value})
    }
    onSignUpPasswordChange=(e)=>{
        this.setState({signUpPassword:e.target.value})
    }
    onChangeOfFirstName=(e)=>{
        this.setState({firstName:e.target.value})
    }
    onChangeOfLastName=(e)=>{
        this.setState({lastName:e.target.value})
    }
    onChangeOfEmail=(e)=>{
        this.setState({email:e.target.value})
    }
    showNotification = (message) => this.setState({messageText: message, notificationOpen: true});
    closeNotification = () => this.setState({messageText: null, notificationOpen: false});


        render()
        {
            return (
                <Box>
                    <AppBar position="static" style={css.appBar}>
                        {/*checking for screen size to make app responsive in smaller screen*/}
                        <Toolbar style={this.props.isSmallScreen ? css.toolBarSM : css.toolBar} >
                            <IconButton edge="start" color="inherit">
                                <FastfoodIcon/>
                            </IconButton>
                            {
                                this.props.showSearch === true ?  <Box className="search" style={css.search}>
                                    <ThemeProvider theme={theme}>
                                        <Input type="text" style={css.inputSearch} color="primary"
                                               placeholder={'Search by Restaurant Name'}
                                               startAdornment={
                                                   <InputAdornment position="start" color="primary">
                                                       <SearchIcon className="mag-glass" color="primary"/>
                                                   </InputAdornment>
                                               }
                                               onChange={this.props.searchHandler}>
                                        </Input>
                                    </ThemeProvider>
                                </Box>: null
                            }
                            {/*checking for screen size to make app responsive in smaller screen*/}
                            {this.props.isSmallScreen ? <br/> :null}
                            {
                                /*show login button if user is not logged in and show user first name if he is logged in*/
                                this.state.loggedIn===false ? <Button
                                variant="contained"
                                size="large"
                                onClick={this.openModalHandler}
                                startIcon={<Icon size="large"><AccountCircleIcon/></Icon>}
                                style={css.loginButton}
                                    ><Typography>Login</Typography></Button> :
                               <div style={css.userDiv}>
                                   <Button
                                   variant="contained"
                                   size="large"
                                   onClick={this.openMenuHandler}
                                   startIcon={<Icon size="large"><AccountCircleIcon/></Icon>}
                                   style={css.user}
                                   ><Typography>{sessionStorage.getItem('first-name')}</Typography></Button>
                                   <Menu className="menu-container"
                                         id="simple-menu"
                                         anchorEl={this.state.anchorEl}
                                         keepMounted
                                         open={Boolean(this.state.anchorEl)}
                                         onClose={this.handleMenuClose}
                                         style={{top: '40px'}}
                                   >
                                       <MenuItem><Link
                                           to={"/profile"} style={{textDecoration: 'none', color: 'black'}}>My
                                           Profile</Link></MenuItem>
                                       <MenuItem onClick={this.logout}><Link
                                           to={"/"} style={{textDecoration: 'none', color: 'black'}}>Logout</Link></MenuItem>
                                   </Menu>
                               </div>
                            }
                            {/*checking for screen size to make app responsive in smaller screen*/}
                            {this.props.isSmallScreen ? <br/> :null}
                        </Toolbar>
                    </AppBar>
                    <Modal ariaHideApp={false} isOpen={this.state.modalIsOpen}
                           contentLabel="Login" onRequestClose={this.closeModal}
                            style={costumStyles}>
                        <Tabs className="tabs" value={this.state.value} onChange={this.onTabChange}>
                            <Tab label="LOGIN"/>
                            <Tab label="SIGNUP"/>
                        </Tabs>
                        {this.state.value === 0 &&
                        <TabContainer>
                            <div className="form-fields">
                            <FormControl required>
                                <InputLabel htmlFor="contactno">Contact No.</InputLabel>
                                <Input id="contactno" type="text" value={this.state.contactno} contactno={this.state.contactno} onChange={this.onContactNumberChange}/>
                                <FormHelperText className={this.state.contactnoRequired}><span className="red">required</span></FormHelperText>
                                <FormHelperText className={this.state.loginContactInvalid}><span className="red">Invalid Contact</span></FormHelperText>
                            </FormControl>
                            <br/>
                            <FormControl required>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input id="password" type="password" value={this.state.password} password={this.state.password} onChange={this.onPasswordChange}/>
                                <FormHelperText className={this.state.passwordRequired}><span className="red">required</span></FormHelperText>
                                <br/>
                                <FormHelperText className={this.state.loginErrorSpan}><span className="red">{this.state.loginError.message}</span></FormHelperText>
                            </FormControl><br/>
                            </div>
                            <Button variant="contained" color="primary" onClick={this.onLoginClick}>LOGIN</Button>
                        </TabContainer>}
                        {this.state.value ===1 &&
                        <TabContainer>
                            <div className="form-fields">
                            <FormControl required>
                                <InputLabel htmlFor="firstName">First Name</InputLabel>
                                <Input id="firstName" type="text" value={this.state.firstName} firstname={this.state.firstName} onChange={this.onChangeOfFirstName}/>
                                <FormHelperText className={this.state.firstNameRequired}><span className="red">required</span></FormHelperText>
                            </FormControl>
                            <br/>
                            <FormControl>
                                <InputLabel  htmlFor="lastName" >Last Name</InputLabel>
                                <Input id="lastName" type="text" value={this.state.lastName} lastname={this.state.lastName} onChange={this.onChangeOfLastName}/>
                            </FormControl>
                            <br/>
                            <FormControl required>
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input id="email" type="email" value={this.state.email} email={this.state.email} onChange={this.onChangeOfEmail}/>
                                <FormHelperText className={this.state.emailRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.emailInvalid}>
                                    <span className="red">Invalid Email</span>
                                </FormHelperText>
                            </FormControl>
                            <br/>
                            <FormControl required>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input id="signuppassword" type="password" value={this.state.signUpPassword} password={this.state.signUpPassword} onChange={this.onSignUpPasswordChange}/>
                                <FormHelperText className={this.state.signUpPasswordRequired}><span className="red">required</span></FormHelperText>
                                <FormHelperText className={this.state.signUpPasswordInvalid}><span className="red">Password must contain at least one capital letter, one small letter, one number, and one special character</span></FormHelperText>
                            </FormControl>
                            <br/>
                            <FormControl required>
                                <InputLabel htmlFor="contactno">Contact No.</InputLabel>
                                <Input id="signupcontactno" type="text" value={this.state.signUpContactno} contactno={this.state.signUpContactno} onChange={this.onSignUpContactNumberChange}/>
                                <FormHelperText className={this.state.signUpcontactnoRequired}><span className="red">required</span></FormHelperText>
                                <FormHelperText className={this.state.signUpcontactInvalid}><span className="red">Contact No. must contain only numbers and must be 10 digits long</span></FormHelperText>
                                <br/>
                                <FormHelperText className={this.state.signUpErrorSpan} ><span className="red">{this.state.signUpError.message}</span></FormHelperText>
                            </FormControl>
                            </div>

                            <br/>

                            <Button variant="contained" color="primary" onClick={this.onSignUpClick}>SIGNUP</Button>
                        </TabContainer>

                        }
                    </Modal>
                    <Notification messageText={this.state.messageText} open={this.state.notificationOpen}
                              onClose={this.closeNotification}/>
                </Box>
            );
        }
    }

export default (withMediaQuery() (Header));
