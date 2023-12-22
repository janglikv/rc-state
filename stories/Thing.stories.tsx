import React from 'react';
import { Meta, Story } from '@storybook/react';
import { createStore } from '../src';

const store = createStore({
    state: {
        count: 10
    },
    selector: {
        useCount: state => state.count,
    },
    actions: {
        increment: state => ({ ...state, count: state.count + 1 }),
        decrement: state => ({ ...state, count: state.count - 1 }),
    }
});


const DemoApp = store.withProvider(function ({ name = '' }) {
    const count = store.selector.useCount();
    const actions = store.useActions()
    return <div style={{ zoom: 1.5 }}>
        {name}
        {count}
        <br />
        <button onClick={actions.increment}>+</button>
        &nbsp;
        <button onClick={actions.decrement}>-</button>
    </div>
})

const meta: Meta = {
    title: 'Welcome',
    component: DemoApp,
    argTypes: {
        children: {
            control: {
                type: 'text',
            },
        },
    },
    parameters: {
        controls: { expanded: true },
    },
};

export default meta;

const Template: Story = args => <DemoApp {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
