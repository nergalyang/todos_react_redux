import { createStore, combineReducers } from 'redux';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

const todo = ( state, action) => {
	switch (action.type) {
		case 'ADD_TODO':
			return {
				id: action.id,
				text: action.text,
				completed: false
			};
		case 'TOGGLE_TODO':
			if (state.id !== action.id) {
				return state;
			}
			return {
				...state,
				completed: !state.completed
			}
		default:
			return state;

	}
}

const todos = ( state=[], action) => {
	switch (action.type) {
		case 'ADD_TODO':
			return [
			...state,
			todo(undefined, action)
			];
		case 'TOGGLE_TODO':
			return state.map(t => todo(t, action));
		default:
			return state;

	}
}

const visibilityFilter = ( state='SHOW_ALL', action) => {
	switch (action.type) {
		case 'SET_VISIBILITY_FILTER':
			return action.filter;
		default:
			return state
	}
}


// const todoApp = ( state={}, action ) => {
// 	return {
// 		todos: todos(state.todo, action),
// 		visibilityFilter: visibilityFilter( state.visibilityFilter, action)
// 	}
// }

const todoApp = combineReducers({todos,visibilityFilter})

// const combineReducers = (reducers) => {
// 	return ( state={}, action) => {
// 		return Object.key(reducers).reduce( (nextState, key) => {
// 			 nextState[key] = reducer[key]( state.key, action);
// 			 return nextState
// 			},{});
// 	}
// }


const store = createStore(todoApp);

// console.log(store.getState());
// store.dispatch({
// 	type:'ADD_TODO',
// 	id:0,
// 	text:'Learn redux'
// })
console.log(store.getState());

let nextTodoId = 0;
class TodoApp extends Component {
	render() {
		return (
			<div>
				<input ref={ node => this.input = node} />
				<button onClick={ () => {
					store.dispatch({
						type:'ADD_TODO',
						id: nextTodoId++,
						text:this.input.value
					})
				}}>Add Todo</button>
				<ul>
					{ this.props.todos.map(
					todo =>
						<li style={{textDecoration: todo.completed ? 'line-through':'none'}} key={todo.id} onClick={ () => {store.dispatch({
							type: 'TOGGLE_TODO',
							id: todo.id
						})}}>{ todo.text }</li>
					)}
				</ul>
			</div>
		);
	}
}


const node = document.getElementById('root')
const render = () => {
	ReactDOM.render(
		<TodoApp todos={store.getState().todos}/>,node
	)
}
store.subscribe(render);
render();





