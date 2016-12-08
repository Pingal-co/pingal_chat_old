import React, {Component} from 'react'

import {
    View,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from 'react-native'

import Camera from 'react-native-camera'
import Icon from 'react-native-vector-icons/FontAwesome';
import IconI from 'react-native-vector-icons/Ionicons';

import {camera as styles} from '../styles/styles.js'

export default class MyCamera extends Component{
    constructor(props){
        super(props)
        this.state = {
            captureStyle:{margin:15, alignSelf:'center', width:55, height:55},
            captureType: Camera.constants.Type.back,
            flashmode: Camera.constants.FlashMode.off
        }
    }
    renderTopBar(){
        return (
            <View>
                <View style={{
                    flexDirection:'row',
                    height:90,
                    justifyContent:'space-between',
                }}>
                    <TouchableHighlight style={{flex:1}}>
                        <Icon name="flash" style={{
                            margin:20, marginLeft:0, alignSelf:'center'
                            }} size={30} color="#fff" />
                    </TouchableHighlight>
                    <TouchableHighlight style={{flex: 1, }} 
                        onPress={() => {
                            this.props.navigator.push({id: 'Login'})
                        }}>
                        <IconI name="ios-ribbon" style={{margin:20, alignSelf:'center'}} size={30} color="#fff" />
                    </TouchableHighlight>
                    <TouchableHighlight>
                        <IconI name="ios-reverse-camera-outline" style={{margin:20, alignSelf:'center'}} size={35} color="#fff"/>
                    </TouchableHighlight>
                </View>
            </View>

        )

    }
    renderBottomBar(){
        return (
            <View style={{
                    flexDirection:'row', 
                    height:90, 
                    justifyContent:'space-between'
                }}>
                
                 <TouchableOpacity 
                    style={{flex: 1,}} 
                    onPress={() => this.captureImage()} >
                      <Icon name="camera" style ={{margin:30, alignSelf:'center'}} size={32} color="#fff" />
                
                </TouchableOpacity>
                <TouchableOpacity
                    style={{flex: 1,}} 
                    onPress = {()=>{this.props.navigator.replace({
                        id: 'mailto'
                    })}}
                >
                    <Icon name="bars" style ={{margin:30, alignSelf:'center'}} size={32} color="#fff" />
                </TouchableOpacity>

            </View>
        )

    }

    render(){
        /*
     
            
        */
     
     return(
        <View style={styles.container}>
            <Camera
                ref={(cam) => {this.camera = cam}}
                style={styles.preview}
                aspect={Camera.constants.Aspect.fill}
                type={this.state.captureType}
                flashmode={this.state.flashmode}
            >
            {this.renderBottomBar()} 
            <View style={{flex:1, justifyContent:'space-between'}}>
                <View style={{backgroundColor:'#333', alignSelf:'center', justifyContent:'center', padding:10}}>
                    <Text style={{color:'#fff'}}>Camera Background Works on Device</Text>
                </View> 
                        
            </View>
            </Camera>
           
        </View>
     )

    }

    takePicture(){
        this.setState({
            captureStyle:{margin:17, alignSelf:'center', width:50, height:50}
        })
 
    }

    captureImage(){
        
        this.camera.capture()
        .then((data) => console.log(data))
        .catch(err => console.error(err));

        this.setState({
            captureStyle:{margin:15, alignSelf:'center', width:55, height:55}
        });
    }
}

/*
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});
*/