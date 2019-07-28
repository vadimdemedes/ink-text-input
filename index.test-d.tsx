import * as React from 'react';
import InkTextInput, { UncontrolledTextInput } from '.';

const handler = (value: string) => console.log(value);

const Input = () => <InkTextInput value="foo" onChange={handler} />;
const AllPropsInput = () => (
	<InkTextInput
		value="bar"
		placeholder="placeholder"
		focus={false}
		mask="*"
		showCursor
		highlightPastedText
		onChange={handler}
		onSubmit={handler}
	/>
);

const UncontrolledInput = () => <UncontrolledTextInput onSubmit={handler} />;
const AllPropsUncontrolledInput = () => (
	<UncontrolledTextInput
		placeholder="placeholder"
		focus={false}
		mask="*"
		showCursor
		highlightPastedText
		onSubmit={handler}
	/>
);
