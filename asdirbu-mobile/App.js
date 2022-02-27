/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux'
import { View, Image,Text,StyleSheet } from 'react-native';
import reducer from './src/reducers';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Onboarding from './src/screens/vender/Onboard';
import Login from './src/screens/vender/Login';
import Home from './src/screens/vender/Home';
import Search from './src/screens/vender/search';
import CreateProfile from './src/screens/vender/Createprofile';
import ComponyRegister from './src/screens/vender/ComponyRegister';
import PersonalRegister from './src/screens/vender/PersonalRegister';
import Profile from './src/screens/vender/Profile';
import images from './src/config/images';
import MemoProfile from './src/screens/vender/Menoprofile';
import Message from './src/screens/vender/message';
import Details from './src/screens/vender/Details';
import Aboutus from './src/screens/vender/aboutus';
import Itemdetails from './src/screens/vender/itemdetails';
import MainRegister from './src/screens/vender/MainRegister';
import SearchResult from './src/screens/vender/SearchResult';
import Services from './src/screens/vender/Services';
import Members from './src/screens/vender/NewMember';
import Income from './src/screens/vender/income';
import Invoice from './src/screens/vender/Invoice';
import InvoiceContent from './src/screens/vender/InvoiceContent'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const middleware = [thunk];
const composeEnhancer = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancer(applyMiddleware(...middleware));
const store = createStore(reducer, {}, enhancer);
function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: '#E57D33',
        style: {
          height: 80,
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.bottomcontainer}>
              <Image source={images.home} style={{width: 28, height: 30, tintColor: color }}/>
              <Text style={{textAlign: "center", fontSize:12}}>Pradinis</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.bottomcontainer}>
              <Image source={images.search} style={{width: 28, height: 30, tintColor: color }}/>
              <Text style={{textAlign: "center", fontSize:12}}>Paieška</Text>
            </View>
          ),
        }}
      />
       <Tab.Screen
        name="CreateProfile"
        component={CreateProfile}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.bottomcontainer}>
              <Image source={images.plus} style={{width: 28, height: 30, tintColor: color }}/>
              <Text style={{textAlign: "center", fontSize:12}}>Greitas darbas</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Income"
        component={Income}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.bottomcontainer}>
             <Image source={images.clock} style={{width: 28, height: 30, tintColor: color }}/>
             <Text style={{textAlign: "center", fontSize:12}}>uždarbis</Text>
            </View>
          ),
          
        }}
      />
     
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.bottomcontainer}>
              <Image source={images.user} style={{width: 28, height: 30, tintColor: color }}/>
              <Text style={{textAlign: "center", fontSize:12}}>Profilis</Text>
            </View>
          ),
        }}
      />
      
    </Tab.Navigator>
  );
}


function Navigator() {
  return (
    <NavigationContainer>
      
      <Stack.Navigator screenOptions={{ cardStyle: { backgroundColor: '#fff' } }} initialRouteName='Onboarding'>
        <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
        <Stack.Screen name="ComponyRegister" component={ComponyRegister} options={{ headerShown: false }} />
        <Stack.Screen name="PersonalRegister" component={PersonalRegister} options={{ headerShown: false }} />
        <Stack.Screen name="MainRegister" component={MainRegister} options={{ headerShown: false }} />
        <Stack.Screen name="SearchResult" component={SearchResult} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={MyTabs} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="viewProfile" component={MemoProfile} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="Message" component={Message} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="Details" component={Details} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="Aboutus" component={Aboutus} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="Itemdetails" component={Itemdetails} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="Services" component={Services} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="Members" component={Members} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="Invoice" component={Invoice} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="InvoiceContent" component={InvoiceContent} options={{ headerShown: false, gestureEnabled: false }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function App(){
  return(
    <Provider store={store}>
      <Navigator/>
    </Provider>
  )
}

const styles = StyleSheet.create({
  bottomcontainer:{
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default App;
