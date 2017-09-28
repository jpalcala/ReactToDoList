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
        color: 'rgba(0,0,0,1)',
        fontSize: '2em'
    },
    selectedItemStyle: {
        textDecoration: 'line-through',
        color: 'rgba(0,0,0,0.5)',
        fontSize: '2em'
    }
};

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
        activeFilter: Filter.ALL
    };
    filter = (f)=>{
        this.setState({
            filteredItems : _.filter(this.state.items, (item) => {

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
    };
     addNewitem= (name)=>{   
       
        this.setState(prevState=>({
            items: [...prevState.items, {name:name,done:false,id:prevState.items.length}],
          
        }),()=>this.filter(this.state.activeFilter));

    };

    onDelete = (item)=>{
       
        this.setState(prevState =>({
           
            items: _.filter(prevState.items,(i,n)=>{
               
                return i.id !== item;
            }),
            filteredItems:_.filter(prevState.filteredItems,(i,n)=>{
               
                return i.id !== item;
            })
            }));
    };

    removeAllDone = ()=>{
        this.setState(prevState =>({
            
             items: _.filter(prevState.items,(i,n)=>{
                
                 return i.done !== true;
             }),
             filteredItems:_.filter(prevState.filteredItems,(i,n)=>{
                
                 return i.done !== true;
             })
             }));
    };
    itemStatusChanged = (item)=>{
      
        this.setState(prevState =>({
            
             items:_.map(prevState.items,(val,i)=>{
                val.done = (val.id==item ? val.done? false:true:val.done); 
                 return val;
             })
        }),()=>this.filter(this.state.activeFilter));
    };
    selectAll =()=>{       
        this.setState(prevState =>({
            
             items:_.map(prevState.items,(val,i)=>{
                 this.state.selected ?val.done=false: val.done=true;
                 return val;
             }),             
             selected:!prevState.selected
        }),()=>this.filter(this.state.activeFilter));
    };
    render() {
    return (
    <Grid  >       
        <Form selected={this.state.selected} selectAll={this.selectAll} onSubmit={this.addNewitem}/>
        <Row center={'xs'} >
            <Col   xs={12} sm={8} md={6} lg={5}>
                <MuiThemeProvider >                  
                    <List  >            
                        {                 
                        this.state.filteredItems.map((item,i) => {
                            
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

    render() {

        return (<ItemList/>)
    }
}

export default ToDoList;