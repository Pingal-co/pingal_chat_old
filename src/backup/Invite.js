import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default class Invite extends Component {
  render() {
      return (
        <TouchableOpacity
          style={[styles.container, this.props.containerStyle]}
          onPress={() => {
            this.props.onInvite(this.props);
          }}
        >
          <Text style={[styles.text, this.props.textStyle]}>{this.props.name}</Text>
        </TouchableOpacity>
      );
    }

}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 5,
  },
  text: {
    color: '#0084ff',
    fontWeight: '600',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
});

Invite.defaultProps = {
  containerStyle: {},
  textStyle: {},
  text: '',
  onInvite: () => {},
  name: 'Invite',
};
