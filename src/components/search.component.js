import React from 'react';
import {TextInput, StyleSheet, View} from 'react-native';
import {StyleBase} from '../config/styleBase';
import Icon from 'react-native-vector-icons/MaterialIcons';
const SearchComponent = ({
  error,
  value,
  autoCapitalize,
  onChangeText,
  onSelectionChange,
  editable,
  onEndEditing,
  placeholder,
}) => {
  return (
    <View style={styles.textInputTemplate}>
      <TextInput
        error={error}
        style={styles.textInput}
        value={value}
        placeholder={placeholder}
        autoCapitalize={autoCapitalize ? autoCapitalize : 'none'}
        onChangeText={onChangeText}
        onSelectionChange={onSelectionChange}
        onEndEditing={onEndEditing}
        editable={editable}
      />
      <Icon name="search" style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    color: '#000',
    flex: 1,
    fontSize: 15,
    margin: 0,
    padding: 0,
  },
  textInputTemplate: {
    flexDirection: 'row',
    borderColor: StyleBase.fonts.darkGray,
    borderWidth: 0.5,
    borderStyle: 'solid',
    marginLeft: 0,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    borderRadius: 5,
  },
  icon: {
    fontSize: 20,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginRight: 5,
    color: StyleBase.fonts.darkGray,
  },
});
export default SearchComponent;
