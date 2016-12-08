import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from '../styles/Back.js'

export default class Back extends Component {
  render() {
    const MainLobby = this.props.MainLobby
    const onBack = this.props.onBack
    const name = this.props.name

    if (MainLobby) {
      return <View/>;
    }
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => { onBack(this.props); }}
      >
        <Text style={styles.text}>{name}</Text>
      </TouchableOpacity>
    );
  }
}

Back.defaultProps = {
  MainLobby: true,
  onBack: () => {},
  name: 'Back',
};
