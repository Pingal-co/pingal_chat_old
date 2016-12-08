import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

export default class SlideImage extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Image
          style={[styles.image, this.props.imageStyle]}
          source={{uri: this.props.currentSlide.image}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',
  },
});

SlideImage.defaultProps = {
  containerStyle: {},
  imageStyle: {},
  currentSlide: {
    image: null,
  },
};
