import { Meta, Story } from '@storybook/react';
import React from 'react';
import { createStore } from '../src';

const demoStore = createStore({ state: { say: 'hello', name: 'rc-state' } });

const DemoApp = demoStore.withProvider(function () {
    return (
        <div>
            <demoStore.Consumer selectors={[(state) => state.say]}>{({ values: [say] }) => say}</demoStore.Consumer>
            <span> </span>
            <demoStore.Consumer selectors={[(state) => state.name]}>{({ values: [name] }) => name}</demoStore.Consumer>!
            <br />
            <SayInput />
            <NameInput />
        </div>
    );
});

function SayInput() {
    const say = demoStore.useSelector((state) => state.say);
    console.log('say', say);
    const { setState } = demoStore.useContext();
    const changeName = (e) => setState((state) => ({ ...state, say: e.target.value }));
    return <input value={say} onChange={changeName} />;
}

function NameInput() {
    const name = demoStore.useSelector((state) => state.name);
    console.log('name', name);
    const { setState } = demoStore.useContext();
    const changeName = (e) => setState((state) => ({ ...state, name: e.target.value }));
    return <input value={name} onChange={changeName} />;
}

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
