import EventEmitter from 'events';
import React, {useState} from 'react';
import {spy} from 'sinon';
import test from 'ava';
import chalk from 'chalk';
import {render} from 'ink';
import TextInput from '.';

const noop = () => {};

const createInkOptions = () => {
	const stdin = new EventEmitter();
	stdin.setRawMode = () => {};
	stdin.setEncoding = () => {};

	const options = {
		stdin,
		stdout: {
			columns: 100,
			write: spy()
		},
		debug: true
	};

	return options;
};

const CURSOR = chalk.inverse(' ');

test('default state', t => {
	const options = createInkOptions();
	render(<TextInput value="" onChange={noop}/>, options);

	const output = options.stdout.write.lastCall.args[0];
	t.is(output, CURSOR);
});

test('display value', t => {
	const options = createInkOptions();
	render(<TextInput value="Hello" showCursor={false} onChange={noop}/>, options);

	const output = options.stdout.write.lastCall.args[0];
	t.is(output, 'Hello');
});

test('display placeholder', t => {
	const options = createInkOptions();
	render(<TextInput value="" placeholder="Placeholder" onChange={noop}/>, options);

	const output = options.stdout.write.lastCall.args[0];
	t.is(output, chalk.dim('Placeholder'));
});

test('display value with mask', t => {
	const options = createInkOptions();
	render(<TextInput value="Hello" showCursor={false} mask="*" onChange={noop}/>, options);

	const output = options.stdout.write.lastCall.args[0];
	t.is(output, '*****');
});

test('accept input', t => {
	const options = createInkOptions();

	const StatefulTextInput = () => {
		const [value, setValue] = useState('');

		return <TextInput value={value} onChange={setValue}/>;
	};

	render(<StatefulTextInput/>, options);

	t.is(options.stdout.write.lastCall.args[0], CURSOR);

	options.stdin.emit('data', 'X');

	t.is(options.stdout.write.lastCall.args[0], `X${CURSOR}`);
});

test('ignore input when not in focus', t => {
	const options = createInkOptions();

	const StatefulTextInput = () => {
		const [value, setValue] = useState('');

		return <TextInput focus={false} value={value} onChange={setValue}/>;
	};

	render(<StatefulTextInput/>, options);

	t.is(options.stdout.write.lastCall.args[0], '');

	options.stdin.emit('data', 'X');

	t.true(options.stdout.write.calledOnce);
});
