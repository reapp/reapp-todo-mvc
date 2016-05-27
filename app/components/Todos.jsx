import { Reapp, React, Immutable, store } from 'reapp-kit';
import Footer from './todos/Footer';
import TodoItem from './todos/TodoItem';
import ReactDOM from 'react-dom';

const ENTER_KEY = 13;

function uuid() {
  /*jshint bitwise:false */
  var i, random;
  var uuid = '';

  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
      .toString(16);
  }

  return uuid;
}

window.ALL_TODOS = '/';
window.ACTIVE_TODOS = '/active';
window.COMPLETED_TODOS = '/completed';

class Todos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: null
    }
  }

  handleNewTodoKeyDown(e) {
    if (e.which === ENTER_KEY || typeof e.which === 'undefined') {
      e.preventDefault();

      var val = ReactDOM.findDOMNode(this.refs.newField).value.trim();

      if (val) {
        const newTodo = {
          id: uuid(),
          title: val,
          completed: false
        };

        this.store().update('todos', todos =>
          todos.push(Immutable.fromJS(newTodo))
        );

        ReactDOM.findDOMNode(this.refs.newField).value = '';
      }
    }
  }

  toggleAll(event) {
    const checked = event.target.checked;

    this.store().withMutations(store => {
      store.set('todos',
        store.get('todos').map(todo => todo.set('completed', checked))
      )
    });
  }

  toggle(todoToToggle) {
    this.store().update('todos', todos =>
      todos.map(todo =>
        Immutable.is(todo, todoToToggle) ? todo.set('completed', !todo.get('completed')) : todo
      )
    );
  }

  destroy(destroyTodo) {
    this.store().update('todos', todos =>
      todos.filter(todo => todo.get('id') !== destroyTodo.get('id'))
    );
  }

  edit(todo, callback) {
    this.setState({editing: todo.get('id')}, function () {
      callback();
    });
  }

  save(todoToSave, text) {
    todoToSave.set('title', text);
  }

  clearCompleted() {
    this.store().update('todos', todos =>
      todos.filter(todo => !todo.get('completed'))
    );
  }

  render() {
    const path = this.router().getCurrentPathname();
    const { todos } = this.props;

    let footer = null;
    let main = null;

    const shownTodos = todos.filter(todo => {
      switch (path) {
        case ACTIVE_TODOS:
          return !todo.get('completed');
        case COMPLETED_TODOS:
          return todo.get('completed');
        default:
          return true;
      }
    });

    const todoItems = shownTodos.map(todo =>
      <TodoItem
        key={todo.get('id')}
        todo={todo}
        onToggle={this.toggle.bind(this, todo)}
        onDestroy={this.destroy.bind(this, todo)}
        onEdit={this.edit.bind(this, todo)}
        editing={this.state.editing === todo.get('id')}
        onSave={this.save.bind(this, todo)}
        onCancel={this.cancel}
      />
    );

    const activeTodoCount = todos.reduce(
      (accum, todo) => todo.get('completed') ? accum : accum + 1,
      0
    );

    const completedCount = todos.size - activeTodoCount;

    if (activeTodoCount || completedCount)
      footer =
        <Footer
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.router().getCurrentPathname()}
          onClearCompleted={this.clearCompleted}
        />;

    if (todos.size)
      main =
        <section id="main">
          <input
            id="toggle-all"
            type="checkbox"
            onChange={this.toggleAll}
            checked={activeTodoCount === 0}
          />
          {this.props.child({ todoItems })}
        </section>

    return (
      <div id="todoapp">
        <header id="header">
          <h1>todos</h1>
          <input
            ref="newField"
            id="new-todo"
            placeholder="What needs to be done?"
            onKeyDown={this.handleNewTodoKeyDown}
          />
        </header>
        {main}
        {footer}
      </div>
    );
  }
}

const TodosData = store.cursor(['todos'], Todos);

export default Reapp(TodosData);
