import { Meta, Story } from '@storybook/react';
import React from 'react';
import { createStore } from '../src';

const demoStore = createStore({ state: { say: 'hello', name: 'rc-state' } });

const DemoApp = demoStore.withProvider(function () {
    const name = demoStore.useSelector((state) => state.name);
    const say = demoStore.useSelector((state) => state.say);
    const { setState } = demoStore.useContext();
    const changeName = (e) => setState((state) => ({ ...state, name: e.target.value }));
    return (
        <div>
            {say} {name}!
            <br />
            <input value={name} onChange={changeName} />
        </div>
    );
});

const demo2Store = createStore({
    state: { say: 'hello', name: 'rc-state' },
    actions: {
        changeNameFromEvent: (state, event) => ({ ...state, name: event.target.value }),
    },
});

export const Demo2App = demo2Store.withProvider(function () {
    return (
        <>
            <demo2Store.Consumer selectors={[(state) => state.say, (state) => state.name]}>
                {({ values: [say, name], actions }) => {
                    return (
                        <>
                            {say} {name}!
                            <br />
                            <input value={name} onChange={actions.changeNameFromEvent} />
                        </>
                    );
                }}
            </demo2Store.Consumer>
        </>
    );
});

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

const Template: Story = (args) => (
    <>
        demo1:
        <DemoApp {...args} />
        <hr />
        demo2:
        <Demo2App {...args} />
    </>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
