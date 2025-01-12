import React from "react";

class Converter extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      fromNumber: 1,
      fromUnit: 'USD',
      toNumber: 1,
      toUnit: 'USD',
      unitsList: [],
    };

  this.handleChange = this.handleChange.bind(this);
}

componentDidMount() {
  fetch(`https://api.frankfurter.dev/v1/currencies`)
  .then((resp) => resp.json())
  .then((data) => {
    let codes = Object.keys(data);
    let options = codes.map((x) => <option key={x}>{x}</option>);
    this.setState({unitsList: options});
  });    

}

  handleChange(event){
    this.setState({ [event.target.name]: event.target.value });

    if (this.state.fromUnit === this.state.toUnit) {
      this.setState({ toNumber: this.state.fromNumber });
    } else {
      fetch(`https://api.frankfurter.dev/v1/latest?base=${this.state.fromUnit}&symbols=${this.state.toUnit}`)
        .then((resp) => resp.json())
        .then((data) => {
          this.setState((state) => ({toNumber: this.state.fromNumber * data.rates[this.state.toUnit]}));
        });
    }
  }

  render(){
    const {fromNumber, fromUnit, toNumber, toUnit, unitsList} = this.state;
    
    return(
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <form className="form-inline">
              <input
                type='number'
                name='fromNumber'
                value={fromNumber}
                onChange={this.handleChange}
              />
              <select 
                name='fromUnit'
                value={fromUnit}
                onChange={this.handleChange}
              >
                {unitsList}
              </select>
              <button>↔</button>
              <input 
              type='number' 
              className='form-inline'
              value={toNumber}
              onChange={this.handleChange}
              />
              <select
                name='toUnit'
                value={toUnit}
                onChange={this.handleChange}
              >
              {unitsList}
              </select>              
            </form>
          </div>
        </div>
        <div className="row">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">{fromNumber} {fromUnit} =</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1.00</th>
                <td>GBP</td>
                <td>British Pound</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default Converter;