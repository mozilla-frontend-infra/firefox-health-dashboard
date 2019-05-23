import React from 'react';

class Link extends React.Component {
  constructor(props, ...other) {
    super(props, ...other);
    this.props = props;
  }

  render() {
    const { to, title, children } = this.props;

    return (
      <a href={to} title={title}>
        {children}
      </a>
    );
  }
}

/* eslint-disable-next-line import/prefer-default-export */
export { Link };
