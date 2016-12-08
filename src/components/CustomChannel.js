import React, { Component, PropTypes } from 'react';
import {
  Animated,
  InteractionManager,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import InvertibleScrollView from 'react-native-invertible-scroll-view';

import ActionSheet from '@exponent/react-native-action-sheet';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import moment from 'moment/min/moment-with-locales.min';
import md5 from 'md5';
import _ from 'lodash';

import InputToolbar from './InputToolbar';
import NavBar, { NavButton, NavButtonText, NavTitle } from 'react-native-nav';
import CustomNavBar from './CustomNavBar';
import InputThought from './InputThought';
import ThoughtContainer from './ThoughtContainer';

import {chat as styles, navbar as navbar_styles, palette,icon as icon_style, formStylesheet} from '../styles/styles.js'
import Icon from 'react-native-vector-icons/FontAwesome';
import IconI from 'react-native-vector-icons/Ionicons';

import t from 'tcomb-form-native'

const MIN_COMPOSER_HEIGHT = Platform.select({
  ios: 33,
  android: 41,
});
const MAX_COMPOSER_HEIGHT = 200;
const MIN_INPUT_TOOLBAR_HEIGHT = 5;
const MIN_TOPBAR_HEIGHT = 33;

export default class CustomChannel extends Component {

    constructor(props){
        super(props)

        // default: slides
        this._slides = [];
        this._slidesHash = null;

        this.state = {
            isInitialized: false, // initialization will calculate maxHeight before rendering the chat
        };

        // Chat server
        this.onType = this.onType.bind(this);
        this.onSend = this.onSend.bind(this);

        // default values for keyboard and locale
        this._isMounted = false;
        this._keyboardHeight = 0;
        this._maxHeight = null;
        this._touchStarted = false;
        this._isTypingDisabled = false;
        this._locale = 'en';

        // Keyboard event handlers
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onKeyboardWillShow = this.onKeyboardWillShow.bind(this);
        this.onKeyboardWillHide = this.onKeyboardWillHide.bind(this);
        this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this);
        this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this);
        this.getLocale = this.getLocale.bind(this);
     

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
        this.setSlides(slides);
    }

    setSlides(slides) {
        this._slides = slides;
        this.setSlidesHash(md5(JSON.stringify(slides)));
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


    renderSlides() {
        const AnimatedView = this.props.isAnimated === true ? Animated.View : View;
        /*
        onTouchStart: this.onTouchStart,
                            onTouchMove: this.onTouchMove,
                            onTouchEnd: this.onTouchEnd,
        */
       return (
            <AnimatedView style={{
              height: this.state.slidesContainerHeight,
              }}>  
                <ThoughtContainer
                        {...this.props}
                        scrollViewProps={{
                            inverted: true,
                            keyboardShouldPersistTaps: true,
                            
                            onKeyboardWillShow: this.onKeyboardWillShow,
                            onKeyboardWillHide: this.onKeyboardWillHide,
                            onKeyboardDidShow: this.onKeyboardDidShow,
                            onKeyboardDidHide: this.onKeyboardDidHide,
                        }}

                    ref={component => this._slideContainerRef = component}
                    slides={this.getSlides()}
                /> 

                
            </AnimatedView>
        )
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
        Header Bar
    */

    renderTopbar() {

        this.channel_tabs =['']
        const topbarProps = {    
        channel_tabs: this.channel_tabs,
        leftButton: "braille",
        onLeftPress: () => {
            let channel_tabs = this.channel_tabs 
            if (channel_tabs.indexOf('Pingal') < 0) {
                channel_tabs = ['Pingal'].concat(channel_tabs)
            }
            this.props.navigator.push({ 
                id: 'thought', 
                params: {
                    topic: 'pingal',
                    server: this.server,
                    user: this.user,
                    channel_tabs: channel_tabs,
                    muteInputToolbar: false,
                },
                })
            },
            ...this.props    
        }

        return (
        <CustomNavBar {...topbarProps} />

        );
    } 

    renderForm(){
        let Form = t.form.Form;
        let category = "sports"
        let thought_obj={}
        thought_obj[category] = t.String
        thought_obj['thought'] = t.String
        let Thought = t.struct(thought_obj);
        
        
        const options = {
        fields: {
            name: {
            stylesheet: formStylesheet // overriding the style of the textbox
            }
        }
        };  
         

        return (
            <View style={styles.formContainer}>
              <Form
                ref="form"
                type={Thought}
                options={options}
                />
            </View>
        )
    }
    /*
        Footer bar: Chat input
    */

    renderInputToolbar(){

        const inputThoughtProps = {
            ...this.props,
            text: this.state.text,    
            composerHeight: Math.max(MIN_COMPOSER_HEIGHT, this.state.composerHeight),
            onChange: this.onType,     
            onSend: this.onSend,
            
        };
        
        if (this.props.muteInputToolbar) {
        return <View/>
        }
        return (
            <View/>
        )
        /*
        return (
         <InputThought
                {...inputThoughtProps}
            />
        );
        */

    }

    resetInputToolbar() {
        this.setState((previousState) => {
        return {
            text: '',
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

  /*
    Communication with Chat Server
  */

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

        console.log("onSend")
        console.log(slides)
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

CustomChannel.childContextTypes = {
  actionSheet: PropTypes.func,
  getLocale: PropTypes.func,
};

CustomChannel.defaultProps = {
  user:{},
  slides: [],
  slide:{},
  locale: null,
  onSend: () => {},
  onChannelName: () => {},
  onChannelCategory: () => {},
  onCategoryType: () => {},
  onChannelProperties: () => {},
  muteInputToolbar: false,
  category_type: '',
  isAnimated: Platform.select({
    ios: true,
    android: false,
  }),
}
