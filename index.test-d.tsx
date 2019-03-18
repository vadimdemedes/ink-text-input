import * as React from 'react';
import InkTextInput from '.';

const handler = (value:string) => console.log(value);

const Input = () => <InkTextInput value="foo" onChange={handler} />;
const AllPropsInput = () =>
	<InkTextInput
		value="bar"
		placeholder="placeholder"
		focus={false}
		mask="*"
		showCursor
		onChange={handler}
		onSubmit={handler}
	/>
