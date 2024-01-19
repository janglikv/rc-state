import { Meta, Story } from '@storybook/react';
import React from 'react';
import { createStore } from '../src';
import Form from './rc-state-form';

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

const store3 = createStore({
    state: {
        name: 'alice',
        age: 20,
        count: 0,
    },
    actions: {
        setName(state, e) {
            return { ...state, name: e.target.value };
        },
        setAge(state, e) {
            return { ...state, age: e.target.value };
        },
        setCount(state, e) {
            return { ...state, count: e.target.value };
        },
    },
});

function Count() {
    const count = store3.useSelector((state) => state.count);
    console.log('count', count);
    return count;
}

const Demo3App = store3.withProvider(function () {
    return (
        <div>
            <store3.Consumer selectors={[(state) => state.name, (state) => state.age, (state) => state.count]}>
                {({ values: [name, age, count], actions }) => {
                    return (
                        <div>
                            <input value={name} onChange={actions.setName} />
                            <input value={age} onChange={actions.setAge} />
                            <input value={count} onChange={actions.setCount} />
                        </div>
                    );
                }}
            </store3.Consumer>
            <store3.Consumer selectors={[(state) => state.name]}>
                {({ values: [name] }) => {
                    console.log({ name });
                    return <div>{name}</div>;
                }}
            </store3.Consumer>
            <store3.Consumer selectors={[(state) => state.age]}>
                {({ values: [age] }) => {
                    console.log({ age });
                    return <div>{age}</div>;
                }}
            </store3.Consumer>
            <Count />
        </div>
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
        demo3:
        <hr />
        <Demo3App {...args} />
        <hr />
        <h1>rc-state-form</h1>
        <Form>
            <Form.Item name="name" label="姓名">
                <input />
            </Form.Item>
            <Form.Item name="age" label="年龄">
                <input />
            </Form.Item>
        </Form>
    </>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
