import React, {useState, useEffect} from 'react';
import {View, RefreshControl, StyleSheet, Text} from 'react-native';
import ScrollComponent from '../components/scroll.component';
import HeaderComponent from '../components/header.component';
import ContainerBaseComponent from '../components/containerBase.component';
import AsyncStorage from '@react-native-community/async-storage';
import requestModule from '../modules/request.module';
import toastAndroidModule from '../modules/toastAndroid.module';
import LoadingComponent from '../components/loading.component';
import {StyleBase} from '../config/styleBase';
import FloatButtonComponent from '../components/floatButton.component';
import ModalInputComponent from '../components/modalInput.component';
import InputSquareComponent from '../components/inputSquare.component';
import {FormsValidator} from '../modules/formsValidator.module';
import * as Yup from 'yup';
import IconButtonComponent from '../components/iconButton.component';
import LinkButtonComponent from '../components/linkButton.component';
import {useNavigation} from '@react-navigation/native';

const MarketListPage = () => {
  const [houseId, setHouseId] = useState('');
  const [token, setToken] = useState('');
  const [lists, setLists] = useState([]);
  const [showLoad, setShowLoad] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalAddHouse, setModalAddHouse] = useState(false);
  const [dataMarketList, setDataMarketList] = useState({name: ''});
  const [fromErros, setFormErros] = useState({name: false});
  const [validForm, setValidForm] = useState(true);
  const [modalRemove, setModalRemove] = useState(false);
  const [selectListDelete, setSelectListDelete] = useState({
    _id: '',
    index: null,
  });
  const schemaValidate = Yup.object().shape({
    name: Yup.string().required().min(3),
  });
  const navigate = useNavigation();
  const getMarketList = async () => {
    try {
      setShowLoad(true);
      const userStorage = await AsyncStorage.getItem('user');
      const storageHouse = await AsyncStorage.getItem('house');
      const localToken = JSON.parse(userStorage).token;
      setToken(localToken);
      setHouseId(storageHouse);
      const requestList = await requestModule.axios.get(
        `/marketList/${storageHouse}`,
        {
          headers: {Authorization: `Bearer ${localToken}`},
        },
      );
      setLists(requestList.data.data);
      setShowLoad(false);
    } catch (_e) {
      setShowLoad(false);
      toastAndroidModule.show('Ocorreu um erro');
    }
  };

  useEffect(() => {
    getMarketList();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getMarketList();
      setRefreshing(false);
    } catch (_e) {
      setRefreshing(false);
    }
  };

  const setMarketData = (value, name) => {
    const data = dataMarketList;
    data[name] = value;
    setDataMarketList({...data});
    formValidator.validateData(name, data);
    formValidator.validateForm(data);
  };

  const createMarketList = async () => {
    setModalAddHouse(false);
    setShowLoad(true);
    try {
      const requestCreate = await requestModule.axios.post(
        '/marketList',
        {
          house: houseId,
          products: [],
          name: dataMarketList.name,
        },
        {headers: {Authorization: `Bearer ${token}`}},
      );
      lists.push({_id: requestCreate.data.data._id, name: dataMarketList.name});
      setShowLoad(false);
      setDataMarketList({name: ''});
      setValidForm(true);
    } catch (e) {
      setShowLoad(false);
      setDataMarketList({name: ''});
      setValidForm(true);
      toastAndroidModule.show('Ocorreu um erro');
    }
  };

  const deleteList = async () => {
    setModalRemove(false);
    setShowLoad(true);
    const {_id: id, index} = selectListDelete;
    try {
      await requestModule.axios.delete(`/marketList/${houseId}/${id}`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      lists.splice(index, 1);
      setShowLoad(false);
    } catch (e) {
      setShowLoad(false);
      setDataMarketList({name: ''});
      setValidForm(true);
      toastAndroidModule.show('Ocorreu um erro');
    }
  };

  const selectList = (name, id) => {
    navigate.navigate('productsList', {name, id});
  };

  const formValidator = new FormsValidator(
    dataMarketList,
    schemaValidate,
    setFormErros,
    fromErros,
    setValidForm,
  );

  return (
    <>
      <HeaderComponent text="Lista de mercado" showMenu={true} />
      <ScrollComponent
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <ContainerBaseComponent>
          <Text style={styles.houseListTitle}>Listas</Text>

          {lists.map((element, index) => (
            <View key={element._id} style={styles.baseList}>
              <LinkButtonComponent
                style={styles.listText}
                text={element.name}
                onPress={() => selectList(element.name, element._id)}
              />
              <View style={styles.iconContainer}>
                <IconButtonComponent
                  iconName="delete"
                  iconColor={StyleBase.colors.error}
                  style={styles.iconButton}
                  // onPress={() => deleteList(element._id, index)}
                  onPress={() => {
                    setSelectListDelete({_id: element._id, index});
                    setModalRemove(true);
                  }}
                />
              </View>
            </View>
          ))}
          <LoadingComponent visible={showLoad} />
          <ModalInputComponent
            visible={modalAddHouse}
            title="Adicionar"
            onRequestClose={() => setModalAddHouse(false)}
            onCancel={() => setModalAddHouse(false)}
            disabled={validForm}
            onConfirm={createMarketList}>
            <InputSquareComponent
              placeholder=""
              label="Nome"
              error={fromErros.name}
              onChangeText={(text) => setMarketData(text, 'name')}
              value={dataMarketList.name}
              onEndEditing={() => formValidator.validateData('name')}
              errorMessage="mínimo 3 caracteres"
            />
          </ModalInputComponent>
          <ModalInputComponent
            title="Remover"
            visible={modalRemove}
            onRequestClose={() => {
              setModalRemove(false);
              setSelectListDelete({_id: '', index: null});
            }}
            onCancel={() => {
              setModalRemove(false);
              setSelectListDelete({_id: '', index: null});
            }}
            onConfirm={deleteList}>
            <Text style={styles.removeText}>Deseja remover essa lista?</Text>
          </ModalInputComponent>
        </ContainerBaseComponent>
      </ScrollComponent>
      <FloatButtonComponent onPress={() => setModalAddHouse(true)} />
    </>
  );
};

const styles = StyleSheet.create({
  baseList: {
    borderBottomWidth: 1,
    marginLeft: 10,
    borderColor: StyleBase.fonts.lightGray,
    borderStyle: 'solid',
    flexDirection: 'row',
  },
  listText: {
    paddingBottom: 4,
    paddingTop: 8,
    color: StyleBase.colors.primary,
    fontSize: 18,
    marginBottom: 1,
  },
  iconButton: {
    fontSize: 25,
    textAlign: 'center',
  },
  iconContainer: {
    flexDirection: 'column',
    marginLeft: 'auto',
    alignSelf: 'center',
    marginTop: 10,
    marginRight: 5,
  },
  houseListTitle: {
    marginLeft: 10,
    marginBottom: -5,
    fontSize: 15,
    color: StyleBase.fonts.darkGray,
  },
  removeText: {color: StyleBase.fonts.darkGray},
});

export default MarketListPage;
