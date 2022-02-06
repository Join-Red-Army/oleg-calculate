import React from 'react';
import BoardForm from '../board-form';

const BoardsList = ({boardInfo, ...rest}) => {

  const boardsArray = boardInfo
    .map((info) => <BoardForm {...info} {...rest}  />)

  return (
    <div>
      {boardsArray}
    </div>
  );
}

export default BoardsList;