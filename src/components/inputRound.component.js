import React from 'react';
import {TextInput, StyleSheet, View, Text} from 'react-native';
import {StyleBase} from '../config/styleBase';

const InputRoundComponent = (props) => {
  return (
    <View style={styles.textInputTemplate}>
      <Text
        style={{
          ...styles.TextInputLabel,
          ...(props.error === true && styles.errorLabel),
        }}>
        {props.label}
      </Text>
      <TextInput
        error={props.error}
        style={{
          ...styles.textInput,
          ...(props.error === true && styles.errorInput),
        }}
        placeholder={props.placeholder ? props.placeholder : ''}
        value={props.value}
        keyboardType={props.keyboardType}
        secureTextEntry={props.secureTextEntry}
        autoCapitalize={props.autoCapitalize ? props.autoCapitalize : 'none'}
        onChangeText={props.onChangeText}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        onSelectionChange={props.onSelectionChange}
        onEndEditing={props.onEndEditing}
      />
      {props.error && (
        <Text style={styles.errorMessage}>{props.errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderColor: StyleBase.colors.primary,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 11,
    padding: 2,
    paddingLeft: 10,
  },
  textInputTemplate: {
    flexDirection: 'column',
  },
  TextInputLabel: {
    color: StyleBase.colors.primary,
    marginLeft: 8,
    marginBottom: 3,
    fontSize: 15,
  },
  errorInput: {
    borderColor: StyleBase.colors.error,
  },
  errorLabel: {
    color: StyleBase.colors.error,
  },
  errorMessage: {
    marginTop: -0.1,
    marginLeft: 5,
    color: StyleBase.colors.error,
    fontSize: 10,
  },
});
export default InputRoundComponent;
