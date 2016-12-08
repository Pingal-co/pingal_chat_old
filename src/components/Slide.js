import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import moment from 'moment';

import Avatar from './Avatar';
import SlideView from './Sheet';
import Day from './Day';

import {slide as styles} from '../styles/styles.js'

export default class Slide extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const nextSlide = this.props.nextSlide
    const previousSlide = this.props.previousSlide

    if (nextSlide._id !== nextProps.nextSlide._id) {
      return true;
    }
    if (previousSlide._id !== nextProps.previousSlide._id) {
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
    const timestamp = this.props.currentSlide.timestamp

    if (timestamp) {
      const dayProps = {
        ...this.props,
        isSameUser: this.isSameUser,
        isSameDay: this.isSameDay,
      };

      return <Day {...dayProps}/>;
    }
    return null;
  }

  renderSlideView() {
    const sheetProps = {
      ...this.props,
      isSameUser: this.isSameUser,
      isSameDay: this.isSameDay,
    };

    return <SlideView {...sheetProps}/>;
  }

  renderAvatar() {
    const currentSlide = this.props.currentSlide
    const userid = this.props.user._id

    if (userid !== currentSlide.user._id) {
      const avatarProps = {
        ...this.props,
        isSameUser: this.isSameUser,
        isSameDay: this.isSameDay,
      };
      return <Avatar {...avatarProps}/>;
    }
    return null;
  }

  renderCustomSlide(){
    const currentSlide = this.props.currentSlide
    const nextSlide = this.props.nextSlide
    const position = this.props.position

    const body = currentSlide.body
    const customView = currentSlide.customView
    const image = currentSlide.image

    if (this.props.renderCustomSlide){
      this.props.renderCustomSlide(this.props)
    }
    return (
      <View>
        {this.renderDay()}
        <View style={[styles[position].container, {
          marginBottom: this.isSameUser(currentSlide, nextSlide) ? 2 : 10,
        }]}>
          {position === 'left' ? this.renderAvatar() : null}
          {this.renderSlideView()}
          {position === 'right' ? this.renderAvatar() : null}
        </View>
      </View>
    );

  }

  render() {    
    /*
     if (!body && !customView && !image) {
        return null;
      }
    */

    return (
      <View>
        {this.renderCustomSlide()}
      </View>
    );
  }
}

Slide.defaultProps = {
  position: 'left',
  currentSlide: {},
  nextSlide: {},
  previousSlide: {},
  user: {},
  renderCustomSlide: null,
};
