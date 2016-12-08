
import {
  Platform,
  StyleSheet,

} from 'react-native';

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

export default styles
