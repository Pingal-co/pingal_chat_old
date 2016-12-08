import React, { Component } from 'react';
import {
  View, 
  Text
} from 'react-native';
import Icon from  'react-native-vector-icons/MaterialIcons';

export default class CheckBoxField extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const label = this.props.label
    const checked = this.props.checked
    let iconName = checked ? 'check-box' : 'check-box-outline-blank';
    let color = this.props.color || '#000';
    let onCheckBoxPressed = this.props.onCheckBoxPressed
    let checkbox = (
        <Icon.Button
        name={iconName}
        backgroundColor='rgba(0,0,0,0)'
        color={color}
        underlayColor='rgba(0,0,0,0)'
        size={20}
        iconStyle={{marginLeft: -10, marginRight: 0}}
        activeOpacity={1}
        borderRadius={5}
        onPress={onCheckBoxPressed}
      >
      </Icon.Button>
    )
    return (
      
     <View style={{flexDirection: 'row', alignItems: 'center'}}>
          
          <Text style={{paddingLeft: 10,
    paddingRight: 10,fontSize:18}}>{label}</Text>
          {checkbox}
      </View>
    );
  }
}


CheckBoxField.defaultProps = {
  onCheckBoxPressed: () => {},
  label: '',
  checked: false,
};