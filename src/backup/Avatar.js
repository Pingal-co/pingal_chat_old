import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import GiftedAvatar from './GiftedAvatar';

export default class Avatar extends Component {
  renderAvatar() {
    if (this.props.renderAvatar) {
      return this.props.renderAvatar(this.props);
    }
    return (
      <GiftedAvatar
        avatarStyle={StyleSheet.flatten([styles[this.props.position].image, this.props.imageStyle[this.props.position]])}
        user={this.props.currentSlide.user}
      />
    );
  }

  render() {
    if (this.props.isSameUser(this.props.currentSlide, this.props.nextSlide) && this.props.isSameDay(this.props.currentSlide, this.props.nextSlide)) {
      return (
        <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
          <GiftedAvatar
            avatarStyle={StyleSheet.flatten([styles[this.props.position].image, this.props.imageStyle[this.props.position]])}
          />
        </View>
      );
    }
    return (
      <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
        {this.renderAvatar()}
      </View>
    );
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      marginRight: 8,
    },
    image: {
      height: 36,
      width: 36,
      borderRadius: 18,
    },
  }),
  right: StyleSheet.create({
    container: {
      marginLeft: 8,
    },
    image: {
      height: 36,
      width: 36,
      borderRadius: 18,
    },
  }),
};

Avatar.defaultProps = {
  containerStyle: {},
  imageStyle: {},
  isSameDay: () => {},
  isSameUser: () => {},
  position: 'left',
  currentSlide: {
    user: null,
  },
  nextSlide: {},
};
