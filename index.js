import { AppRegistry } from 'react-native';
import Amplify from 'aws-amplify'

import App from './App';

import config from './aws-exports'

Amplify.configure(config)

AppRegistry.registerComponent('RNTranslate', () => App);
