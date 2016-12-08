import React, { Component } from 'react';
import {
  TextInput,
  ScrollView, 
  Text, 
  Platform,
  View,
} from 'react-native';

import styles from '../styles/MailTo.js'
import {palette} from '../styles/styles.js'

import Composer from './Composer';
import CustomNavBar from './CustomNavBar.js'
import { Form,
  Separator,InputField, LinkField,
  SwitchField, PickerField,DatePickerField,TimePickerField
} from 'react-native-form-generator';
import CheckBoxField from './CheckBox'

export default class MailTo extends Component {
 constructor(props){
    super(props)
    this.state = {
      formData:{}
    }
   }
  
  handleFormChange(formData){
    this.setState({formData:formData})
    this.props.onFormChange && this.props.onFormChange(formData);
  }

  renderNavBar() {
    const onSend = this.props.onSend
    const leftButton = "ios-arrow-dropleft"
    const onLeftPress = () => this.props.navigator.pop()
    const title = 'Make a Slide'
    const rightButton = "ios-cloud-upload-outline"
    const onRightPress = this.onLogin


    return (
      <CustomNavBar
        leftButton={leftButton}
        onLeftPress={onLeftPress}
        title={title}
        rightButton={rightButton}
        onRightPress={onRightPress}
      >
      </CustomNavBar>

    );
  }

  renderMailTo(){
    const mailto = this.props.mailto
    const mailtoplaceholder = this.props.mailtoplaceholder
    const placeholderTextColor = this.props.placeholderTextColor
    const onMailTo = this.props.onMailTo
    const multiline = this.props.multiline
    const textInputProps = this.props.textInputProps
    
    return (
      <TextInput
        placeholder={mailtoplaceholder}
        placeholderTextColor={placeholderTextColor}
        multiline={multiline}
        onChange={onMailTo}
        style={styles.textInput}
        value={mailto}
        enablesReturnKeyAutomatically={true}
        underlineColorAndroid="transparent"
        {...textInputProps}
      />
    );

  }

  renderComposer() {

    return (
      <Composer 
          onChange={this.handleFormChange.bind(this)}
          composerHeight = {Platform.select({
              ios: 99,
              android: 123,
            })}
          placeholder = 'Write text ...'
          
      {...this.props} />
    );
  }

  renderForm(){
    return (
      <Form
        ref='MailForm'
        onChange={this.handleFormChange.bind(this)}
        label="Mail Info">
        <InputField
          label= 'Address'
          ref='address'
          placeholder='Channel@Server'
          />
        <InputField
          ref='text'
          placeholder='Write text'
          />
        
        <SwitchField 
          label='Private'
          ref="is_private"
          />
          <SwitchField 
          label='Sponsored'
          ref="is_sponsored"
          />
       
      </Form>

    )

  }
  render1() {
    return (
          <ScrollView 
        keyboardShouldPersistTaps={true} 
        style={{height:200}}>
       {this.renderNavBar()}
       {this.renderForm()}
      <Text>Data: {JSON.stringify(this.state.formData)}</Text>
      </ScrollView>
   

    );
  }
    render() {
    return (
        <View>
        {this.renderMailTo}
        </View>
   

    );
  }
}


MailTo.defaultProps = {
  onMailTo: () => {},
  mailto: '',
  multiline: false,
  mailtoplaceholder: 'Address: channel@network',
  placeholderTextColor: palette.text_color,
  textInputProps: null,
  style: styles.textInput
          
};
