'use strict';

const readline = require('readline');
const {h, Text, Component} = require('ink');
const PropTypes = require('prop-types');
const hasAnsi = require('has-ansi');

const noop = () => {};

class TextInput extends Component {
	constructor(props) {
		super(props);

		if (props.line) {
			this.rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout
			});
		}

		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	render({value, placeholder}) {
		const hasValue = value.length > 0;

		return (
			<Text dim={!hasValue}>
				{hasValue ? value : placeholder}
			</Text>
		);
	}

	componentDidMount() {
		if (this.rl) {
			this.rl.on('line', this.props.onSubmit);
		} else {
			process.stdin.on('keypress', this.handleKeyPress);
		}
	}

	componentWillUnmount() {
		if (this.rl) {
			this.rl.removeListener('line', this.props.onSubmit);
		} else {
			process.stdin.removeListener('keypress', this.handleKeyPress);
		}
	}

	handleKeyPress(ch, key) {
		if (hasAnsi(key.sequence)) {
			return;
		}

		const {value, onChange, onSubmit} = this.props;

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

TextInput.propTypes = {
	line: PropTypes.bool,
	value: PropTypes.string,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	onSubmit: PropTypes.func
};

TextInput.defaultProps = {
	line: false,
	value: '',
	placeholder: '',
	onChange: noop,
	onSubmit: noop
};

module.exports = TextInput;
