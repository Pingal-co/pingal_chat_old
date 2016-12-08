import React, { Component, PropTypes } from 'react';
import {
  Linking,
  MapView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ListView,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import ParsedSlide from '../lib/ParsedSlide';
import Communications from 'react-native-communications';
//import TextExtraction from './TextExtraction';

const PATTERN = {
  url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/,
  phone: /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/,
  email: /\S+@\S+\.\S+/,
  bold: /\*(\w+)\*/,
  italic: /\_(\w+)\_/,
  strikethrough: /\~(\w+)\~/,
  hashtag: /#(\w+)/,
  list: /\[(\w+)\]/,
  blockquote: />(\w+)>/,
  code: /```(\w+)```/,
  h3: /\^\^\^(\w+)\^\^\^/,
  h2: /\^\^(\w+)\^\^/,
  h1: /\^(\w+)\^/,
};



export default class SlideText extends Component {
  constructor(props) {
    super(props);
    this.onUrlPress = this.onUrlPress.bind(this);
    this.onPhonePress = this.onPhonePress.bind(this);
    this.onEmailPress = this.onEmailPress.bind(this);
    this.onChannelPress = this.onChannelPress.bind(this);
    this.renderListView = this.renderListView.bind(this);

  }

  onUrlPress(url) {
    Linking.openURL(url);
  }

  onPhonePress(phone) {
    const options = [
      'Text',
      'Call',
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
          Communications.phonecall(phone, true);
          break;
        case 1:
          Communications.text(phone);
          break;
      }
    });
  }

  onEmailPress(email) {
    Communications.email(email, null, null, null, null);
  }
  onChannelPress(channel) {
    console.log(`channel: ${channel} pressed`);
  }

  renderBoldText(matchString, matches){
    console.log("bold text matched")
    //let boldPattern = /\*(\w+)\*/
    //let match = matchString.match(boldPattern)
    return `${matches[1]}`
  }

  renderItalicText(matchString, matches){
    return `${matches[1]}`
  }

  renderStrikethroughText(matchString, matches){
    return `${matches[1]}`
  }

  renderHeadingOneText(matchString, matches){
    return `${matches[1]}`
  }

  renderHeadingTwoText(matchString, matches){
    return `${matches[1]}`
  }

  renderHeadingThreeText(matchString, matches){
    return `${matches[1]}`
  }

  renderBlockquoteText(matchString, matches){
    return `${matches[1]}`
  }

  renderCodeText(matchString, matches){
    return `${matches[1]}`
  }

  renderImage(matchString, matches){
    return `${matches[1]}`
  }

  renderListViewText(matchString, matches){
    console.log("list view text matched")
    //let boldPattern = /\*(\w+)\*/
    //let match = matchString.match(boldPattern)
    return `${matches[1]}`
  }

  renderListView(matchString, matches){
    let ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    let dataSource = ds.cloneWithRows(`${matches[1]}`)
    let rowData = `${matches[1]}`
    console.log("list view matched")
    console.log(`matches: ${matches[0]}, ${matches[1]}, ${rowData}`)
    return(
        <Text style={[styles[this.props.position].text, this.props.textStyle[this.props.position]]}># {rowData}</Text>


    /*
    return (

      <ListView
        dataSource={dataSource}
        renderRow={(rowData) =>
          <TouchableHighlight onPress={() => this.onChannelPress(rowData)}>
            <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
              <Text style={[styles[this.props.position].text, this.props.textStyle[this.props.position]]}># {rowData}</Text>
            </View>
          </TouchableHighlight>
        }
      />
      */

    )

  }

  renderNamedLinks(matchString, matches){
    return `${matches[1]}`
  }

  renderTable(matchString, matches){
    return `${matches[1]}`
  }






  render() {
    /*
      <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>

        </View>
      */
    console.log(`body: ${this.props.currentSlide.body} `)
    return (

        <ParsedSlide
          style={[styles[this.props.position].text, this.props.textStyle[this.props.position]]}

          parse={[
            {type: 'url', pattern: PATTERN['url'], style: StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]), onPress: this.onUrlPress},
            {type: 'phone', pattern: PATTERN['phone'], style: StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]), onPress: this.onPhonePress},
            {type: 'email', pattern: PATTERN['email'], style: StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]), onPress: this.onEmailPress},
            {type: 'list', pattern: PATTERN['list'], style: StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]), onPress: this.onChannelPress, renderText: this.renderListView},
            {type: 'hashtag', pattern: PATTERN['hashtag'], style: StyleSheet.flatten([styles[this.props.position].hashtag, this.props.linkStyle[this.props.position]]), onPress: this.onChannelPress},
            {type: 'bold', pattern: PATTERN['bold'], style: StyleSheet.flatten([styles[this.props.position].bold, this.props.linkStyle[this.props.position]]), renderText: this.renderBoldText},
            {type: 'italic', pattern: PATTERN['italic'], style: StyleSheet.flatten([styles[this.props.position].italic, this.props.linkStyle[this.props.position]]), renderText: this.renderItalicText},
            {type: 'strikethrough', pattern: PATTERN['strikethrough'], style: StyleSheet.flatten([styles[this.props.position].strikethrough, this.props.linkStyle[this.props.position]]), renderText: this.renderStrikethroughText},
            {type: 'blockquote', pattern: PATTERN['blockquote'], style: StyleSheet.flatten([styles[this.props.position].blockquote, this.props.linkStyle[this.props.position]]), renderText: this.renderBlockquoteText},
            {type: 'code', pattern: PATTERN['code'], style: StyleSheet.flatten([styles[this.props.position].code, this.props.linkStyle[this.props.position]]), renderText: this.renderCodeText},
            {type: 'h3', pattern: PATTERN['h3'], style: StyleSheet.flatten([styles[this.props.position].h3, this.props.linkStyle[this.props.position]]), renderText: this.renderHeadingThreeText},
            {type: 'h2', pattern: PATTERN['h2'], style: StyleSheet.flatten([styles[this.props.position].h2, this.props.linkStyle[this.props.position]]), renderText: this.renderHeadingTwoText},
            {type: 'h1', pattern: PATTERN['h1'], style: StyleSheet.flatten([styles[this.props.position].h1, this.props.linkStyle[this.props.position]]), renderText: this.renderHeadingOneText},

          ]}
        >
          {this.props.currentSlide.body}
        </ParsedSlide>

    );
  }
}

const textStyle = {
  fontSize: 16,
  lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10,
};

const styles = {
  left: StyleSheet.create({
    container: {
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: '#f0f0f0',
      marginRight: 60,
    },
    text: {
      color: 'black',
      ...textStyle,
    },
    link: {
      color: 'black',
      textDecorationLine: 'underline',
      ...textStyle,
    },
    hashtag: {
      color: 'blue',
    },
    italic: {
      fontStyle: 'italic',
    },
    bold: {
      fontWeight: '700',
    },
    italic: {
      fontStyle: 'italic',
    },
    bolditalic: {
      fontWeight: '700',
      fontStyle: 'italic',
    },
    h1: {
      fontSize: 17,
      fontWeight: '700',
    },
    h2: {
      fontSize: 15,
      fontWeight: '400',
    },
    h3: {
      fontSize: 13,
    },
    strikethrough: {
      textDecorationLine: 'line-through',
    },
    underline: {
      textDecorationLine: 'underline',
    },
    blockquote: {
      color: 'grey',
    },
    code: {
      color: 'black',
      fontStyle: 'italic',

    },
  }),
  right: StyleSheet.create({
    container: {
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: '#f0f0f0',
      marginRight: 60,
    },
    text: {
      color: 'white',
      ...textStyle,
    },
    link: {
      color: 'white',
      textDecorationLine: 'underline',
    },
    hashtag: {
      color: 'blue',
    },
    italic: {
      fontStyle: 'italic',
    },
    bold: {
      fontWeight: '400',
    },
    italic: {
      fontStyle: 'italic',
    },
    bolditalic: {
      fontWeight: '400',
      fontStyle: 'italic',
    },
    h1: {
      fontSize: 17,
    },
    h2: {
      fontSize: 15,
    },
    h3: {
      fontSize: 13,
    },
    strikethrough: {
      textDecorationLine: 'line-through',
    },
    underline: {
      textDecorationLine: 'underline',
    },
    blockquote: {
      color: 'grey',
    },
    code: {
      color: 'black',
      fontStyle: 'italic',

    },
  }),
};

SlideText.contextTypes = {
  actionSheet: PropTypes.func,
};

SlideText.defaultProps = {
  containerStyle: {},
  position: 'left',
  textStyle: {},
  linkStyle: {},
  currentSlide: {
    body: '',
  },
};
