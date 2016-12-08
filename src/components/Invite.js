import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from '../styles/Invite.js'

export default class Invite extends Component {
  render() {
      const onInvite = this.props.onInvite
      const name = this.props.name

      return (
        <TouchableOpacity
          style={styles.container}
          onPress={() => { onInvite(this.props); }}
        >
          <Text style={styles.text}>{name}</Text>
        </TouchableOpacity>
      );
    }

}

Invite.defaultProps = {
  onInvite: () => {},
  name: 'Invite',
};
