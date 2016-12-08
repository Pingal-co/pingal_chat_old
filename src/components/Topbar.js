import React, { Component, PropTypes } from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  Image,
  StatusBar
} from 'react-native';

import Invite from './Invite';
import Back from './Back';
import User from './User';
import Network from './Network';
import NavBar, { NavButton, NavButtonText, NavTitle } from 'react-native-nav';

import CustomNavBar from './CustomNavBar.js'
import AddForm from './FormView.js'
import iconfontConf from '../lib/iconfontConf'
import {navbar as styles} from '../styles/styles.js'


export default class Topbar extends Component {
  constructor(props) {
    super(props);
    this.onAddPress = this.onAddPress.bind(this);
  }

  onAddPress() {
    const options = ['Add Network', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    const actionSheet = this.context.actionSheet()
    actionSheet.showActionSheetWithOptions({
      options,
      cancelButtonIndex,
    },
    (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          this.setModalVisible(true);
          break;
        default:
      }
    });
  }

  renderAddNetwork(){
    return (
      <AddForm {...this.props} />
    )
  }

  renderNavBar() {
    const onSend = this.props.onSend
    const leftButton = "ios-add-circle-outline"
    const onLeftPress = () => this.props.navigator.push({
      id: 'add'
    })
    const title = 'Local'
    const rightButton = "ios-log-in"
    const onRightPress = () => this.props.navigator.push({
      id: 'login'
    })


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

  /*
  renderNavBar() {
    //const onSend = this.props.onSend
    return (
      <NavBar>
        <NavButton
          style={styles.iconWrapper}
          onPress={this.onAddPress}
        >
          <NavButtonText style={styles.iconText}>
            {'+'}
          </NavButtonText>
        </NavButton>
        <NavTitle style={styles.titleText}>
          {'Local'}
        </NavTitle>
        <NavButton
          style={styles.iconWrapper}
          onPress={() => alert('hi')}>
          <NavButtonText
            style={styles.iconText}>
            {'>'}
          </NavButtonText>
        </NavButton>
      </NavBar>
    );
  }
  */

  renderBack(){
    return (
      <Back {...this.props} />
    );

  }

  renderUser() {
    return <User {...this.props}/>;;
  }

  renderInvite(){
    return (
      <Invite {...this.props}/>
    )
  }

  renderTitle(){
    const title = this.props.title
    return (
      <View style={styles.titleContainer}>
        {this.renderUser()}
        <Text style={styles.titleText}>in {title}</Text>
      </View>
    )
  }

  render() {
    /*
    <View style={styles.container}>
    <View style={styles.topBar}>
    {this.renderBack()}
    {this.renderTitle()}
    {this.renderInvite()}
    </View>
      </View>
    */
    return (
      <View>
      {this.renderNavBar()}
      </View>


      );
  }
}

Topbar.contextTypes = {
  actionSheet: PropTypes.func,
};

Topbar.defaultProps = {
  title: ''
};
