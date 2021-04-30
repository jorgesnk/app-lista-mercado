import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {StyleBase} from '../config/styleBase';

const ScrollComponent = ({children, refreshControl}) => {
  return (
    <ScrollView
      refreshControl={refreshControl}
      disableScrollViewPanResponder={true}
      snapToInterval={10}
      style={styles.base}>
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  base: {backgroundColor: StyleBase.colors.backGround, flex: 1},
});
export default ScrollComponent;
