import React, {useState, useEffect} from 'react';
import ScrollComponent from '../components/scroll.component';
import ContainerBaseComponent from '../components/containerBase.component';
import {View, StyleSheet, Button} from 'react-native';
import HeaderComponent from '../components/header.component';
import InputSquareComponent from '../components/inputSquare.component';
import * as Yup from 'yup';
import {FormsValidator} from '../modules/formsValidator.module';
import DatePickerComponent from '../components/datePicker.component';
import {StyleBase} from '../config/styleBase';
import requestModule from '../modules/request.module';
import LoadingComponent from '../components/loading.component';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import toastAndroidModule from '../modules/toastAndroid.module';
import ModalInputComponent from '../components/modalInput.component';

const ProfilePage = () => {
  const schemaValidate = Yup.object().shape({
    email: Yup.string().required().email(),
    name: Yup.string().required().min(3),
    birthDate: Yup.string().required().min(1),
  });
  const [subscribeData, setSubscribeData] = useState({
    email: '',
    name: '',
    birthDate: '',
  });
  const [fromErrors, setFormErrors] = useState({
    email: false,
    name: false,
    birthDate: false,
  });
  const [validForm, setValidForm] = useState(true);
  const [showLoad, setLoad] = useState(false);
  const [token, setToken] = useState('');
  const [initialDate, setInitialDate] = useState('');
  useEffect(() => {
    getProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const formValidator = new FormsValidator(
    subscribeData,
    schemaValidate,
    setFormErrors,
    fromErrors,
    setValidForm,
  );

  const schemaValidatePassword = Yup.object().shape({
    old: Yup.string().required().min(6),
    new: Yup.string().required().min(6),
  });
  const [dataLostPassword, setDataLostPassword] = useState({old: '', new: ''});
  const [formErrorsPassword, setFormErrorsPassword] = useState({
    old: false,
    new: false,
  });
  const [validPasswordForm, setValidPasswordForm] = useState(true);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const formValidatorPassword = new FormsValidator(
    dataLostPassword,
    schemaValidatePassword,
    setFormErrorsPassword,
    formErrorsPassword,
    setValidPasswordForm,
  );

  const changePassword = async () => {
    setLoad(true);
    const updateData = {
      newPassword: dataLostPassword.new,
      oldPassword: dataLostPassword.old,
    };
    try {
      await requestModule.axios.put('/user/password', updateData, {
        headers: {Authorization: `Bearer ${token}`},
      });
    } catch (e) {
      toastAndroidModule.show('Ocorreu um  erro');
    }
    setPasswordData('', 'old');
    setPasswordData('', 'new');
    setLoad(false);
    setShowModalPassword(false);
  };

  const setPasswordData = (value, name) => {
    const data = dataLostPassword;
    data[name] = value;
    setDataLostPassword({...data});
    formValidatorPassword.validateData(name, data);
    formValidatorPassword.validateForm(data);
  };

  const executeSubscribe = async () => {
    setLoad(true);
    const sendData = {
      birthDate: moment(subscribeData.birthDate, 'DD/MM/YYYY').toDate(),
      name: subscribeData.name,
    };
    try {
      await requestModule.axios.put('/user', sendData, {
        headers: {Authorization: `Bearer ${token}`},
      });
    } catch (e) {
      toastAndroidModule.show('Ocorreu um error');
    }
    setLoad(false);
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

  const getProfileData = async () => {
    try {
      setLoad(true);
      const userStorage = await AsyncStorage.getItem('user');
      const localToken = JSON.parse(userStorage).token;
      setToken(localToken);
      const requestProfile = await requestModule.axios.get('/user', {
        headers: {Authorization: `Bearer ${localToken}`},
      });
      setSubscribe(requestProfile.data.data.name, 'name');
      setSubscribe(
        moment(requestProfile.data.data.birthDate).format('DD/MM/YYYY'),
        'birthDate',
      );
      setSubscribe(requestProfile.data.data.email, 'email');

      setInitialDate(
        moment(requestProfile.data.data.birthDate).format('DD/MM/YYYY'),
      );
    } catch (e) {
      toastAndroidModule.show('Ocorreu um erro');
    }
    setLoad(false);
  };
  return (
    <>
      <HeaderComponent showMenu={true} text="Perfil" />
      <ScrollComponent>
        <ModalInputComponent
          visible={showModalPassword}
          title="Recuperar senha"
          onRequestClose={() => setShowModalPassword(false)}
          onCancel={() => setShowModalPassword(false)}
          disabled={validPasswordForm}
          onConfirm={changePassword}>
          <InputSquareComponent
            secureTextEntry={true}
            placeholder=""
            label="Senha anterior"
            error={formErrorsPassword.old}
            onChangeText={(text) => setPasswordData(text, 'old')}
            value={dataLostPassword.old}
            onEndEditing={() => formValidatorPassword.validateData('old')}
            errorMessage="minimo 6 caracteres"
          />
          <InputSquareComponent
            placeholder=""
            secureTextEntry={true}
            label="Nova Senha"
            error={formErrorsPassword.new}
            onChangeText={(text) => setPasswordData(text, 'new')}
            value={dataLostPassword.new}
            onEndEditing={() => formValidatorPassword.validateData('new')}
            errorMessage="minimo 6 caracteres"
          />
        </ModalInputComponent>
        <ContainerBaseComponent>
          <View style={styles.containerInput}>
            <InputSquareComponent
              placeholder=""
              keyboardType="default"
              label="Nome"
              error={fromErrors.name}
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
              error={fromErrors.email}
              onChangeText={(text) => setSubscribe(text, 'email')}
              value={subscribeData.email}
              onEndEditing={() => formValidator.validateData('email')}
              errorMessage="email invalido"
              editable={false}
            />
          </View>

          <View style={styles.containerInput}>
            <DatePickerComponent
              emitValue={(value) => setSubscribe(value, 'birthDate', true)}
              label="Data de nascimento"
              error={fromErrors.birthDate}
              dateStart={subscribeData.birthDate}
              errorMessage="Data obrigatória"
              initialDate={initialDate}
            />
          </View>
          <View style={styles.containerButton}>
            <Button
              color={StyleBase.colors.primary}
              title="Editar"
              disabled={validForm}
              onPress={executeSubscribe}
            />
          </View>
          <View style={styles.containerButton}>
            <Button
              color={StyleBase.colors.error}
              title="Alterar Senha"
              onPress={() => setShowModalPassword(true)}
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
    marginBottom: 10,
    marginTop: 5,
  },
});

export default ProfilePage;
