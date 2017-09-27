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
//material-ui Icons
import ActionDelete from 'material-ui/svg-icons/action/delete';
import DoneIcon from 'material-ui/svg-icons/action/done';
import ScheduleIcon from 'material-ui/svg-icons/action/schedule';
import ImageCircle  from  'material-ui/svg-icons/image/panorama-fish-eye'
import ArrowDown  from  'material-ui/svg-icons/hardware/keyboard-arrow-down'
import ActionCheckCircle  from  'material-ui/svg-icons/action/check-circle'
import {red500, grey400, blue500} from 'material-ui/styles/colors';
import DoneAllIcon from 'material-ui/svg-icons/action/done-all';
import AllOutIcon from 'material-ui/svg-icons/action/all-out';
import SelectAllIcon from 'material-ui/svg-icons/content/select-all';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';

const selectedItemStyle ={
    textDecoration:'line-through',
    color:'rgba(0,0,0,0.5)',
    fontSize:'2em'
};
const unSelectedItemStyle ={
    textDecoration:'none',
    color:'rgba(0,0,0,1)',
    fontSize:'2em'
};

const styles = {
  
  radioButton: {
    marginBottom: 16,
    width:'auto'
  },
};
class Item extends React.Component{

    state = {
        done:this.props.done,
        id:this.props.id,
        name:this.props.name
    };

    onDelete = (ev)=>{
       
        this.props.onDelete(this.state.id);
    };
    onCheckboxCliked = (ev,isChecked)=>{
      
        console.log(this.state.id+'state')
       this.props.itemStatusChanged(this.state.id);
    };

    render(){
        return (    
            <div>       
            <ListItem primaryText={this.props.name} 
            style={this.props.done?selectedItemStyle:unSelectedItemStyle}
            leftCheckbox={<Checkbox uncheckedIcon={<ImageCircle color={grey400}  />} checkedIcon={<ActionCheckCircle/>} checked={this.props.done} 
            onCheck={this.onCheckboxCliked} />} 
            rightIconButton={<FlatButton  icon={<ActionDelete color={red500} />} style={{height:'100%'}} onClick={this.onDelete}/>} />
            <Divider/>
            </div>
         
        );
    }
  
}
const Filter = {
    ALL:0,
    ACTIVE:1,
    COMPLETED:2
};
class  ItemList extends React.Component{

    state ={
      items:[],
      filteredItems:[],
      selected:false,
      activeFilter: Filter.ALL
    };
    /*
    filter = (item)=>{
        switch(this.state.activeFilter){
            case Filter.COMPLETED:
                return item.done?true:false;
            break;
            case Filter.ACTIVE:
            return item.done?false:true;
            break;
            default:
            return true;
            break;
        }
    };*/
    filter = (f)=>{
        console.log(f);
       
        this.setState({
            filteredItems: _.filter(this.state.items,(item)=>{

                switch(f){
                    case Filter.COMPLETED:
                        console.log('completed')
                        return item.done?item:null;
                    break;
                    console.log('active')
                    case Filter.ACTIVE:
                    return item.done?null:item;
                    break;
                    default:
                    console.log('all')
                    return item;
                    break;
                }
            }),
            activeFilter:f
        },()=>console.log(this.state.filteredItems));
    };
     addNewitem= (name)=>{       
        this.setState({
            items: [...this.state.items, {name:name,done:false,id:this.state.items.length}],
          
        },()=>this.filter(this.state.activeFilter));

    };
    filterAll = ()=>{
console.log(this.state.activeFilter);
    };

    onDelete = (item)=>{
        console.log('delete');
        this.setState(prevState =>({
           
            items: _.filter(prevState.items,(i,n)=>{
                return n !== item;
            }),
            filteredItems:_.filter(prevState.filteredItems,(i,n)=>{
                return n !== item;
            })
            }));
    };
    itemStatusChanged = (item)=>{
       console.log('item'+item);
        this.setState(prevState =>({
            
             items:_.map(prevState.items,(val,i)=>{
                
                 if(val.id==item)
                 {
                    
                   val.done = val.done?false:true;
                 }
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
            }));
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
                 
                    this.state.filteredItems.map((item,i) => <Item 
                        itemStatusChanged={this.itemStatusChanged} 
                        done={item.done} onDelete={this.onDelete} 
                        id={i} 
                        key={i}  
                        name={item.name}/>)
                  
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
                    <IconButton tooltip="Select All" onClick={()=>this.filter(Filter.ALL)} touch={true} tooltipPosition='bottom-center' ><SelectAllIcon/></IconButton> 
                    
                   
                   
                    <IconButton tooltip="Active" onClick={()=>this.filter(Filter.ACTIVE)} touch={true} tooltipPosition='bottom-center' ><ScheduleIcon/></IconButton> 
                   
                    <IconButton tooltip="Completed" onClick={()=>this.filter(Filter.COMPLETED)} touch={true} tooltipPosition='bottom-center' ><DoneIcon/></IconButton> 
                    
                    </ToolbarGroup>
                       
                       
           
          
      </Toolbar>
     
      
      </MuiThemeProvider >
      </Col>
        </Row>
        
            
      </Grid>
    );
  }
  
    
} ;
class Form extends React.Component{
    state={item:''}

    handleSubmit = (event)=>{
        event.preventDefault();
        this.props.onSubmit(this.state.item);
        this.setState({item:''});
    };
    selectAll =()=>{
        this.props.selectAll();
    };
    render(){    
        return(
        <Row center='xs'  >
            <Col  xs={12} sm={8} md={6} lg={5} >
                <MuiThemeProvider >
                    <form  onSubmit={this.handleSubmit}>
                        <Row bottom={'xs'}>
                            <Col xs={2}>
                            <FlatButton onClick={this.selectAll} style={{minWidth:'40px'}} icon={this.props.selected?<AllOutIcon/>:<DoneAllIcon/>}/>
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


class App extends React.Component {
   
  render(){

    return (
        <ItemList/>
    )
  }
}

export default App;