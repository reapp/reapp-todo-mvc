import { React } from 'reapp-kit';

export default class {
  render() {
    return (
      <ul class="todo-items">
        {this.props.todoItems}
      </ul>
    )
  }
}