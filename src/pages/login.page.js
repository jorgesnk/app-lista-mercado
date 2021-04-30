import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Button, Image, ToastAndroid} from 'react-native';
import HeaderComponent from '../components/header.component';
import InputRoundComponent from '../components/inputRound.component';
import {StyleBase} from '../config/styleBase';
import ScrollComponent from '../components/scroll.component';
import * as Yup from 'yup';
import {FormsValidator} from '../modules/formsValidator.module';
import LinkButtonComponent from '../components/linkButton.component';
import ContainerBaseComponent from '../components/containerBase.component';
import LoadingComponent from '../components/loading.component';
import {useNavigation, StackActions} from '@react-navigation/native';
import requestModule from '../modules/request.module';
import AsyncStorage from '@react-native-community/async-storage';
import ModalInputComponent from '../components/modalInput.component';
import InputSquareComponent from '../components/inputSquare.component';
import toastAndroidModule from '../modules/toastAndroid.module';

const LoginPage = () => {
  const navigate = useNavigation();

  useEffect(() => {
    AsyncStorage.multiGet(['user', 'house']).then((data) => {
      if (data[0][1]) {
        if (data[1][1]) {
          navigate.dispatch(StackActions.replace('marketList'));
          return;
        }
        navigate.dispatch(StackActions.replace('home'));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const schemaValidate = Yup.object().shape({
    email: Yup.string().required().email(),
    password: Yup.string().required().min(6),
  });
  const [loginData, setLoginData] = useState({email: '', password: ''});
  const [fromErros, setFormErros] = useState({email: false, password: false});
  const [validForm, setValidForm] = useState(true);
  const [showLoad, setShowLoad] = useState(false);
  const formValidator = new FormsValidator(
    loginData,
    schemaValidate,
    setFormErros,
    fromErros,
    setValidForm,
  );
  const schemaValidatePassword = Yup.object().shape({
    email: Yup.string().required().email(),
  });
  const [dataLostPassword, setDataLostPassword] = useState({email: ''});
  const [formErrosPassword, setFormErrosPassword] = useState({email: false});
  const [validPasswordForm, setValidPasswordForm] = useState(true);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const formValidatorPassword = new FormsValidator(
    dataLostPassword,
    schemaValidatePassword,
    setFormErrosPassword,
    formErrosPassword,
    setValidPasswordForm,
  );

  const setLogin = (value, name) => {
    const data = loginData;
    data[name] = value;
    setLoginData({...data});
    formValidator.validateData(name, data);
    formValidator.validateForm(data);
  };

  const onSubmit = () => {
    setShowLoad(true);
    requestModule.axios
      .post('/login', loginData)
      .then((data) => {
        AsyncStorage.setItem('user', JSON.stringify(data.data.data))
          .then((_data2) => {
            setShowLoad(false);
            navigate.dispatch(StackActions.replace('home'));
          })
          .catch((e) => {
            setShowLoad(false);
            ToastAndroid.showWithGravity(
              'Usuário ou senha invalido',
              35,
              ToastAndroid.BOTTOM,
            );
          });
      })
      .catch((_e) => {
        setShowLoad(false);
        ToastAndroid.showWithGravity(
          'Usuário ou senha invalido',
          35,
          ToastAndroid.BOTTOM,
        );
      });
  };

  const subscribe = () => {
    navigate.navigate('subscribe');
  };

  const setPasswordData = (value, name) => {
    const data = dataLostPassword;
    data[name] = value;
    setDataLostPassword({...data});
    formValidatorPassword.validateData(name, data);
    formValidatorPassword.validateForm(data);
  };

  const changePassword = async () => {
    setShowLoad(true);
    try {
      await requestModule.axios.post('/login/password', {
        email: dataLostPassword.email,
      });
      setShowLoad(false);
      setShowModalPassword(false);
      toastAndroidModule.show('uma nova senha foi enviada para seu email');
    } catch (e) {
      setShowLoad(false);
      setShowModalPassword(false);
      toastAndroidModule.show('ocorreu um erro');
    }
  };

  return (
    <>
      <HeaderComponent text="Login" showMenu={false} />
      <ScrollComponent>
        <ModalInputComponent
          visible={showModalPassword}
          title="Recuperar senha"
          onRequestClose={() => setShowModalPassword(false)}
          onCancel={() => setShowModalPassword(false)}
          disabled={validPasswordForm}
          onConfirm={changePassword}>
          <InputSquareComponent
            placeholder=""
            label="email"
            error={formErrosPassword.email}
            onChangeText={(text) => setPasswordData(text, 'email')}
            value={dataLostPassword.email}
            keyboardType="email-address"
            onEndEditing={() => formValidatorPassword.validateData('email')}
            errorMessage="email invalido"
          />
        </ModalInputComponent>
        <ContainerBaseComponent>
          <View style={styles.logoContainer}>
            <Image
              style={styles.image}
              source={require('../../assets/logo.png')}
            />
          </View>
          <View style={{...styles.inputTemplate, ...styles.clearTop}}>
            <InputRoundComponent
              placeholder="exemplo@gmail.com"
              keyboardType="email-address"
              label="Email"
              error={fromErros.email}
              onChangeText={(text) => setLogin(text, 'email')}
              value={loginData.email}
              onEndEditing={() => formValidator.validateData('email')}
              errorMessage="email invalido"
            />
          </View>
          <View style={styles.inputTemplate}>
            <InputRoundComponent
              secureTextEntry={true}
              label="Senha"
              onChangeText={(text) => setLogin(text, 'password')}
              value={loginData.password}
              error={fromErros.password}
              onEndEditing={() => formValidator.validateData('password')}
              errorMessage="mínimo 6 caracteres"
            />
          </View>
          <View style={styles.loginButton}>
            <Button
              color={StyleBase.colors.primary}
              onPress={onSubmit}
              title="Entrar"
              disabled={validForm}
            />
          </View>
          <View style={styles.linksContainer}>
            <LinkButtonComponent text="Cadastrar" onPress={subscribe} />
          </View>
          <View style={styles.linksContainer}>
            <LinkButtonComponent
              style={styles.passwordLink}
              text="Redefinir senha"
              onPress={() => {
                setShowModalPassword(true);
              }}
            />
          </View>
          <LoadingComponent visible={showLoad} />
        </ContainerBaseComponent>
      </ScrollComponent>
    </>
  );
};

const styles = StyleSheet.create({
  inputTemplate: {
    width: '95%',
    marginTop: 25,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  clearTop: {
    marginTop: 0,
  },
  loginButton: {
    width: '85%',
    marginTop: 32,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  logoContainer: {
    height: 260,
    maxWidth: '80%',
    marginBottom: 35,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  image: {
    maxHeight: '100%',
    maxWidth: '100%',
  },
  linksContainer: {
    marginTop: 15,
    textAlign: 'center',
    flexDirection: 'column',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  passwordLink: {
    color: StyleBase.fonts.darkGray,
    fontSize: 15,
  },
});

export default LoginPage;
