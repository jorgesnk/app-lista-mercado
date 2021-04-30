import React, {useState} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import HeaderComponent from '../components/header.component';
import ScrollComponent from '../components/scroll.component';
import ContainerBaseComponent from '../components/containerBase.component';
import {StyleBase} from '../config/styleBase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalInputComponent from '../components/modalInput.component';
import InputSquareComponent from '../components/inputSquare.component';

const SelectUnitModalPage = ({visible, onRequestClose}) => {
  const units = ['Kg', 'Uni', 'Mg', 'Cx', 'outros'];
  const [modalOther, setModalOthers] = useState(false);
  const [otherValue, setOtherValue] = useState('');
  const selectUnit = (unit) => {
    if (unit === 'outros') {
      setModalOthers(true);
      return;
    }
    onRequestClose(unit);
  };
  return (
    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="slide"
      transparent={true}>
      <HeaderComponent
        text="unidade"
        showBackModal={true}
        backModal={onRequestClose}
      />
      <ScrollComponent>
        <ContainerBaseComponent>
          <Text style={styles.houseListTitle}>Unidade de medida</Text>
          {units.map((element, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => selectUnit(element)}>
                <View style={styles.baseList}>
                  <Text style={styles.text}>{element}</Text>
                  <Icon style={styles.icon} name="keyboard-arrow-right" />
                </View>
              </TouchableOpacity>
            );
          })}
        </ContainerBaseComponent>
        <ModalInputComponent
          title="Outros"
          visible={modalOther}
          onConfirm={() => {
            setModalOthers(false);
            onRequestClose(otherValue);
          }}
          onRequestClose={() => {
            setModalOthers(false);
          }}
          onCancel={() => setModalOthers(false)}
          disabled={!otherValue.length > 0}>
          <InputSquareComponent
            label="unidade"
            error={false}
            value={otherValue}
            onChangeText={(value) => setOtherValue(value)}
          />
        </ModalInputComponent>
      </ScrollComponent>
    </Modal>
  );
};
const styles = StyleSheet.create({
  baseList: {
    borderBottomWidth: 1,
    marginLeft: 10,
    borderColor: StyleBase.fonts.lightGray,
    borderStyle: 'solid',
    flexDirection: 'row',
    paddingBottom: 5,
    paddingTop: 10,
  },
  houseListTitle: {
    marginLeft: 10,
    marginBottom: -5,
    fontSize: 15,
    color: StyleBase.fonts.darkGray,
  },
  icon: {
    fontSize: 18,
    marginLeft: 'auto',
    marginRight: 8,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  text: {
    marginBottom: 'auto',
    color: StyleBase.colors.primary,
    marginTop: 'auto',
    marginRight: 3,
    marginLeft: 2,
    fontSize: 15,
  },
});

export default SelectUnitModalPage;
