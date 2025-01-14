import React from 'react';
import Chart from 'chart.js/auto'

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
  this.chartRef = React.createRef();
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
        this.getHistoricalRates(this.state.fromUnit, this.state.toUnit);
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

    this.getHistoricalRates(this.state.fromUnit, this.state.toUnit);
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

  getHistoricalRates = (base, quote) => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date((new Date).getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

    fetch(`https://api.frankfurter.app/${startDate}..${endDate}?from=${base}&to=${quote}`)
    .then(json)
    .then( data => {
      const chartLabels = Object.keys(data.rates);
      const chartData = Object.values(data.rates).map(rate => rate[quote]);
      const chartLabel = `${base} / ${quote}`;
      this.buildChart(chartLabels, chartData, chartLabel);
    })
  }

  buildChart = (labels, data, label) => {
    const chartRef = this.chartRef.current.getContext("2d");

    if(typeof this.chart !== "undefined") {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartRef.current.getContext("2d"), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: label,
            data,
            fill: false,
            tension: 0,
          }
        ]
      },
      options: {
        responsive: true,
      }
    })
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
        <div className='row'>
          <div className='col-12'>
            <canvas ref={this.chartRef} />
          </div>
        </div>
      </div>
    )
  }
}

export default Converter;