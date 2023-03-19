import React, { useReducer } from 'react';

interface MyState {
    value: string;
}

interface MyAction {
    type: 'UPDATE';
}

function myReducer(state: MyState, action: MyAction): MyState {
    switch (action.type) {
        case 'UPDATE':
            return { ...state }; // return new object with same values
        default:
            return state;
    }
}

function MyComponent() {
    const [myState, dispatch] = useReducer(myReducer, { value: 'foo' });

    function updateState() {
        dispatch({ type: 'UPDATE' });
    }

    return (
        <div>
            <p>My value is: {myState.value}</p>
            <button onClick={updateState}>Update value</button>
        </div>
    );
}

export default MyComponent