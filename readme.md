# ink-text-input [![Build Status](https://travis-ci.org/vadimdemedes/ink-text-input.svg?branch=master)](https://travis-ci.org/vadimdemedes/ink-text-input)

> Text input component for [Ink](https://github.com/vadimdemedes/ink).


## Install

```
$ npm install ink-text-input
```


## Usage

```jsx
import React from 'react';
import {render, Box} from 'ink';
import TextInput from 'ink-text-input';

class SearchQuery extends React.Component {
	constructor() {
		super();

		this.state = {
			query: ''
		};

		this.handleChange = this.handleChange.bind(this);
	}

	render() {
		return (
			<Box>
				<Box marginRight={1}>
					Enter your query:
				</Box>

				<TextInput
					value={this.state.query}
					onChange={this.handleChange}
				/>
			</Box>
		);
	}

	handleChange(query) {
		this.setState({query});
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

### showCursor

Type: `boolean`<br>
Default: `false`

Whether to show cursor and allow navigation inside text input with arrow keys.

### mask

Type: `string`

Replace all chars and mask the value. Useful for password inputs.

```jsx
<TextInput
	value="Hello"
	mask="*"
/>
//=> "*****"
```

### onChange

Type: `Function`

Function to call when value updates.

### onSubmit

Type: `Function`

Function to call when `Enter` is pressed.


## License

MIT © [Vadim Demedes](https://github.com/vadimdemedes)
