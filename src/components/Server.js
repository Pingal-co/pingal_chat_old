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


import { Form, 
    Separator,InputField, LinkField,
    SwitchField, PickerField
} from 'react-native-form-generator';
import iconfontConf from '../lib/iconfontConf'
import CustomNavBar from './CustomNavBar.js'
import {slide_maker as styles, palette, icon as icon_style} from '../styles/styles.js'
import Composer from './Composer';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import Screen from './Screen';


export default class Server extends Component{
     /*
        - Server (e.g. community, database, web_domain, file_drive)
            - Keys : [name, group]
            - Bots: invite friends via email,
        - Channel (e.g. room, table, page, folder, spreadsheet)
            - Keys : [name]. Keys for learning relations (e.g. joins, links)
            - when: [never or secret, ]
            - Bots : invite friends, (other web_services or actions)
        - Data Slide (e.g. message, row, form, file)
            - Keys: [where, who and when: [address], 
            - when: [never or secret]
        
        Discard features for now: 
            - keys_Channel: [group/team]
            - when_Slide: [always, @time, @location, @phrase, never, $bid]
            - when_Channels: [$bid, expiry]
            - Bots: - Linked Data slides or programs with if-then-else (decision trees or flat groups like sessions)
            - Each data slide (e.g. ) can have elements (e.g. data_columns)
          */

    constructor(props){     
        super(props)     
        this.state = {
            server_name: '',
            server_typename: '' ,
            channel_name: '',
            server_type: '',
            mute: true,

        }
        this.renderTopbar = this.renderTopbar.bind(this)
        this.renderSlideContainer = this.renderSlideContainer.bind(this);
        this.renderInputToolbar = this.renderInputToolbar.bind(this)
        
        this.renderServerName = this.renderServerName.bind(this)
        this.renderServerType = this.renderServerType.bind(this)
        this.renderServerProperties = this.renderServerProperties.bind(this)
        this.renderServerTypeName = this.renderServerTypeName.bind(this)
            
    }
    
    onSend(){
        const server = this.props.server
        const lobby = this.props.lobby
        let slides = [{
             server_name: this.state.server_name,
             server_group: this.state.server_group ,
             channel_name: this.state.channel_name,
        }]
        const action="new:network"
         server.send(lobby, slides, action)

    }
    
    onServerName(e){
    const newText = e.nativeEvent.text;
    this.setState((previousState) => {
        return {
            server_name: newText,
        };
        }); 
    console.log(`server_name :${this.state.server_name}`)
 
    }

    onServerTypeName(e){
     const newText = e.nativeEvent.text;
    this.setState((previousState) => {
        return {
            server_typename: newText,
        };
    }); 
    console.log(`server_group :${this.state.server_typename}`)
 
   }
   onServerType(value){
    //const newText = e.nativeEvent.text;
    this.setState((previousState) => {
        return {
            server_type: value,
            mute: false
        };
        }); 
    //console.log(`channel_name :${this.state.channel_name}`)
 
    }
    handleFormChange(formData){
        this.setState({formData: formData})
        this.props.onFormChange && this.props.onFormChange(formData);
      
    }
    handleFormFocus(e, component){

    }
    renderServerProperties() {
    return (
      <View style={styles.toolbar}>
        <Text style={[styles.toolText, {marginTop: 8}]}> Select Server Group: </Text>
        {this.renderButton({tool: 'secret', icon: 'lock', text: "Secret"})}
        {this.renderButton({tool: 'sponsored', icon: 'credit-card', text: "Sponsored"})}
        {this.renderButton({tool: 'time', icon: 'clock-o', text: "Time"})}        
      </View>
    )
  }

 renderButton(props) {
    let icon=props.icon
    let tool=props.tool
    let text=props.text

    const myIcon = (icon) => {return (<FontIcon name={icon} size={15} color={palette.icon_color} />)}
        if(this.enableTool(tool)) {
            return (

                <TouchableOpacity
                  style={styles.tool}
                  onPress = {() => onServerGroup(tool)}
                > 
                      {myIcon(icon)}
                      <Text style={styles.toolText}>
                        {text}
                      </Text>
                </TouchableOpacity>
            )
        }
  }

  enableTool(tool) {
      let list = this.props.enableTools
      return ~list.trim().indexOf(tool)
  }

  renderForm(){
      const validateNetworkName = (value)=>{

            if(value == '') return "Required";
            //Initial state is null/undefined
            if(!value) return true;
            // Check if User Name is AlphaNumeric
            let regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
            let match_alpha = value.match(regExp) 
            if (match_alpha != null) {
                return "Server Name needs to be alphanumeric";
            }
            return true;
          }

      const MyForm = (<Form
        ref='AddServer'
        onFocus={this.handleFormFocus.bind(this)}
        onChange={this.handleFormChange.bind(this)}
        label="Server Info">
         <Separator/>
          <Text> Add a Server </Text>
        <InputField
          ref='server_name'
          placeholder='Server Name'
          validationFunction={[validateNetworkName]}
          />   
          <InputField
          ref='server_type'
          placeholder='Server Type'
          validationFunction={[validateNetworkName]}
          />
          <Separator/>
          <Text> Add a Channel </Text>
        <InputField
          ref='channel_name'
          placeholder='Channel Name'
          validationFunction={[validateNetworkName]}
          />
        <Separator/>
          <Text> Invite Friends </Text>
         
        
      </Form>)
      return (
        <ScrollView 
        keyboardShouldPersistTaps={true} 
        style={{height:200}}>
       {this.renderNavBar()}
       {MyForm}
       </ScrollView> 
      )
  }
    
  renderServerName(){
    return (
        <Composer
        placeholder={'Broadcast your thought'}
        placeholderTextColor={palette.right_slide_text_color}
  
        onChange={(e) => this.onServerName(e)}
        text={this.state.server_name} />

     
    )
  }
  renderServerTypeName(){
    return (
        <Composer
        placeholder={`Name of ${this.state.server_type}`}
        placeholderTextColor={palette.right_slide_text_color}
  
        onChange={(e) => this.onServerTypeName(e)}
        text={this.state.server_typename} />

     
    )
  }
  renderServerType(){
       // For people :
       // []
       /*
         return (
        <Composer
        placeholder={'Channel Name'}
        onChange={(e) => this.onChannelName(e)}
        text={this.state.channel_name} />
        )
       */
      const list = [
          {'type': 'cowatch', 'icon': 'eye', 'description': 'co-watch'}, 
          {'type': 'colisten', 'icon': 'headphones', 'description': 'co-listen'}, 
          {'type': 'activity', 'icon': 'bicycle', 'description': 'activity'}, 
          {'type': 'book', 'icon': 'book', 'description': 'book'}, 
          {'type': 'sport', 'icon': 'soccer-ball-o', 'description': 'sport'},
          {'type': 'passion', 'icon': 'coffee', 'description': 'passion'},
          {'type': 'interest', 'icon': 'cutlery', 'description': 'interest'},
          {'type': 'fashion', 'icon': 'photo', 'description': 'fashion'},
          {'type': 'classifieds', 'icon': 'money', 'description': 'classifieds'},
          {'type': 'identity', 'icon': 'female', 'description': "identity"},
          {'type': 'life-stage', 'icon': 'child', 'description': 'life stage'},
          {'type': 'profession', 'icon': 'briefcase', 'description': 'profession'}, 
          {'type': 'institution', 'icon': 'institution', 'description': 'organization'}, 
          {'type': 'discipline', 'icon': 'bookmark', 'description': 'discipline'},
          {'type': 'class', 'icon': 'graduation-cap', 'description': 'class'},
          {'type': 'club', 'icon': 'camera-retro', 'description': 'club'},
          {'type': 'cause', 'icon': 'paw', 'description':  'cause'},
          {'type': 'situation', 'icon': 'street-view', 'description': "situation"},
          {'type': 'diagnosis', 'icon': 'heartbeat', 'description': 'diagnosis'},
          {'type': 'language', 'icon': 'language', 'description': 'language'},
          {'type': 'city', 'icon': 'home', 'description': 'city'},
          {'type': 'culture', 'icon': 'group', 'description': 'culture'}, 
          {'type': 'custom' , 'icon': 'plus', 'description': 'other'}]
      let ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
      let dataSource = ds.cloneWithRows(list)

      return (
        <ListView contentContainerStyle={styles.listWrapper}
          dataSource={dataSource}
          renderRow={(rowData) =>
            <TouchableOpacity onPress={() => this.onServerType(rowData.type)}>
            
              <View style={[styles.rowWrapper]}>
                <FontIcon name={rowData.icon} style={[styles.rowIcon]} size={15} color={palette.icon_color2} />
                <Text style={[styles.rowText]}> {rowData.description}</Text>
              </View>

            </TouchableOpacity>
          }
        />

      )
    

   
  }

  
  renderTopbar() {
    /*
    leftButton: "arrow-left",
      onLeftPress: () => this.props.navigator.pop(),
    */
    const topbarProps = {
      
      rightButton: "cloud-upload",
      onRightPress: this.props.onSend,
      channel_tabs: ['Thought Bot'],
      ...this.props
    }

    return (
      <CustomNavBar {...topbarProps} />

    );
  }

  renderSlideContainer() {
      // {this.renderNavBar()}
      /*
       <View style={styles.mailto}>
        {this.renderServerName()} 
        </View> 
      <View style={styles.primary}>
            {this.renderServerProperties()}
        </View>
          <View style={styles.secondary}>
          <Text> Invite Friends </Text>
        </View>
      */
    return (
      <View style={styles.container}>
         <View style={styles.mailto}>
        {this.renderServerName()} 
        </View> 
        <View> 
            <Text style={styles.listH3}> Bot: magically team people by my thought in</Text>         
             {this.renderServerType()}
        </View>
         
        
      </View>
    );
  }

  renderInputToolbar() {
      return(
      <View style={styles.mailto}>
        {this.renderServerTypeName()}
        </View> 
      )
  }
  render(){
      const navigator = this.props.navigator
      const user = this.props.route.params.user 
      const topic = this.props.route.params.topic
      const channel_tabs = ['Chat Server']
      const chat_server = this.props.route.params.server
    
		return (
             <Screen 
                server={chat_server}
                user={user}
                topic={topic} 
                renderCustomSlideContainer={this.renderSlideContainer}
                renderCustomTopbar={this.renderTopbar}
                navigator={navigator}
                channel_tabs = {channel_tabs}
                muteInputToolbar={this.state.mute}
                renderCustomInputToolbar={this.renderServerTypeName}
                
            />
        )

  }
}

Server.defaultProps = {
  enableTools: 'album, camera, secret, sponsored, time',
};