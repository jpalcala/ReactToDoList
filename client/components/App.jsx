//libs
import React from 'react';
import _ from 'underscore'
//grid
import { Grid, Row, Col } from 'react-flexbox-grid';
//material-ui themes
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
//material-ui components
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import Toggle from 'material-ui/Toggle';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
// colors
import {red500, grey400, blue500} from 'material-ui/styles/colors';

//Action icons
import DoneAllIcon from 'material-ui/svg-icons/action/done-all';
import AllOutIcon from 'material-ui/svg-icons/action/all-out';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import DoneIcon from 'material-ui/svg-icons/action/done';
import ScheduleIcon from 'material-ui/svg-icons/action/schedule';
//material-ui Icons
import ImageCircle  from  'material-ui/svg-icons/image/panorama-fish-eye'
import ArrowDown  from  'material-ui/svg-icons/hardware/keyboard-arrow-down'
import ActionCheckCircle  from  'material-ui/svg-icons/action/check-circle'
import ClearAllIcon from 'material-ui/svg-icons/communication/clear-all'


import SelectAllIcon from 'material-ui/svg-icons/content/select-all';

import * as firebase from 'firebase'


const config = {
    apiKey: "AIzaSyCQKxNWwNAtE-q4yQgbKZbv1YPAtVadujk",
    authDomain: "amazing-list.firebaseapp.com",
    databaseURL: "https://amazing-list.firebaseio.com",
    projectId: "amazing-list",
    storageBucket: "amazing-list.appspot.com",
    messagingSenderId: "15068975582"
  };
  firebase.initializeApp(config);
  const listRef =  firebase.database().ref().child('list');
  console.log('firebase initialized');

  /*firebase.auth().signOut().then(function() {
    console.log('logged out');
  }).catch(function(error) {
    console.log('err out');
  });*/

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
     console.log(user);
    } else {
      console.log('no');
    }
  });
 
const Filter = {
    ALL: 0,
    ACTIVE: 1,
    COMPLETED: 2
};

const styles = {

    radioButton: {
        marginBottom: 16,
        width: 'auto'
    },
    unSelectedItemStyle: {
        textDecoration: 'none',
        color: 'rgba(0,0,0,1)'
    },
    selectedItemStyle: {
        textDecoration: 'line-through',
        color: 'rgba(0,0,0,0.5)'
    }
};
class Login extends React.Component {
    static muiName = 'FlatButton';
  
    render() {
      return (
        <FlatButton onClick={this.props.click} label="Login" />
      );
    }
  }
  class Logged extends React.Component {
    static muiName = 'FlatButton';
  
    render() {
      return (
        <FlatButton onClick={this.props.click} label="Logout" />
      );
    }
  }

class Item extends React.Component{  
    onDelete = (ev)=> this.props.onDelete(this.props.id);

    onCheckboxCliked = (ev,isChecked)=> this.props.itemStatusChanged(this.props.id);

    render(){
        return (    
            <div>
            <ListItem primaryText={this.props.name} 
            style={this.props.done?styles.selectedItemStyle:styles.unSelectedItemStyle}
            leftCheckbox={<Checkbox uncheckedIcon={<ImageCircle color={grey400}  />} checkedIcon={<ActionCheckCircle/>} checked={this.props.done} 
            onCheck={this.onCheckboxCliked} />} 
            rightIconButton={<IconButton    onClick={this.onDelete}><ActionDelete color={red500} /></IconButton>} />
            <Divider/>
            </div>
         
        );
    }
  
}
class Form extends React.Component{
    state = {
        item: ''
    }
    

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.state.item);
        this.setState({item: ''});
    };

    selectAll =()=> this.props.selectAll();

    render(){    
        return(
        <Row center='xs'  >
            <Col  xs={12} sm={8} md={6} lg={5} >
                <MuiThemeProvider >
                    <form  onSubmit={this.handleSubmit}>
                        <Row bottom={'xs'}>
                            <Col xs={2}>
                            <IconButton onClick={this.selectAll} >{this.props.selected?<AllOutIcon/>:<DoneAllIcon/>}</IconButton>                            
                            </Col>
                            <Col xs={10}>
                            <TextField
                                fullWidth 
                                value={this.state.item}
                                style={{fontSize:'1.5em'}}
                                onChange={(event)=>this.setState({item:event.target.value})}
                                hintText="Buy stuff"
                                floatingLabelText="What needs to be done?"
                            />  
                            </Col>
                        </Row>
                        
                    </form>                 
                </MuiThemeProvider>    
            </Col>            
        </Row>
        );
    }
}


class  ItemList extends React.Component{
    state = {
        items: [],
        filteredItems: [],
        selected: false,
        activeFilter: Filter.ALL,
        photoURL:'',
        email:'',
        username:'',
        user:null,
        logged:false,
        dialog:{
            open:false,
            text:''
        }
    };

    checkLog = function(){
        console.log('check');
     
        

    
    };
  
    logIn =()=>{
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        provider.addScope('https://www.googleapis.com/auth/plus.me');
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            this.setState({
                user:user,
                photoURL:user.photoURL,
                username:user.displayName,
                email:user.email,
                logged:true
            },()=>console.log(user));
            // ...
        }.bind(this)).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;

            console.log(error);
            // ...
        });
    };
    logOut = () =>{
        firebase.auth().signOut().then(function() {
            this.setState({
                user:null,
                photoURL:'',
                username:'',
                email:'',
                logged:false,
                dialog:{
                    text:'You just logged out',
                    open:true
                }
            });
          }.bind(this), function(error) {
            // An error happened.
          });
    }
    componentDidMount(){
        listRef.on('child_added', data => {
            this.setState(prevState=>({
                items:[...prevState.items,data.val()]
            }),()=>console.log('child added'))
          });

          
          listRef.on('child_removed',data =>{
            this.setState(prevState=>({
                items:_.filter(prevState.items,(item,i)=>{
                    
                    return data.val().id!==item.id;
                })
            }),()=>console.log('child removed'));
          });

          listRef.on('child_changed',data =>{
            this.setState(prevState=>({
                items:_.map(prevState.items,(item,i)=>{
                    
                    if(data.val().id===item.id)
                    item=data.val();
                    return item;
                })
            }),()=>console.log('child changed'));
          });


    }
    componentWillUnmount() {
       listRef.remove();
      }
      componentWillMount(){
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
             
              this.setState({
                  user:user,
                  photoURL:user.photoURL,
                  username:user.displayName,
                  email:user.email,
                  logged:true
              });
            } else {
             
            }
          }.bind(this));
      }
    
    filter = (f)=>{
        listRef.once('value').then((snapshot)=>{

            console.log(listRef.orderByChild('done'));
            this.setState({


                items : _.filter(snapshot.val(), (item) => {
    
                    switch (f) {
                        case Filter.COMPLETED:
                            return item.done
                                ? item
                                : null;
                            break;
    
                        case Filter.ACTIVE:
                            return item.done
                                ? null
                                : item;
                            break;
                        default:
    
                            return item;
                            break;
                    }
                }),
                activeFilter : f
            });
        });
        
    };
     addNewitem= (name)=>{   
       var newPostRef = listRef.push();
       newPostRef.set({
        name:name,done:false,id:120,id:newPostRef.key
       });

     

    };

    onDelete = (item)=>{
        listRef.child(item).once('value').then(function(snapshot) {
            console.log(snapshot.val());
           
          });
          listRef.child(item).remove();   
    };

    removeAllDone = ()=>{
        let temp = this.state.items.slice();

        _.each(temp,(element)=>{
            if(element.done)
            listRef.child(element.id).remove();
        });
    };
    itemStatusChanged = (item)=>{
      
        listRef.child(item).once('value').then(function(snapshot) {
            
            listRef.child(item).update({done:!snapshot.val().done});
          });
       
    };
    selectAll =()=>{     
        let temp = this.state.items.slice();
        _.each(temp,(element)=>{
            listRef.child(element.id).update({done:true});
        });
    };
    handleOpen = () => {
        this.setState(prevState=>({
            dialog:{
                open:true,
                text:prevState.dialog.text
            }
        }));
      };
    
      handleClose = () => {
        this.setState(prevState=>({
            dialog:{
                open:false,
                text:prevState.dialog.text
            }
        }));
      };
      
    render() {
        const actions = [
            
            <FlatButton
              label="Ok"
              primary={true}
              keyboardFocused={true}
              onClick={this.handleClose}
            />,
          ];
    return (
    <Grid  >  
        <MuiThemeProvider >
        <Dialog
          title="Alert"
          actions={actions}
          modal={false}
          open={this.state.dialog.open}
          onRequestClose={this.handleClose}
        >
         {this.state.dialog.text}
        </Dialog>
        </MuiThemeProvider >
         <MuiThemeProvider >     
         <AppBar
         iconElementRight={this.state.logged ? <Logged click={this.logOut}/>: <Login click={this.logIn}/>}
         title={this.state.username}
         iconElementLeft={<Avatar src={this.state.photoURL}
         
          />}
       />
        </MuiThemeProvider >
        <Form selected={this.state.selected} selectAll={this.selectAll} onSubmit={this.addNewitem}/>
        <Row center={'xs'} >
            <Col   xs={12} sm={8} md={6} lg={5}>
                <MuiThemeProvider >                  
                    <List  >            
                        {                 
                        _.map(this.state.items,(item,i) => {
                            
                            return  <Item 
                            itemStatusChanged={this.itemStatusChanged} 
                            done={item.done} onDelete={this.onDelete} 
                            id={item.id} 
                            key={i}  
                            name={item.name}/>})                  
                        }
                    </List>
                </MuiThemeProvider >                
            </Col>
        </Row>
       
        <Row center={'xs'} >
            <Col   xs={12} sm={8} md={6} lg={5}>
                <MuiThemeProvider > 
               
                    <Toolbar >                      
                        <ToolbarGroup firstChild>                           
                            <Badge
                            badgeContent={_.reduce(this.state.items, function(memo, num){ return num.done?memo: memo + 1 }, 0)}
                            secondary={true}
                            badgeStyle={_.reduce(this.state.items, function(memo, num){ return num.done?memo: memo + 1 }, 0)>0?{top: 20, right: 20}:{display:'none'}}
                            >
                            <IconButton tooltip="Items left">
                                <NotificationsIcon />
                            </IconButton>
                            </Badge>
                        </ToolbarGroup>

                        <ToolbarGroup >
                        <IconButton tooltip="Select All"  onClick={()=>this.filter(Filter.ALL)} touch={true} tooltipPosition='bottom-center' ><SelectAllIcon/></IconButton>   
                            <IconButton tooltip="Active" onClick={()=>this.filter(Filter.ACTIVE)} touch={true} tooltipPosition='bottom-center' ><ScheduleIcon/></IconButton>                         
                            <IconButton tooltip="Completed" onClick={()=>this.filter(Filter.COMPLETED)} touch={true} tooltipPosition='bottom-center' ><DoneIcon/></IconButton>  
                            <IconButton tooltip="Remove Done" onClick={this.removeAllDone}  touch={true} tooltipPosition='bottom-center' ><ClearAllIcon/></IconButton>                      
                        </ToolbarGroup>
                    </Toolbar>
                </MuiThemeProvider >
            </Col>
        </Row>  
        
    </Grid>
    );
  }
  
    
} ;


class ToDoList extends React.Component {
   
 componentDidMount(){
   
 }
    render() {
        console.log();

        return (<ItemList/>)
    }
}

export default ToDoList;