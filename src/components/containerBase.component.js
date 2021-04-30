import React from 'react';
import {View, StyleSheet} from 'react-native';
import {StyleBase} from '../config/styleBase';

const ContainerBaseComponent = (props) => {
  return <View style={styles.base} children={props.children} />;
};

const styles = StyleSheet.create({
  base: {
    paddingTop: 15,
    flexDirection: 'column',
    paddingBottom: 20,
    flex: 1,
    backgroundColor: StyleBase.colors.backGround,
  },
});

export default ContainerBaseComponent;
