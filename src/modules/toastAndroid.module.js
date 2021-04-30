import {ToastAndroid} from 'react-native';

class ToastAndroidModule {
  show(message = '') {
    ToastAndroid.showWithGravity(message, 35, ToastAndroid.BOTTOM);
  }
}

export default new ToastAndroidModule();
