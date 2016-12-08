import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default class Back extends Component {
  render() {
    if (this.props.MainLobby) {
      return <View/>;
    }
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={() => {
          this.props.onBack(this.props);
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
    color: 'black',
    fontWeight: '200',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
});

Back.defaultProps = {
  containerStyle: {},
  textStyle: {},
  MainLobby: true,
  onBack: () => {},
  name: 'Back',
};
