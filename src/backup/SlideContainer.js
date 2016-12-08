import React, { Component, PropTypes } from 'react';

import InvertibleScrollView from 'react-native-invertible-scroll-view';

import LoadEarlier from './LoadEarlier';
import Slide from './Slide';

export default class SlideContainer extends Component {
  constructor(props) {
    super(props);
    this.renderFooter = this.renderFooter.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.slidesHash === nextProps.slidesHash && this.props.loadEarlier === nextProps.loadEarlier && this.props.footer === nextProps.footer) {
      return false;
    }
    return true;
  }

  renderFooter() {
    if (this.props.footer) {
      const footerProps = {
        ...this.props,
      };
      return this.props.footer(footerProps);
    }
    return null;
  }

  renderLoadEarlier() {
    if (this.props.loadEarlier === true) {
      const loadEarlierProps = {
        ...this.props,
      };
      if (this.props.renderLoadEarlier) {
        return this.props.renderLoadEarlier(loadEarlierProps);
      }
      return (
        <LoadEarlier {...loadEarlierProps}/>
      );
    }
    return null;
  }

  scrollTo(options) {
    this._invertibleScrollViewRef.scrollTo(options);
  }

  render() {
    console.log(`Message container: ${this.props.slides}`)
    return (
      <InvertibleScrollView
        {...this.props.invertibleScrollViewProps}
        ref={component => this._invertibleScrollViewRef = component}
      >
        {this.renderFooter()}
        {this.props.slides.map((slide, index) => {
          if (!slide._id) {
            console.warn('PingalChat: `_id` is missing for slide', JSON.stringify(slide));
          }
          if (!slide.user) {
            console.warn('PingalChat: `user` is missing for slide', JSON.stringify(slide));
            slide.user = {};
          }

          const slideProps = {
            ...this.props,
            key: slide._id,
            currentSlide: slide,
            previousSlide: this.props.slides[index + 1] || {},
            nextSlide: this.props.slides[index - 1] || {},
            position: slide.user._id === this.props.user._id ? 'right' : 'left',
          };

          if (this.props.renderslide) {
            return this.props.renderSlide(slideProps);
          }
          return <Slide {...slideProps}/>;
        })}
        {this.renderLoadEarlier()}
      </InvertibleScrollView>
    );
  }
}

SlideContainer.defaultProps = {
  slides: [],
  user: {},
  footer: null,
  renderSlide: null,
  onLoadEarlier: () => {},
};
