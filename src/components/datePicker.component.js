import React, {useState, useEffect} from 'react';
import {View, TouchableHighlight, Text, StyleSheet} from 'react-native';
import {StyleBase} from '../config/styleBase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
const DatePickerComponent = (props) => {
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState();
  const startDate = new Date().setFullYear(1994, 0, 1);
  const onChange = (value) => {
    setVisible(false);
    try {
      const formatted = moment(new Date(value.nativeEvent.timestamp)).format(
        'DD/MM/YYYY',
      );
      if (formatted === 'Invalid date') {
        setDate('Data invalida');
        props.emitValue('');

        return;
      }
      setDate(formatted);
      props.emitValue(formatted);
    } catch (e) {
      setDate('Data invalida');
      props.emitValue('');
    }
  };
  useEffect(() => {
    setDate(props.initialDate);
  }, [props.initialDate]);
  return (
    <>
      {visible && (
        <DateTimePicker
          onChange={onChange}
          value={startDate}
          mode="date"
          display="spinner"
          maximumDate={new Date()}
        />
      )}
      <TouchableHighlight onPress={() => setVisible(true)}>
        <View style={styles.base}>
          <View style={styles.textLabelContainer}>
            <Text
              style={{
                ...styles.TextLabel,
                ...(props.error === true && styles.errorLabel),
              }}>
              {props.label}
            </Text>
          </View>
          <View
            style={{
              ...styles.textInput,
              ...(props.error === true && styles.errorInput),
            }}>
            <Text style={styles.valueText}>{date}</Text>
            {props.error === true ? (
              <Icon
                name="date-range"
                style={styles.icon}
                color={StyleBase.colors.error}
              />
            ) : (
              <Icon
                name="date-range"
                style={styles.icon}
                color={StyleBase.colors.primary}
              />
            )}
          </View>
          {props.error && (
            <Text style={styles.errorMessage}>{props.errorMessage}</Text>
          )}
        </View>
      </TouchableHighlight>
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

export default DatePickerComponent;
