import React from 'react';
import {Modal, Text, StyleSheet, View, ActivityIndicator} from 'react-native';
import {StyleBase} from '../config/styleBase';

const LoadingComponent = (props) => {
  return (
    <Modal animated="fade" transparent={true} visible={props.visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalLoad}>
            <ActivityIndicator size="large" color={StyleBase.colors.primary} />
            <Text style={styles.textLoad}>carregando...</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modalView: {
    backgroundColor: '#443F3F90',
    padding: 10,
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  modalLoad: {
    borderRadius: 6,
    backgroundColor: StyleBase.fonts.light,
    padding: 15,
    marginTop: 'auto',
    marginBottom: 'auto',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  textLoad: {
    marginTop: 10,
  },
});

export default LoadingComponent;
