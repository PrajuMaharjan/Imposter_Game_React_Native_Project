import {View,Text,StyleSheet,ImageBackground,TouchableOpacity,ScrollView} from 'react-native';
import {useCallback, useEffect, useState,useRef} from 'react';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useGame,GameMode} from '../../store/GameContext';
import { useFocusEffect } from '@react-navigation/native';
import CounterBox from "../components/CounterBox";
import GameModeBox from "../components/GameModeBox";
import BackButton from "../components/BackButton";
import ScreenTitle from "../components/ScreenTitle";
import NextButton from "../components/NextButton";

type RootStackParamList={
  Home:undefined;
  GameSettings:undefined;
  "Select Genre":{players:number;imposters:number};
  "Select Genre-2":{players:number;imposters:number};
  "Advanced Settings":undefined;
};

type GameSettingsScreenProps={
  navigation:NativeStackNavigationProp<RootStackParamList,"GameSettings">;
};

export default function GameSettings({navigation}:GameSettingsScreenProps){
    const {gameState,setGameState}=useGame();
    const [players,setPlayers]=useState(gameState.players);
    const [imposters,setImposters]=useState(gameState.imposters);
    const [gameMode,setGameMode]=useState<GameMode>(gameState.gameMode);

    const gameStateRef=useRef(gameState);
    const playersRef=useRef(players);
    const impostersRef=useRef(imposters);
    const gameModeRef=useRef(gameMode);

    useEffect(()=>{gameStateRef.current=gameState;},[gameState]);
    useEffect(()=>{playersRef.current=players;},[players]);
    useEffect(()=>{impostersRef.current=imposters;},[imposters]);
    useEffect(()=>{gameModeRef.current=gameMode;},[gameMode]);

    // Call from GameContext every time the screen is loaded
    useFocusEffect(
      useCallback(()=>{
      
      setPlayers(gameStateRef.current.players);
      setImposters(gameStateRef.current.imposters);
      setGameMode(gameStateRef.current.gameMode);

      return()=>{
        setGameState(prev=>({
        ...prev,
        players:playersRef.current,
        imposters:impostersRef.current,
        gameMode:gameModeRef.current,
      }));
      }
      },[])
    );

    useEffect(()=>{
      if(imposters>players-2){
        setImposters(players-2);
      }      
    },[players]);
    
    const handleStart=():void=>{
      setGameState(prev=>({
        ...prev,
        players,
        imposters,
        gameMode,
      }));
        if(gameMode==='Word'){
            navigation.navigate('Select Genre',{players,imposters});
        }else{   
            navigation.navigate('Select Genre-2',{players,imposters});
        }
    }

    const handleSettingsChange=():void=>{
    setGameState(prev=>({
        ...prev,
        players,
        imposters,
        gameMode,
      }));

      navigation.navigate("Advanced Settings");
    }
    return(
<ImageBackground source={require('../../assets/Images/HomeImage.png')} style={styles.background} resizeMode="cover">
    
    {/* Back button*/}
    <BackButton onPress={()=>navigation.navigate("Home")} />

    <ScrollView contentContainerStyle={styles.container}>
        <ScreenTitle label="Game Settings" style={styles.heading} />
        
      {/* Number of Players and Imposters Section*/}
      <View style={styles.row}>

        {/* Players box*/}
        <CounterBox emoji="👥"
                    label="How many players?"
                    value={players}
                    onDecrement={()=>setPlayers(p=>Math.max(3,p-1))}
                    onIncrement={()=>setPlayers(p=>Math.min(20,p+1))}
        />
        
        {/* Imposters box*/} 
        <CounterBox emoji="🔪"
                    label="How many imposters?"
                    value={imposters}
                    onDecrement={()=>setImposters(i=>Math.max(1,i-1))}
                    onIncrement={()=>setImposters(i=>Math.min(players-2,i+1))}
        />
      </View>

        {/* Game Mode */}
        <View style={styles.row}>
            <GameModeBox emoji="📝"
                         label="Word Game"
                         description="Find out who does not know the word."
                         mode="Word"
                         activeMode={gameMode}
                         onPress={()=>setGameMode("Word")}
            />

            <GameModeBox emoji="❓"
                         label="Question Game"
                         description="Find out who got a different question."
                         mode="Question"
                         activeMode={gameMode}
                         onPress={()=>setGameMode("Question")}
            />
        </View>

        {/* Advanced Settings*/}
        <TouchableOpacity style={styles.advancedHeader} onPress={handleSettingsChange}>
          <Text style={styles.advancedHeaderText}>⚙️ Advanced Settings</Text>
        </TouchableOpacity>

        {/* Start game button*/}
        <NextButton label="NEXT" style={styles.startButton} onPress={handleStart} />
      </ScrollView>
    </ImageBackground>
    );
}

const styles = StyleSheet.create({
  background:{
    flex:1,
  },
  container: {
    padding:20,
  },
  heading:{
    fontSize:28,
    marginBottom:30,
    marginTop:50,
  },
  row:{
    flexDirection:'row',
    gap:12,
    marginBottom:16,
  },
  advancedHeader:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'rgba(255,255,255,0.2)',
    borderRadius:12,
    padding:14,
    marginBottom:8,    
  },
  advancedHeaderText:{
    color:'white',
    fontSize:15,
    fontWeight:'bold',
  },
  startButton:{
    marginBottom:50
  },
});