import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
} from 'react-native';

import {composer as styles, palette} from '../styles/styles.js'

export default class Composer extends Component {
  render() {
    const placeholder = this.props.placeholder
    const placeholderTextColor = this.props.placeholderTextColor
    const onChange = this.props.onChange
    const composerHeight = this.props.composerHeight
    const text = this.props.text
    const textInputProps = this.props.textInputProps
    const style = this.props.style

    return (
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        multiline={true}
        onChange={(e) => { onChange(e); }}
        style={[styles.textInput, style, { height: composerHeight, }]}
        value={text}
        enablesReturnKeyAutomatically={true}
        underlineColorAndroid="transparent"
        {...textInputProps}
      />
    );
  }
}


Composer.defaultProps = {
  onChange: () => {},
  composerHeight: Platform.select({
    ios: 33,
    android: 41,
  }),
  text: '',
  placeholder: 'Chat or Command ...',
  placeholderTextColor: palette.left_slide_text_color,
  textInputProps: null,
  style: StyleSheet.create({})
};
