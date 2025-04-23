
import { AppRegistry } from 'react-native';
import App from './App.js';               // ← указываем расширение явно
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);