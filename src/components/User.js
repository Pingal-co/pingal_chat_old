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

import styles from '../styles/User.js'

export default class User extends Component {
  render() {
    const username = this.props.user.name
    const onUser = this.props.onUser

    if (!!username) {
      return (
        <TouchableOpacity
          style={styles.container}
          onPress={() => { onUser(); }}
        >
          <Text style={styles.text}>{username}</Text>
        </TouchableOpacity>
      );
    }
    return <View/>;
  }

}

User.defaultProps = {
  onUser: () => {},
  user: {_id: 1, name: 'Nickname'},
};
