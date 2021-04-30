import React from 'react';
import {TouchableHighlight, StyleSheet} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {StyleBase} from '../config/styleBase';
const FloatButtonComponent = ({onPress}) => {
  return (
    <TouchableHighlight style={styles.container} onPress={onPress}>
      <Icons name="add" style={styles.icon} color="#000" />
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: StyleBase.colors.primary,
    borderRadius: 60,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    flex: 1,
    bottom: 25,
    right: 15,
  },
  icon: {
    fontSize: 40,
    color: '#fff',
  },
});
export default FloatButtonComponent;
