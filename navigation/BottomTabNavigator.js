import * as React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import i18n from 'i18n-js';


const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = i18n.t('corona_counter');

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ 
    headerTitle: getHeaderTitle(route), 
    headerTintColor: 'deepskyblue',
    activeTintColor: 'deepskyblue'},
    );

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name={i18n.t('corona_counter')}
        component={HomeScreen}
        options={{
          title: i18n.t('corona_counter'),
          tabBarIcon: ({ focused, tintColor }) => <Image
            focused={focused}
            style={{height:24, width:24}}
            source={require('../assets/images/corona_icon.png')}
            tintColor={{tintColor}}
          />,
          activeTintColor: 'deepskyblue'
        }}
      />
      <BottomTab.Screen
        name={i18n.t('about')}
        component={LinksScreen}
        options={{
          title: i18n.t('about'),
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Counter':
      return i18n.t('corona_counter');
    case 'About':
      return i18n.t('about')
    default:
      return i18n.t('corona_counter')
  }
}
