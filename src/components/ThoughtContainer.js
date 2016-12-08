import React, { Component, PropTypes } from 'react';

import InvertibleScrollView from 'react-native-invertible-scroll-view';

import {
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  ListView
} from 'react-native';
import Composer from './Composer';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import t from 'tcomb-form-native'
// user name generator
import {fruits, titles, adjectives, nouns, encouraging_words, animals} from '../data/names.js'
// device info
import DeviceInfo from 'react-native-device-info'
//styles
import {thought as styles, palette, formStylesheet} from '../styles/styles.js'

export default class ThoughtContainer extends Component {
    constructor(props) {
        super(props);
        this.category = this.props.category_type
        this.state = {
            value: {},
            location:{},
        }
        this.state.value[this.category] = this.category
        this.state.value['user_hash'] = ''
        

        this.onSend = this.onSend.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onGenerateUser = this.onGenerateUser.bind(this)    
        this.generateUserName = this.generateUserName.bind(this)
        this.addLocation = this.addLocation.bind(this)
       
    }

   componentWillMount(){
       //console.log("Device Unique ID", DeviceInfo.getUniqueID());
    }

    
    onChange(value){
        this.setState({value})
    }

    scrollTo(options) {
        this._scrollViewRef.scrollTo(options);
    }

    onGenerateUser(){
        let value = this.state.value
        value['user_hash'] = this.generateUserName()
        this.onChange(value)
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

    renderForm(){
        let Form = t.form.Form;
        let category = this.props.category_type
        let thought_obj={}
        thought_obj[category] = t.String
        // thought_obj['user_hash'] = t.String
        let Thought = t.struct(thought_obj);
        
        
        const options = {
        fields: {
            name: {
            stylesheet: formStylesheet // overriding the style of the textbox
            }
        }
        };  
         
        this.addLocation()

        return (
            <View style={styles.formContainer}>
              <View>
                <Text style={styles.listH3}>  Create ChatBot ... </Text>            
          
                {this.renderCategoryType()}
               </View>
               <View>

                <Text style={styles.listH3}>  Host a talk channel on ... </Text>            
           
                <Form
                    ref="form"
                    type={Thought}
                    options={options}
                    value={this.state.value}
                    onChange={this.onChange}
                    />
                </View>
                {this.renderButtons()}
            </View>
        )
    }

    onSend(){
        let slide={}
        
        let data = this.refs.form.getValue()
        slide['user_hash'] = data['user_hash']
        for (prop in data) {
            if (prop === this.props.category_type) {
                slide['category'] = prop
                slide['thought'] = data[prop]
            }
        }
        // get location
        slide['location'] = this.state.location
        slide['device_info'] = this.props.device_info

        console.log(data)
        console.log(slide)
        this.props.onSend([slide])
    }

     addLocation(){
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let location = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                }
                this.setState({location})
            },
            (error) => {
                console.log("Error in getting native location: trying by ip .. ", error.message)
                // ios only allows https : http need to enabled manually
                // http://ip-api.com/json
                fetch('https://geoip.nekudo.com/api/')
                    .then((response) => {
                        if (response.status >= 200 && response.status < 300) {
                        return response;
                        } else {
                            let e = new Error(response.statusText);
                            e.response = response;
                            throw e;
                        }
                    })
                    .then((response) => {
                     let location = response.json()
                     console.log("location based on ip", location)
                    })
                    .catch((e) => console.log("Error in fetching location by ip ",e))
            },
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
          );
    }

    renderButtons(){

        const list = [
            // {'type': 'undo', 'icon': 'undo', 'description': ''},    
           //  {'type': 'user', 'icon': 'at', 'description': 'hash'},    
             {'type': 'ping', 'icon': 'mars-double', 'description': 'PingAl local people'},
            
        ]
       
        let ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(list)

        return (
            <ListView contentContainerStyle={styles.listWrapper}
            dataSource={dataSource}
            initialListSize={list.length}
            renderRow={(rowData) =>
                <TouchableHighlight
                    underlayColor={palette.left_wrapper_background_color}
                    onPress={() => {
                        (rowData.type === "undo") ?
                            this.props.onCategoryType("") 
                        :
                        (rowData.type === "user") ?
                            this.onGenerateUser()
                        :
                            this.onSend()
                    }}>
                
                <View style={[styles.rowWrapper]}>
                    <FontIcon name={rowData.icon} style={[styles.rowIcon]} size={15} color={palette.icon_color2} />
                    <Text style={[styles.rowText]}> {rowData.description}</Text>
                </View>

                </TouchableHighlight>
            }
            />
        )
    }

    renderCategoryType(){
       /*
      const list = [
          {'type': 'cowatching', 'icon': 'eye', 'description': 'co-watching'}, 
          {'type': 'colistening', 'icon': 'headphones', 'description': 'co-listening'}, 
          {'type': 'book', 'icon': 'book', 'description': 'book'},
          {'type': 'sports', 'icon': 'futbol-o', 'description': 'sports'},
          {'type': 'game', 'icon': 'gamepad', 'description': 'game'},
          {'type': 'activity', 'icon': 'bicycle', 'description': 'activity'}, 
          {'type': 'passion', 'icon': 'coffee', 'description': 'passion'},
          {'type': 'fashion', 'icon': 'photo', 'description': 'fashion'},    
          {'type': 'shop', 'icon': 'shopping-cart', 'description': 'shop'},
          {'type': 'service', 'icon': 'gears', 'description': "service"},
          {'type': 'travel', 'icon': 'plane', 'description': "travel"},
          {'type': 'identity', 'icon': 'female', 'description': "identity"},
          {'type': 'life-stage', 'icon': 'child', 'description': 'life stage'},
          {'type': 'profession', 'icon': 'briefcase', 'description': 'profession'}, 
          {'type': 'organization', 'icon': 'institution', 'description': 'organization'}, 
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
     */
      const list = [
          {'type': 'IamA', 'icon': 'group', 'description': 'I am A ...'},
         {'type': 'TodayILearned', 'icon': 'book', 'description': 'Today I learned ...'},
          {'type': 'TodayI', 'icon': 'paw', 'description': 'Today I ...'},
          {'type': 'Gaming', 'icon': 'gamepad', 'description': 'Gaming ...'},
          {'type': 'Passion', 'icon': 'coffee', 'description': 'Passion ... '},
          {'type': 'Skill', 'icon': 'photo', 'description': 'Skills ...'},
          {'type': 'Health', 'icon': 'heartbeat', 'description': 'Health ...'},
          {'type': 'Traders', 'icon': 'shopping-cart', 'description': 'Trading ...'},
      ]
      let ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
      let dataSource = ds.cloneWithRows(list)

      return (
        <ListView contentContainerStyle={styles.listWrapper}
          dataSource={dataSource}
          initialListSize={list.length}
          renderRow={(rowData) =>
            <TouchableHighlight
                underlayColor={palette.left_wrapper_background_color}
                onPress={() => {this.props.onCategoryType(rowData.type)}}>
            
              <View style={[styles.rowWrapper]}>
                <FontIcon name={rowData.icon} style={[styles.rowIcon]} size={15} color={palette.icon_color2} />
                <Text style={[styles.rowText]}> {rowData.description}</Text>
              </View>

            </TouchableHighlight>
          }
        />
      )
    }

    renderChannelName(){
        return (
            <Composer
            placeholder={'Ping your thought'}
            placeholderTextColor={palette.right_slide_text_color}
    
            onChange={(e) => this.props.onChannelName(e)}
            text={this.props.channel_name} />

        
        )
    }


    renderSlideContainer() {
        /*
        <View style={styles.pingto}>
            {this.renderChannelName()} 
            </View> 
        */
        let category_type = this.props.category_type
        /*
        let slide = (category_type.length > 0) ?          
                this.renderForm() 
            : 
            <View>
                <Text style={styles.listH3}> Thinking about ...</Text>            
               
                {this.renderCategoryType()}
                this.renderForm()
            </View>
        */
         let slide = 
            <View>
                <Text style={styles.listH3}> Thinking about ...</Text>            
               
                {this.renderCategoryType()}
                this.renderForm()
            </View>
            
        return (
        <View style={styles.container}>
            {this.renderForm()}
        </View>
        );
    }

    render() {
        const scrollViewProps = this.props.scrollViewProps
        
        return (
        <ScrollView
            {...scrollViewProps}
            ref={component => this._scrollViewRef = component}
        >
            {this.renderSlideContainer()}
            
        </ScrollView>
        );
  }
}

ThoughtContainer.defaultProps = {
  onCategoryType: () => {},
  onChannelName: ()=> {},
  channel_name:'',
};
