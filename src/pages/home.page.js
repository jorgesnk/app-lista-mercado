import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
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
import {useNavigation, StackActions} from '@react-navigation/native';

const HomePage = () => {
  const [houses, setHouses] = useState([]);
  const [showLoad, setShowLoad] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const getHouses = async () => {
    setShowLoad(true);
    try {
      const storage = await AsyncStorage.getItem('user');
      const storageData = JSON.parse(storage);
      const request = await requestModule.axios.get('/house', {
        headers: {Authorization: `Bearer ${storageData.token}`},
      });
      setHouses(request.data.data.houses);
      setShowLoad(false);
    } catch (e) {
      toastAndroidModule.show('Ocorreu um erro');
      setShowLoad(false);
    }
  };

  useEffect(() => {
    getHouses();
  }, []);

  const navigate = useNavigation();
  const schemaValidate = Yup.object().shape({
    name: Yup.string().required().min(3),
  });
  const [houseData, setHouseData] = useState({name: ''});
  const [fromErros, setFormErros] = useState({name: false});
  const [validForm, setValidForm] = useState(true);
  const formValidator = new FormsValidator(
    houseData,
    schemaValidate,
    setFormErros,
    fromErros,
    setValidForm,
  );

  const setHouse = (value, name) => {
    const data = houseData;
    data[name] = value;
    setHouseData({...data});
    formValidator.validateData(name, data);
    formValidator.validateForm(data);
  };
  const createHouse = async () => {
    setViewModal(false);
    setShowLoad(true);
    try {
      const storage = await AsyncStorage.getItem('user');
      const storageData = JSON.parse(storage);

      const request = await requestModule.axios.post('/house', houseData, {
        headers: {Authorization: `Bearer ${storageData.token}`},
      });
      const localHouse = houses;
      localHouse.push({...request.data.data, name: houseData.name});
      setHouse('', 'name');
      setShowLoad(false);
    } catch (_e) {
      setHouse('', 'name');
      setShowLoad(false);
      toastAndroidModule.show('Erro ao cadastrar');
    }
  };
  const selectHouse = async (id) => {
    try {
      setShowLoad(true);
      const storage = await AsyncStorage.getItem('user');
      const storageData = JSON.parse(storage);
      const getLevel = await requestModule.axios.get(
        `/house/users/level/${id}`,
        {headers: {Authorization: `Bearer ${storageData.token}`}},
      );
      await AsyncStorage.setItem('house', id);
      await AsyncStorage.setItem('level', getLevel.data.data.level);
      setShowLoad(false);
      navigate.dispatch(StackActions.replace('members'));
    } catch (_e) {
      setShowLoad(false);
      toastAndroidModule.show('Ocorreu um erro');
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getHouses();
      setRefreshing(false);
    } catch (_e) {}
    setRefreshing(false);
  };

  return (
    <>
      <HeaderComponent text="Casas" showMenu={false} />
      <ScrollComponent
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <ContainerBaseComponent>
          <ModalInputComponent
            onRequestClose={() => setViewModal(false)}
            disabled={validForm}
            visible={viewModal}
            onCancel={() => {
              setViewModal(false);
            }}
            onConfirm={createHouse}
            title="Cadastrar">
            <InputSquareComponent
              placeholder=""
              label="Nome"
              error={fromErros.name}
              onChangeText={(text) => setHouse(text, 'name')}
              value={houseData.name}
              onEndEditing={() => formValidator.validateData('name')}
              errorMessage="mínimo 3 caracteres"
            />
          </ModalInputComponent>

          {houses.length > 0 ? (
            <Text style={styles.houseListTitle}>Selecione uma casa</Text>
          ) : (
            <Text style={styles.emptyHouses}>Adicione uma casa</Text>
          )}
          {houses.map((element) => (
            <TouchableOpacity
              key={element._id}
              onPress={() => selectHouse(element._id)}>
              <View style={styles.houseList}>
                <Text style={styles.houseListText}>{element.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ContainerBaseComponent>
        <LoadingComponent visible={showLoad} />
      </ScrollComponent>
      <FloatButtonComponent onPress={() => setViewModal(true)} />
    </>
  );
};
const styles = StyleSheet.create({
  houseList: {
    borderBottomWidth: 1,
    marginLeft: 10,
    borderColor: StyleBase.fonts.lightGray,
    borderStyle: 'solid',
  },
  houseListText: {
    paddingBottom: 6,
    paddingTop: 8,
    color: StyleBase.colors.primary,
    fontSize: 18,
    marginBottom: 2,
  },
  houseListTitle: {
    marginLeft: 10,
    marginBottom: 0,
    fontSize: 15,
    color: StyleBase.fonts.darkGray,
  },
  emptyHouses: {
    textAlign: 'center',
    marginTop: '60%',
    color: StyleBase.fonts.darkGray,
    fontSize: 15,
  },
});

export default HomePage;
