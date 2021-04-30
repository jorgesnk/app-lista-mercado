import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {StyleBase} from '../config/styleBase';
import Icon from 'react-native-vector-icons/MaterialIcons';
const SelectInputComponent = ({onPress, error, label, value, errorMessage}) => {
  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.base}>
          <View style={styles.textLabelContainer}>
            <Text
              style={{
                ...styles.TextLabel,
                ...(error === true && styles.errorLabel),
              }}>
              {label}
            </Text>
          </View>
          <View
            style={{
              ...styles.textInput,
              ...(error === true && styles.errorInput),
            }}>
            <Text style={styles.valueText}>{value}</Text>
            {error === true ? (
              <Icon
                name="arrow-drop-down"
                style={styles.icon}
                color={StyleBase.colors.error}
              />
            ) : (
              <Icon
                name="arrow-drop-down"
                style={styles.icon}
                color={StyleBase.colors.primary}
              />
            )}
          </View>
          {error && <Text style={styles.errorMessage}>{errorMessage}</Text>}
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  base: {flexDirection: 'column'},
  textLabelContainer: {
    marginBottom: -8,
    alignSelf: 'flex-start',
    zIndex: 2,
    marginLeft: 7,
    backgroundColor: StyleBase.colors.backGround,
  },
  TextLabel: {
    color: StyleBase.colors.primary,
    fontSize: 15,
  },
  errorLabel: {
    color: StyleBase.colors.error,
  },
  textInput: {
    borderColor: StyleBase.colors.primary,
    borderWidth: 0.5,
    borderStyle: 'solid',
    marginLeft: 0,
    paddingLeft: 5,
    paddingBottom: 1,
    paddingTop: 1,
    borderRadius: 5,
    flexDirection: 'row',
  },
  errorInput: {
    borderColor: StyleBase.colors.error,
  },
  errorMessage: {
    marginTop: -0.1,
    marginLeft: 2,
    color: StyleBase.colors.error,
    fontSize: 10,
  },
  valueText: {
    fontSize: 15,
    color: StyleBase.fonts.darkGray,
    paddingBottom: 5,
    paddingTop: 5,
  },
  icon: {
    fontSize: 18,
    paddingBottom: 5,
    paddingTop: 7,
    marginLeft: 'auto',
    marginRight: 10,
  },
});

export default SelectInputComponent;
