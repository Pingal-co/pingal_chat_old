import React, { Component } from 'react';

import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  ListView
} from 'react-native';

import CustomNavBar from './CustomNavBar.js'
import Composer from './Composer';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import Screen from './Screen';
import CustomChannel from './CustomChannel';

import Send from './Send';
import ChatServer from '../components/ChatServer';

import {thought as styles, palette} from '../styles/styles.js'

import {DB} from './DataModel'
// device info
import DeviceInfo from 'react-native-device-info'

const DEFAULT_USER = "pingal"

export default class Thought extends Component{
    constructor(props){     
        super(props)     
        this.state = {
            channel_name: '',
            channel_category: '' ,
            category_type: '',
            channel_properties: this.props.channel_properties,

        }

        this.chat_server = ChatServer()
        this.topic = 'thought:lobby'
        this.user = {
            _id: 1, // sent messages should have same user._id
            name: DEFAULT_USER, // hash
            deviceid: '', 
            avatar:'',
            email: '',
        }
        
          
        // bind send and receive
        this.onSend = this.onSend.bind(this)
        this.onReceive = this.onReceive.bind(this)
        this.onNavigation = this.onNavigation.bind(this)
        
        this.lobby = this.chat_server.lobby(this.topic, this.onReceive.bind(this))
     
        
        // bind actions
        this.onChannelName = this.onChannelName.bind(this)
        this.onChannelCategory = this.onChannelCategory.bind(this)
        this.onCategoryType = this.onCategoryType.bind(this)
        this.onChannelProperties = this.onChannelProperties.bind(this)

        // bind views
        //this.renderTopbar = this.renderTopbar.bind(this)
        //this.renderSlideContainer = this.renderSlideContainer.bind(this);
        //this.renderInputToolbar = this.renderInputToolbar.bind(this)
        
        //this.renderChannelName = this.renderChannelName.bind(this)
       // this.renderChannelCategory = this.renderChannelCategory.bind(this)
       // this.renderCategoryType = this.renderCategoryType.bind(this)
       // this.renderChannelProperties = this.renderChannelProperties.bind(this)
        //this.renderPing = this.renderPing.bind(this)
    }

    componentWillMount(){

        /*
         if device exists in db,
            get_user_from_device_id
            set user : postgres_id, device_id (user_name), current_user_hash, avatar, email, verified 
        
        */
        let uid = DeviceInfo.getUniqueID()
        this.device_info = {
            unique_id: uid,
            brand: DeviceInfo.getBrand(),
            name: DeviceInfo.getDeviceName(),
            user_agent: DeviceInfo.getUserAgent(),
            locale: DeviceInfo.getDeviceLocale(),
            country: DeviceInfo.getDeviceCountry(),
        }

        DB.device.add(this.device_info)

        DB.user.find().then(resp => this.setState({user: resp}))
        DB.user.find({
            where: {deviceid: uid},
            limit: 1
         }
        ).then(resp => this.setUser(resp))


    }

    componentDidMount(){
        this.setSlides()
    }
    
    setUser(user) {
        this.user = user
    }

    getUser(){
        return this.user
    }

    onDebug(){
       console.log("Device Unique ID", DeviceInfo.getUniqueID());
       console.log("Device Manufacturer", DeviceInfo.getManufacturer());
       console.log("Device Brand", DeviceInfo.getBrand());
       console.log("Device Model", DeviceInfo.getModel());
       console.log("Device ID", DeviceInfo.getDeviceId());  
       console.log("System Name", DeviceInfo.getSystemName());
       console.log("System Version", DeviceInfo.getSystemVersion());  // e.g. 9.0
       console.log("Bundle ID", DeviceInfo.getBundleId());
       console.log("Build Number", DeviceInfo.getBuildNumber());  // e.g. 89
       console.log("App Version", DeviceInfo.getVersion());  
       console.log("App Version (Readable)", DeviceInfo.getReadableVersion());  // e.g. 1.1.0.89

       console.log("Device Name", DeviceInfo.getDeviceName());  // e.g. Becca's iPhone 6

        console.log("User Agent", DeviceInfo.getUserAgent()); // e.g. Dalvik/2.1.0 (Linux; U; Android 5.1; Google Nexus 4 - 5.1.0 - API 22 - 768x1280 Build/LMY47D)

        console.log("Device Locale", DeviceInfo.getDeviceLocale()); // e.g en-US

        console.log("Device Country", DeviceInfo.getDeviceCountry()); // e.g US

        //console.log("Timezone", DeviceInfo.getTimezone()); // e.g America/Mexico_City

        //console.log("App Instance ID", DeviceInfo.getInstanceID()); // ANDROID ONLY - see https://developers.google.com/instance-id/
  
    }
    onSend(slides=[]){
        const event="add:thought"
        console.log('send to chat server')
        this.chat_server.send(this.lobby, slides, event)
    }

    setSlides(){
        this._slides = {
             channel_name: this.state.channel_name,
             channel_category: this.state.channel_category ,
             category_type: this.state.category_type,
             channel_properties: this.state.channel_properties,

        }
    }

     getSlides() {
        //console.log(`slides: ${this._slides}`)
        return this._slides;
    }

    onReceive(message){
        //ChatServer(user.name)
        //.then(this.onNavigation({server: _, ...params}))
        //
        console.log("received")
        console.log(message)
        let topic_id = `room:${message.params.room_id}` 
        let topic = message.params.room_name 
        let user = message.user
        let body = message.body
        let server = ChatServer(user._id)
        // server: server,
        let params = {
                topic_id: topic_id,
                topic: topic,              
                user: user,
                channel_tabs: [topic],
                server: server,
                body: body
            }
       console.log(params)
       // add thought to db
       DB.thought.add({thought: message.body, category: this.state.category_type, topic: message.topic })
       // add user hash to db
       DB.hash.add({user: message.user._id, hash: message.user.name})
       // add user to db if user_id does not exists in db
       /*
       let u = DB.user.find({
                where: {_id: message.user._id},
                limit: 1
        })
        */
        DB.user.add({user: message.user._id, hash: message.user.name, params: message.user})



       // Navigate to the right chat_lobby
       this.onNavigation(params)
          
    }

    onNavigation(params){
         this.props.navigator.push({
            id: 'lobby',
            params: params

        })        
    }

    onChannelName(event){
        const newText = event.nativeEvent.text;
        this.setState((previousState) => {
            return {
                channel_name: newText,
            };
        }); 
        console.log(`channel_name :${this.state.channel_name}`)   
    }

    onChannelCategory(event){
        const newText = event.nativeEvent.text;
        this.setState((previousState) => {
            return {
                channel_category: newText,
            };
        }); 
        console.log(`channel_category :${this.state.channel_category}`)
 
   }

   onCategoryType(value){
        this.setState((previousState) => {
            return {
                category_type: value,
            };
        }); 
        this.onChannelProperties({mute: false})
        console.log(`category_type :${this.state.category_type}`)
    
    }

    onChannelProperties(obj){
        this.setState((previousState) => {
            return {
                channel_properties: obj,
            };
        }); 
        console.log(`category_properties :${this.state.category_properties}`)   
    }



   
   
   renderChannelProperties(){
        return (
            <View/>
        )
    }



  

  

  render(){
      const navigator = this.props.navigator
      // renderCustomInputToolbar={this.renderInputToolbar}  

        return (
             <CustomChannel 
                user={this.user}
                navigator={navigator}
                muteInputToolbar={this.state.channel_properties.mute}
                onSend={this.onSend}
                onChannelName={this.onChannelName}
                onChannelCategory={this.onChannelCategory}
                onCategoryType={this.onCategoryType}
                onChannelProperties={this.onChannelProperties}
                slide={this.getSlides()}
                channel_name={this.state.channel_name}
                category_type={this.state.category_type}
                device_info={this.device_info}
            />
        )

  }


    
}

Thought.defaultProps = {
    channel_properties: {
        mute: false,
    } 
};