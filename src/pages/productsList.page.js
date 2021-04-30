import React, {useState, useEffect} from 'react';
import ScrollComponent from '../components/scroll.component';
import ContainerBaseComponent from '../components/containerBase.component';
import HeaderComponent from '../components/header.component';
import {View, StyleSheet, Text, RefreshControl} from 'react-native';
import {useRoute} from '@react-navigation/native';
import FloatButtonComponent from '../components/floatButton.component';
import requestModule from '../modules/request.module';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingComponent from '../components/loading.component';
import IconButtonComponent from '../components/iconButton.component';
import {StyleBase} from '../config/styleBase';
import RadioComponent from '../components/radio.component';
import toastAndroidModule from '../modules/toastAndroid.module';
import SearchComponent from '../components/search.component';
import ButtonBadgeComponent from '../components/buttonBadge.component';
import ProductModalPage from './product.modal.page';
import ModalInputComponent from '../components/modalInput.component';
const ProductsListPage = () => {
  const [houseId, setHouseId] = useState('');
  const [token, setToken] = useState('');
  const [products, setProducts] = useState([]);
  const [listId, setListId] = useState('');
  const route = useRoute();
  const [showLoad, setShowLoad] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterSelected, setFilterSelected] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [updateParams, setUpdateParams] = useState({
    id: '',
    houseId: '',
    token: '',
    product: '',
  });
  const [modalProduct, setModalProduct] = useState(false);
  const [modalRemove, setModalRemove] = useState(false);
  const [productRemove, setProductRemove] = useState({_id: '', index: null});
  const getProducts = async () => {
    setShowLoad(true);
    try {
      const userStorage = await AsyncStorage.getItem('user');
      const storageHouse = await AsyncStorage.getItem('house');
      const localToken = JSON.parse(userStorage).token;
      setToken(localToken);
      setHouseId(storageHouse);
      setListId(route.params.id);
      const request = await requestModule.axios.get(
        `/marketList/${storageHouse}/${route.params.id}`,
        {headers: {Authorization: `Bearer ${localToken}`}},
      );
      setProducts(request.data.data.products);
      setAllProducts([...request.data.data.products]);
      filterSelect(undefined, [...request.data.data.products]);
      setShowLoad(false);
    } catch (e) {
      toastAndroidModule.show('Ocorreu um erro');
      setShowLoad(false);
    }
  };
  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const setStatus = async (index, product) => {
    setShowLoad(true);
    const toSet = product.purchased ? false : true;
    try {
      await requestModule.axios.put(
        `/marketList/list/${route.params.id}/${houseId}/${product._id}`,
        {purchased: toSet},
        {headers: {Authorization: `Bearer ${token}`}},
      );
      const data = [...products];
      data[index].purchased = toSet;
      setProducts(data);
      const allProductsCopy = [...allProducts];
      let allProductIndex = 0;
      allProductsCopy.forEach((element, eachIndex) => {
        if (element._id === product._id) {
          allProductIndex = eachIndex;
        }
      });
      allProductsCopy[allProductIndex].purchased = toSet;
      setAllProducts(allProductsCopy);
      filterSelect(undefined, allProductsCopy);
      setShowLoad(false);
    } catch (_e) {
      setShowLoad(false);
      toastAndroidModule.show('Ocorreu um error');
    }
  };
  const goToProduct = async (addProduct) => {
    const sendProduct = addProduct ? addProduct : undefined;
    // navigate.navigate('product', {
    const params = {
      id: listId,
      houseId: houseId,
      token: token,
      product: sendProduct,
    };
    setUpdateParams(params);
    setModalProduct(true);
    setSearchText('');
  };
  const deleteProduct = async () => {
    const {_id: id, index} = productRemove;
    setModalRemove(false);
    setShowLoad(true);
    try {
      await requestModule.axios.delete(
        `/marketList/list/${listId}/${houseId}/${id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      products.splice(index, 1);
      let indexAll = 0;
      allProducts.forEach((element, indexProduct) => {
        if (element._id === id) {
          indexAll = indexProduct;
        }
      });
      allProducts.splice(indexAll, 1);
      setShowLoad(false);
    } catch (e) {
      setShowLoad(false);
      toastAndroidModule.show('Ocorreu um erro');
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getProducts();
      setRefreshing(false);
    } catch (_e) {
      setRefreshing(false);
    }
  };
  const executeFilterSelect = () => {
    if (filterSelected === true) {
      setFilterSelected(false);
      filterSelect(false);
      return;
    }
    setFilterSelected(true);
    filterSelect(true);
  };
  const filterSelect = (action, all, text) => {
    const valueFilter = text !== undefined ? text : searchText;
    const paramsFilter = action !== undefined ? action : filterSelected;
    const copy = (all !== undefined
      ? [...all]
      : [...allProducts]
    ).filter((element) => element.name.toLowerCase().includes(valueFilter));
    if (paramsFilter === true) {
      const filter = copy.filter((element) => element.purchased === false);
      setProducts(filter);
      return;
    }
    setProducts(copy);
  };
  const onCloseModal = (create, product) => {
    setModalProduct(false);
    if (product === undefined) {
      return;
    }
    const copyAll = [...allProducts];
    if (create) {
      copyAll.push(product);
      setAllProducts(copyAll);
      filterSelect(undefined, copyAll, undefined);
      return;
    }
    let indexEdit = 0;
    copyAll.forEach((element, index) => {
      if (element._id === product._id) {
        indexEdit = index;
      }
    });
    copyAll[indexEdit] = product;
    setAllProducts(copyAll);
    filterSelect(undefined, copyAll, undefined);
  };
  return (
    <>
      <HeaderComponent showBack={true} text={route.params.name} />
      <ScrollComponent
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <ContainerBaseComponent>
          <View style={styles.searchContainer}>
            <SearchComponent
              value={searchText}
              placeholder="Buscar produto"
              onChangeText={(text) => {
                setSearchText(text);
                filterSelect(undefined, undefined, text);
              }}
            />
          </View>
          <View style={styles.badgeItem}>
            <ButtonBadgeComponent
              text="não selecionados"
              selected={filterSelected}
              onPress={() => executeFilterSelect()}
            />
          </View>
          <Text style={styles.houseListTitle}>Produtos</Text>

          {products.map((element, index) => (
            <View key={element._id} style={styles.baseList}>
              <View style={styles.textContainer}>
                <RadioComponent
                  value={element.purchased}
                  onPress={() => setStatus(index, element)}
                />
              </View>
              <View style={styles.textContainer}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.textQtd}>{`${element.quantity}${
                  element.unit || 'x'
                }`}</Text>

                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={styles.listText}>
                  {element.name}
                </Text>
              </View>

              <View style={styles.iconContainer}>
                <IconButtonComponent
                  iconName="edit"
                  iconColor={StyleBase.colors.primary}
                  style={styles.iconButton}
                  onPress={() => goToProduct(element)}
                />
                <IconButtonComponent
                  iconName="delete"
                  iconColor={StyleBase.colors.error}
                  style={styles.iconButton}
                  // onPress={() => deleteProduct(element._id, index)}
                  onPress={() => {
                    setProductRemove({_id: element._id, index});
                    setModalRemove(true);
                  }}
                />
              </View>
            </View>
          ))}
          <View style={styles.endList} />
          <LoadingComponent visible={showLoad} />
          <ProductModalPage
            modalVisible={modalProduct}
            params={updateParams}
            onDismiss={onCloseModal}
          />
          <ModalInputComponent
            title="Remover"
            visible={modalRemove}
            onCancel={() => setModalRemove(false)}
            onConfirm={deleteProduct}
            onRequestClose={() => setModalRemove(false)}>
            <Text style={styles.removeText}>Deseja remover esse produto?</Text>
          </ModalInputComponent>
        </ContainerBaseComponent>
      </ScrollComponent>
      <FloatButtonComponent onPress={() => goToProduct()} />
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
    paddingBottom: 5,
    paddingTop: 10,
  },
  listText: {
    color: StyleBase.colors.primary,
    fontSize: 18,
    maxWidth: 210,
  },
  iconButton: {
    fontSize: 25,
    textAlign: 'center',
    marginRight: 5,
  },
  iconContainer: {
    marginLeft: 'auto',
    alignSelf: 'center',
    marginTop: 10,
    marginRight: 5,
    flexDirection: 'row',
  },
  textContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
    marginRight: 5,
  },
  textQtd: {
    marginBottom: 'auto',
    color: StyleBase.fonts.darkGray,
    marginTop: 'auto',
    marginRight: 3,
    marginLeft: 2,
    fontSize: 15,
    maxWidth: 45,
  },
  houseListTitle: {
    marginLeft: 10,
    marginBottom: -10,
    fontSize: 15,
    color: StyleBase.fonts.darkGray,
  },
  searchContainer: {
    width: '98%',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 10,
  },
  badgeItem: {width: 150, marginLeft: 8, marginBottom: 10, marginTop: 10},
  endList: {marginTop: 68},
  removeText: {color: StyleBase.fonts.darkGray},
});
export default ProductsListPage;
