import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  ScrollView
} from 'react-native';

//import styles from '../styles/LoadEarlier.js'
import iconfontConf from '../lib/iconfontConf'
import CustomNavBar from './CustomNavBar.js'
import { Form,
  Separator,InputField, LinkField,
  SwitchField, PickerField,DatePickerField,TimePickerField
} from 'react-native-form-generator';

export default class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: '',
      errorMessage: '',
      formData:{},
    }
    this.onLogin = this.onLogin.bind(this)
  }

  handleFormChange(formData){
    this.setState({formData:formData})
    this.props.onFormChange && this.props.onFormChange(formData);
  }

  handleFormFocus(e, component){
    //console.log(e, component);
  }

  onLogin(){
    if (this.state.username.trim().length == 0) {
      this.setState({
        username: '',
        errorMessage: 'Please enter user nickname'
      });
      return;
    }
    let regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
    if (regExp.test(this.state.username)) {
      this.setState({
        username: '',
        errorMessage: 'Please only alphanumeric characters.'
      });
      return;
    }
    console.log(`username: ${this.state.username}`)
    // alert(this.state.username)
  }

  renderNavBar() {
    const onSend = this.props.onSend
    const leftButton = "ios-arrow-dropleft"
    const onLeftPress = () => this.props.navigator.pop()
    const title = 'Sign up'
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

  render() {
    
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
    const validatePhoneNumber = (value) =>{
      return true;
    }
    
    const autoLogin = this.props.autoLogin
    const onLogin = this.onLogin
    
    if (autoLogin) {
      return <View/>;
    }
    const loginForm = (
      <ScrollView 
        keyboardShouldPersistTaps={true} 
        style={{paddingLeft:10,paddingRight:10, height:200}}>
       {this.renderNavBar()}
      <Form
        ref='LoginForm'
        onFocus={this.handleFormFocus.bind(this)}
        onChange={this.handleFormChange.bind(this)}
        label="Login Info">
        <InputField
          ref='user_name'
          placeholder='User Name'
          validationFunction={[validateUserName]}
          />
        <InputField
          ref='phone_number'
          placeholder='Phone Name'
          validationFunction={[validatePhoneNumber]}
          />

        <InputField
          ref='avatar'
          placeholder='Avatar'
          />

      </Form>
      <Text>{JSON.stringify(this.state.formData)}</Text>
      </ScrollView>
   
    );

    return (
      <ScrollView 
        keyboardShouldPersistTaps={true} 
        style={{height:200}}>
       {this.renderNavBar()}
      <Form
        ref='LoginForm'
        onFocus={this.handleFormFocus.bind(this)}
        onChange={this.handleFormChange.bind(this)}
        label="Login Info">
        <InputField
          ref='user_name'
          placeholder='User Name'
          validationFunction={[validateUserName]}
          />
        <InputField
          ref='phone_number'
          placeholder='Phone Name'
          validationFunction={[validatePhoneNumber]}
          />

        <InputField
          ref='avatar'
          placeholder='Avatar'
          />

      </Form>
      <Text>{JSON.stringify(this.state.formData)}</Text>
      </ScrollView>
   
    );

  }
}



Login.defaultProps = {
  autoLogin: false,
  loginButtonText: 'Login',
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  iconContainer: {
    flex: 3,

  },
  signinContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    width: 250,
    color: '#555555',
    padding: 10,
    height: 50,
    borderColor: '#32C5E6',
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  errorLabel: {
    color: '#c7b0ff',
    fontSize: 15,
    marginTop: 10,
    width: 250
  },
  icon: {
    width: 200,
    height: 53
  }
});
