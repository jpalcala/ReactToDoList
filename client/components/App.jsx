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
const Item = (props) =>{

   return (

           
            <ListItem primaryText={props.name} leftCheckbox={<Checkbox />} rightIconButton={<ActionDelete />} />
         
   );

}

const ItemList = (props) =>{
    return (
        <MuiThemeProvider >
        <List>
            <Subheader>Que hay que hacer?</Subheader>
            {props.items.map((item,i) => <Item onDelete={props.onDelete} key={i} id={i} name={item}/>)}
        </List>
        </MuiThemeProvider >
    );
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
    state ={
      items:[
        
      ]
    };


    addNewitem= (name)=>{
        this.setState(prevState =>({items: prevState.items.concat(name)}));
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
          <ItemList  onDelete={this.onDelete} items={this.state.items}/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;