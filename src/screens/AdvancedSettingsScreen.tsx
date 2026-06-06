import {View,Text,StyleSheet,ImageBackground,TouchableOpacity,ScrollView,Alert,BackHandler} from 'react-native';
import {useState,useEffect} from 'react';
import {NativeStackNavigationProp}  from "@react-navigation/native-stack";
import {useGame} from '../../store/GameContext';
import ToggleRow from "../components/ToggleRow";

type RootStackParamList={
  GameSettings:undefined;
  "Advanced Settings":undefined;
};

type AdvancedSettingsScreenProps={
  navigation:NativeStackNavigationProp<RootStackParamList,"Advanced Settings">;
};

type OriginalSettings={
  hintsForImposter:boolean;
  showGenreToImposter:boolean;
  noImposterMode:boolean;
};

export default function AdvancedSettingsScreen({navigation}:AdvancedSettingsScreenProps){
    const {gameState,setGameState}=useGame();
    const  gameMode=gameState.gameMode;
    const [hintsForImposter,setHintsForImposter]=useState(gameState.hintsForImposter);
    const [noImposterMode,setnoImposterMode]=useState(gameState.noImposterMode);
    const [showGenreToImposter,setshowGenreToImposter]=useState(gameState.showGenreToImposter);

    // Original values
    const [original]=useState<OriginalSettings>({
      hintsForImposter:gameState.hintsForImposter,
      showGenreToImposter:gameState.showGenreToImposter,
      noImposterMode:gameState.noImposterMode,
    });
    
    //Check for changed settings
    const hasChanges=
    hintsForImposter!==original.hintsForImposter ||
    showGenreToImposter!==original.showGenreToImposter ||
    noImposterMode!==original.noImposterMode;

    // Save Settings to GameContext
    const saveSettings=()=>{
        setGameState(prev=>({
        ...prev,
        hintsForImposter,
        showGenreToImposter,
        noImposterMode,
        }));
    };

    // Navigate back to GameSettingsScreen after saving
    const handleApply=()=>{
      saveSettings();
      navigation.navigate("GameSettings");
    }
    
    //Alert and Decision Maker for backPress
    useEffect(()=>{
      const backAction=()=>{
        if(hasChanges){
          Alert.alert('Unsaved Changes',"You have unsaved changes. What would you like to do?",
                    [
                        {text:'Cancel',style:'cancel'},
                        {text:'Discard',onPress:()=>navigation.goBack(),style:'destructive'},
                        {text:'Save',onPress:()=>{saveSettings();navigation.goBack();}},
                    ]
                  );
          return true;
        }
        return false;
      };

  const backHandler=BackHandler.addEventListener('hardwareBackPress',backAction)
      return ()=>backHandler.remove();
    },[hasChanges,hintsForImposter,showGenreToImposter,noImposterMode]);
    
    const handleBackPress=()=>{
        if(hasChanges){
          Alert.alert('Unsaved Changes',"You have unsaved changes. What would you like to do?",
                    [
                        {text:'Cancel',style:'cancel'},
                        {text:'Discard',onPress:()=>navigation.goBack(),style:'destructive'},
                        {text:'Save',onPress:()=>{saveSettings();navigation.goBack();}},
                    ]
                  );
                }
                  else{
                    navigation.goBack();
                  }
                };

    return(
        <ImageBackground source={require("../assets/Images/HomeImage.png")} style={styles.background} resizeMode="cover">
        
        {/*Back button*/}
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backArrow}>←</Text> 
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Advanced Game Settings</Text>
                  <View style={styles.advancedBox}>
                    {gameMode==='Word' ? (
                    <>
                      {/* Toggle hints for imposter*/}
                      <ToggleRow label="Show Hints For Imposter?" value={hintsForImposter} onValueChange={setHintsForImposter} />  
                      <View style={styles.divider} />
        
                      {/*Toggle to show or hide genre from imposter*/}
                      <ToggleRow label="Show Genre To Imposter" value={showGenreToImposter} onValueChange={setshowGenreToImposter} />  
                      <View style={styles.divider} />

                      {/*Toggle for No Imposter Mode*/}
                      <ToggleRow label="No Imposter Mode" value={noImposterMode} onValueChange={setnoImposterMode} />  
                    </>
                    ):(
                      <Text style={styles.emptyAdvanced}>No advanced Settings yet for Questions Game</Text>
                    )}
                    </View>

                {/* Apply Changes button*/}
                    <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                      <Text style={styles.applyButtonText}>Apply Changes</Text>
                    </TouchableOpacity>
           </ScrollView>
        </ImageBackground>
    );
}

const styles=StyleSheet.create({
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
    container:{
        padding:20,
    },
    heading:{
        fontSize:25,
        fontWeight:'bold',
        color:'white',
        marginBottom:30,
        marginTop:100,
        textAlign:'center',
  },
    advancedBox:{
    backgroundColor:'rgba(255,255,255,0.15)',
    borderRadius:12,
    padding:14,
    marginBottom:16,
  },
  toggleInfo:{
    flex:1,
    paddingRight:12,
  },
  toggleRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingVertical:8,
  },
  toggleLabel:{
    color:'white',
    fontSize:13,
    fontWeight:'bold',
    marginBottom:2,
  },
  divider:{
    height:1,
    backgroundColor:'rgba(255,255,255,0.15)',
  },
  emptyAdvanced:{
    fontSize:13,
    textAlign:'center',
    paddingVertical:8,
    color:'white',
  },
  applyButton:{
    backgroundColor:'rgba(255,255,255,0.3)',
    paddingVertical:16,
    borderRadius:12,
    alignItems:'center',
    marginTop:10,
    marginBottom:50,
    borderWidth:2,
    borderColor:'white',
  },
  applyButtonText:{
    color:'white',
    fontSize:18,
    fontWeight:'bold',
    letterSpacing:1,
  },
});