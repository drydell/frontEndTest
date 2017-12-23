import { Component } from 'react';
import PropTypes from 'prop-types';

export default class ThrottledRenderer extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    interval: PropTypes.number.isRequired
  };

  state = { counter: 0 };

  componentDidMount() {
    this.intervalId = setInterval(
      () => this.setState({ counter: this.state.counter + 1 }),
      this.props.interval
    );
  }

  shouldComponentUpdate(props, { counter }) {
    return this.state.counter !== counter;
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    return this.props.children;
  }
}
