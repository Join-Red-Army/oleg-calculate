import React, { Component } from 'react';
import './app.css';
import BoardsList from '../boards-list'

export default class App extends Component {
  maxId = 0;

  state = {
    boards: [ 
      this.createBoardInfo(), 
      this.createBoardInfo()
    ],
  }


  createBoardInfo() {
    this.maxId += 1;
    return { key: this.maxId, id: this.maxId };
  }

  onDelete = (id) => {
    this.setState( ({ boards }) => {
      const deleteIndex = boards.findIndex((el) => el.id === id);
      return { boards: [...boards.slice(0, deleteIndex), ...boards.slice(deleteIndex + 1)]};
    });
  };

  onAdd = () => {
    this.setState( ({boards}) => {
      return { boards: [...boards, this.createBoardInfo()]}
    } )
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
