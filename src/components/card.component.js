import React from 'react';
import {View, StyleSheet} from 'react-native';
import {StyleBase} from '../config/styleBase';
const CardComponent = ({style, children}) => {
  return <View style={{...styles.card, ...style}}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: StyleBase.colors.backGround,
    margin: 10,
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,

    elevation: 21,
  },
});

export default CardComponent;
