import React from 'react';
import _ from 'underscore'
import { Grid, Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import Toggle from 'material-ui/Toggle';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import FlatButton from 'material-ui/FlatButton';
class Item extends React.Component{



    state = {
        done:false,
        name:this.props.name
      };

      onDelete = (ev)=>{
      console.log(this.state.name);
      this.props.onDelete(this.state.name);
    };
    onCheckboxCliked = (ev,isChecked)=>{
        this.setState(prevState =>({done: isChecked}),()=>console.log(isChecked));
    };
    render(){
        return (

           
            <ListItem primaryText={this.props.name} 
                style={this.state.done?{textDecoration:'line-through'}:{}}
                 leftCheckbox={<Checkbox onCheck={this.onCheckboxCliked} />} 
                 rightIconButton={<FlatButton  icon={<ActionDelete />} onClick={this.onDelete}/>} />
         
   );
    }
  

}

class  ItemList extends React.Component{

    state ={
      items:[
        
      ]
    };


    addNewitem= (name)=>{
        this.setState(prevState =>({items: prevState.items.concat(name)}),()=>console.log(this.state.items));

    };
    onDelete = (item)=>{
        this.setState(prevState =>({
           
            items: _.filter(prevState.items,(i)=>{
                return i !== item;
            })
            }));
    }
    render() {
    return (
      <Grid fluid>
       
        <Form onSubmit={this.addNewitem}/>
        <Row>
          <Col  xsOffset={4} xs={4} mdOffset={4} md={4}>
          <MuiThemeProvider >
        <List>
            
            {
                this.state.items.length>0?
                this.state.items.map((item,i) => <Item onDelete={this.onDelete} key={i}  name={item}/>)
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
    state={
            item:''
        }
        handleSubmit = (event)=>{
            event.preventDefault();
            console.log(this.state.item);
            this.props.onSubmit(this.state.item);
            this.setState({item:''});
        };
    render(){    
                return(

        <Row center='xs'>
            <Col   xs={6} >
            <MuiThemeProvider >
                <form onSubmit={this.handleSubmit}>
                    <TextField value={this.state.item}
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