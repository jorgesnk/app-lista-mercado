import {View, StyleSheet, Button, Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import ContainerBaseComponent from '../components/containerBase.component';
import ScrollComponent from '../components/scroll.component';
import HeaderComponent from '../components/header.component';
import {FormsValidator} from '../modules/formsValidator.module';
import requestModule from '../modules/request.module';
import * as Yup from 'yup';
import InputSquareComponent from '../components/inputSquare.component';
import {StyleBase} from '../config/styleBase';
import LoadingComponent from '../components/loading.component';
import toastAndroidModule from '../modules/toastAndroid.module';
import SelectInputComponent from '../components/selectInput.component';
import SelectUnitModalPage from './selectUnit.moda.page';
const ProductModalPage = ({onDismiss, modalVisible, params}) => {
  const [id, setId] = useState('');
  const [houseId, setHouseId] = useState('');
  const [token, setToken] = useState('');
  const [productData, setProductData] = useState({
    name: '',
    quantity: 0,
    unit: '',
    brand: '',
  });
  const [fromErros, setFormErros] = useState({
    name: false,
    quantity: false,
    unit: false,
    brand: false,
  });
  const [validForm, setValidForm] = useState(true);
  const [showLoad, setShowLoad] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [productId, setProductId] = useState('');
  const [purchased, setPurchased] = useState(false);
  const [selectModal, setSelectModal] = useState(false);
  const schemaValidate = Yup.object().shape({
    name: Yup.string().required(),
    quantity: Yup.number().required().min(1),
    unit: Yup.string(),
    brand: Yup.string(),
  });
  const formValidator = new FormsValidator(
    productData,
    schemaValidate,
    setFormErros,
    fromErros,
    setValidForm,
  );
  const setProduct = (value, name, isNumber) => {
    if (isNumber) {
      value = parseFloat(value) ? parseFloat(value) : 0;
    }
    const data = productData;
    data[name] = value;
    setProductData({...data});
    formValidator.validateData(name, data);
    formValidator.validateForm(data);
  };

  const getProperties = () => {
    setToken(params.token);
    setHouseId(params.houseId);
    setId(params.id);
    if (params.product) {
      setIsEdit(true);
      setProductId(params.product._id);
      setProduct(params.product.name, 'name');
      setProduct(params.product.quantity, 'quantity', true);
      setProduct(params.product.unit, 'unit');
      setProduct(params.product.brand, 'brand');
      setPurchased(params.product.purchased);
    }
  };

  const updateProduct = async () => {
    setShowLoad(true);
    const data = {
      name: productData.name,
      quantity: parseFloat(productData.quantity),
      unit: productData.unit,
      brand: productData.brand,
    };
    await requestModule.axios.put(
      `/marketList/list/${id}/${houseId}/${productId}`,
      data,
      {headers: {Authorization: `Bearer ${token}`}},
    );
    setShowLoad(false);
    onDismiss(false, {
      name: productData.name,
      quantity: productData.quantity,
      unit: productData.unit,
      brand: productData.brand,
      _id: productId,
      purchased: purchased,
    });
    setProductId('');
    setProduct('', 'name');
    setProduct(null, 'quantity', true);
    setProduct('', 'unit');
    setProduct('', 'brand');
    try {
    } catch (e) {
      setShowLoad(false);
      toastAndroidModule.show('Ocorreu um erro');
    }
  };
  const createProduct = async () => {
    setShowLoad(true);
    try {
      const request = await requestModule.axios.post(
        `/marketList/list/${id}/${houseId}`,
        {
          name: productData.name,
          brand: productData.brand,
          quantity: parseFloat(productData.quantity),
          unit: productData.unit,
        },
        {headers: {Authorization: `Bearer ${token}`}},
      );
      setShowLoad(false);
      onDismiss(true, {
        name: productData.name,
        brand: productData.brand,
        quantity: productData.quantity,
        unit: productData.unit,
        _id: request.data.data._id,
        purchased: false,
      });
      setProductId('');
      setProduct('', 'name');
      setProduct(null, 'quantity', true);
      setProduct('', 'unit');
      setProduct('', 'brand');
    } catch (e) {
      setShowLoad(false);
      toastAndroidModule.show('Ocorreu um Erro');
    }
  };

  const action = () => {
    if (isEdit) {
      updateProduct();
      return;
    }
    createProduct();
  };
  const closeModal = (value) => {
    if (value) {
      setProduct(value, 'unit');
    }
    setSelectModal(false);
  };
  useEffect(() => {
    setProduct('', 'name');
    setProduct('', 'brand');
    setProduct('', 'unit');
    setProduct(null, 'quantity');
    if (modalVisible === true) {
      setIsEdit(false);
      getProperties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible]);

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        onDismiss(null);
      }}>
      <>
        <HeaderComponent
          text="Produto"
          showBackModal={true}
          backModal={onDismiss}
        />
        <ScrollComponent>
          <ContainerBaseComponent>
            <View style={styles.form}>
              <InputSquareComponent
                label="nome"
                error={fromErros.name}
                onChangeText={(text) => setProduct(text, 'name')}
                value={productData.name}
                onEndEditing={() => formValidator.validateData('name')}
                errorMessage="nome obrigatório"
              />
              <InputSquareComponent
                label="quantidade"
                keyboardType="numeric"
                error={fromErros.quantity}
                onChangeText={(text) => setProduct(text, 'quantity')}
                value={
                  productData.quantity ? productData.quantity.toString() : ''
                }
                onEndEditing={() => formValidator.validateData('quantity')}
                errorMessage="mínimo 1"
              />
              <InputSquareComponent
                label="marca"
                error={fromErros.brand}
                onChangeText={(text) => setProduct(text, 'brand')}
                value={productData.brand}
                onEndEditing={() => formValidator.validateData('brand')}
                errorMessage="adicione uma marca"
              />
              <SelectInputComponent
                label="unidade"
                error={fromErros.unit}
                value={productData.unit}
                errorMessage="unidade de medida obrigatória"
                onPress={() => setSelectModal(true)}
              />
              <View style={{...styles.form, ...styles.viewButton}}>
                <Button
                  title={isEdit ? 'Editar' : 'Cadastrar'}
                  disabled={validForm}
                  color={StyleBase.colors.primary}
                  onPress={action}
                />
              </View>
            </View>
            <LoadingComponent visible={showLoad} />
          </ContainerBaseComponent>
        </ScrollComponent>
      </>
      <SelectUnitModalPage visible={selectModal} onRequestClose={closeModal} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '95%',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  viewButton: {
    marginTop: 10,
  },
});

export default ProductModalPage;
