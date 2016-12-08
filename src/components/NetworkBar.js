import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';

import styles from '../styles/NetworkBar.js'
import Icon from 'react-native-vector-icons/FontAwesome';
import IconI from 'react-native-vector-icons/Ionicons';

export default class NetworkBar extends Component {
renderNetworkBar(){
        return   (
            <View style={{
                    flexDirection:'row',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginLeft: 8,
                    marginRight: 0,
                     }}>
                <View style={{
                    flexDirection: 'row',
                    borderRadius: 15,
                    backgroundColor: '#f0f0f0',
                    marginRight: 60,
                    width:150,
                    }}>
                    <TouchableOpacity 
                        style={{flex:1}}
                        onPress={() => {
                        this.props.navigator.push({
                        id: 'add'
                        })
                    }}                    
                    >
                        <Icon name="flash" style={{ margin:20,
                             marginLeft:0, alignSelf:'center'
                            }} size={30} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{flex: 1, }} 
                        onPress={() => {
                            this.props.navigator.push({id: 'login'})
                        }}>
                        <IconI name="ios-ribbon" style={{margin:20, alignSelf:'center'}} size={30} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

        )

    }
    
   render() {
    const onLoadEarlier = this.props.onLoadEarlier
    /*
    return (

    <View style={styles.container}>
      <TouchableOpacity
        style={styles.wrapper}
          onPress={() => {
                this.props.navigator.push({
                id: 'add'
                })
            }}
      >
        <View>
          <Text style={styles.text}>
            Network
          </Text>
          <IconI name="ios-add-circle-outline" size={20} color="black" />
         </View>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.wrapper }
            onPress={() => {
                this.props.navigator.push({
                id: 'login'
                })
            }}
           >
         <View>
          <Text style={styles.text}>
            Login
          </Text>
         </View>
       </TouchableOpacity>
     </View>
    );
    */
    return (
        <View>
        {this.renderNetworkBar()}
        </View>
    )
  }
}


NetworkBar.defaultProps = {
  onLogin: () => {},
  onAdd: () => {},
};
