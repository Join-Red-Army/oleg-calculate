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
    const priceForCubicMeter = e.target.value;
    this.setState({priceForCubicMeter});
  }

  onCalculate = () => {
    const { priceForCubicMeter } = this.state;

    if (!this.checkDimensionsCompletion) return;
    const totalVolume = this.transformToCubicMeters();
    
    const totalPrice = priceForCubicMeter ?
      (totalVolume * priceForCubicMeter) : null;

    this.setState({totalVolume, totalPrice})
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


  
  render() {
    const { woodName, units, totalVolume, totalPrice } = this.state;
    const { id, numberOfBoards, onDelete, onAdd } = this.props;
    const onCalculate = this.onCalculate;

    
    return (
      <form className='board-form' action='/' method='post'>

        <div className='board-form__section'>
          <WoodNameInput id={id} />
        </div>

        <div className='board-form__section'>
          <PriceInput  id={id} onPriceChange={this.onPriceChange}/>
        </div>

        <div className='board-form__section'>
          <UnitsInput id={id} />
        </div>

        <div className='board-form__section'>
          <SizeInputs formId={id} units={units}/>
        </div>

        <div className='board-form__section'>
          <FormButtons 
            numberOfBoards={numberOfBoards} 
            id={id} 
            onCalculate={onCalculate} 
            onAdd={onAdd} 
            onDelete={onDelete} 
          />
        </div>

        <div className='board-form__section'>
          <VolumeAndPriceInfo 
            woodName={woodName} 
            totalVolume={totalVolume} 
            totalPrice={totalPrice}/>
        </div>
        
      </form>
      
    );
  };
};


// ниже расположены компоненты для формы
const WoodNameInput = (props) => {
  const { id } = props;

  const suggestOptions = [
    'сипо', 'орех', 'амарант', 'абачи', 'бубинга', 'ольха', 'макоре', 
    'клён', 'акация', 'анегри', 'кедр', 'бальза', 'бук', 'падук', 'венге', 
    'палисандр', 'вишня', 'граб', 'дуб', 'тополь', 'ясень', 'липа', 'махагон',
    'меранти', 'мербау', 'цедер', 'эбен'];

  const optionElements = suggestOptions
    .map((el, i) => <option value={el} key={i}/>);
  
  return (
    <div className='board-form__group'>

      <input
        type='text'
        id={`wood-type-${id}`}
        list='wood-list' 
        placeholder='порода дерева'
      />
        
      <datalist id='wood-list'> { optionElements } </datalist>
    </div>
  );
};


const PriceInput = (props) => {
  const { id, onPriceChange } = props;
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
        placeholder='0'
        required
      />
    </div>
  );
};






const SizeInputs = (props) => {
  const { formId, units } = props;


  const inputData = [
    { dimension: 'thickness', units, labelText: 'толщина', formId: formId, onChange: () => {}, },
    { dimension: 'width',     units, labelText: 'ширина',  formId: formId, onChange: () => {}, },
    { dimension: 'length',    units, labelText: 'ширина',  formId: formId, onChange: () => {}, }
  ];


  const SizeInput = (props) => {
    const {labelText, dimension, units, formId, onChange} = props;

    return (
      <div className='board-form__group'>
        <label htmlFor={ `${dimension}-${formId}` }
          >{`${labelText}, ${units}`}
        </label>
  
        <input 
          type='number'
          id={`${dimension}-${formId}`}
          placeholder='0'
          required
        />
      </div>
    );
  };

  const inputElements = inputData
    .map((data, i) => <SizeInput {...data} key={i} />);

  return <div>{inputElements}</div>;
};



const UnitsInput = (props) => {
  const { id } = props;
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


const FormButtons = (props) => {
  const { numberOfBoards, id, onCalculate, onAdd, onDelete } = props;
    
  const calculateBtn = (
    <button 
      className='btn--grow'
      type='button'
      onClick={onCalculate}
      >посчитать по-братски
    </button>
  );

  const clearBtn = (
    <button 
      className='btn--grow'
      type='reset'
      >очистить
    </button>
  );

  const addFormBtn = (
    <button 
      className='btn--grow' 
      type='button' 
      onClick={() => onAdd(id)}
      >добавить
    </button>
  );

  const deleteBtn = (
    <button 
      className='btn--grow' 
      type='button' 
      onClick={() => onDelete(id)}
      >удалить
    </button>
  );

  return (
    <div>
      <div className='form-buttons__row'>
        {addFormBtn}
        {clearBtn}
        {numberOfBoards > 1 ? deleteBtn : null }
      </div>
      <div className='form-buttons__row'>
        {calculateBtn}
      </div> 
    </div>
  );
};



const VolumeAndPriceInfo = (props) => {
  const { woodName, totalVolume, totalPrice } = props;

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