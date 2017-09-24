
import React, { Component } from 'react';
import demo1 from './demo/demo1';
import demo2 from './demo/demo2';
import demo3 from './demo/demo3';
import demo4 from './demo/demo4';
import demo5 from './demo/demo5';
import demo6 from './demo/demo6';

export default class App extends Component {
  handleClickDemo1 = () => {
    demo1();
  }
  handleClickDemo2 = () => {
    demo2();
  }
  handleClickDemo3 = () => {
    demo3();
  }
  handleClickDemo4 = () => {
    demo4();
  }
  handleClickDemo5 = () => {
    demo5();
  }
  handleClickDemo6 = () => {
    demo6();
  }
  render() {
    return (
      <div style={{cursor: 'pointer', lineHeight: 3, marginLeft: 30}}>
        <div onClick={this.handleClickDemo1}>Observable</div>
        <div onClick={this.handleClickDemo2}>Computed</div>
        <div onClick={this.handleClickDemo3}>Observable Object</div>
        <div onClick={this.handleClickDemo4}>Observable Array</div>
        <div onClick={this.handleClickDemo5}>Use class</div>
        <div onClick={this.handleClickDemo6}>Observable Map</div>
      </div>
    );
  };
}