'use strict';

const {h, Text, Component} = require('ink');
const hasAnsi = require('has-ansi');

const noop = () => {};

class TextInput extends Component {
	constructor(props) {
		super(props);

		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	render({value = '', placeholder}) {
		const hasValue = value.length > 0;

		return (
			<Text dim={!hasValue}>
				{hasValue ? value : placeholder}
			</Text>
		);
	}

	componentDidMount() {
		process.stdin.on('keypress', this.handleKeyPress);
	}

	componentWillUnmount() {
		process.stdin.removeListener('keypress', this.handleKeyPress);
	}

	handleKeyPress(ch, key) {
		if (hasAnsi(key.sequence)) {
			return;
		}

		const {
			value,
			onSubmit = noop,
			onChange = noop
		} = this.props;

		if (key.name === 'return') {
			onSubmit(value);
			return;
		}

		if (key.name === 'backspace') {
			onChange(value.slice(0, -1));
			return;
		}

		if (key.name === 'space' || (key.sequence === ch && /^.*$/.test(ch) && !key.ctrl)) {
			onChange(value + ch);
		}
	}
}

module.exports = TextInput;
