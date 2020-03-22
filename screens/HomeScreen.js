import * as React from 'react';
import { Platform, StyleSheet, Text, View,
   RefreshControl, Dimensions} from 'react-native';
import { ScrollView  } from 'react-native-gesture-handler';
import Flag from 'react-native-flags';
import * as firebase from 'firebase';
import Moment from 'react-moment';

import i18n from 'i18n-js';
import * as Localization from 'expo-localization';
import {
  Card,
  CardHeader,
  Layout,
  // Text,
} from '@ui-kitten/components';

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const HeaderDeathCount = () => (
  <CardHeader title={i18n.t('death_count')}/>
);

const HeaderInfectedCount = () => (
  <CardHeader title={i18n.t('infected_count')}/>
);

const HeaderCountry = () => (
  <CardHeader title={i18n.t('country')}>
  <Text>Polska</Text>
    <Flag
      code="PL"
      size={32}
      style={styles.tabBarInfoText}
    />
  </CardHeader>
);

export default function HomeScreen() {
  const [refreshing, setRefreshing, ] = React.useState(false);
  const [deathCount, setDeathCount, ] = React.useState(0);
  const [infectedCount, setInfectedCount, ] = React.useState(0);
  const [lastUpdate, setLastUpdate, ] = React.useState(0);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
    getCoronaStatistics();
  }, [refreshing]);


  function getCoronaStatistics() {
    firebase.database().ref('/').on('value', (snapshot) => {
      const stats = snapshot.val().stats;
      const deathCount = snapshot.val().deaths;
      const infectedCount = snapshot.val().infected;
      const lastUpdateTime = snapshot.val().last_update;
    
      var date = new Date( lastUpdateTime );

      setDeathCount(deathCount);
      setInfectedCount(infectedCount);
      setLastUpdate(date);

      console.log("Death: " + deathCount + " infected:" + infectedCount + " lastUpdate:" + lastUpdateTime + " d: " + date);

    });
  }

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    getCoronaStatistics();
  }, []);

  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={styles.container}>
        <Text style={styles.refreshLabelText}>{i18n.t('pull_to_refresh')}</Text>
        <ScrollView style={styles.container}  contentContainerStyle={styles.contentContainer} 
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <Card style={styles.card} header={HeaderDeathCount} status='danger'>
              <Text style={styles.deathCountText}>{deathCount}</Text>
          </Card>
          <Card style={styles.card} header={HeaderInfectedCount} status='success'>
              <Text style={styles.infectedCountText}>{infectedCount}</Text>
          </Card>
        </ScrollView>
        <Card style={styles.card} status='success'>
            <Flag
              code="PL"
              size={32}
            />
            <Text style={styles.lastUpdateLabelText}>{i18n.t('last_update')}</Text>
            <View style={styles.lastUpdateContainer}>
              <Moment element={Text} format="YYYY/MM/DD HH:mm" unix locale={Localization.locale}>{lastUpdate}</Moment>
              <Text>  (<Moment element={Text} fromNow unix locale={Localization.locale}>{lastUpdate}</Moment>)</Text>
            </View>
        </Card>
  {/* 
        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/BottomTabNavigator.js</MonoText>
          </View>
        </View> */}
      </View>
    </Layout>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    alignSelf: 'stretch',
    backgroundColor: '#ffec2c',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  lastUpdateContainer: {
    flexDirection: 'row',
    textAlign: 'right',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center'
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  countryFlag: {
    fontSize: 17,
    textAlign: 'center',
    alignSelf: 'center',
  },
  infectedCountText: {
    fontSize: 40,
    color: '#f28039',
    textAlign: 'center',
  },
  deathCountText: {
    fontSize: 80,
    color: '#ba0001',
    textAlign: 'center',
  },
  infectedLabelText: {
    fontSize: 17,
    paddingTop: 10,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  deathsLabelText: {
    fontSize: 20,
    paddingTop: 10,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  lastUpdateLabelText: {
    fontSize: 12,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'right',
  },
  lastUpdateDateLabelText: {
    fontSize: 18,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  countryLabelText: {
    fontSize: 12,

    paddingBottom: 10,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  refreshLabelText: {
    fontSize: 12,
    paddingTop: 10,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  card: {
    marginVertical: 6,
    alignSelf: 'stretch',
    marginLeft: 10,
    marginRight: 10
  },

});
