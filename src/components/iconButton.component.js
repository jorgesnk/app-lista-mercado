import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableHighlight} from 'react-native';

const IconButtonComponent = ({iconName, iconColor, onPress, style}) => {
  return (
    <TouchableHighlight onPress={onPress}>
      <Icon style={style} name={iconName} color={iconColor} />
    </TouchableHighlight>
  );
};

export default IconButtonComponent;
