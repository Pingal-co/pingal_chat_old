import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  PixelRatio,
  View,
  TouchableOpacity,
  Text
} from 'react-native';

export default class User extends Component {
  render() {
    if (!!this.props.user.name) {
      return (
        <TouchableOpacity
          style={[styles.container, this.props.containerStyle]}
          onPress={() => {
            this.props.onUser();
          }}
        >
          <Text style={[styles.text, this.props.textStyle]}>{this.props.user.name}</Text>
        </TouchableOpacity>
      );
    }
    return <View/>;
  }

}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 5,
    marginBottom: 0,
  },
  text: {
    color: '#0084ff',
    fontWeight: '600',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
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

User.defaultProps = {
  containerStyle: {},
  textStyle: {},
  textInputStyle: {},
  onUser: () => {},
  user: {_id: 1, name: 'Nickname'},
  placeholder: 'Set Nickname',
  placeholderTextColor: '#b2b2b2',
  textInputProps: null,
};
