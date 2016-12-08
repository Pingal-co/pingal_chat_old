import React, { Component, PropTypes } from 'react';
import {
  Animated,
  InteractionManager,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import ActionSheet from '@exponent/react-native-action-sheet';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import moment from 'moment/min/moment-with-locales.min';
import md5 from 'md5';

import Actions from './Actions';
import Avatar from './Avatar';
import Sheet from './Sheet';
import SlideImage from './SlideImage';
import SlideText from './SlideText';
import Composer from './Composer';
import Day from './Day';
import Topbar from './Topbar';
import InputToolbar from './InputToolbar';
import LoadEarlier from './LoadEarlier';
import Slide from './Slide';
import SlideContainer from './SlideContainer';
import Send from './Send';
import Time from './Time';
import NavBar, { NavButton, NavButtonText, NavTitle } from 'react-native-nav';

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
const MIN_INPUT_TOOLBAR_HEIGHT = 115;
const MIN_TOPBAR_HEIGHT = 33;

class Chat extends Component {
  constructor(props) {
    super(props);

    // default values
    this._isMounted = false;
    this._keyboardHeight = 0;
    this._maxHeight = null;
    this._touchStarted = false;
    this._isTypingDisabled = false;
    this._locale = 'en';
    this._slides = [];
    this._slidesHash = null;

    this._topBar = false;
    this._title = this.props.lobbyTitle
    this._isMainLobby =  this.props.isMainLobby
    this._buttons = [];

    this.state = {
      isInitialized: false, // initialization will calculate maxHeight before rendering the chat
    };

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onKeyboardWillShow = this.onKeyboardWillShow.bind(this);
    this.onKeyboardWillHide = this.onKeyboardWillHide.bind(this);
    this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this);
    this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this);
    this.onType = this.onType.bind(this);
    this.onMailTo = this.onMailTo.bind(this);
    this.onSend = this.onSend.bind(this);
    this.getLocale = this.getLocale.bind(this);
  }

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

  initSlides(slides = []) {
    this.setSlides(slides);
  }

  setSlides(slides) {
    this._slides = slides;
    this.setSlidesHash(md5(JSON.stringify(slides)));
  }

  setButtons(buttons) {
    this._buttons = buttons;
  }

  getSlides() {
    console.log(`slides: ${this._slides}`)
    return this._slides;
  }

  setSlidesHash(slidesHash) {
    this._slidesHash = slidesHash;
  }

  getSlidesHash() {
    return this._slidesHash;
  }

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

  setTopBar(value) {
    this._topBar = value;
  }

  getTopBar() {
    return this._topBar;
  }

  getTitle(){
    return this._title ;
  }
  setTitle(value){
    this._title = value ;
  }

  setIsMainLobby(value) {
    this._isMainLobby = value;
  }

  getIsMainLobby() {
    return this._isMainLobby;
  }

  // TODO
  // setMinInputToolbarHeight
  getMinInputToolbarHeight() {
    if (this.props.renderAccessory) {
      return MIN_INPUT_TOOLBAR_HEIGHT * 2 + MIN_TOPBAR_HEIGHT;
    }
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

  renderSlides() {
    const AnimatedView = this.props.isAnimated === true ? Animated.View : View;
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

          ref={component => this._slideContainerRef = component}
        />
      </AnimatedView>
    );
  }

  onSend(slides = [], shouldResetInputToolbar = false) {
    if (!Array.isArray(slides)) {
      slides = [slides];
    }

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

    this.props.onSend(slides);
    this.scrollToBottom();

    if (shouldResetInputToolbar === true) {
      setTimeout(() => {
        if (this.getIsMounted() === true) {
          this.setIsTypingDisabled(false);
        }
      }, 200);
    }
  }

  resetInputToolbar() {
    this.setState((previousState) => {
      return {
        text: '',
        mailto:'',
        composerHeight: MIN_COMPOSER_HEIGHT,
        slidesContainerHeight: this.prepareSlidesContainerHeight(this.getMaxHeight() - this.getMinInputToolbarHeight() - this.getKeyboardHeight()),
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

  onMailTo(e) {
    if (this.getIsTypingDisabled() === true) {
      return;
    }
    const newText = e.nativeEvent.text;
    this.setState((previousState) => {
      return {
        mailto: newText,
      };
    });
  }

  onBackPress() {
    this.props.navigator.pop();
  }

  onInvite() {
    console.log("send invite");
  }

  onChannelTabPress(channel){
    console.log(`channel pressed: ${channel}`)
  }

  renderCustomTopBar() {
    // button = {name: '', text: channel_name}
    let buttons = this.props.buttons
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
    let tab = (button, index) => {
        console.log("button")
        console.log(button)
        return(
        <NavButton 
            key={index}
            style={navbar_styles.tabContainer} 
            onPress={() => this.onChannelTabPress(button)}>           
             
             {button_text(button)}      
        </NavButton>
        )
    };
    console.log(buttons)
    let tabs = buttons.map((button, index) => tab(button, index))

    return(
       <NavBar style={{
        statusBar:navbar_styles.statusBar,
        navBar:navbar_styles.chatnavBar
      }}>
        {tabs}
      </NavBar>
    )
  }

  /*
  renderTopBar() {
    const TopbarProps = {
      ...this.props,
      MainLobby: this.getIsMainLobby(),
      title: this.getTitle(),
      onBack: this.onBackPress,
      onInvite: this.onInvite
    };

    if (this.props.renderTopbar) {
      return this.props.renderTopbar(TopbarProps);
    }
    return (

      <Topbar{...TopbarProps}/>



    );


  }
  */


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

    if (this.props.renderInputToolbar) {
      return this.props.renderInputToolbar(inputToolbarProps);
    }
    return (
      <InputToolbar
        {...inputToolbarProps}
      />
    );
  }

  renderLoading() {
    if (this.props.renderLoading) {
      return this.props.renderLoading();
    }
    return null;
  }

  render() {
    
    if (this.state.isInitialized === true) {
      return (
        <ActionSheet ref={component => this._actionSheetRef = component}>
          <View style={styles.container}>
            {this.renderCustomTopBar()}
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
              mailto:'',
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


Chat.childContextTypes = {
  actionSheet: PropTypes.func,
  getLocale: PropTypes.func,
};

Chat.defaultProps = {
  lobbyTitle: 'Main Lobby',
  isMainLobby: false,
  slides: [],
  onSend: () => {},
  loadEarlier: false,
  onLoadEarlier: () => {},
  locale: null,
  isAnimated: Platform.select({
    ios: true,
    android: false,
  }),
  footer: null,
  renderAccessory: null,
  renderActions: null,
  renderAvatar: null,
  renderSheet: null,
  renderSlideText: null,
  renderSlideImage: null,
  renderComposer: null,
  renderCustomView: null,
  renderDay: null,
  renderTopBar: null,
  renderInputToolbar: null,
  renderLoadEarlier: null,
  renderLoading: null,
  renderSlide: null,
  renderSend: null,
  renderTime: null,
  user: {},
  lobby:null,
  chatserver: null,
};

export {
  Chat,
  Actions,
  Avatar,
  Sheet,
  SlideImage,
  SlideText,
  Composer,
  Day,
  InputToolbar,
  LoadEarlier,
  Slide,
  Send,
  Time,
};
