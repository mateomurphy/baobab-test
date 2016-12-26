import React, {Component} from 'react'

import connect from '../connectors'
import * as actions from '../actions'

class List extends Component {
  constructor(props, context) {
    super(props, context);

    // Initial state
    this.state = {inputColor: ''}
  }

  // Controlling the input's value
  updateInput(e) {
    this.setState({inputColor: e.target.value})
  }

  // Adding a color on click
  handleClick() {

    this.props.addColor(
      this.state.inputColor
    );

    // Resetting the input
    this.setState({inputColor: ''})
  }

  render() {
    const colors = this.props.colors;

    function renderItem(color) {
      return <li key={color}>{color}</li>
    }

    return (
      <div>
        <ul>{colors.map(renderItem)}</ul>
        <input type="text"
               value={this.state.inputColor}
               onChange={e => this.updateInput(e)} />
        <button type="button" onClick={() => this.handleClick()}>Add</button>
      </div>
    );
  }
}

// Subscribing to the relevant data in the tree
export default connect(
  actions,
  {
    colors: ['colors']
  },
  List
)
