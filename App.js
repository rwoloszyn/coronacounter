import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';
import * as firebase from 'firebase';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';

const Stack = createStackNavigator();

i18n.translations = {
  en: { 
    corona_counter: 'CoronaCounter',
    about: 'About',
    data_source: 'Data source',
    privacy_policy: 'Privacy policy',
    version: 'Version   1.0',
    pull_to_refresh: 'Pull down to refresh data',
    country: 'Country: ',
    last_update: 'Last update:',
    death_count: 'Deaths:',
    infected_count: 'Infected:'
  },
  pl: { 
    corona_counter: 'CoronaCounter', 
    about: 'O aplikacji',
    data_source: 'Źródło danych',
    privacy_policy: 'Polityka prywatności',
    version: 'Wersja    1.0',
    pull_to_refresh: 'Przesuń w dół aby odświeżyć',
    country: 'Kraj: ',
    last_update: 'Ostatnia aktualizacja:',
    death_count: 'Przypadki śmiertelne:',
    infected_count: 'Zarażeni:'
  }
};


export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  // Initialize Firebase
  const firebaseConfig = {
    apiKey: "XXXXXXXXXXXXXXXXXXXX",
    authDomain: "XXXXXXXXXXXXXXXXXXXXXXXx",
    databaseURL: "XXXXXXXXXXXXXXXXXXXXXXXXX",
    storageBucket: "XXXXXXXXXXXXXXXXXXXxx"
  };
    
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
        firebase.initializeApp(firebaseConfig);

        // Set the locale once at the beginning of your app.
        i18n.locale = 'pl'; //Localization.locale;
        // When a value is missing from a language it'll fallback to another language with the key present.
        i18n.fallbacks = true;

      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
            <Stack.Navigator>
              <Stack.Screen name="Root" component={BottomTabNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </ApplicationProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
