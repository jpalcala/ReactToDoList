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
//material-ui Icons
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ImageCircle  from  'material-ui/svg-icons/image/panorama-fish-eye'
import ActionCheckCircle  from  'material-ui/svg-icons/action/check-circle'
import {red500, yellow500, blue500} from 'material-ui/styles/colors';

const selectedItemStyle ={
    textDecoration:'line-through',
    color:'rgba(1,1,1,0.5)',
    fontSize:'2em'
};
const unSelectedItemStyle ={
    textDecoration:'none',
    color:'rgba(1,1,1,1)',
    fontSize:'2em'
};


class Item extends React.Component{

    state = {
        done:this.props.done,
        id:this.props.id,
        name:this.props.name
    };

    onDelete = (ev)=>{
        console.log(this.state.id);
        this.props.onDelete(this.state.id);
    };
    onCheckboxCliked = (ev,isChecked)=>{
       this.props.itemStatusChanged(this.state.id);
    };

    render(){
        return (           
            <ListItem primaryText={this.props.name} 
            style={this.props.done?selectedItemStyle:unSelectedItemStyle}
            leftCheckbox={<Checkbox uncheckedIcon={<ImageCircle style={{outlineColor:'rgba(1,1,1,0.4)'}} />} checkedIcon={<ActionCheckCircle/>} checked={this.props.done} 
            onCheck={this.onCheckboxCliked} />} 
            rightIconButton={<FlatButton  icon={<ActionDelete color={red500} />} onClick={this.onDelete}/>} />
         
        );
    }
  
}

class  ItemList extends React.Component{

    state ={
      items:[]
    };


    addNewitem= (name)=>{       
        this.setState({
            items: [...this.state.items, {name:name,done:false}]
        })

    };

    onDelete = (item)=>{
        this.setState(prevState =>({
           
            items: _.filter(prevState.items,(i,n)=>{
                return n !== item;
            })
            }));
    }
    itemStatusChanged = (item)=>{
        this.setState(prevState =>({
            
             items:_.map(prevState.items,(val,i)=>{
                 if(i==item)
                 {
                    val.done ? val.done=false: val.done=true;
                 }
                 
                 return val;
             })
             }));
    }
    render() {
    return (
      <Grid  >       
        <Form onSubmit={this.addNewitem}/>
        <Row center={'xs'} >
            <Col  xs={5}>
                <MuiThemeProvider >
                    <List  >            
                        {
                        this.state.items.length>0?
                        this.state.items.map((item,i) => <Item 
                            itemStatusChanged={this.itemStatusChanged} 
                            done={item.done} onDelete={this.onDelete} 
                            id={i} 
                            key={i}  
                            name={item.name}/>)
                        :<Subheader>Que hay que hacer?</Subheader>
                        }
                    </List>
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
        console.log(this.state.item);
        this.props.onSubmit(this.state.item);
        this.setState({item:''});
    };
    render(){    
        return(
        <Row center='xs'>
            <Col  xs={5} >
                <MuiThemeProvider >
                    <form  onSubmit={this.handleSubmit}>
                        <TextField fullWidth value={this.state.item}
                        onChange={(event)=>this.setState({item:event.target.value})}
                        hintText="Holis"
                        floatingLabelText="Introduce aqui algo por hacer"
                        />  
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