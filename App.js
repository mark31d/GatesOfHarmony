// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { SavedProvider } from './Components/SavedContext';
import Loader from './Components/Loader';
import Start from './Components/Start';
import Main from './Components/Main';
import Inspiration from './Components/Inspiration';
import SavedScreen from './Components/SavedScreen';
import Profile from './Components/Profile';
const Stack = createStackNavigator();

export default function App() {
  const [loaderEnded, setLoaderEnded] = useState(false);

  return (
    <NavigationContainer>
      <SavedProvider>
        {!loaderEnded ? (
          <Loader onEnd={() => setLoaderEnded(true)} />
        ) : (
          <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Start"       component={Start} />
            <Stack.Screen name="Main"        component={Main} />
            <Stack.Screen name="Inspiration" component={Inspiration} />
            <Stack.Screen name="Saved"       component={SavedScreen} />
            <Stack.Screen name="Profile"      component={Profile} />
          </Stack.Navigator>
        )}
      </SavedProvider>
    </NavigationContainer>
  );
}
