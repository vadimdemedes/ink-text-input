import React, {useState} from 'react';
import test from 'ava';
import chalk from 'chalk';
import {render} from 'ink-testing-library';
import TextInput from '.';

const noop = () => {};

const CURSOR = chalk.inverse(' ');

test('default state', t => {
	const {lastFrame} = render(<TextInput value="" onChange={noop}/>);

	t.is(lastFrame(), CURSOR);
});

test('display value', t => {
	const {lastFrame} = render(<TextInput value="Hello" showCursor={false} onChange={noop}/>);

	t.is(lastFrame(), 'Hello');
});

test('display placeholder', t => {
	const {lastFrame} = render(<TextInput value="" placeholder="Placeholder" onChange={noop}/>);

	t.is(lastFrame(), chalk.dim('Placeholder'));
});

test('display value with mask', t => {
	const {lastFrame} = render(<TextInput value="Hello" showCursor={false} mask="*" onChange={noop}/>);

	t.is(lastFrame(), '*****');
});

test('accept input', t => {
	const StatefulTextInput = () => {
		const [value, setValue] = useState('');

		return <TextInput value={value} onChange={setValue}/>;
	};

	const {stdin, lastFrame} = render(<StatefulTextInput/>);

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
