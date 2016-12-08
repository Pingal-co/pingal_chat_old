import {
  PixelRatio,
  StyleSheet,
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: '#b2b2b2',
    backgroundColor: '#FFFFFF',
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  mailto: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#b2b2b2',

  },
  accessory: {
    height: 44,
  },
  tool: {
      width: 50,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 5,
      marginRight: 5
  },
  toolText: {
      fontSize: 20,
      fontFamily: 'iconfont',
      color: '#666'
  },
  toolbar: {
      flexDirection: 'row',
      height: 40,
      backgroundColor: '#f9f9f9',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderColor: '#dadada',
  },
});

export default styles
