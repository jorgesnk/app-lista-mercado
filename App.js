/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';

import Router from './src/route';
import {StatusBar} from 'react-native';

const App = () => {
  useEffect(() => {}, []);
  return (
    <>
      <StatusBar
        // dark-content, light-content and default
        hidden={false}
        //To hide statusBar
        backgroundColor="#1a6e60"
        //Background color of statusBar
        translucent={false}
        //allowing light, but not detailed shapes
        networkActivityIndicatorVisible={true}
      />
      <Router />
    </>
  );
};

export default App;
