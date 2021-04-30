import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './pages/home.page';
import LoginPage from './pages/login.page';
import SubscribePage from './pages/subscribe.page';
import MembersPage from './pages/members.page';
import MarketListPage from './pages/marketList.page';
import ProductsListPage from './pages/productsList.page';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
} from '@react-native-firebase/admob';
import ProfilePage from './pages/profile.page';

InterstitialAd.createForAdRequest(TestIds.BANNER);

const Stack = createStackNavigator();
const Router = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="login" headerMode="none">
          <Stack.Screen
            name="login"
            component={LoginPage}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen
            component={HomePage}
            name="home"
            options={{ animationEnabled: false }}
          />
          <Stack.Screen
            component={SubscribePage}
            name="subscribe"
            options={{ animationEnabled: false }}
          />
          <Stack.Screen
            component={MembersPage}
            name="members"
            options={{ animationEnabled: false }}
          />
          <Stack.Screen
            component={MarketListPage}
            name="marketList"
            options={{ animationEnabled: false }}
          />
          <Stack.Screen
            component={ProductsListPage}
            name="productsList"
            options={{ animationEnabled: false }}
          />
          <Stack.Screen
            component={ProfilePage}
            name="profile"
            options={{ animationEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.FULL_BANNER}
      />
    </>
  );
};

export default Router;
