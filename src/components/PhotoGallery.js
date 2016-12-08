import React, { Component } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import CameraRollPicker from 'react-native-camera-roll-picker';
import NavBar, { NavButton, NavButtonText, NavTitle } from 'react-native-nav';
import DeviceInfo from 'react-native-device-info';
  
import Camera from './Camera'
import CustomNavBar from './CustomNavBar.js'
import iconfontConf from '../lib/iconfontConf'

export default class PhotoGallery extends Component {
  constructor(props) {
    super(props);
    this._images = [];
    this.selectImages = this.selectImages.bind(this);
  }

  setImages(images) {
    this._images = images;
  }

  getImages() {
    return this._images;
  }

  selectImages(images) {
    this.setImages(images);
  }

  renderNavBar() {
    const onSend = this.props.onSend
    const leftButton = "ios-arrow-dropleft"
    const onLeftPress = () => this.props.navigator.pop()
    const title = 'Camera and Roll'
    const rightButton = "ios-cloud-upload-outline"
    const onRightPress = () => {
      this.props.navigator.pop()

      const images = this.getImages().map((image) => {
        return {
          image: image.uri,
        };
      });
      onSend(images);
      this.setImages([]);
    }

    return (
      <CustomNavBar
        leftButton={leftButton}
        onLeftPress={onLeftPress}
        title={title}
        rightButton={rightButton}
        onRightPress={onRightPress}
      >
      </CustomNavBar>

    );
  }

  render() {
    console.log("gallery visible")
    // let clientId = DeviceInfo.getUniqueID();
    // console.log(`clientid: ${clientid}`)
    const device = false
    const camera_roll = (device) ? (
          <CameraRollPicker
                maximum={10}
                imagesPerRow={4}
                callback={this.selectImages}
                selected={[]}
              />
          ) : (<View />)
    const camera = (
      <Camera {...this.props}/>
    )

    return (
      <View >
          {this.renderNavBar()}
          <View>  
            <View style={{flex:3}}>
              {camera}
            </View>
              <View style={{flex:2}}>
              {camera_roll}
            </View>
          </View>
      </View>
    )

  }
}


PhotoGallery.defaultProps = {
  onSend: () => {}
};
