import React, {useState} from 'react';
import test from 'ava';
import chalk from 'chalk';
import {render} from 'ink-testing-library';
import sinon from 'sinon';
import TextInput, {UncontrolledTextInput} from '.';

const noop = () => {};

const CURSOR = chalk.inverse(' ');
const ENTER = '\r';
const ARROW_LEFT = '\u001B[D';
const ARROW_RIGHT = '\u001B[C';
const DELETE = '\u007F';

test('default state', t => {
	const {lastFrame} = render(<TextInput value="" onChange={noop}/>);

	t.is(lastFrame(), CURSOR);
});

test('display value', t => {
	const {lastFrame} = render(<TextInput value="Hello" showCursor={false} onChange={noop}/>);

	t.is(lastFrame(), 'Hello');
});

test('display value with cursor', t => {
	const {lastFrame} = render(<TextInput value="Hello" onChange={noop}/>);

	t.is(lastFrame(), `Hello${CURSOR}`);
});

test('display placeholder', t => {
	const {lastFrame} = render(<TextInput value="" placeholder="Placeholder" onChange={noop}/>);

	t.is(lastFrame(), chalk.dim('Placeholder'));
});

test('display value with mask', t => {
	const {lastFrame} = render(<TextInput value="Hello" showCursor={false} mask="*" onChange={noop}/>);

	t.is(lastFrame(), '*****');
});

test('accept input (controlled)', t => {
	const StatefulTextInput = () => {
		const [value, setValue] = useState('');

		return <TextInput value={value} onChange={setValue}/>;
	};

	const {stdin, lastFrame} = render(<StatefulTextInput/>);

	t.is(lastFrame(), CURSOR);

	stdin.write('X');

	t.is(lastFrame(), `X${CURSOR}`);
});

test('accept input (uncontrolled)', t => {
	const {stdin, lastFrame} = render(<UncontrolledTextInput/>);

	t.is(lastFrame(), CURSOR);

	stdin.write('X');

	t.is(lastFrame(), `X${CURSOR}`);
});

test('ignore input when not in focus', t => {
	const StatefulTextInput = () => {
		const [value, setValue] = useState('');

		return <TextInput focus={false} value={value} onChange={setValue}/>;
	};

	const {stdin, frames, lastFrame} = render(<StatefulTextInput/>);

	t.is(lastFrame(), '');

	stdin.write('X');

	t.is(frames.length, 1);
});

test('onSubmit', t => {
	const onSubmit = sinon.spy();

	const StatefulTextInput = () => {
		const [value, setValue] = useState('');

		return (
			<TextInput value={value} onChange={setValue} onSubmit={onSubmit}/>
		);
	};

	const {stdin, lastFrame} = render(<StatefulTextInput/>);

	t.is(lastFrame(), CURSOR);

	stdin.write('X');
	stdin.write(ENTER);

	t.is(lastFrame(), `X${CURSOR}`);
	t.true(onSubmit.calledWith('X'));
	t.true(onSubmit.calledOnce);
});

test('paste and move cursor', t => {
	const StatefulTextInput = () => {
		const [value, setValue] = useState('');

		return <TextInput highlightPastedText value={value} onChange={setValue}/>;
	};

	const {stdin, lastFrame} = render(<StatefulTextInput/>);

	// Need this to invert each char separately
	const inverse = str => str.split('').map(c => chalk.inverse(c)).join('');

	stdin.write('A');
	stdin.write('B');
	t.is(lastFrame(), `AB${CURSOR}`);

	stdin.write(ARROW_LEFT);
	t.is(lastFrame(), `A${chalk.inverse('B')}`);

	stdin.write('Hello World');
	t.is(lastFrame(), `A${inverse('Hello WorldB')}`);

	stdin.write(ARROW_RIGHT);
	t.is(lastFrame(), `AHello WorldB${CURSOR}`);
});

test('delete at begigging of text', t => {
	const StatefulTextInput = () => {
		const [value, setValue] = useState('');

		return <TextInput value={value} onChange={setValue}/>;
	};

	const {stdin, lastFrame} = render(<StatefulTextInput/>);

	stdin.write('T');
	stdin.write('e');
	stdin.write('s');
	stdin.write('t');

	stdin.write(ARROW_LEFT);
	stdin.write(ARROW_LEFT);
	stdin.write(ARROW_LEFT);
	stdin.write(ARROW_LEFT);

	stdin.write(DELETE);

	t.is(lastFrame(), `${chalk.inverse('T')}est`);
});
