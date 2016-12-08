import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';


import { Chat, Actions, Sheet } from '../components/Chat';
import ChatServer from '../components/ChatServer';

import CustomActions from '../components/CustomActions';
import CustomView from '../components/CustomView';

export default class Lobby extends Component {
  constructor(props) {

    super(props);
    this.username = (this.props.route.params.user_hash) ? this.props.route.params.user_hash : this.props.user_hash
    this.topic = this.props.route.params.topic
    this.channeltabs = (this.props.route.params.channeltabs) ? this.props.route.params.channeltabs: this.props.channeltabs


    this.state = {
      slides: [],
      loadEarlier: true,
      footer: null,
    };

    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);

    this.server = ChatServer(this.props.username)
    this.lobby = this.server.lobby(this.topic, this.onReceive)

    /*
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderSheet = this.renderSheet.bind(this);
    this.renderCustomView = this.renderCustomView.bind(this);
    */
    this.onLoadEarlier = this.onLoadEarlier.bind(this);
    this.onBackPress = this.onBackPress.bind(this);

    this._isAlright = null;
  }


  componentWillMount() {
    // load data from chat server
    let slides = require('../data/slides.js')
    //console.log(slides);
    this.setState(() => {
      return {
        slides: slides,
      };
    });
  }

  onLoadEarlier() {
    // load previous data from chat server
    const previousSlides = require('../data/old_slides.js')
    this.setState((previousState) => {
      return {
        slides: Chat.prepend(previousState.slides, previousSlides),
        loadEarlier: false,
      };
    });
  }

  onAddPress() {
    this.props.navigator.push({
      id: 'add'
    })
  }
  
  onSignupPress() {
    this.props.navigator.push({
      id: 'login'
    })
  }

  onBackPress() {
    this.props.navigator.pop();
  }

  onSend(slides = []) {
    this.server.send(this.lobby, slides)

    // for demo purpose
    this.answerDemo(slides);
  }

  answerDemo(slides) {
    // must come from backend
    if (slides.length > 0) {
      if ((slides[0].image || slides[0].location) || !this._isAlright) {
        this.setState((previousState) => {
          return {
            footer: (props) => {
              return (
                <View style={styles.footer}>
                  <Text>Pingal is typing...</Text>
                </View>
              );
            },
          };
        });
      }
    }

    setTimeout(() => {
      if (slides.length > 0) {
        if (slides[0].image) {
          this.onReceive( {body:'Nice picture!', user:'Pingal', timestamp: new Date()});
        } else if (slides[0].location) {
          this.onReceive({body:'My favorite place' , user:'Pingal', timestamp: new Date()});
        } else {
          if (!this._isAlright) {
            this._isAlright = true;
            this.onReceive({body:'Alright', user:'Pingal', timestamp: new Date()});
          }
        }
      }

      this.setState((previousState) => {
        return {
          footer: null,
        };
      });
    }, 1000);
  }



  onReceive(text) {
    //console.log("Rendering received msg")
    //console.log(text)
    this.setState((previousState) => {
      return {
        slides: Chat.append(previousState.slides, {
          _id: Math.round(Math.random() * 1000000),
          body: text.body,
          timestamp: text.timestamp,
          user: {
            _id: 2,
            name: text.user,
            // avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        }),
      };
    });
  }

  /*
  renderCustomActions(props) {
    if (Platform.OS === 'ios') {
      return (
        <CustomActions {...props} />
      );
    }
    const options = {
      'Action 1': (props) => {
        alert('option 1');
      },
      'Action 2': (props) => {
        alert('option 2');
      },
      'Cancel': () => {},
    };
    return (
      <Actions {...props} options={options} />
    );
  }
  */
  /*
  renderSheet(props) {
    return (
      <Sheet
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }
  */

  /*
  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  }
  */
  render() {
    let slides = this.state.slides
    let loadEarlier = this.state.loadEarlier
    let footer = this.state.footer
    const navigator = this.props.navigator
    const buttons = this.channeltabs
    /*
    renderActions={this.renderCustomActions}
    renderSheet={this.renderSheet}
    renderCustomView={this.renderCustomView}
    */
    return (
      <Chat
        slides={slides}
        onSend={this.onSend}
        loadEarlier={loadEarlier}
        onLoadEarlier={this.onLoadEarlier}
        footer={footer}
        navigator={navigator}
        buttons={buttons}

        user={{
          _id: 1, // sent messages should have same user._id
          name: `${this.props.username}`
        }}
        lobby={this.lobby}
        channeltabs={this.channeltabs}
        chatserver={this.server}
        {...this.props}


      />
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    margin: 10,
  },
});

Lobby.defaultProps = {
  username: 'Vihaan',
  room: '',
  channeltabs: ['#Local','#User'],
  server: null,
}
