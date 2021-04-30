import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StyleBase} from '../config/styleBase';
const ButtonBadgeComponent = ({selected, onPress, text}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          ...styles.container,
          ...(selected === false && styles.unselected),
        }}>
        <Text
          style={{
            ...styles.text,
            ...(selected === false && styles.unselected),
          }}>
          {text}
        </Text>
        <Icon
          name="shopping-cart"
          style={{...styles.icon, ...(selected === false && styles.unselected)}}
        />
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: StyleBase.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 'auto',
    marginTop: 'auto',
    fontSize: 15,
    color: StyleBase.colors.primary,
  },
  text: {
    marginBottom: 'auto',
    marginTop: 'auto',
    fontSize: 15,
    color: StyleBase.colors.primary,
  },
  unselected: {
    borderColor: StyleBase.fonts.darkGray,
    color: StyleBase.fonts.darkGray,
  },
});

export default ButtonBadgeComponent;
