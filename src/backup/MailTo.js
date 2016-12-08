import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  PixelRatio,
} from 'react-native';

export default class MailTo extends Component {
  render() {
    return (
      <TextInput
        placeholder={this.props.mailtoplaceholder}
        placeholderTextColor={this.props.placeholderTextColor}
        multiline={false}
        onChange={(e) => {
          this.props.onMailTo(e);
        }}
        style={[styles.textInput, this.props.textInputStyle]}
        value={this.props.mailto}
        enablesReturnKeyAutomatically={true}
        underlineColorAndroid="transparent"
        {...this.props.textInputProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    marginLeft: 25,
    fontSize: 16,
    lineHeight: 16,
    height: 15,
    marginTop: Platform.select({
      ios: 8,
      android: 4,
    }),
    marginBottom: Platform.select({
      ios: 5,
      android: 2,
    }),
  },
});

MailTo.defaultProps = {
  textInputStyle: {},
  onMailTo: () => {},
  mailto: '',
  mailtoplaceholder: 'PingTo: topic@localhost',
  placeholderTextColor: '#b2b2b2',
  textInputProps: null,
};
