import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ImageBackground,View } from 'react-native';
import * as SplashScreen from "expo-splash-screen";
import { useEffect,useCallback,useState } from 'react';
import { Asset } from 'expo-asset';

/* Import Game Context */
import { GameProvider } from './GameContext';

/* Import each screen*/
import HomeScreen from './HomeScreen';
import Settings from './SettingsScreen';
import GameSettings from './GameSettingsScreen';
import Advanced_Settings from './AdvancedSettingsScreen';

/* Word Game Screens*/
import GenreSelect_1 from './WordGame/GenreSelectScreen';
import PlayerEntry_1 from './WordGame/PlayerNamesScreen';
import RoleReveal_1 from './WordGame/RoleRevealScreen';
import Discussion_1 from './WordGame/DiscussionScreen';
import Voting_1 from './WordGame/VotingScreen';
import Results_1 from './WordGame/ResultsScreen';
import Imposter_1 from './WordGame/ImposterRevealScreen';

/* Question Game Screens*/
import GenreSelect_2 from './QuestionGame/GenreSelectScreen';
import PlayerEntry_2 from './QuestionGame/PlayerNamesScreen';
import RoleReveal_2 from './QuestionGame/RoleRevealScreen';
import Discussion_2 from './QuestionGame/DiscussionScreen';
import Voting_2 from './QuestionGame/VotingScreen';
import Results_2 from './QuestionGame/ResultsScreen';
import Imposter_2 from './QuestionGame/ImposterRevealScreen';

SplashScreen.preventAutoHideAsync();

const Stack=createNativeStackNavigator();

export default function App() {
  const [appReady,setAppReady]=useState(false);

  useEffect(()=>{
    async function prepare(){
    try{
      //Loading background image
      await Asset.loadAsync(require('../assets/Images/HomeImage.png'));
    }catch(e){
      console.warn(e);
    }finally{
      setAppReady(true);
    }
  }
  prepare();
},[]);

const onLayoutRootView=useCallback(async()=>{
  if(appReady){
    await SplashScreen.hideAsync();
  }
},[appReady]);

if(!appReady) return null;

return(
<View style={{flex:1}} onLayout={onLayoutRootView}>
<ImageBackground source={require('../assets/Images/HomeImage.png')} style={{flex:1}} resizeMode='cover'>
  <GameProvider>
  <NavigationContainer>
  <Stack.Navigator initialRouteName="Home" screenOptions={{contentStyle:{backgroundColor:'black'},}}>

  <Stack.Screen name='Home' component={HomeScreen} options={{headerShown:false}}/>
  <Stack.Screen name='GameSettings' component={GameSettings} options={{headerShown:false}}/>
  <Stack.Screen name='Settings' component={Settings} options={{headerShown:false}}/>
  <Stack.Screen name='Advanced Settings' component={Advanced_Settings} options={{headerShown:false}} />

  
  <Stack.Screen name='Select Genre' component={GenreSelect_1} options={{headerShown:false}} />
  <Stack.Screen name='Names' component={PlayerEntry_1} options={{headerShown:false}}/>  
  <Stack.Screen name='Roles' component={RoleReveal_1} options={{headerShown:false}}/>
  <Stack.Screen name='Discussion' component={Discussion_1} options={{headerShown:false}}/>
  <Stack.Screen name='Vote' component={Voting_1} options={{headerShown:false}}/>
  <Stack.Screen name='Results' component={Results_1} options={{headerShown:false}}/>
  <Stack.Screen name="Imposter" component={Imposter_1} options={{headerShown:false}}/>
  
  <Stack.Screen name='Select Genre-2' component={GenreSelect_2} />
  <Stack.Screen name='Names-2' component={PlayerEntry_2} />
  <Stack.Screen name='Roles-2' component={RoleReveal_2} />
  <Stack.Screen name='Discussion-2' component={Discussion_2} />
  <Stack.Screen name='Vote-2' component={Voting_2} />
  <Stack.Screen name='Results-2' component={Results_2} />
  <Stack.Screen name="Imposter-2" component={Imposter_1} />
  </Stack.Navigator>
  </NavigationContainer>
  </GameProvider>
  </ImageBackground>
  </View>
);
}
