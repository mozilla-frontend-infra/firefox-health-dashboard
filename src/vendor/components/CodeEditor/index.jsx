import React, { Component } from 'react';
import { object, string, func } from 'prop-types';
import { Controlled } from 'react-codemirror2';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/display/placeholder';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/theme/material.css';
import './yaml-lint';
import './json-lint';

export default
@withStyles({
  root: {
    width: '100%',
  },
})
/** Render an editor */
class CodeEditor extends Component {
  static propTypes = {
    /** Callback function fired when the editor is changed. */
    onChange: func,
    /** The value of the editor. */
    value: string.isRequired,
    /** Code mirror options */
    options: object,
    /** The CSS class name of the wrapper element */
    className: string,
  };

  static defaultProps = {
    onChange: null,
    options: null,
    className: null,
  };

  handleTextUpdate = (editor, data, value) => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  render() {
    const { classes, className, value, onChange: _, ...options } = this.props;
    const opts = {
      mode: 'application/json',
      theme: 'material',
      indentWithTabs: false,
      gutters: ['CodeMirror-lint-markers'],
      lineNumbers: true,
      ...options,
    };

    return (
      <Controlled
        className={classNames(classes.root, className)}
        options={opts}
        onBeforeChange={this.handleTextUpdate}
        value={value}
      />
    );
  }
}
