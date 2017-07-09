import {spy} from 'sinon';
import test from 'ava';
import {h, render as build, renderToString, mount, Text} from 'ink';
import TextInput from '.';

const render = tree => renderToString(build(tree));

test('default state', t => {
	t.is(render(<TextInput/>), '');
});

test('display value', t => {
	t.is(render(<TextInput value="Hello"/>), 'Hello');
});

test('display placeholder', t => {
	t.is(render(<TextInput placeholder="Placeholder"/>), render(<Text dim>Placeholder</Text>));
});

test.serial('attach keypress listener', t => {
	const setRef = spy();
	const stream = {write: () => {}};
	const unmount = mount(<TextInput ref={setRef}/>, stream);
	const ref = setRef.firstCall.args[0];

	t.is(process.stdin.listeners('keypress')[0], ref.handleKeyPress);

	unmount();

	t.deepEqual(process.stdin.listeners('keypress'), []);
});

test('ignore ansi escapes', t => {
	const setRef = spy();
	const onChange = spy();
	const onSubmit = spy();

	render(<TextInput ref={setRef} onChange={onChange} onSubmit={onSubmit}/>);

	const ref = setRef.firstCall.args[0];
	ref.handleKeyPress('', {sequence: '\u001B[H'});

	t.false(onChange.called);
	t.false(onSubmit.called);
});

test('handle return', t => {
	const setRef = spy();
	const onChange = spy();
	const onSubmit = spy();

	render(<TextInput ref={setRef} value="Test" onChange={onChange} onSubmit={onSubmit}/>);

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

	render(<TextInput ref={setRef} value="A" onChange={onChange} onSubmit={onSubmit}/>);

	const ref = setRef.firstCall.args[0];
	ref.handleKeyPress('B', {sequence: 'B'});

	t.true(onChange.calledOnce);
	t.deepEqual(onChange.firstCall.args, ['AB']);
	t.false(onSubmit.called);
});
