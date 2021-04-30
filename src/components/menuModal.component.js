import React from 'react';
import {Modal, Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation, StackActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StyleBase} from '../config/styleBase';

const MenuModalComponent = (props) => {
  const navigate = useNavigation();
  const logOut = async () => {
    await AsyncStorage.clear();
    navigate.dispatch(StackActions.replace('login'));
  };
  const marketList = () => {
    navigate.dispatch(StackActions.replace('marketList'));
  };
  const members = () => {
    navigate.dispatch(StackActions.replace('members'));
  };
  const houses = () => {
    navigate.dispatch(StackActions.replace('home'));
  };
  const profile = () => {
    navigate.dispatch(StackActions.replace('profile'));
  };
  return (
    <Modal animated="fade" transparent={true} visible={props.visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={marketList}>
            <View style={styles.viewIconList}>
              <Icon
                style={styles.modalText}
                name="shopping-cart"
                color={StyleBase.colors.primary}
              />
              <Text style={{...styles.modalText, ...styles.textColor}}>
                Listas de mercado
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={members}>
            <View style={styles.viewIconList}>
              <Icon
                style={styles.modalText}
                name="people"
                color={StyleBase.colors.primary}
              />
              <Text style={{...styles.modalText, ...styles.textColor}}>
                Membros
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={houses}>
            <View style={styles.viewIconList}>
              <Icon
                style={styles.modalText}
                name="home"
                color={StyleBase.colors.primary}
              />
              <Text style={{...styles.modalText, ...styles.textColor}}>
                Casas
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={profile}>
            <View style={styles.viewIconList}>
              <Icon
                style={styles.modalText}
                name="person"
                color={StyleBase.colors.primary}
              />
              <Text style={{...styles.modalText, ...styles.textColor}}>
                Perfil
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={logOut}>
            <View style={styles.viewIconList}>
              <Icon
                style={styles.modalText}
                name="exit-to-app"
                color={StyleBase.colors.error}
              />
              <Text style={{...styles.modalText, ...styles.textColor}}>
                Sair
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={props.action} style={styles.viewExit}>
          <></>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flexDirection: 'row',
    height: '100%',
  },
  modalView: {
    backgroundColor: StyleBase.colors.backGround,
    alignItems: 'flex-start',
    shadowColor: '#000',
    flex: 0.65,
    height: '100%',
    paddingTop: 5,
  },
  modalText: {
    fontSize: 19,
    paddingLeft: 5,
    paddingTop: 10,
    paddingBottom: 2,
  },
  textColor: {
    color: StyleBase.fonts.darkGray,
  },
  viewExit: {
    flex: 0.3,
    height: '100%',
  },
  viewIconList: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginLeft: '2%',
    borderColor: StyleBase.fonts.lightGray,
    minWidth: '98%',
  },
});

export default MenuModalComponent;
