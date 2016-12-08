
import {
  Platform,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 5,
    marginBottom: 0,
  },
  text: {
    color: '#0084ff',
    fontWeight: '600',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  textInput: {
    flex: 1,
    marginLeft: 25,
    fontSize: 16,
    lineHeight: 16,
    height: 15,
    marginTop: Platform.select({
      ios: 8,
      android: 4,
    }),
    marginBottom: Platform.select({
      ios: 5,
      android: 2,
    }),
  },
});

export default styles
