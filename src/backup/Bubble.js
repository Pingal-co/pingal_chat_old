import React, { Component, PropTypes } from 'react';
import {
  Clipboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import SlideText from './SlideText';
import SlideImage from './SlideImage';
import Time from './Time';

export default class Bubble extends Component {
  constructor(props) {
    super(props);
    this.onLongPress = this.onLongPress.bind(this);
  }

  handleBubbleToNext() {
    if (this.props.isSameUser(this.props.currentSlide, this.props.nextSlide) && this.props.isSameDay(this.props.currentSlide, this.props.nextSlide)) {
      return StyleSheet.flatten([styles[this.props.position].containerToNext, this.props.containerToNextStyle[this.props.position]]);
    }
    return null;
  }

  handleBubbleToPrevious() {
    if (this.props.isSameUser(this.props.currentSlide, this.props.previousSlide) && this.props.isSameDay(this.props.currentSlide, this.props.previousSlide)) {
      return StyleSheet.flatten([styles[this.props.position].containerToPrevious, this.props.containerToPreviousStyle[this.props.position]]);
    }
    return null;
  }

  renderSlideText() {
    if (this.props.currentSlide.body) {
      if (this.props.renderSlideText) {
        return this.props.renderSlideText(this.props);
      }
      return <SlideText {...this.props}/>;
    }
    return null;
  }

  renderSlideImage() {
    if (this.props.currentSlide.image) {
      if (this.props.renderSlideImage) {
        return this.props.renderSlideImage(this.props);
      }
      return <SlideImage {...this.props}/>;
    }
    return null;
  }

  renderTime() {
    if (this.props.currentSlide.timestamp) {
      if (this.props.renderTime) {
        return this.props.renderTime(this.props);
      }
      return <Time {...this.props}/>;
    }
    return null;
  }

  renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props);
    }
    return null;
  }

  onLongPress() {
    if (this.props.currentSlide.body) {
      const options = [
        'Copy Text',
        'Cancel',
      ];
      const cancelButtonIndex = options.length - 1;
      this.context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            Clipboard.setString(this.props.currentSlide.body);
            break;
        }
      });
    }
  }

  render() {
    //{this.renderCustomView()}
    return (
      <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
        <View style={[styles[this.props.position].wrapper, this.props.wrapperStyle[this.props.position], this.handleBubbleToNext(), this.handleBubbleToPrevious()]}>
          <TouchableWithoutFeedback
            onLongPress={this.onLongPress}
          >
            <View>
              {this.renderSlideImage()}
              {this.renderSlideText()}

              {this.renderTime()}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start',
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: '#f0f0f0',
      marginRight: 60,
    },
    containerToNext: {
      borderBottomLeftRadius: 3,
    },
    containerToPrevious: {
      borderTopLeftRadius: 3,
    },
  }),
  right: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-end',
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: '#0084ff',
      marginLeft: 60,
    },
    containerToNext: {
      borderBottomRightRadius: 3,
    },
    containerToPrevious: {
      borderTopRightRadius: 3,
    },
  }),
};

Bubble.contextTypes = {
  actionSheet: PropTypes.func,
};

Bubble.defaultProps = {
  containerStyle: {},
  wrapperStyle: {},
  containerToNextStyle: {},
  containerToPreviousStyle: {},

  renderSlideImage: null,
  renderSlideText: null,
  renderCustomView: null,
  renderTime: null,
  isSameUser: () => {},
  isSameDay: () => {},
  position: 'left',
  currentSlide: {
    body: null,
    timestamp: null,
    image: null,
  },
  nextSlide: {},
  previousSlide: {},
};
