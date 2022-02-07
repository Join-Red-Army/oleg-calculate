import React, { Component } from 'react';
import './app.css';
import BoardsList from '../boards-list'

export default class App extends Component {
  maxId = 100;

  state = {
    boards: [ 
      this.createBoardInfo()
    ],
  }


  createBoardInfo() {
    this.maxId += 1;
    return { key: this.maxId, id: this.maxId++ };
  }

  onDelete = (id) => {
    this.setState( ({ boards }) => {
      // const deleteIndex = boards.findIndex((el) => el.id === id);
      const deleteIndex = this.findIndex(boards, id);
      return { boards: [...boards.slice(0, deleteIndex), ...boards.slice(deleteIndex + 1)]};
    });
  };

  onAdd = (id) => {
    this.setState( ({boards}) => {
      const i = this.findIndex(boards, id);
      const newItem = this.createBoardInfo();
      const newArr = [...boards.slice(0, i + 1), newItem, ...boards.slice(i + 1)]
      return { boards: newArr }
    } )
  }

  findIndex = (array, id) => {
    return array.findIndex((el) => el.id === id);
  }
  
  render() {
    return <div className='app'>
      <BoardsList 
        boardInfo={this.state.boards} 
        onDelete={this.onDelete}
        onAdd={this.onAdd}
        numberOfBoards={this.state.boards.length}
      />
    </div>
  }
};
