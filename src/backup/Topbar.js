import React, { Component, PropTypes } from 'react';
import {
  PixelRatio,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  StatusBar
} from 'react-native';

import Invite from './Invite';
import Back from './Back';
import User from './User';

const TOP_BAR_HEIGHT = 33;
const STATUS_BAR_HEIGHT = 20;
/*
const ImageButton = require('./imageButton');

const backIcon = require('../img/btn-back.png');
const infoIcon = require('../img/btn-info.png');
const memberIcon = require('../img/btn-member.png');
const leaveIcon = require('../img/btn-leave.png');
const startMessagingIcon = require('../img/btn-start-message.png');
const inviteIcon = require('../img/btn-invite.png');
*/

export default class Topbar extends Component {
  renderBack(){

    if (this.props.renderBack) {
      return this.props.renderBack(this.props);
    }

    return (
      <Back {...this.props} />
    );

  }

  renderUser() {
    if (this.props.renderMailTo) {
      return this.props.renderMailTo(this.props);
    }
    return <User {...this.props}/>;;
  }

  renderInvite(){

    if (this.props.renderInvite) {
      return this.props.renderInvite(this.props);
    }

    return (
      <Invite {...this.props}/>
    )
  }

  renderTitle(){
    if (this.props.renderTitle) {
      return this.props.renderTitle(this.props);
    }

    return (
      <View style={styles.titleContainer}>
        {this.renderUser()}
        <Text style={styles.titleText}>in {this.props.title}</Text>
      </View>
    )
  }

  render() {
    return (
        <View style={[styles.container, this.props.containerStyle]}>
          <View style={[styles.topBar, this.props.primaryStyle]}>
            {this.renderBack()}
            {this.renderTitle()}
            {this.renderInvite()}
          </View>
        </View>
      );
  }
}



const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: '#b2b2b2',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#b2b2b2',
    marginTop:22,

  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  statusBar: {
  height: STATUS_BAR_HEIGHT,
  },
  topBar: {
    height: TOP_BAR_HEIGHT,
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
    fontWeight: '200',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
});

Topbar.defaultProps = {
  containerStyle: {},
  primaryStyle: {},
  accessoryStyle: {},
  renderAccessory: null,
  renderActions: null,
  renderSend: null,
  renderComposer: null,
  title: ''
};


/*
renderButton() {
  if (this.props.onInfoPress) {
    return (
      <ImageButton
        underlayColor={'#4e4273'}
        onPress={this.props.onInfoPress}
        imageStyle={styles.imageButton}
        image={infoIcon}
      />
    );
  } else if (this.props.openChat) {
    return (
      <View style={styles.multiButtonContainer}>
        <ImageButton
          underlayColor={'#4e4273'}
          onPress={this.props.openChat.onMemberListPress}
          buttonStyle={styles.multiButtonItem}
          imageStyle={styles.imageButton}
          image={memberIcon}
        />

        <ImageButton
          underlayColor={'#4e4273'}
          onPress={this.props.openChat.onLeaveChannelPress}
          imageStyle={styles.imageButton}
          image={leaveIcon}
        />
      </View>
    );
  } else if (this.props.onInvitePress) {
    return (
      <ImageButton
        underlayColor={'#4e4273'}
        onPress={this.props.onInvitePress}
        imageStyle={styles.imageButton}
        image={startMessagingIcon}
      />
    );
  } else if (this.props.messaging) {
    return (
      <View style={styles.multiButtonContainer}>
        <ImageButton
          underlayColor={'#4e4273'}
          onPress={this.props.messaging.onMemberInvitePress}
          buttonStyle={styles.multiButtonItem}
          imageStyle={styles.imageButton}
          image={inviteIcon}
        />

        <ImageButton
          underlayColor={'#4e4273'}
          onPress={this.props.messaging.onMemberListPress}
          buttonStyle={styles.multiButtonItem}
          imageStyle={styles.imageButton}
          image={memberIcon}
        />

        <ImageButton
          underlayColor={'#4e4273'}
          onPress={this.props.messaging.onLeaveChannelPress}
          imageStyle={styles.imageButton}
          image={leaveIcon}
        />
      </View>
    );
  } else {
    return <Text></Text>;
  }
}
});
*/
/*
const styles = StyleSheet.create({
container: {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  backgroundColor: '#4e4273',
  paddingTop: 20,
},
titleLabel: {
  color:'#fff',
  textAlign:'center',
  fontWeight:'bold',
  fontSize: 18
},
leftButton: {
  justifyContent: 'flex-start',
  paddingLeft: 5
},
rightButton: {
  justifyContent: 'flex-end',
  paddingRight: 10
},
imageButton: {
  width: 30,
  height: 30
},
multiButtonContainer: {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
},
multiButtonItem: {
  marginRight: 10
}
});
*/
