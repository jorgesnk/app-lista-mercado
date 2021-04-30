import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {StyleBase} from '../config/styleBase';
const LinkButtonComponent = ({style, text, onPress, disabled}) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <Text style={{...styles.label, ...style}}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  label: {
    color: StyleBase.colors.primary,
    fontSize: 18,
  },
});

export default LinkButtonComponent;
