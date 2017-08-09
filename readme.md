# ink-text-input [![Build Status](https://travis-ci.org/vadimdemedes/ink-text-input.svg?branch=master)](https://travis-ci.org/vadimdemedes/ink-text-input)

> Text input component for [Ink](https://github.com/vadimdemedes/ink).


## Install

```
$ npm install ink-text-input
```


## Usage

```js
const {h, render, Component} = require('ink');
const TextInput = require('ink-text-input');

class SearchQuery extends Component {
	constructor() {
		super();

		this.state = {
			query: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	render(props, state) {
		return (
			<div>
				Enter your query:

				<TextInput
					value={state.query}
					onChange={this.handleChange}
					onSubmit={this.handleSubmit}
				/>
			</div>
		);
	}

	handleChange(value) {
		this.setState({
			query: value
		});
	}

	handleSubmit(value) {
		// Query submitted
	}
}

render(<SearchQuery/>);
```

<img src="media/demo.gif" width="556">


## Props

### value

Type: `string`

Value to display in a text input.

### placeholder

Type: `string`

Text to display when `value` is empty.

### onChange

Type: `Function`

Function to call when value updates.

### onSubmit

Type: `Function`

Function to call when user press <kbd>Enter</kbd>.


## License

MIT © [Vadim Demedes](https://github.com/vadimdemedes)
