import React, { Component, PropTypes } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {action as styles} from '../styles/styles.js'

export default class Actions extends Component {
  constructor(props) {
    super(props);
    this.onActionsPress = this.onActionsPress.bind(this);
  }

  onActionsPress() {
    const options = this.props.options
    const optionKeys = Object.keys(options);
    const cancelButtonIndex = optionKeys.length - 1;
    const actionSheet = this.context.actionSheet()

    actionSheet.showActionSheetWithOptions({
      optionKeys,
      cancelButtonIndex,
    },
    (buttonIndex) => {
      let i = 0;
      for (let key in options) {
        if (options.hasOwnProperty(key)) {
          if (buttonIndex === i) {
            options[key](this.props);
            return;
          }
          i++;
        }
      }
    });
  }

  renderIcon() {
    if (this.props.icon) {
      return this.props.icon();
    }
    return (
      <View style={styles.wrapper}>
        <Text style={styles.iconText}>
          +
        </Text>
      </View>
    );
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.onActionsPress}
      >
        {this.renderIcon()}
      </TouchableOpacity>
    );
  }
}

Actions.contextTypes = {
  actionSheet: PropTypes.func,
};

Actions.defaultProps = {
  onSend: () => {},
  options: {},
  icon: null,
};
