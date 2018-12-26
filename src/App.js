import React, { Component } from 'react';
import './App.css';
import RenderInput from "./Core/Components/Input/RenderInput";

class App extends Component {
  changeField = (value) =>{
    console.warn('value', value);
  };

  render() {
    return (
        <RenderInput
            type={"login"}
            placeholder={"Логин"}
            width={500}
            margin = {20}
            error={false}
            onChange={(value) => {this.changeField( value)}}
        />
    );
  }
}

export default App;
