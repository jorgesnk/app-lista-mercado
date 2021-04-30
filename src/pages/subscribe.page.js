import React, {useState} from 'react';
import ScrollComponent from '../components/scroll.component';
import ContainerBaseComponent from '../components/containerBase.component';
import {View, StyleSheet, Button, ToastAndroid} from 'react-native';
import HeaderComponent from '../components/header.component';
import InputSquareComponent from '../components/inputSquare.component';
import * as Yup from 'yup';
import {FormsValidator} from '../modules/formsValidator.module';
import DatePickerComponent from '../components/datePicker.component';
import {StyleBase} from '../config/styleBase';
import requestModule from '../modules/request.module';
import LoadingComponent from '../components/loading.component';
import moment from 'moment';
import {useNavigation, StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

const SubscribePage = () => {
  const schemaValidate = Yup.object().shape({
    email: Yup.string().required().email(),
    password: Yup.string().required().min(6),
    name: Yup.string().required().min(3),
    birthDate: Yup.string().required().min(1),
  });
  const [subscribeData, setSubscribeData] = useState({
    email: '',
    name: '',
    password: '',
    birthDate: '',
  });
  const [fromErros, setFormErros] = useState({
    email: false,
    password: false,
    name: false,
    birthDate: false,
  });
  const [validForm, setValidForm] = useState(true);
  const [showLoad, setLoad] = useState(false);
  const navigate = useNavigation();
  const formValidator = new FormsValidator(
    subscribeData,
    schemaValidate,
    setFormErros,
    fromErros,
    setValidForm,
  );
  const executeSubscribe = () => {
    setLoad(true);

    const sendData = {
      email: subscribeData.email,
      birthDate: moment(subscribeData.birthDate, 'DD/MM/YYYY').toDate(),
      password: subscribeData.password,
      name: subscribeData.name,
    };
    requestModule.axios
      .post('/user/create', sendData)
      .then((data) => {
        AsyncStorage.setItem('user', JSON.stringify(data.data.data)).then(
          (_data) => {
            setLoad(false);
            navigate.dispatch(StackActions.pop());
            navigate.dispatch(StackActions.replace('home'));
          },
        );
      })
      .catch((_e) => {
        setLoad(false);
        ToastAndroid.showWithGravity(
          'Erro ao cadastrar usuário',
          35,
          ToastAndroid.BOTTOM,
        );
      });
  };

  const setSubscribe = (value, name, force) => {
    const data = subscribeData;
    data[name] = value;
    setSubscribeData({...data});
    formValidator.validateData(name, data);
    if (force) {
      formValidator.validateData(name);
    }
    formValidator.validateForm(data);
  };

  return (
    <>
      <HeaderComponent showMenu={false} text="Cadastrar" />
      <ScrollComponent>
        <ContainerBaseComponent>
          <View style={styles.containerInput}>
            <InputSquareComponent
              placeholder=""
              keyboardType="default"
              label="Nome"
              error={fromErros.name}
              onChangeText={(text) => setSubscribe(text, 'name')}
              value={subscribeData.name}
              onEndEditing={() => formValidator.validateData('name')}
              errorMessage="nome obrigatório"
            />
          </View>
          <View style={styles.containerInput}>
            <InputSquareComponent
              placeholder="exemplo@exemplo.com"
              keyboardType="email-address"
              label="Email"
              error={fromErros.email}
              onChangeText={(text) => setSubscribe(text, 'email')}
              value={subscribeData.email}
              onEndEditing={() => formValidator.validateData('email')}
              errorMessage="email invalido"
            />
          </View>
          <View style={styles.containerInput}>
            <InputSquareComponent
              placeholder=""
              secureTextEntry={true}
              label="Senha"
              error={fromErros.password}
              onChangeText={(text) => setSubscribe(text, 'password')}
              value={subscribeData.password}
              onEndEditing={() => formValidator.validateData('password')}
              errorMessage="mínimo 6 caracteres"
            />
          </View>
          <View style={styles.containerInput}>
            <DatePickerComponent
              emitValue={(value) => setSubscribe(value, 'birthDate', true)}
              label="Data de nascimento"
              error={fromErros.birthDate}
              errorMessage="Data obrigatória"
            />
          </View>
          <View style={styles.containerButton}>
            <Button
              color={StyleBase.colors.primary}
              title="Cadastrar"
              disabled={validForm}
              onPress={executeSubscribe}
            />
          </View>
        </ContainerBaseComponent>
        <LoadingComponent visible={showLoad} />
      </ScrollComponent>
    </>
  );
};

const styles = StyleSheet.create({
  containerInput: {
    width: '95%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  containerButton: {
    width: '95%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
    marginTop: 20,
  },
});

export default SubscribePage;
