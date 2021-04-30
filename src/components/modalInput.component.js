import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import LinkButtonComponent from './linkButton.component';
import {StyleBase} from '../config/styleBase';

const ModalInputComponent = ({
  children,
  visible,
  title,
  onConfirm,
  onCancel,
  disabled,
  hideAction,
  onRequestClose,
  textConfirm,
  textCancel,
}) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={onRequestClose}>
        <View style={styles.centeredView}>
          <TouchableOpacity style={styles.exModal} onPress={onRequestClose} />
          <View style={styles.modalView}>
            <Text style={styles.title}>{title}</Text>
            <ScrollView>{children}</ScrollView>
            {!hideAction && (
              <View style={styles.actionContainer}>
                <LinkButtonComponent
                  style={{
                    ...styles.linkConfirm,
                    ...(disabled && styles.linkConfirmDisable),
                  }}
                  disabled={disabled}
                  text={textConfirm ? textConfirm : 'Confirmar'}
                  onPress={onConfirm}
                />
                <LinkButtonComponent
                  style={styles.linkCancel}
                  onPress={onCancel}
                  text={textCancel ? textCancel : 'Cancelar'}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ededed99',
  },
  modalView: {
    marginTop: '55%',
    maxHeight: 400,
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 25,
  },
  title: {textAlign: 'left', fontSize: 20, marginBottom: 10},
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
    marginTop: 15,
  },
  linkConfirm: {color: StyleBase.colors.primary, marginRight: 5},
  linkConfirmDisable: {color: StyleBase.fonts.darkGray, marginRight: 5},
  linkCancel: {color: StyleBase.colors.error, marginLeft: 2},
  exModal: {width: '100%', height: '100%', position: 'absolute'},
});

export default ModalInputComponent;
