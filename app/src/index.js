import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Provider } from 'react-redux';

import { createStore } from 'redux';

// Our initial state for the reducer
const initialState = {
    students: null,
    filter: "",
    error: null,
    tagFilter: "",
};

// Our reducer for Redux store
const reducer = (oldState = initialState, action) => 
{
    console.log('reduce', oldState, action);
    // Things must be done in an immutable way, or else re-renders won't be triggered
    let newState = Object.assign({}, oldState);
    // Switch based on the action type
    switch(action.type)
    {
        case "TAG_ADD": { // A new tag was added
            // We assign a new object as re-render will not trigger since modifying students despite the new state object does not make React/Redux think state has changed
            let students = Object.assign({}, newState.students);

            if(!students[action.data.index].tags)
                students[action.data.index].tags = [];
            
            students[action.data.index].tags.push(action.data.tag);

            newState.students = students;
            return newState;
        }
        case "TAG_UPDATE": // The tag filter was updated
            newState.tagFilter = action.data;
            return newState;
        case "TOGGLE_DISPLAY": // The dropdown button was clicked
            // If expanded evaluates to true, make it false, otherwise make it true
            // Covers the case of if undefined
            let students = Object.assign({}, newState.students);
            students[action.data].expanded = students[action.data].expanded ? false : true;

            newState.students = students;
            return newState;
        case "FILTER_UPDATE": // The name filter was updated
            newState.filter = action.data;
            return newState;
        case "STUDENT_DATA": // We got student data
            newState.students = action.data;
            return newState;
        default:
            return newState;
    }

}
// Create our store
const store = createStore(reducer);


// Render our App and provide the Redux store
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

