import EventEmitter from 'events';
import React from 'react';
import {spy} from 'sinon';
import test from 'ava';
import {render, Color} from 'ink';
import TextInput from '.';

const noop = () => {};

const createStdin = () => {
	const stream = new EventEmitter();
	stream.setRawMode = spy();

	return stream;
};

const renderToString = (node, stdin = createStdin()) => {
	let output = '';

	const stream = {
		columns: 100,
		write: data => {
			output += data;
		}
	};

	render(node, {
		debug: true,
		stdout: stream,
		stdin
	});

	return output;
};

test('default state', t => {
	t.is(renderToString(<TextInput value="" onChange={noop}/>), '');
});

test('display value', t => {
	t.is(renderToString(<TextInput value="Hello" showCursor={false} onChange={noop}/>), 'Hello\n');
});

test('display placeholder', t => {
	t.is(renderToString(<TextInput value="" placeholder="Placeholder" onChange={noop}/>), renderToString(<Color dim>Placeholder</Color>));
});

test('display value with mask', t => {
	t.is(renderToString(<TextInput value="Hello" showCursor={false} mask="*" onChange={noop}/>), '*****\n');
});

test('accept input', t => {
	const stdin = createStdin();
	const ref = React.createRef();
	const onChange = spy();
	renderToString(<TextInput ref={ref} value="" onChange={onChange}/>, stdin);

	stdin.emit('data', 'X');
	t.true(onChange.calledOnce);
	t.is(onChange.firstCall.args[0], 'X');
});

test('ignore input on blurred', t => {
	const stdin = createStdin();
	const ref = React.createRef();
	const onChange = spy();
	renderToString(<TextInput ref={ref} focus={false} value="" onChange={onChange}/>, stdin);

	stdin.emit('data', 'X');
	t.false(onChange.called);
});
