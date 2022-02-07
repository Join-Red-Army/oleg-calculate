import React, { Component } from 'react';
import './board-form.css';

export default class BoardForm extends Component {

  state = {
    woodName: 'Ольха',
    thickness: 100,
    width: 200,
    length: 300,
    priceForCubicMeter: 0,
    units: 'mm',
    totalVolume: 0,
    totalPrice: null,
  };

  onPriceChange = (e) => {
    const price = e.target.value;
    this.setState({price});
  }

  checkDimensionsCompletion = () => {
    const { thickness, width, length } = this.state;
    return !!(thickness && width && length);
  }


  transformToCubicMeters = () => {
    const { thickness, width, length, units, } = this.state;
    let unitsDivider = 1;
    
    if (units === 'mm') unitsDivider = 1000000000;
    else if (units === 'cm') unitsDivider = 100;
    
    const volumeInMeters = ([thickness, width, length]
      .reduce((acc, current) => current * acc )) / unitsDivider;
    return volumeInMeters;
  };

  getTotalPrice = () => {
    const { priceForCubicMeter, totalVolume } = this.state;
    return priceForCubicMeter * totalVolume;
  }


  onCalculate = () => {
    const { priceForCubicMeter } = this.state;

    if (!this.checkDimensionsCompletion) return;
    const totalVolume = this.transformToCubicMeters();
    
    const totalPrice = priceForCubicMeter ?
      (totalVolume * priceForCubicMeter) : null;

    this.setState({totalVolume, totalPrice})
  }

  getVolumePriceLabel = () => {
    const { woodName, totalVolume, totalPrice } = this.state;

    const volumeLabel = woodName ?
      <span>{woodName}, объём: {totalVolume} м<sup>3</sup></span> :
      <span>объём: {totalVolume} м<sup>3</sup></span>;

    const priceLabel = <span>цена: {totalPrice}</span>;

    return (
      <div>
        <div>{volumeLabel}</div>
        <div>{priceLabel}</div>
      </div>
      );
    };

  render() {
    const { woodName, units, totalVolume, totalPrice } = this.state;
    const { id, numberOfBoards, onDelete, onAdd } = this.props;
    const onCalculate = this.onCalculate;

    return (
      <form className='board-form' action='/' method='post'>

        <div className='board-form__section'>
          { createWoodTypesInput(id) }
        </div>

        <div className='board-form__section'>
          { createPriceInput(id, this.onPriceChange) }
        </div>

        <div className='board-form__section'>
          { createUnitsInput(id) }
        </div>

        {createSizeComponents(units, id)}

        <div className='board-form__section'>
          {createFormButtons({id, numberOfBoards, onDelete, onAdd, onCalculate})}
        </div>

        <div className='board-form__section'>
          {this.getVolumePriceLabel()}
        </div>
        
      </form>
      
    );
  };

}


const createWoodTypesInput = (id) => {
  const woodTypes = [
    'сипо', 'орех', 'амарант', 'абачи', 'бубинга', 'ольха', 'макоре', 
    'клён', 'акация', 'анегри', 'кедр', 'бальза', 'бук', 'падук', 'венге', 
    'палисандр', 'вишня', 'граб', 'дуб', 'тополь', 'ясень', 'липа', 'махагон',
    'меранти', 'мербау', 'цедер', 'эбен'];
  const optionElements = woodTypes.map((el, i) => <option value={el} key={i}/>);
  
  return (
    <div className='board-form__group'>
      
      {/* <label htmlFor={`wood-type-${id}`}>
        Порода дерева
      </label> */}
      
      <input
        type='text'
        id={`wood-type-${id}`}
        list='wood-list' 
        placeholder='порода дерева'
      />
        
      <datalist 
        id='wood-list'
      >
        { optionElements }
      </datalist>
    </div>

  );
};


function createSizeInput(dimension, units, id) {

  let labelName = null;
  switch (dimension) {
    case 'thickness': 
      labelName = 'толщина';
      break;
    case 'width':
      labelName = 'ширина';
      break;
    case 'length': 
      labelName = 'длина';
      break;
    default: 
      return null;
  };

  return (
    <div className='board-form__group'>

      <label htmlFor={ `${dimension}-${id}` }>
        {`${labelName}, ${units}`}
      </label>

      <input 
        type='number'
        id={`${dimension}-${id}`}
        placeholder='0'
        required
      />
    </div>
  );
};


function createSizeComponents(units, id) {
  const sizeInputs = ['thickness', 'width', 'length']
    .map((el) => {
      return (
        <div className='board-form__section' key={el}>
          { createSizeInput(el, units, id) }
        </div>
      );
    });

  return sizeInputs
}


const createUnitsInput = (id) => {
  return (
    <div className='board-form__group'>
      <label htmlFor={`units-select-${id}`}>В чём будешь измерять?</label>
      <select size='1' id={`units-select-${id}`}>
        <option value='mm' defaultValue>мм</option>
        <option value='cm'>см</option>
        <option value='m'>м</option>
      </select>
    </div>
  )
}


function createPriceInput(id, onPriceChange) {
  return (
    <div className='board-form__group'>

      <label 
        htmlFor={`price-${id}`}
        >Цена за кубический метр
      </label>

      <input
        type='number'
        id={`price-${id}`}
        onChange={onPriceChange}
        // onBlur={onPriceChange}
        placeholder='0'
        required
      />
    </div>
  );
}


function createFormButtons ({numberOfBoards, onDelete, onAdd, onCalculate, id}) {
  
  let buttonSize = numberOfBoards === 1 ? 'big' : 'small';

  const calculateBtn = (
    <button 
      className='btn-calculate' 
      type='button'
      onClick={onCalculate}
      >посчитать по-братски
    </button>
  );

  const clearBtn = (
    <button 
      className={buttonSize} 
      type='reset'
      >очистить
    </button>
  );

  const addFormBtn = (
    <button 
      className={buttonSize} 
      type='button'
      onClick={() => onAdd(id)}
      >добавить
  </button>
  )

  let deleteBtn = (
    <button 
      className={buttonSize}
      type='button'
      onClick={() => onDelete(id)}
      >удалить
    </button>
  );

  if (numberOfBoards === 1) {
    deleteBtn = null;
  }

  return (
    <div className='board-form__buttons'>
      {addFormBtn}
      {clearBtn}
      {deleteBtn}

      {calculateBtn}
    </div>
  );
};