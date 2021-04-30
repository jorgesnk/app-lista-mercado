import React from 'react';
import {TextInput, StyleSheet, View, Text} from 'react-native';
import {StyleBase} from '../config/styleBase';

const InputSquareComponent = (props) => {
  return (
    <View style={styles.textInputTemplate}>
      <View style={styles.textLabelContainer}>
        <Text
          style={{
            ...styles.TextInputLabel,
            ...(props.error === true && styles.errorLabel),
          }}>
          {props.label}
        </Text>
      </View>
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
        editable={props.editable}
      />

      <Text style={styles.errorMessage}>
        {props.error ? props.errorMessage : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderColor: StyleBase.colors.primary,
    borderWidth: 0.5,
    borderStyle: 'solid',
    marginLeft: 0,
    paddingLeft: 5,
    paddingBottom: 1,
    paddingTop: 1,
    borderRadius: 5,
    fontSize: 15,
  },
  textInputTemplate: {
    flexDirection: 'column',
  },
  textLabelContainer: {
    marginBottom: -8,
    alignSelf: 'flex-start',
    zIndex: 2,
    marginLeft: 7,
    backgroundColor: StyleBase.colors.backGround,
  },
  TextInputLabel: {
    color: StyleBase.colors.primary,
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
    marginLeft: 2,
    color: StyleBase.colors.error,
    fontSize: 10,
  },
});
export default InputSquareComponent;
