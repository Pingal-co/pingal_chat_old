import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import moment from 'moment';

import Avatar from './Avatar';
import Bubble from './Bubble';
import Day from './Day';

export default class Slide extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    // not implemented yet
    // if (this.props.currentSlide.status !== nextProps.currentSlide.status) {
    //   return true;
    // }
    if (this.props.nextSlide._id !== nextProps.nextSlide._id) {
      return true;
    }
    if (this.props.previousSlide._id !== nextProps.previousSlide._id) {
      return true;
    }
    return false;
  }

  isSameDay(currentSlide = {}, diffSlide = {}) {
    let diff = 0;
    if (diffSlide.timestamp && currentSlide.timestamp) {
      diff = Math.abs(moment(diffSlide.timestamp).startOf('day').diff(moment(currentSlide.timestamp).startOf('day'), 'days'));
    } else {
      diff = 1;
    }
    if (diff === 0) {
      return true;
    }
    return false;
  }

  isSameUser(currentSlide = {}, diffSlide = {}) {
    if (diffSlide.user && currentSlide.user) {
      if (diffSlide.user._id === currentSlide.user._id) {
        return true;
      }
    }
    return false;
  }

  renderDay() {
    if (this.props.currentSlide.timestamp) {
      const dayProps = {
        ...this.props,
        isSameUser: this.isSameUser,
        isSameDay: this.isSameDay,
      };
      if (this.props.renderDay) {
        return this.props.renderDay(dayProps);
      }
      return <Day {...dayProps}/>;
    }
    return null;
  }

  renderBubble() {
    const bubbleProps = {
      ...this.props,
      isSameUser: this.isSameUser,
      isSameDay: this.isSameDay,
    };
    if (this.props.renderBubble) {
      return this.props.renderBubble(bubbleProps);
    }
    return <Bubble {...bubbleProps}/>;
  }

  renderAvatar() {
    if (this.props.user._id !== this.props.currentSlide.user._id) {
      const avatarProps = {
        ...this.props,
        isSameUser: this.isSameUser,
        isSameDay: this.isSameDay,
      };
      return <Avatar {...avatarProps}/>;
    }
    return null;
  }

  render() {
    // if (!this.props.currentSlide.body && !this.props.currentSlide.customView && !this.props.currentSlide.image) {
    //   return null;
    // }

    return (
      <View>
        {this.renderDay()}
        <View style={[styles[this.props.position].container, {
          marginBottom: this.isSameUser(this.props.currentSlide, this.props.nextSlide) ? 2 : 10,
        }, this.props.containerStyle[this.props.position]]}>
          {this.props.position === 'left' ? this.renderAvatar() : null}
          {this.renderBubble()}
          {this.props.position === 'right' ? this.renderAvatar() : null}
        </View>
      </View>
    );
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 0,
    },
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 8,
    },
  }),
};

Slide.defaultProps = {
  containerStyle: {},
  renderAvatar: null,
  renderBubble: null,
  renderDay: null,
  position: 'left',
  currentSlide: {},
  nextSlide: {},
  previousSlide: {},
  user: {},
};
