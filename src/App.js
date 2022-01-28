import React, { Component } from "react";
import "./App.css";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			counter: 0,
		};
	}
	render() {
		return (
			<div className="App">
				<header className="App-header" style={{ minHeight: 200 }}>
          <div>
            <div className="App-intro">
              <div className="button-container">
                <button
                  className="decrement-button"
                  onClick={() =>
                    this.setState({
                      counter: this.state.counter - 1,
                    })
                  }
                >
                  -
                </button>
                <div className="counter-text">{this.state.counter}</div>
                <button
                  className="increment-button"
                  onClick={() =>
                    this.setState({
                      counter: this.state.counter + 1,
                    })
                  }
                >
                  +
                </button>
              </div>
            </div>
          </div>
				</header>
			</div>
		);
	}
}

export default App;