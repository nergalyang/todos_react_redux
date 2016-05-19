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
		const { todos, visibilityFilter } = this.props;
		const visibleTodos = getVisibleTodos(todos, visibilityFilter)
		return (
			<div>
				<AddTodo onAddClick={text =>
					store.dispatch({
						type:'ADD_TODO',
						id: nextTodoId++,
						text
					})
				}/>
				<TodoList 
					todos = {visibleTodos}
					onTodoClick = {(id) => {
								store.dispatch({
									type: 'TOGGLE_TODO',
									id
								})
							}}
				/>
				<p>
					{' '}
					<FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter} className="showAll">Show all</FilterLink>
					{' '}
					<FilterLink filter='SHOW_COMPLETED' currentFilter={visibilityFilter} className="showCompleted">Show completed</FilterLink>
					{' '}
					<FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter} className="showActive">Show active</FilterLink>
				</p>
			</div>
		);
	}
}
//var { checked, className, ...other } = this.props;
//try className above
const FilterLink = ({filter, children, currentFilter, ...something}) => {
	if (filter === currentFilter ) { return <span>{children}</span>}
	return (
		<a href='#' 
		onClick={e => {
			console.log("logging className! "+something.className+" This is destruction");
			e.preventDefault();
			store.dispatch({
				type: 'SET_VISIBILITY_FILTER',
				filter: filter,
			})
		}}>{children}
		</a>
	)
}

const Todo = ({ completed, onTodoClick, text }) =>  (
	<li 
		style={{
			textDecoration: completed ? 'line-through':'none'
		}} 
		onClick={ onTodoClick }>
		{ text }
	</li>
)

const TodoList = ({todos, onTodoClick}) =>
	(
		<ul>
			{todos.map( todo =>
				<Todo 
					key={todo.id} 
					{...todo} 
					onTodoClick={() => onTodoClick(todo.id)}
				/>
			)}
		</ul>
	)

const AddTodo = ({onAddClick}) => {
	let input;
	return			(
		<div>
			<input ref={ node => input = node} />
			<button onClick={ ()=>  onAddClick(input.value)} 
			>
				Add Todo
			</button>
		</div>
	)
}


const getVisibleTodos = (todos, filter) => {
	switch (filter) {
		case 'SHOW_ALL':
			return todos;
		case 'SHOW_COMPLETED':
			return todos.filter(todo => todo.completed);
		case 'SHOW_ACTIVE':
			return todos.filter(todo => !todo.completed)
	}
}

const node = document.getElementById('root')
const render = () => {
	ReactDOM.render(
		<TodoApp {...store.getState()}/>,node
	)
}
store.subscribe(render);
render();





