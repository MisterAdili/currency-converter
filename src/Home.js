import React from 'react';

const json = (response) => response.json()

class Converter extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      fromNumber: 1,
      fromUnit: 'USD',
      toNumber: 1,
      toUnit: 'EUR',
      fromUnitsList: [],
      toUnitsList: [],
      rates: [],
      tableBody: [,],
      currencyNames: [],
    };

  this.handleChange = this.handleChange.bind(this);
  this.convert = this.convert.bind(this);
  this.switchButton = this.switchButton.bind(this);
  }

  componentDidMount() {
    fetch(`https://api.frankfurter.dev/v1/currencies`)
      .then(json)
      .then((data) => {
        this.setState({ currencyNames : data});
        let options = Object.keys(data).map((x) => <option key={x}>{x}</option>);
        this.setState({ fromUnitsList: options });
        this.convert();
        });
  }

  handleChange(event){
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value }, () => this.convert());
  }

  convert(){

    if(this.state.fromUnit != this.state.toUnit) {

      fetch(`https://api.frankfurter.dev/v1/latest?base=${this.state.fromUnit}&symbols=${this.state.toUnit}`)
      .then(json)
      .then((data) => {
        this.setState({toNumber: (this.state.fromNumber * data.rates[this.state.toUnit]).toFixed(2)});
      });

    }

    fetch(`https://api.frankfurter.dev/v1/latest?base=${this.state.fromUnit}`)
    .then(json)
    .then((data) => {
      let codes = Object.keys(data.rates);
      let options = codes.map((x) => <option key={x}>{x}</option>);
      this.setState({ toUnitsList: options });

      let codesColumn = codes;
      let ratesColumn = Object.values(data.rates);
      let firstColumn = [];

      for (let i = 0; i<codesColumn.length; i++){
        firstColumn[i] = <tr key={'row'+i}>
          <th scope='row' key={'row'+i+'column'+1}>
            {(ratesColumn[i]*this.state.fromNumber).toFixed(2)}
          </th>
          <td key={'row'+i+'column'+2}>
            {ratesColumn[i]}
          </td>
          <td key={'row'+i+'column'+3}>
            {codesColumn[i]}
          </td>
          <td key={'row'+i+'column'+4}>
            {this.state.currencyNames[codesColumn[i]]}
          </td>
          </tr>;
      }
      this.setState({ tableBody : firstColumn});
    });

    if(this.state.fromUnit == this.state.toUnit) {
      return;
    }

    fetch(`https://api.frankfurter.dev/v1/latest?base=${this.state.fromUnit}&symbols=${this.state.toUnit}`)
      .then(json)
      .then((data) => {
        this.setState({toNumber: (this.state.fromNumber * data.rates[this.state.toUnit]).toFixed(2)});
      });
  }

  switchButton (event) {
    event.preventDefault();
    let tempVar = this.state.toNumber
    this.setState({fromNumber : this.state.toNumber});
    this.setState({toNumber : tempVar});
    tempVar = this.state.fromUnit;
    this.setState({ fromUnit : this.state.toUnit });
    this.setState({ toUnit : tempVar }, () => this.convert());

  }  
  

  render(){
    const {fromNumber, fromUnit, toNumber, toUnit, fromUnitsList, toUnitsList, tableBody} = this.state;
    
    return(
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <form className="form-inline">
              <input
                className="form-control-lg m-2"
                type='number'
                name='fromNumber'
                value={fromNumber}
                onChange={this.handleChange}
              />
              <select 
                className="form-control-lg m-2"
                name='fromUnit'
                value={fromUnit}
                onChange={this.handleChange}
              >
                {fromUnitsList}
              </select>
              <button
                className="btn btn-primary btn-lg m-2"
                name='switchButton'
                onClick={this.switchButton}
              >
                 ↔ 
              </button>
              <input 
                className="form-control-lg m-2"
                type='number' 
                readOnly
                disabled
                name='toNumber'
                value={toNumber}
              />
              <select
                className="form-control-lg m-2"
                name='toUnit'
                value={toUnit}
                onChange={this.handleChange}
              >
              {toUnitsList}
              </select>              
            </form>
          </div>
        </div>
        <div className="row">
          <div className='table-responsive col-12 margin-top-2'>
            <table className='table table-striped table-bordered'>
              <thead>
                <tr>
                  <th scope="col">Converted Amount</th>
                  <th scope="col">Rate</th>
                  <th scope="col">Unit</th>
                  <th scope="col">Name</th>
                </tr>
              </thead>
              <tbody>
                {tableBody}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    )
  }
}

export default Converter;