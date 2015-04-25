import RK, { React, Helpers } from 'reapp-kit';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

export default class TodoItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editText: '' };
  }

  componentWillMount() {
    this.setState({
      editText: this.props.todo.get('title')
    })
  }

  handleSubmit() {
    const val = this.state.editText.trim();
    if (val) {
      this.props.onSave(val);
      this.setState({ editText: val });
    }
    else {
      this.props.onDestroy();
    }
    return false;
  }

  handleEdit() {
    this.props.onEdit(() => {
      const node = this.refs.editField.getDOMNode();
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    });
    this.setState({ editText: this.props.todo.get('title') });
  }

  handleKeyDown(event) {
    if (event.keyCode === ESCAPE_KEY) {
      this.setState({ editText: this.props.todo.get('title') });
      this.props.onCancel();
    }
    else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit();
    }
  }

  handleChange(event) {
    this.setState({ editText: event.target.value });
  }

  render() {
    return (
      <li className={Helpers.classnames({
        completed: this.props.todo.get('completed'),
        editing: this.props.editing
      })}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.get('completed') ? 'checked' : null}
            onChange={this.props.onToggle}
          />
          <label onDoubleClick={this.handleEdit}>
            {this.props.todo.get('title')}
          </label>
          <button className="destroy" onClick={this.props.onDestroy} />
        </div>
        <input
          ref="editField"
          className="edit"
          value={this.state.editText}
          onBlur={this.handleSubmit}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </li>
    )
  }
}