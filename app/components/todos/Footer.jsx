import { React, Router } from 'reapp-kit';

const pluralize = function (count, word) {
  return count === 1 ? word : word + 's';
}

export default class TodoFooter extends React.Component {
  render() {
    const { count, completedCount, onClearCompleted, nowShowing } = this.props;
    const activeTodoWord = pluralize(count, 'item');
    let clearButton = null;
    let show = {
      ALL_TODOS: '',
      ACTIVE_TODOS: '',
      COMPLETED_TODOS: ''
    };

    show[nowShowing] = 'selected';

    return (
      <footer id="footer">
        <span id="todo-count">
          <strong>{count}</strong>
          {' '}{activeTodoWord}{' '}left{''}
        </span>

        <ul id="filters">
          <li>
            <Router.Link to="/" className={show[ALL_TODOS]}>All</Router.Link>
          </li>
          {' '}
          <li>
            <Router.Link to="/active" className={show[ACTIVE_TODOS]}>Active</Router.Link>
          </li>
          {' '}
          <li>
            <Router.Link to="/completed" className={show[COMPLETED_TODOS]}>Completed</Router.Link>
          </li>
        </ul>

        {completedCount > 0 &&
          <button
            id="clear-completed"
            onClick={onClearCompleted}>
            {''}Clear completed ({completedCount}){''}
          </button>
        }
      </footer>
    );
  }
}