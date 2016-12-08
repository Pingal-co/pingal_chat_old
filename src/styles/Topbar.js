
import {
  PixelRatio,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: '#b2b2b2',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#b2b2b2',

  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  statusBar: {
    backgroundColor: '#FFF',
  },
  topBar: {
    height: 33,
  },
  navBar: {
    backgroundColor: '#f0f0f0',
    borderTopWidth: 0,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 13,
  },
  topBarold: {
    height: 33,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',

  },
  titleContainer: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 5,
    alignItems: 'center',
  },
  titleText: {
    color: 'black',
    fontWeight: '400',
    fontSize: 16,
  },
  iconWrapper: {
    marginTop: 8,
    marginBottom: 8,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
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

const TOP_BAR_HEIGHT = 33;
const STATUS_BAR_HEIGHT = 20;

export default styles
