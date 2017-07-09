# ink-text-input [![Build Status](https://travis-ci.org/vadimdemedes/ink-text-input.svg?branch=master)](https://travis-ci.org/vadimdemedes/ink-text-input)

> Text input component for [Ink](https://github.com/vadimdemedes/ink).


## Install

```
$ npm install --save ink-text-input
```


## Usage

```js
const {h, Component} = require('ink');
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
		// query submitted
	}
}

mount(<SearchQuery/>);
```

**Note**: For `<TextInput>` to be able to receive `keypress` events, `process.stdin` must be in raw mode. As a result, default behavior like Ctrl+C is disabled, so you must handle that manually.

Use this snippet to enable `keypress` events:

```js
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
```


## Props

### value

Type: `string`

Value to display in a text input.

### placeholder

Type: `string`

Text to display when `value` is empty.

### onChange

Type: `function`

Function to call when value updates.

### onSubmit

Type: `function`

Function to call when user presses Enter.


## License

MIT © [Vadim Demedes](https://github.com/vadimdemedes)
