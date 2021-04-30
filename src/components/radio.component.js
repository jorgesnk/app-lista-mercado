import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StyleBase} from '../config/styleBase';
// check-bold

const RadioComponent = ({onPress, value}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{...styles.base, ...(value === true && styles.selectedBorder)}}>
        {value === true && (
          <Icon
            style={styles.icon}
            name="check"
            color={StyleBase.colors.success}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderStyle: 'solid',
    alignContent: 'center',
    borderColor: StyleBase.fonts.lightGray,
    borderRadius: 5,
    minWidth: 24,
    minHeight: 24,
  },
  icon: {fontSize: 21},
  selectedBorder: {
    borderColor: StyleBase.colors.success,
  },
});
export default RadioComponent;
