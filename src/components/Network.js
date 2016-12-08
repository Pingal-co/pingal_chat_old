import React, { Component } from 'react';
import {
  TextInput,
} from 'react-native';

import styles from '../styles/Network.js'

export default class Network extends Component {
  render() {
    const mailto = this.props.mailto
    const placeholder = this.props.placeholder
    const placeholderTextColor = this.props.placeholderTextColor
    const onSen = this.props.onSend
    const multiline = this.props.multiline
    const textInputProps = this.props.textInputProps

    return (
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        multiline={multiline}
        onChange={(e) => { onSend(e);}}
        style={styles.textInput}
        value={mailto}
        enablesReturnKeyAutomatically={true}
        underlineColorAndroid="transparent"
        {...textInputProps}
      />
    );
  }
}


Network.defaultProps = {
  onSend: () => {},
  mailto: '',
  multiline: false,
  placeholder: 'Enter network name to add',
  placeholderTextColor: '#b2b2b2',
  textInputProps: null,
};
