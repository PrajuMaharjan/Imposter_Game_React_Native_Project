import {View,Text,StyleSheet,ImageBackground,ScrollView,BackHandler} from 'react-native';
import {useState,useEffect} from 'react';
import {NativeStackNavigationProp}  from "@react-navigation/native-stack";
import {useGame} from '../../store/GameContext';
import ToggleRow from "../components/ToggleRow";
import BackButton from "../components/BackButton";
import ScreenTitle from "../components/ScreenTitle";
import NextButton from "../components/NextButton";
import ConfirmModal from "../components/ConfirmModal";

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
    const [modalVisible,setModalVisible]=useState(false);

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
    const saveSettings=():void=>{
        setGameState(prev=>({
        ...prev,
        hintsForImposter,
        showGenreToImposter,
        noImposterMode,
        }));
    };

    // Navigate back to GameSettingsScreen after saving
    const handleApply=():void=>{
      saveSettings();
      navigation.navigate("GameSettings");
    }
    
    const handleBackPress=():void=>{
        if(hasChanges){
            setModalVisible(true);
        }else{
            navigation.goBack();
        }
      };

    const handleModalDiscard=():void=>{
        setModalVisible(false);
        navigation.goBack();
    }

    const handleModalSave=():void=>{
        setModalVisible(false);
        saveSettings();
        navigation.goBack();
    };

    useEffect(()=>{
        const backHandler=BackHandler.addEventListener("hardwareBackPress",()=>{
            if(hasChanges){
                setModalVisible(true);
                return true;
            }
            return false;
        });
        return ()=>backHandler.remove();
    },[hasChanges,hintsForImposter,showGenreToImposter,noImposterMode]);

    return(
        <ImageBackground source={require("../../assets/Images/HomeImage.png")} style={styles.background} resizeMode="cover">
        
        {/*Back button*/}
        <BackButton onPress={handleBackPress} />

        <ScrollView contentContainerStyle={styles.container}>
            <ScreenTitle style={styles.heading} label="Advanced Game Settings" />
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
                    <NextButton label="Apply Changes" style={styles.applyButton} onPress={handleApply} />
           </ScrollView>
           <ConfirmModal visible={modalVisible}
                         title="Unsaved Changes"
                         body="You have unsaved changes. What would you like to do?"
                         onDismiss={()=>setModalVisible(false)}
                         buttons={[
                        {label:'Save',onPress:handleModalSave,style:"default"},
                        {label:'Discard',onPress:handleModalDiscard,style:'destructive'},
                        {label:'Cancel',onPress:()=>setModalVisible(false),style:'cancel'},
                    ]}
            />
        </ImageBackground>
    );
}

const styles=StyleSheet.create({
    background:{
        flex:1,
    },
    container:{
        padding:20,
    },
    heading:{
        fontSize:25,
        marginBottom:30,
        marginTop:100,
  },
    advancedBox:{
      backgroundColor:'rgba(255,255,255,0.15)',
      borderRadius:12,
      padding:14,
      marginBottom:16,
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
    marginBottom:50,
  },
});