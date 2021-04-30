import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {StyleBase} from '../config/styleBase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MenuModalComponent from './menuModal.component';
import {useNavigation, StackActions} from '@react-navigation/native';

const HeaderComponent = (props) => {
  const [viewModal, setViewModal] = useState(false);
  const navigate = useNavigation();
  const showModal = (wait) => {
    if (wait === true) {
      setTimeout(() => {
        if (viewModal) {
          setViewModal(false);
          return;
        }
        setViewModal(true);
      }, 100);
      return;
    }
    if (viewModal) {
      setViewModal(false);
      return;
    }
    setViewModal(true);
  };
  return (
    <>
      <View style={styles.header}>
        {props.showMenu && (
          <TouchableOpacity onPress={() => showModal(true)}>
            <View style={styles.touchIcon}>
              <Icon name="menu" style={styles.menuIcon} />
            </View>
          </TouchableOpacity>
        )}
        {props.showBack && (
          <TouchableOpacity
            onPress={() => navigate.dispatch(StackActions.pop())}>
            <View style={styles.touchIcon}>
              <Icon name="arrow-back" style={styles.menuIcon} />
            </View>
          </TouchableOpacity>
        )}
        {props.showBackModal && (
          <TouchableOpacity onPress={() => props.backModal(null)}>
            <View style={styles.touchIcon}>
              <Icon name="arrow-back" style={styles.menuIcon} />
            </View>
          </TouchableOpacity>
        )}
        <Text style={styles.textHeader}>{props.text}</Text>
      </View>
      <MenuModalComponent visible={viewModal} action={showModal} />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: StyleBase.colors.primary,
    flexDirection: 'row',
    height: 55,
    padding: 5,
  },
  textHeader: {
    color: StyleBase.fonts.light,
    fontSize: 25,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  menuIcon: {
    color: StyleBase.fonts.light,
    fontSize: 25,
  },
  touchIcon: {
    marginTop: 'auto',
    marginBottom: 'auto',
    textAlign: 'center',
  },
});

export default HeaderComponent;
