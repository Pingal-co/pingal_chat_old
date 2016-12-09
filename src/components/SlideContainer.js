import React, { Component, PropTypes } from 'react';

import {ScrollView} from 'react-native'

import InvertibleScrollView from 'react-native-invertible-scroll-view';

import LoadEarlier from './LoadEarlier';
import Slide from './Slide';

export default class SlideContainer extends Component {
  constructor(props) {
    super(props);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderSlide = this.renderSlide.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const slidesHash = this.props.slidesHash
    const loadEarlier = this.props.loadEarlier
    const footer = this.props.footer

    if (slidesHash === nextProps.slidesHash && loadEarlier === nextProps.loadEarlier && footer === nextProps.footer) {
      return false;
    }
    return true;
  }

  renderFooter() {
    const footer = this.props.footer
    if (footer) {
      const footerProps = {
        ...this.props,
      };
      return footer(footerProps);
    }
    return null;
  }

  renderHeader() {
    const loadEarlier = this.props.loadEarlier

    if (loadEarlier === true) {
      const loadEarlierProps = {
        ...this.props,
      };
      return (
        <LoadEarlier {...loadEarlierProps}/>
      );
    }
    return null;
  }

  scrollTo(options) {
    this._invertibleScrollViewRef.scrollTo(options);
  }

  group(list, objname, prop) {
    let groupedfn = (grouped, item) => {
        let obj = item[objname];
        let key = obj[prop]
        grouped[key] = grouped[key] || [];
        grouped[key].push(item);
        return grouped;
    }
    return list.reduce(groupedfn, {})
  }

  renderSlide(slides, user) {
    children = slides.map((slide, index) => {
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
              previousSlide: slides[index + 1] || {},
              nextSlide: slides[index - 1] || {},
              position: slide.user._id === user._id ? 'right' : 'left',
            };
                        
              return <Slide {...slideProps}/>;
        
            })
      return children

  }

  renderGroupedSlide(slides, user){
    // group slides by key and sort by time 
    grouped = this.group(slides, "user", "_id")
    console.log(grouped)

    grouped_children = Object.keys(grouped).map((key) => {
        slides = grouped[key]
        children = this.renderSlide(slides, user)
      
        const invertibleScrollViewProps = { 
            ...this.props.invertibleScrollViewProps, 
            inverted: false,      
          }
        return (
          <InvertibleScrollView
              {...invertibleScrollViewProps}
              key={"grouped-" + key}
          >
              {children}
          </InvertibleScrollView>
        )
    })

    return grouped_children
       
    
  }

  render() {
    //console.log(`Message container: ${this.props.slides}`)
    const invertibleScrollViewProps = {
      ...this.props.invertibleScrollViewProps,
      inverted: true,
    }
    const slides = this.props.slides
    const user = this.props.user
    
    return (
      <InvertibleScrollView
        {...invertibleScrollViewProps}
        ref={component => this._invertibleScrollViewRef = component}
      >
        {this.renderFooter()}
        {this.renderSlide(slides, user)}     
        {this.renderHeader()}
        
      </InvertibleScrollView>
    );
  }
}

SlideContainer.defaultProps = {
  slides: [],
  user: {},
  footer: null,
  onLoadEarlier: () => {},
};
