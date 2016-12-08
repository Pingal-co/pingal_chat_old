import React, { Component } from 'react';
import {
  Navigator,
  StyleSheet,
} from 'react-native';

import Thought from '../components/Thought'
import ChatLobby from './ChatLobby'
import User from '../components/Splash'
import ChatServer from '../components/ChatServer';

/*
import Lobby from './Lobby'
import Login from '../components/Login'
import AddForm from '../components/FormView'
import Server from '../components/Server'

import PhotoGallery from '../components/PhotoGallery'
import MailTo from '../components/MailTo'
import SlideMaker from '../components/SlideMaker'

import Context from '../components/MailTo'
import Camera from '../components/Camera'
import Command from '../components/PhotoGallery'
*/
/*
screens to add (Can every screen be a chat screen?):
- Message: InputToolbar (Modals: Pingto_Search, Context(Location|Time|Secret), Photos, Camera, , Commands)
- Add: Channel OR network (choose template)
- Login: AutoLogin (show InputToolbar) or Signup (Else show signup component )
- Invite: Inside (notifications to users) OR Outside (via sms)
*/

/*
let Screens = {
  splash: Splash,
  lobby: ChatLobby,
  login: Login,
  add: Server,
  thoughtbot: Server,
  album: PhotoGallery,
  slide_maker: SlideMaker,
  bots: Command, 
  context: Context,
  camera: Camera, 
};
*/


let Screens ={
  user: User, 
  lobby: ChatLobby,
  thought: Thought
}


export default class Main extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    // init code before call render
  }
  renderScene(route, navigator) {
    let Scrn = Screens[route.id];
    //console.log(`screen: ${Screen} and id: ${route.id}`)
    return <Scrn route={route} navigator={navigator}/>
  }
  render() {
    return (
      <Navigator
        style={ styles.container }
        initialRoute={ {
            id: 'thought', 
            } }
        renderScene={this.renderScene}
        configureScene={ () => { return Navigator.SceneConfigs.VerticalUpSwipeJump; } }
      />
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
