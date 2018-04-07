'use strict';

const {h, Text, Component} = require('ink');
const PropTypes = require('prop-types');
const hasAnsi = require('has-ansi');

const noop = () => {};

const isValid = (value, type) => {
	switch (type) {
		case 'number':
			return /^[1-9](?:[0-9]*)$/.test(String(value));
		case 'text':
			return value && value.length > 0;
		default:
			return true;
	}
};

class TextInput extends Component {
	constructor(props) {
		super(props);

		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	render() {
		const {value, type, placeholder} = this.props;
		const hasValue = isValid(value, type);

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
		if (!this.props.focus) {
			return;
		}

		if (hasAnsi(key.sequence)) {
			return;
		}

		const {value, type, onChange, onSubmit} = this.props;

		if (key.name === 'return') {
			onSubmit(value);
			return;
		}

		if (key.name === 'backspace') {
			onChange(value.slice(0, -1));
			return;
		}

		if (key.name === 'space' || (key.sequence === ch && /^.*$/.test(ch) && !key.ctrl)) {
			const newValue = String(value) + ch;
			if (isValid(newValue, type)) {
				onChange(newValue);
			}
		}
	}
}

TextInput.propTypes = {
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]),
	placeholder: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]),
	onChange: PropTypes.func,
	onSubmit: PropTypes.func,
	focus: PropTypes.bool,
	type: PropTypes.oneOf(['text', 'number'])
};

TextInput.defaultProps = {
	value: undefined,
	placeholder: '',
	onChange: noop,
	onSubmit: noop,
	focus: true,
	type: 'text'
};

module.exports = TextInput;
