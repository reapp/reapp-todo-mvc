import { React } from 'reapp-kit';

export default class {
  render() {
    return (
      <ul id="todo-list">
        {this.props.todoItems}
      </ul>
    )
  }
}