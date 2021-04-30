import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import HeaderComponent from '../components/header.component';
import ScrollComponent from '../components/scroll.component';
import ContainerBaseComponent from '../components/containerBase.component';
import requestModule from '../modules/request.module';
import toastAndroidModule from '../modules/toastAndroid.module';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingComponent from '../components/loading.component';
import {StyleBase} from '../config/styleBase';
import ModalInputComponent from '../components/modalInput.component';
import InputSquareComponent from '../components/inputSquare.component';
import * as Yup from 'yup';
import {FormsValidator} from '../modules/formsValidator.module';
import FloatButtonComponent from '../components/floatButton.component';
import LinkButtonComponent from '../components/linkButton.component';

const MembersPage = () => {
  const [users, setUsers] = useState([]);
  const [showLoad, setShowLoad] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [viewUserModal, setViewUserModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState({});
  const [token, setToken] = useState('');
  const [houseId, setHouseId] = useState('');
  const [viewConfirm, setViewConfirm] = useState(false);
  const getHouse = async () => {
    setShowLoad(true);
    try {
      const storageUser = await AsyncStorage.getItem('user');
      const storageData = JSON.parse(storageUser);
      setToken(storageData.token);
      const storageHouse = await AsyncStorage.getItem('house');
      setHouseId(storageHouse);
      const storageLevel = await AsyncStorage.getItem('level');
      setIsAdmin(storageLevel === 'ADMIN');
      setEmail(storageData.email);
      const request = await requestModule.axios.get(`/house/${storageHouse}`, {
        headers: {Authorization: `Bearer ${storageData.token}`},
      });
      setUsers(request.data.data.house.users);
      setShowLoad(false);
    } catch (e) {
      toastAndroidModule.show('Ocorreu um erro');
      setShowLoad(false);
    }
  };

  useEffect(() => {
    getHouse();
  }, []);

  const schemaValidate = Yup.object().shape({
    email: Yup.string().required().email(),
  });
  const [userData, setUserData] = useState({email: ''});
  const [fromErros, setFormErros] = useState({email: false});
  const [validForm, setValidForm] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const formValidator = new FormsValidator(
    userData,
    schemaValidate,
    setFormErros,
    fromErros,
    setValidForm,
  );

  const ModalUser = () => {
    return (
      <ModalInputComponent
        visible={viewUserModal}
        hideAction={true}
        title="Usuário"
        onRequestClose={() => setViewUserModal(false)}>
        {selectedUser.level === 'ADMIN' ? (
          <LinkButtonComponent
            style={styles.modalUserInputAction}
            text="Remover acesso de administrador"
            onPress={removeAdmin}
          />
        ) : (
          <LinkButtonComponent
            style={styles.modalUserInputAction}
            text="Definir com administrador"
            onPress={addAdmin}
          />
        )}
        <LinkButtonComponent
          style={styles.modalUserInputActionRemove}
          text="Remover usuário do grupo"
          onPress={confirmRemove}
        />
        <LinkButtonComponent
          text="Sair"
          style={styles.modalUserInputExit}
          onPress={() => setViewUserModal(false)}
        />
      </ModalInputComponent>
    );
  };

  const setUser = (value, name) => {
    const data = userData;
    data[name] = value;
    setUserData({...data});
    formValidator.validateData(name, data);
    formValidator.validateForm(data);
  };

  const addUser = async () => {
    setViewModal(false);
    setShowLoad(true);
    try {
      const storage = await AsyncStorage.getItem('user');
      const storageData = JSON.parse(storage);
      const storageHouse = await AsyncStorage.getItem('house');
      await requestModule.axios.put(
        `/house/users/add/${storageHouse}`,
        {users: [userData.email]},
        {
          headers: {Authorization: `Bearer ${storageData.token}`},
        },
      );
      setUser('', 'email');
      setShowLoad(false);
      getHouse();
    } catch (_e) {
      setUser('', 'email');
      setShowLoad(false);
      toastAndroidModule.show('Erro ao cadastrar');
    }
  };
  const selectUser = async (user) => {
    setViewUserModal(true);
    setSelectedUser(user);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getHouse();
      setRefreshing(false);
    } catch (_e) {}
    setRefreshing(false);
  };
  const addAdmin = async () => {
    setShowLoad(true);
    setViewUserModal(false);
    try {
      await requestModule.axios.put(
        `/house/users/add/admin/${houseId}`,
        {
          user: selectedUser._id._id,
        },
        {headers: {Authorization: `Bearer ${token}`}},
      );
      await getHouse();
    } catch (e) {
      setShowLoad(false);
      toastAndroidModule.show('Ocorreu um erro');
    }
  };
  const removeAdmin = async () => {
    setShowLoad(true);
    setViewUserModal(false);
    try {
      await requestModule.axios.put(
        `/house/users/remove/admin/${houseId}`,
        {
          user: selectedUser._id._id,
        },
        {headers: {Authorization: `Bearer ${token}`}},
      );
      await getHouse();
    } catch (e) {
      setShowLoad(false);
      toastAndroidModule.show('Ocorreu um erro');
    }
  };

  const removeUser = async () => {
    setShowLoad(true);
    setViewConfirm(false);
    try {
      await requestModule.axios.put(
        `/house/users/remove/${houseId}`,
        {
          users: [selectedUser._id._id],
        },
        {headers: {Authorization: `Bearer ${token}`}},
      );
      await getHouse();
    } catch (e) {
      setShowLoad(false);
      toastAndroidModule.show('Ocorreu um erro');
    }
  };

  const confirmRemove = () => {
    setViewUserModal(false);
    setViewConfirm(true);
  };
  return (
    <>
      <HeaderComponent text="Membros" showMenu={true} />
      <ScrollComponent
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <ContainerBaseComponent>
          <ModalInputComponent
            disabled={validForm}
            visible={viewModal}
            onRequestClose={() => setViewModal(false)}
            onCancel={() => {
              setViewModal(false);
            }}
            onConfirm={addUser}
            title="Cadastrar">
            <InputSquareComponent
              placeholder="exemplo@exemplo.com"
              label="Email"
              keyboardType="email-address"
              error={fromErros.email}
              onChangeText={(text) => setUser(text, 'email')}
              value={userData.email}
              onEndEditing={() => formValidator.validateData('email')}
              errorMessage="email invalido"
            />
          </ModalInputComponent>
          <ModalUser />
          <Text style={styles.houseListTitle}>Usuários</Text>
          {users.map((element) => (
            <TouchableOpacity
              disabled={!isAdmin || email === element._id.email}
              key={element._id._id}
              onPress={() => selectUser(element)}>
              <View style={styles.houseListContainer}>
                <View style={styles.houseList}>
                  <Text style={styles.houseListText}>{element._id.name}</Text>
                  <Text style={styles.houseListTextEmail}>
                    {element._id.email}
                  </Text>
                </View>
                <View style={styles.houseListButtons}>
                  <Text style={styles.textAdmin}>
                    {element.level === 'ADMIN' && 'Administrador'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ContainerBaseComponent>
        <ModalInputComponent
          visible={viewConfirm}
          onRequestClose={() => setViewConfirm(false)}
          onConfirm={removeUser}
          onCancel={() => setViewConfirm(false)}
          title="Deletar">
          <Text style={styles.removeText}>deseja deletar esse usuario?</Text>
        </ModalInputComponent>
        <LoadingComponent visible={showLoad} />
      </ScrollComponent>
      {isAdmin === true && (
        <FloatButtonComponent onPress={() => setViewModal(true)} />
      )}
    </>
  );
};
const styles = StyleSheet.create({
  houseList: {
    marginTop: 5,
  },
  houseListButtons: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 3,
  },
  houseListText: {
    paddingBottom: 0,
    color: StyleBase.colors.primary,
    fontSize: 19,
    marginBottom: 0,
  },
  houseListTextEmail: {
    paddingBottom: 0,
    paddingTop: 0,
    color: StyleBase.fonts.darkGray,
    fontSize: 12,
    marginBottom: 0,
    marginTop: 2,
  },
  houseListTitle: {
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 15,
    color: StyleBase.fonts.darkGray,
  },
  houseListContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginLeft: 10,
    borderColor: StyleBase.fonts.lightGray,
    borderStyle: 'solid',
    justifyContent: 'space-between',
  },
  textAdmin: {
    marginRight: 15,
    color: StyleBase.fonts.darkGray,
    fontSize: 12,
  },
  modalUserInputExit: {
    color: StyleBase.colors.primary,
    textAlign: 'right',
    marginRight: 10,
  },
  modalUserInputAction: {
    color: StyleBase.fonts.darkGray,
    fontSize: 15,
    marginBottom: 5,
  },
  modalUserInputActionRemove: {
    color: StyleBase.colors.error,
    fontSize: 15,
    marginBottom: 5,
  },
  removeText: {color: StyleBase.fonts.darkGray},
});

export default MembersPage;
