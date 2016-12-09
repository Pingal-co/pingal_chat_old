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

import SlideContainer from './SlideContainer';
import InputToolbar from './InputToolbar';
import NavBar, { NavButton, NavButtonText, NavTitle } from 'react-native-nav';
import CustomNavBar from './CustomNavBar';

import {chat as styles, navbar as navbar_styles, palette,icon as icon_style} from '../styles/styles.js'
import Icon from 'react-native-vector-icons/FontAwesome';
import IconI from 'react-native-vector-icons/Ionicons';

const MIN_COMPOSER_HEIGHT = Platform.select({
  ios: 33,
  android: 41,
});
const MAX_COMPOSER_HEIGHT = 200;
const MIN_INPUT_TOOLBAR_HEIGHT = 85;
const MIN_TOPBAR_HEIGHT = 33;

export default class Channel extends Component {

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
        //console.log(`slides: ${this._slides}`)
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

    
    static update(currentSlides = [], slide) {
        // We can have better performance with a different data structure e.g. dictionary and sorted array 
        // clone for in-place editing
        slides = currentSlides
        shouldAppend = true
        
        let previous = (currentslide, index) => {
            return (currentslide.user._id === slide.user._id) && ("edit_id" in slide) && (currentslide.edit_id === slide.edit_id)
        }
        
        let duplicate = (currentslide, index) => {
            return (currentslide.user._id === slide.user._id) && (currentslide.slide_id === slide.slide_id)
        }
        
        previousSlideIndex = currentSlides.findIndex(previous)
        if (previousSlideIndex >= 0) { 
            // edit mode and not the first word 
            // save mode but previous edit exist
            //console.log("edited")
           // console.log(previousSlideIndex)        
            slides[previousSlideIndex] = slide
            
        } else if (currentSlides.findIndex(duplicate) < 0) {
            // append only new slides loaded from database
            slides = Channel.append(currentSlides,slide)
            //console.log("append")
        }

        /*
        slides.forEach((currentslide, index) => {         
            // Case 1: Duplicate Slide in Editing / Saved mode
            // Update the slide being edited of the same user
            // currentslide.user._id === slide.user._id && 
            if ( currentslide.slide_id === slide.slide_id) 
            {
                    slides[index] = slide
                    shouldAppend = false
                    console.log("being edited or duplicate")
                    //console.log(slide.edit_id)
            }
            
            if ( currentslide.slide_id !== slide.slide_id &&
                currentslide.edit_id === slide.edit_id) 
            {
                   slides[index] = slide
                    shouldAppend = false
                    console.log("just saved")
                    //console.log(slide.edit_id)
            }
            
  

        })   
        // Case 3: New Slide
        if (shouldAppend) {
            console.log("append")
            slides = Channel.append(currentSlides,slide)
        }
        */
        console.log(slide)    
      
        return slides
    }

    /*
        Header Bar
    */

    renderTopbar() {
        /*
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
        ...this.props
        }
        */
        const topbarProps = {
            ...this.props
        }
        return (
            <CustomNavBar {...topbarProps} />
        ) 
    }

    /*
        Footer bar: Chat input
    */

    renderInputToolbar() {

        const inputToolbarProps = {
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
        <InputToolbar
            {...inputToolbarProps}
        />
        );

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
        // test if last character is space: token by token sending in English
        if (/\s+$/.test(newText)) {
            console.log("sending a new token ...")
            this.onSend(slides={text: newText}, shouldResetInputToolbar=false, save=false)
        }
     }

  /*
    Communication with Chat Server
  */

    onSend(slides = [], shouldResetInputToolbar = false, save=false) {
        if (!Array.isArray(slides)) {
        slides = [slides];
        }
        
        if (save) {
            this.props.onSave()   
        }
        

        slides = slides.map((slide) => {
            // set the slide id only at the first token
            let num_words = slide.text.split(" ").length - 1 
            console.log("total words: ", num_words)
            if (num_words === 1) {
                edit_slide_id = 'edit-id-' + Math.round(Math.random() * 1000000)
                temp_slide_id = 'temp-id-' + Math.round(Math.random() * 1000000)
            }
            new_slide_id = 'temp-id-' + Math.round(Math.random() * 1000000)
           // edit_id: edit_slide_id,
            return {
                ...slide,
                _id: new_slide_id,
                edit: !save,
                edit_id: edit_slide_id,           
                slide_id: temp_slide_id,
                body: this.state.text,
                user: this.props.user,
                timestamp: new Date(),
                public: true,
                sponsored: false,
                room: this.props.topic,      
            } ;
        });

        if (shouldResetInputToolbar === true) {
            this.setIsTypingDisabled(true);
            this.resetInputToolbar();
        }

        console.log("onSend")
        console.log("user:", this.props.user)
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

Channel.childContextTypes = {
  actionSheet: PropTypes.func,
  getLocale: PropTypes.func,
};

Channel.defaultProps = {
  user:{},
  server: null,
  topic:'',
  channel_tabs:[],
  slides: [],
  locale: null,
  onSend: () => {},
  onSave: () => {},
  muteInputToolbar: false,
  renderCustomSlide: null,
  renderCustomView: null,
  isAnimated: Platform.select({
    ios: true,
    android: false,
  }),
}
