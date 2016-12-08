import React, {
  Component,
} from 'react';


import {
  View,
  Text,
  Image,
  ScrollView, 
  TouchableOpacity,
  TextInput,
} from 'react-native';

import {splash as styles, palette, icon, composer} from '../styles/styles.js'
import { Form,Separator,InputField } from 'react-native-form-generator';

import Icon from 'react-native-vector-icons/FontAwesome';
import IconI from 'react-native-vector-icons/Ionicons';

import {fruits, titles, adjectives, nouns, encouraging_words, animals} from '../data/names.js'
//import WP from 'wordpos'

import ChatServer from '../components/ChatServer';
import Screen from './Screen';
import Composer from './Composer';

const DEFAULT_USER = "pingal"
/*
    Splash screen does the following:
    1) Connects to chat server and splash channel
    2) Send events : user_device_info, current_location 
    3) Receives user_hash and local_channel
    4) If user_hash is empty then show sign up/login screen
    5) Upon sign in: Send insert user_hash event;
    6) Navigate to local chat channel
*/



export default class Splash extends Component {
	constructor(props){
		super(props)
		//console.log(this.props)
        this.state = {
            user_hash: '',
            user:{},

        }
        this.chat_server = ChatServer()
        this.onNavigation = this.onNavigation.bind(this)
        this.onSend = this.onSend.bind(this)
        this.topic = 'room:lobby'
        this.user = {
                _id: 1, // sent messages should have same user._id
                name: DEFAULT_USER
        }

        this.renderCustomSlideContainer = this.renderCustomSlideContainer.bind(this);
        this.renderUserName = this.renderUserName.bind(this)
        this.renderPickName = this.renderPickName.bind(this)
        this.renderSignInBar = this.renderSignInBar.bind(this)
        this.onChange = this.onChange.bind(this)
        this.connectChatServer = this.connectChatServer.bind(this)
        this.updateChatServer = this.updateChatServer.bind(this)
   
    }

    connectChatServer(){
        this.chat_server = ChatServer()
    }

    updateChatServer(){
        // send location and get the local room:lobby
        this.chat_server = ChatServer(this.state.user_hash)
    }

    componentWillMount(){
        //this.connectChatServer()
		
	}

	componentDidMount(){
        // this.updateChatServer()
        // this.sendLocation()
         // this.deviceinfo()
		//setTimeout(() => this.nav(), 10000);
		
	}

    /*
    onSignIn(){
        this.updateChatServer()
        setTimeout(() => this.onNavigation(), 100);
    }
    */

	onNavigation(){
      let user = {
          _id: 1,
          name: this.state.user_hash,
          verified: false,
      }   
      //let local_channel = `#${this.topic}`     
	  this.props.navigator.push({
			 id: 'lobby',
             params: {
                server: this.chat_server,
                user: user,
                topic: "room:lobby",
                channel_tabs:['Local', 'You'],
                muteInputToolbar: true,
        }
             
		});
	}
    
    onChange(user_hash){
        this.setState({user_hash:user_hash})
    }

    handleFormFocus(e, component){
    //console.log(e, component);
    }

    /*
    onUserTag(e){
        const newText = e.nativeEvent.text;
        this.setState((previousState) => {
            return {
                user_hash: newText,
            };
            }); 
        }

     onPickName(user_hash){
        this.setState({user_hash: user_hash})
    }
    */

     onSend(slides=[], event="new:location"){       
        const server = this.chat_server
        const channel = server.lobby()
        server.send(channel, slides, event)

    }

    
    sendLocation(){
        const navigator = this.props.navigator
        const onSend = this.onSend
        navigator.geolocation.getCurrentPosition(
            (position) => {
              onSend({
                location: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                },
              });
            },
            (error) => console.log("location error: ", error.message),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
          );
    }
    

    generateUserName(){
        let sampler = Math.random
        //let wp = new WP()
        //let wp_adj = wp.randAdjective({count: 1}, (word)=> {return word})
        
        let sample = (words) => words[Math.floor(sampler()*words.length)]
        let uppercaseFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1)
        let removeSpaces = (word) => word.replace(/\s+/, "")

        title = sample(titles)
        adjective = sample(adjectives)
        encouraging_word = sample(encouraging_words)

        animal = sample(animals)
        fruit = sample(fruits)
         noun = sample(nouns)
        //pokemon = sample(pokemons)
        //dinosaur = sample(dinosaurs)
    
        let firstName = [title, adjective]
        let lastName = [animal, fruit, noun]
        let prefix = removeSpaces(sample(firstName))
        let suffix = removeSpaces(sample(lastName))
        user_hash = uppercaseFirstLetter(prefix) + uppercaseFirstLetter(suffix)
        //console.log(user_hash)
        return user_hash
        

    }

    renderSignInBar() {
     const title = 'Sign in'
    const rightButton = "ios-cloud-upload-outline"
    const onPress = this.onNavigation
    let user_hash = this.state.user_hash

    const myIcon = (icon_name) => {return (<IconI name={icon_name} 
            size={25} color={palette.icon_color} />)}
    
   /*
    <Composer
                style={composer.textInput}
                placeholder={'user_hash'}
                onChange={(e) => this.onChange(e)}
                text={user_hash} 
            />
   */
    return (
        <View style={styles.signWrapper}>
            
            <TextInput
                ref="title1"
                 style={styles.signTextInput}
                 onChange={(e) => this.onChange(e)}
                 value={user_hash}
                 />
            <TouchableOpacity 
                style={styles.iconContainer} 
                onPress={onPress}>
                {myIcon(rightButton)}
                <Text style={styles.titleText}> 
                {title} 
                </Text> 
            </TouchableOpacity>
        </View>
    );
  }
   

    renderPickName(){
        let indices = [1,2,3]

        let button_text = (text) => {
            return (
                <Text style={styles.titleText}>
                    {text}
                </Text>
            )
        }

        let name = (index) => {
            const button = this.generateUserName()
            return(
            <TouchableOpacity 
                key={index}
                style={styles.iconContainer} 
                onPress={() => this.onChange(button)}>           
                
                {button_text(button)}      
            </TouchableOpacity>
            )
        }
        
        let names = indices.map((index) => name(index))

    return(
       
            <ScrollView 
                keyboardShouldPersistTaps={true} 
                style={styles.scrollWrapper}
             >
                <View>
                {names}
                </View>
            </ScrollView>
        
     
    )
        

    }

    renderUserName(){
        const validateUserName = (value)=>{

            if(value == '') return "Required";
            //Initial state is null/undefined
            if(!value) return true;
            // Check if User Name is AlphaNumeric
            let regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
            let match_alpha = value.match(regExp) 
            if (match_alpha != null) {
                return "UserName needs to be alphanumeric";
            }
            return true;
          }
        user_hash = this.state.user_hash
        const form = (
            <ScrollView 
                keyboardShouldPersistTaps={true} 
                style={styles.scrollWrapper}
                >
                <Form
                    ref='userForm'
                    style={styles.form}
                    onFocus={this.handleFormFocus.bind(this)}
                    onChange={this.onChange.bind(this)}
                    label="Login Info">
                <InputField
                ref='user_name'
                placeholder={user_hash}
                validationFunction={[validateUserName]}
                />

            </Form>
            {this.renderSignInBar()}
                
            
            </ScrollView> 
        )

        return (
            <View style={styles.right_wrapper}>
                <Text style={styles.h1}>Select UserHash as identity </Text>
                <View> 
                    {this.renderPickName()}
                    {form}
                </View>
            </View>
        )      

    }
    
    renderCustomSlideContainer(){
        /*
        {this.renderUserName()}
                    
        */
        return (
            
            <View style ={styles.container}>
                <View style={styles.left_wrapper}>
                      <Text style={styles.h1}> Pingal</Text>
                     <Text style={styles.text}> AI chat for local web</Text> 
                              
                </View>
                <View style={styles.wrapper2}>
                     
                    <View style={styles.right_wrapper}>
                        <Text style={styles.h1}>Select Screen Tag</Text>
                        <View> 
                            {this.renderPickName()}
                            {this.renderSignInBar()}
                        </View>
                     </View>           
                </View>
                
			</View>
            
        )

    }

	render() {
        //renderInputToolbar={() => {}}
        /*
            
        
        if (!this.chat_server) {
            this.chat_server = connectChatServer()
        }
        */
        const navigator = this.props.navigator
		return (
             <Screen 
                server={this.chat_server}
                user={this.user}
                topic={this.topic} 
                renderCustomSlideContainer={this.renderCustomSlideContainer}
                muteInputToolbar={true}
                navigator={navigator}
                
            />
        )
	}


}	