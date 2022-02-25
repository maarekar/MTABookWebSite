class ReactButton extends React.Component {
  constructor(props) {
    super(props);
    this.handle_click = this.handle_click.bind(this);
  }

  handle_click() {
    window.location.href = this.props.relocation;
  }

  render() {
    return React.createElement("input", { type: "button",
      style: this.props.style,
      onClick: this.handle_click, value: this.props.name ? this.props.name : 'No idea' });
  }
}