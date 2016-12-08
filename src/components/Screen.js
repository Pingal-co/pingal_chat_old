import React, { Component, PropTypes } from 'react';
import {
  Animated,
  InteractionManager,
  Platform,
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView
} from 'react-native';

import InvertibleScrollView from 'react-native-invertible-scroll-view';

//import { Chat } from '../components/Chat';
import ChatServer from '../components/ChatServer';

import ActionSheet from '@exponent/react-native-action-sheet';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import moment from 'moment/min/moment-with-locales.min';
import md5 from 'md5';

import SlideContainer from './SlideContainer';
import InputToolbar from './InputToolbar';
import NavBar, { NavButton, NavButtonText, NavTitle } from 'react-native-nav';
import CustomNavBar from './CustomNavBar';

import {chat as styles, navbar as navbar_styles, palette,icon as icon_style} from '../styles/styles.js'
import Icon from 'react-native-vector-icons/FontAwesome';
import IconI from 'react-native-vector-icons/Ionicons';

// Min and max heights of ToolbarInput and Composer
// Needed for Composer auto grow and ScrollView animation
// TODO move these values to Constants.js (also with used colors #b2b2b2)
const MIN_COMPOSER_HEIGHT = Platform.select({
  ios: 33,
  android: 41,
});
const MAX_COMPOSER_HEIGHT = 200;
const MIN_INPUT_TOOLBAR_HEIGHT = 85;
const MIN_TOPBAR_HEIGHT = 33;

/*
Every screen is a channel.
Screen should have:
1) Handler or Connect to chat server
2) Chat component for Keyboard animations
3) OnSend, OnReceive, OnNavigation
4) Header (Topbar) and Footer (Actions)
5) MidContainer (ScrollView for slides)
6)  A View (or board) consists of multiple fields
    Each Slide View: Fields, Actions and Style related to it
7) Parse Slide text to generate a custom view

Screen(
  slides, user, server, topic, topbartabs, 
  renderTopbar, renderInputToolbar, renderSlides, ..., 
  customProps : onLoad, OnLoadEarlier, ...
)


*/

export default class Screen extends Component {

  constructor(props){
    super(props)
    this.server = this.props.server
    this.user = this.props.user
    this.topic = this.props.topic
    this.channel_tabs = this.props.channel_tabs

    if (!!this.server){
      this._channel = this.server.lobby(this.topic, this.onReceive)
    }
    
    // screen events
    this.getChannel = this.getChannel.bind(this)
    this.onSend = this.onSend.bind(this)
    this.onReceive = this.onReceive.bind(this)
    this.onNavigation = this.onNavigation.bind(this)

    this.renderSlides = this.renderSlides.bind(this);
    this.renderTopbar = this.renderTopbar.bind(this);
    this.renderInputToolbar = this.renderInputToolbar.bind(this);

    
     // default values for keyboard and locale
    this._isMounted = false;
    this._keyboardHeight = 0;
    this._maxHeight = null;
    this._touchStarted = false;
    this._isTypingDisabled = false;
    this._locale = 'en';

    // default: slides
    this._slidesHash = null;

    this.state = {
      isInitialized: false, // initialization will calculate maxHeight before rendering the chat
      loadEarlier: true,
      slides:[]
    };

    
    // Keyboard event handlers
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onKeyboardWillShow = this.onKeyboardWillShow.bind(this);
    this.onKeyboardWillHide = this.onKeyboardWillHide.bind(this);
    this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this);
    this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this);
    this.onType = this.onType.bind(this);
    this.getLocale = this.getLocale.bind(this);

    // custom buttons
     this.onLoadEarlier = this.onLoadEarlier.bind(this);
   
   
  }

  /*
    React Native Lifecycle handlers
  */

  getChildContext() {
    return {
      actionSheet: () => this._actionSheetRef,
      getLocale: this.getLocale,
    };
  }

  componentWillMount() {
    this.setIsMounted(true);
    this.initLocale();
    this.initSlides(this.props.slides);
  }

  componentWillUnmount() {
    this.setIsMounted(false);
  }

  componentWillReceiveProps(nextProps) {
    this.initSlides(nextProps.slides);
  }

  

  /*
    slides
  */

  initSlides(slides = []) {
    // load data from chat server
    console.log(`room topic: ${this.topic}`)
    
    
    let topic = this.topic.toLowerCase()
    let fpath = `../data/${topic}.js`
    console.log(fpath)
    if (slides.length < 1) {
      switch(topic){
      case "room:lobby" : 
            slides = require("../data/local.js")
            break;
      case "you": 
          if (!this.props.user.verified) {
             this.props.navigator.push({ 
              id: 'splash', 
              params: {
                topic: 'splash',
                server: this.server,
                user: this.user,
                channel_tabs: this.channel_tabs,
                muteInputToolbar: true,
              },
              })
          }
            slides = require("../data/you.js")
            break;
      case "arts": 
            slides = require("../data/arts.js")
            break;
      case "pingal": 
            slides = require("../data/pingal.js")
            break;
      default: 
            slides = require("../data/local.js")
    }
        
        // slides = this.onSend(slides=[], event="get:slides:today")
        // console.log(slides);
    }
    this.setSlides(slides);
  }

  setSlides(slides) {
    this.setState(() => {
      return {
        slides: slides,
      };
    });
    this.setSlidesHash(md5(JSON.stringify(slides)));
  }

  getSlides() {
    console.log(`slides: ${this.state.slides}`)
    return this.state.slides;
  }

  setSlidesHash(slidesHash) {
    this._slidesHash = slidesHash;
  }

  getSlidesHash() {
    return this._slidesHash;
  }

  renderSlides() {
    const AnimatedView = this.props.isAnimated === true ? Animated.View : View;
    if (this.props.renderCustomSlideContainer){
      //
      /*
            onTouchEnd: this.onTouchEnd,
      */
      let ScrollViewProps={
            keyboardShouldPersistTaps: false,
            onKeyboardWillShow: this.onKeyboardWillShow,
            onKeyboardWillHide: this.onKeyboardWillHide,
            onKeyboardDidShow: this.onKeyboardDidShow,
            onKeyboardDidHide: this.onKeyboardDidHide,
            onTouchStart: this.onTouchStart,
            onTouchMove: this.onTouchMove,
            
               }
              // {...ScrollViewProps}
      return (
            <AnimatedView style={{
              height: this.state.slidesContainerHeight,
              }}>
              
              <ScrollView
              {...this.props}
              {...ScrollViewProps}
              ref={component => this._invertibleScrollViewRef = component}
      
              > 
              
              {this.props.renderCustomSlideContainer()}
              </ScrollView>
            </AnimatedView>
        )
    }
    console.log("slides for container")
    console.log(this.getSlides())
    return (
      <AnimatedView style={{
        height: this.state.slidesContainerHeight,
      }}>
        <SlideContainer
          {...this.props}

          invertibleScrollViewProps={{
            inverted: true,
            keyboardShouldPersistTaps: true,
            onTouchStart: this.onTouchStart,
            onTouchMove: this.onTouchMove,
            onTouchEnd: this.onTouchEnd,
            onKeyboardWillShow: this.onKeyboardWillShow,
            onKeyboardWillHide: this.onKeyboardWillHide,
            onKeyboardDidShow: this.onKeyboardDidShow,
            onKeyboardDidHide: this.onKeyboardDidHide,
          }}

          slides={this.getSlides()}
          slidesHash={this.getSlidesHash()}
          onSend={this.onSend}
          onNavigation={this.onNavigation}

          ref={component => this._slideContainerRef = component}
        />
      </AnimatedView>
    );
  }

  onLoadEarlier() {
    // load previous data from chat server
    const previousSlides = require('../data/old_local.js')
    // const previousSlides = Screen.onSend(slides=[], event="get:slides:previous")
     this.setState((previousState) => {
      return {
        slides: Screen.prepend(previousState.slides, previousSlides),
        loadEarlier: false,
      };
    });
  }


  /*
    Utils to add slides to array
  */

  static append(currentSlides = [], slides) {
    if (!Array.isArray(slides)) {
      slides = [slides];
    }
    return slides.concat(currentSlides);
  }

  static prepend(currentSlides = [], slides) {
    if (!Array.isArray(slides)) {
      slides = [slides];
    }
    return currentSlides.concat(slides);
  }

  /*
    Communication with Chat Server
  */

  connectChatServer(){
      // send location and get the local room:lobby
     this.server = ChatServer(this.props.user.name)  
  }

  getChannel(){
    return this.server && this.server.lobby(this.topic, this.onReceive)
  }
  
   onNavigation(id='lobby', params){
     let previous={
       topic: this.topic,
       server: this.server,
       user: this.user,
       channel_tabs: this.channel_tabs,
       muteInputToolbar: false,
     }
     console.log("navigation to screen")
     console.log(params)
     let current = Object.assign({}, previous, params)
     console.log(id)
     console.log(current)
      this.props.navigator.push(
          {id: id, 
           params: current 
          })
   }

  
   onReceive(text){
    //console.log("Rendering received msg")
    //console.log(text)
    
    this.setState((previousState) => {
      return {
        slides: Screen.append(previousState.slides, {
          _id: Math.round(Math.random() * 1000000),
          body: text.body,
          timestamp: text.timestamp,
          user: {
            _id: 2,
            name: text.user,
            // avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
          location: text.location,
          channels: text.channels,
        }),
      };
    });
    
  }

   onSend(slides = [], event = "new:slide", shouldResetInputToolbar = false) {
    const server = this.server  // socket
    if (!!server) {
      const channel = this._channel  // socket topic 

      if (!Array.isArray(slides)) {
        slides = [slides];
      }

      // add any meta info to the slide
      slides = slides.map((slide) => {
        return {
          ...slide,
          user: this.props.user,
          timestamp: new Date(),
          _id: 'temp-id-' + Math.round(Math.random() * 1000000),
        };
      });

      if (shouldResetInputToolbar === true) {
        this.setIsTypingDisabled(true);
        this.resetInputToolbar();
      }
 
      server.send(channel, slides, event)
 
      this.scrollToBottom();

      if (shouldResetInputToolbar === true) {
        setTimeout(() => {
          if (this.getIsMounted() === true) {
            this.setIsTypingDisabled(false);
          }
        }, 200);
      }
    }
  }
 
   

  sendLocation(){
        const navigator = this.props.navigator
        const onSend = this.onSend
        navigator.geolocation.getCurrentPosition(
            (position) => {
              onSend({
                location: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                },
              });
            },
            (error) => alert(error.message),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
          );
    }

  /*
    Locale
  */

  initLocale() {
    if (this.props.locale === null || moment.locales().indexOf(this.props.locale) === -1) {
      this.setLocale('en');
    } else {
      this.setLocale(this.props.locale);
    }
  }

  setLocale(locale) {
    this._locale = locale;
  }

  getLocale() {
    return this._locale;
  }

  /*
    Handle Keyboard Animations
  */

  setMaxHeight(height) {
    this._maxHeight = height;
  }

  getMaxHeight() {
    return this._maxHeight;
  }

  setKeyboardHeight(height) {
    this._keyboardHeight = height;
  }

  getKeyboardHeight() {
    return this._keyboardHeight;
  }

  setIsTypingDisabled(value) {
    this._isTypingDisabled = value;
  }

  getIsTypingDisabled() {
    return this._isTypingDisabled;
  }

  setIsMounted(value) {
    this._isMounted = value;
  }

  getIsMounted() {
    return this._isMounted;
  }

  getMinInputToolbarHeight() {
    return MIN_INPUT_TOOLBAR_HEIGHT + MIN_TOPBAR_HEIGHT;
  }

  prepareSlidesContainerHeight(value) {
    if (this.props.isAnimated === true) {
      return new Animated.Value(value);
    }
    return value;
  }

  onKeyboardWillShow(e) {
    this.setIsTypingDisabled(true);
    this.setKeyboardHeight(e.endCoordinates.height);
    const newSlidesContainerHeight = (this.getMaxHeight() - (this.state.composerHeight + (this.getMinInputToolbarHeight() - MIN_COMPOSER_HEIGHT))) - this.getKeyboardHeight();
    if (this.props.isAnimated === true) {
      Animated.timing(this.state.slidesContainerHeight, {
        toValue: newSlidesContainerHeight,
        duration: 210,
      }).start();
    } else {
      this.setState((previousState) => {
        return {
          slidesContainerHeight: newSlidesContainerHeight,
        };
      });
    }
  }

  onKeyboardWillHide() {
    this.setIsTypingDisabled(true);
    this.setKeyboardHeight(0);
    const newSlidesContainerHeight = this.getMaxHeight() - (this.state.composerHeight + (this.getMinInputToolbarHeight() - MIN_COMPOSER_HEIGHT));
    if (this.props.isAnimated === true) {
      Animated.timing(this.state.slidesContainerHeight, {
        toValue: newSlidesContainerHeight,
        duration: 210,
      }).start();
    } else {
      this.setState((previousState) => {
        return {
          slidesContainerHeight: newSlidesContainerHeight,
        };
      });
    }
  }

  onKeyboardDidShow(e) {
    if (Platform.OS === 'android') {
      this.onKeyboardWillShow(e);
    }
    this.setIsTypingDisabled(false);
  }

  onKeyboardDidHide(e) {
    if (Platform.OS === 'android') {
      this.onKeyboardWillHide(e);
    }
    this.setIsTypingDisabled(false);
  }

  scrollToBottom(animated = true) {
    this._slideContainerRef.scrollTo({
      y: 0,
      animated,
    });
  }

  onTouchStart() {
    this._touchStarted = true;
  }

  onTouchMove() {
    this._touchStarted = false;
  }

// handle Tap event to dismiss keyboard
  onTouchEnd() {
    if (this._touchStarted === true) {
      dismissKeyboard();
    }
    this._touchStarted = false;
  }

  /*
    Header Bar
  */

  onChannelTabPress(channel){
    console.log(`channel pressed: ${channel}`)
  }

  renderTopbar() {
    /* maybe use context to pass actions */
     //console.log("rendering custom topbar")
     /*
      const topbarProps = {
        ...this.props,
        onSend: this.onSend,
        onNavigation: this.onNavigation,
      }
    */
    if (this.props.renderCustomTopbar) {
      return this.props.renderCustomTopbar();
    }
    // button = {name: '', text: channel_name}
    const topbarProps = {
      leftButton: "plus",
      onLeftPress: () => { 
          this.props.navigator.push({ 
              id: 'add', 
              params: {
                topic: 'network:lobby',
                server: this.server,
                user: this.user,},
              })
      },
      rightButton: "braille",
      onRightPress: () => { 
         let channel_tabs = this.channel_tabs 
          if (channel_tabs.indexOf('Pingal') < 0) {
            channel_tabs = ['Pingal'].concat(channel_tabs)
          }
          this.props.navigator.push({ 
              id: 'lobby', 
              params: {
                topic: 'pingal',
                server: this.server,
                user: this.user,
                channel_tabs: channel_tabs,
                muteInputToolbar: true,
              },
              })
      },
      onNavigation: this.onNavigation,
      ...this.props
    }
    return (
        <CustomNavBar {...topbarProps} />
    ) 
    /*
    let button_icon = (name) => {return (
      <Icon name={name} style={icon_style} size={15} color={palette.icon_color} />
    )}

    let button_text = (text) => {
      return (
        <NavButtonText style={navbar_styles.iconText}>
            {text}
          </NavButtonText>
      )
    }
    //{button_icon(button.icon)}
    let tab = (text, index) => {
        return(
        <NavButton 
            key={index}
            style={navbar_styles.tabContainer} 
            onPress={() => this.onNavigation(
              id='lobby', params={
                topic: text, 
                channel_tabs: this.channel_tabs
              })}>           
             
             {button_text(text)}      
        </NavButton>
        )
    };
    //console.log('rendering topbar ...')
    let buttons = this.props.channel_tabs
    if (!!buttons && buttons.length > 0) {
      let tabs = buttons.map((button, index) => tab(button, index))
      //console.log('topbar with buttons')
      //console.log(buttons)
    
      return (
        
          <NavBar style={{
            statusBar:navbar_styles.statusBar,
            navBar:navbar_styles.chatnavBar
          }}>
          <InvertibleScrollView horizontal={true}>
            {tabs}
            </InvertibleScrollView> 
          </NavBar> 
        
      )
    }
    //console.log('no topbar: empty_view')
    return (
        <NavBar style={{
          statusBar:navbar_styles.statusBar,
          navBar:[navbar_styles.chatnavBar,{borderBottomWidth:0}]
        }}>
        </NavBar>  
      );
      */
  }

  /*
    Footer bar: Chat input
  */
  resetInputToolbar() {
    this.setState((previousState) => {
      return {
        text: '',
        composerHeight: MIN_COMPOSER_HEIGHT,
        slidesContainerHeight: this.prepareSlidesContainerHeight(this.getMaxHeight() - this.getMinInputToolbarHeight() - this.getKeyboardHeight()),
      };
    });
  }

  zeroInputToolbar() {
    this.setState((previousState) => {
      return {
        slidesContainerHeight: this.prepareSlidesContainerHeight(this.getMaxHeight() - this.getKeyboardHeight()),
      };
    });
  }

  calculateInputToolbarHeight(newComposerHeight) {
    return newComposerHeight + (this.getMinInputToolbarHeight() - MIN_COMPOSER_HEIGHT);
  }

  onType(e) {
    if (this.getIsTypingDisabled() === true) {
      return;
    }
    let newComposerHeight = Math.max(MIN_COMPOSER_HEIGHT, Math.min(MAX_COMPOSER_HEIGHT, e.nativeEvent.contentSize.height));
    let newSlidesContainerHeight = this.getMaxHeight() - this.calculateInputToolbarHeight(newComposerHeight) - this.getKeyboardHeight();
    let newText = e.nativeEvent.text;
    this.setState((previousState) => {
      return {
        text: newText,
        composerHeight: newComposerHeight,
        slidesContainerHeight: this.prepareSlidesContainerHeight(newSlidesContainerHeight),
      };
    });
  }

  renderInputToolbar() {
    //mailto: this.state.mailto,
    // onMailTo: this.onMailTo,
    const inputToolbarProps = {
      ...this.props,
      text: this.state.text,    
      composerHeight: Math.max(MIN_COMPOSER_HEIGHT, this.state.composerHeight),
      onChange: this.onType,     
      onSend: this.onSend,
      
    };
    
    if (this.props.muteInputToolbar) {
       //this.zeroInputToolbar()
      return <View/>
    }
    if (this.props.renderCustomInputToolbar) {
      return this.props.renderCustomInputToolbar(inputToolbarProps);
    }
    
    return (
      <InputToolbar
        {...inputToolbarProps}
      />
    );

  }


  /*
    Loading Animation

  */

  renderLoading() {
    return null;
  }

  
  /*
    renderScreen
  */
  render() {
      //
        if (this.state.isInitialized === true) {
          return (
            <ActionSheet ref={component => this._actionSheetRef = component}>
              <View style={styles.container}>
                {this.renderTopbar()}
                {this.renderSlides()}
                {this.renderInputToolbar()}
              </View>
            </ActionSheet>
          );
        }
        return (
          <View
            style={styles.container}
            onLayout={(e) => {
              const layout = e.nativeEvent.layout;
              this.setMaxHeight(layout.height);
              InteractionManager.runAfterInteractions(() => {
                this.setState({
                  isInitialized: true,
                  text: '',
                  composerHeight: MIN_COMPOSER_HEIGHT,
                  slidesContainerHeight: this.prepareSlidesContainerHeight(this.getMaxHeight() - this.getMinInputToolbarHeight()),
                });
              });
            }}
          >
            {this.renderLoading()}
          </View>
        );
      
  }

}

Screen.childContextTypes = {
  actionSheet: PropTypes.func,
  getLocale: PropTypes.func,
};

Screen.defaultProps = {
  user:{},
  server: null,
  topic:'',
  channel_tabs:[],
  slides: [],
  locale: null,
  onSend: () => {},
  onRecieve: () => {},
  onNavigation: () => {},
  topBar: true,
  muteInputToolbar: false,
  actionBar: true, 
  renderCustomTopbar: null,
  renderCustomInputToolbar: null,
  renderCustomSlideContainer: null,
  renderCustomSlide: null,
  renderCustomView: null,
  isAnimated: Platform.select({
    ios: true,
    android: false,
  }),
}