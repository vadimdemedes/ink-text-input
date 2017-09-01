import EventEmitter from 'events';
import {spy} from 'sinon';
import test from 'ava';
import {h, build, renderToString, render, Text} from 'ink';
import TextInput from '.';

test('default state', t => {
	t.is(renderToString(<TextInput/>), '');
});

test('display value', t => {
	t.is(renderToString(<TextInput value="Hello"/>), 'Hello');
});

test('display placeholder', t => {
	t.is(renderToString(<TextInput placeholder="Placeholder"/>), renderToString(<Text dim>Placeholder</Text>));
});

test.serial('attach keypress listener', t => {
	const stdin = new EventEmitter();
	stdin.setRawMode = spy();
	stdin.pause = spy();

	const stdout = {
		write: spy()
	};

	const setRef = spy();
	const unmount = render(<TextInput ref={setRef}/>, {stdin, stdout});
	const ref = setRef.firstCall.args[0];

	t.is(process.stdin.listeners('keypress')[0], ref.handleKeyPress);

	unmount();

	t.deepEqual(process.stdin.listeners('keypress'), []);
});

test('ignore input on blurred', t => {
	const setRef = spy();
	const onChange = spy();
	const onSubmit = spy();

	build(<TextInput ref={setRef} focus={false} onChange={onChange} onSubmit={onSubmit}/>);
	const ref = setRef.firstCall.args[0];

	ref.handleKeyPress('', {name: 'return'});
	ref.handleKeyPress('B', {sequence: 'B'});

	t.false(onChange.called);
	t.false(onSubmit.called);
});

test('ignore ansi escapes', t => {
	const setRef = spy();
	const onChange = spy();
	const onSubmit = spy();

	build(<TextInput ref={setRef} onChange={onChange} onSubmit={onSubmit}/>);

	const ref = setRef.firstCall.args[0];
	ref.handleKeyPress('', {sequence: '\u001B[H'});

	t.false(onChange.called);
	t.false(onSubmit.called);
});

test('handle return', t => {
	const setRef = spy();
	const onChange = spy();
	const onSubmit = spy();

	build(<TextInput ref={setRef} value="Test" onChange={onChange} onSubmit={onSubmit}/>);

	const ref = setRef.firstCall.args[0];
	ref.handleKeyPress('', {name: 'return'});

	t.false(onChange.called);
	t.true(onSubmit.calledOnce);
	t.deepEqual(onSubmit.firstCall.args, ['Test']);
});

test('handle change', t => {
	const setRef = spy();
	const onChange = spy();
	const onSubmit = spy();

	build(<TextInput ref={setRef} value="A" onChange={onChange} onSubmit={onSubmit}/>);

	const ref = setRef.firstCall.args[0];
	ref.handleKeyPress('B', {sequence: 'B'});

	t.true(onChange.calledOnce);
	t.deepEqual(onChange.firstCall.args, ['AB']);
	t.false(onSubmit.called);
});
