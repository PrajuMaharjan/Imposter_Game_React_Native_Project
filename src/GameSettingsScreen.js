import {View,Text,StyleSheet,ImageBackground,TouchableOpacity,Switch,ScrollView} from 'react-native';
import {useCallback, useEffect, useState} from 'react';
import {useGame} from './GameContext';
import { useFocusEffect } from '@react-navigation/native';

export default function GameSettings({navigation}){
    const {gameState,setGameState}=useGame();
    const [players,setPlayers]=useState(gameState.players);
    const [imposters,setImposters]=useState(gameState.imposters);
    const [gameMode,setGameMode]=useState(gameState.gameMode);

    // Call from GameContext every time the screen is loaded
    useFocusEffect(
      useCallback(()=>{
      setPlayers(gameState.players);
      setImposters(gameState.imposters);
      setGameMode(gameState.gameMode);
      },[gameState.players,gameState.imposters,gameState.gameMode])
    );

    useEffect(()=>{
      if(imposters>players-2){
        setImposters(players-2);
      }      
    },[players]);
    
    const handleStart=()=>{
      setGameState(prev=>({
        ...prev,
        players:players,
        imposters:imposters,
        gameMode:gameMode,
      }));
        if(gameMode==='Word'){
            navigation.navigate('Select Genre',{players,imposters});
        }else{   
            navigation.navigate('Select Genre-2',{players,imposters});
        }
    }
    const handleSettingsChange=()=>{
    setGameState(prev=>({
        ...prev,
        players:players,
        imposters:imposters,
        gameMode:gameMode,
      }));

      navigation.navigate("Advanced Settings");
    }
    return(
<ImageBackground source={require('../assets/Images/HomeImage.png')} style={styles.background} resizeMode="cover">
    
    {/* Back button*/}
    <TouchableOpacity style={styles.backButton} onPress={()=>navigation.navigate('Home')}>
        <Text style={styles.backArrow}>←</Text>
    </TouchableOpacity>

    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Game Settings</Text>
      {/* Number of Players and Imposters Section*/}
      <View style={styles.row}>

        {/* Players box*/}
        <View style={styles.box}>
            <Text style={styles.emoji}>👥</Text>
            <Text style={styles.boxLabel}>How many players?</Text>
            <View style={styles.counter}>
                <TouchableOpacity style={styles.counterButton} onPress={()=>setPlayers(p=>Math.max(3,p-1))}>
                    <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{players}</Text>
                <TouchableOpacity style={styles.counterButton} onPress={()=>setPlayers(p=>Math.min(20,p+1))}>
                    <Text style={styles.counterButtonText}>+</Text>        
                </TouchableOpacity>
            </View>
        </View>

        {/* Imposters box*/} 
        <View style={styles.box}>
            <Text style={styles.emoji}>🔪</Text>
            <Text style={styles.boxLabel}>How many imposters?</Text>
            <View style={styles.counter}>
                <TouchableOpacity style={styles.counterButton} onPress={()=>setImposters(i=>Math.max(1,i-1))}>
                    <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{imposters}</Text>
                <TouchableOpacity style={styles.counterButton} onPress={()=>setImposters(i=>Math.min(players-2,i+1))}>
                    <Text style={styles.counterButtonText}>+</Text>        
                </TouchableOpacity>
            </View>
        </View>
        </View>

        {/* Game Mode */}
        <View style={styles.row}>
            <TouchableOpacity style={[styles.modeBox,gameMode==='Word' && styles.modeBoxActive]} onPress={()=>setGameMode('Word')}>
                <Text style={styles.emoji}>📝</Text>
                <Text style={[styles.modeText,gameMode==='Word' && styles.modeTextActive]}>Word Game</Text>
                <Text style={styles.modeDescription}>Find out who does not know the word.</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modeBox,gameMode==='Question' && styles.modeBoxActive]} onPress={()=>setGameMode('Question')}>
                <Text style={styles.emoji}>❓</Text>
                <Text style={[styles.modeText,gameMode==='Question' && styles.modeTextActive]}>Question Game</Text>
                <Text style={styles.modeDescription}>Find out who got a different question.</Text>
            </TouchableOpacity>
        </View>

        {/* Advanced Settings*/}
        <TouchableOpacity style={styles.advancedHeader} onPress={handleSettingsChange}>
          <Text style={styles.advancedHeaderText}>⚙️ Advanced Settings</Text>
        </TouchableOpacity>

        {/* Start game button*/}
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>NEXT</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
    );
}

const styles = StyleSheet.create({
  background:{
    flex:1,
  },
  backButton:{
    position:'absolute',
    top:50,
    left:20,
    zIndex:10,
    padding:8,
  },  
  backArrow:{
    fontSize:28,
    color:'white',
    fontWeight:'bold',
  },
  container: {
    padding:20,
  },
  heading:{
    fontSize:28,
    fontWeight:'bold',
    color:'white',
    marginBottom:30,
    marginTop:50,
    textAlign:'center',
  },

  row:{
    flexDirection:'row',
    gap:12,
    marginBottom:16,
  },

  box:{
    flex:1,
    backgroundColor:'rgba(255,255,255,0.2)',
    borderRadius:12,
    padding:16,
    alignItems:'center',
  },
  boxLabel:{
    fontSize:11,
    fontWeight:'bold',
    color:'white',
    marginBottom:12,
    textAlign:'center',
  },
  emoji:{
    fontSize:30,
    marginBottom:6,
  },
  counter:{
    flexDirection:'row',
    alignItems:'center',
    gap:16,
  },
  counterButton:{
    backgroundColor:'rgba(255,255,255,0.3)',
    width:32,
    height:32,
    borderRadius:8,
    alignItems:'center',
    justifyContent:'center',
  },
  counterButtonText:{
    color:'white',
    fontSize:20,
    fontWeight:'bold',
  },
  counterValue:{
    fontSize:22,
    fontWeight:'bold',
    color:'white',
    minWidth:36,
    textAlign:'center',
  },
  modeBox:{
    flex:1,
    backgroundColor:'rgba(255,255,255,0.2)',
    borderRadius:12,
    padding:16,alignItems:'center',
    borderWidth:2,
    borderColor:'transparent',
  },
  modeBoxActive:{
    borderColor:'white',
    backgroundColor:'rgba(255,255,255,0.4)',
  },
  modeText:{
    fontSize:15,
    fontWeight:'bold',
    color:'rgba(255,255,255,0.7)',
    marginBottom:4,
  },
  modeTextActive:{
    color:'white',
  },
  modeDescription:{
    fontSize:11,
    color:'rgba(255,255,255,0.7)',
    textAlign:'center',
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
    backgroundColor:'rgba(255,255,255,0.3)',
    paddingVertical:16,
    borderRadius:12,
    alignItems:'center',
    marginTop:10,
    marginBottom:50,
    borderWidth:2,
    borderColor:'white',
  },
  startButtonText:{
    color:'white',
    fontSize:18,
    fontWeight:'bold',
    letterSpacing:1,
  },
});