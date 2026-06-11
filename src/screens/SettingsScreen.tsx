import {View,Text,StyleSheet,ImageBackground,TouchableOpacity,ScrollView,Alert,BackHandler} from 'react-native';
import {useState,useEffect} from 'react';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useGame} from '../../store/GameContext';
import ToggleRow from "../components/ToggleRow";

type RootStackParamList={
    Home:undefined;
    Settings:undefined;
};

type SettingsScreenProps={
    navigation:NativeStackNavigationProp<RootStackParamList,"Settings">;
};

type OriginalSettings={
    music:boolean;
    sound:boolean;
    haptics:boolean;
    shakeForNext:boolean;
};

export default function Settings({navigation}){
    const {gameState,setGameState}=useGame();
    const [music,setMusic]=useState(gameState.music);
    const [sound,setSound]=useState(gameState.sound);
    const [haptics,setHaptics]=useState(gameState.haptics);
    const [shakeForNext,setShakeForNext]=useState(gameState.shakeForNext);

    /* Original values */
    const [original]=useState<OriginalSettings>({
        music:gameState.music,
        sound:gameState.sound,
        haptics:gameState.haptics,
        shakeForNext:gameState.shakeForNext,
    })

    // Check for changed settings
    const hasChanges=
    music!==original.music ||
    sound!==original.sound ||
    haptics!==original.haptics ||
    shakeForNext!==original.shakeForNext;

    // Save settings to GameContext
    const saveSettings=()=>{
        setGameState(prev=>({
        ...prev,
        music,
        sound,
        haptics,
        shakeForNext,
        }));
    }

    // Navigate to Home after saving settings
    const handleSettingsChange=()=>{
        saveSettings();    
        navigation.navigate("Home");
    }

    // Alert and decision maker for backPress
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
    },[hasChanges,music,sound,haptics,shakeForNext]);

    const handleBackPress=()=>{
        if(hasChanges){
            Alert.alert('Unsaved Changes',"You have unsaved changes. What would you like to do?",
            [
                {text:'Cancel',style:'cancel'},
                {text:'Discard',onPress:()=>navigation.goBack(),style:'destructive'},
                {text:'Save',onPress:()=>{saveSettings();navigation.goBack();}},
                    ]
                );}
                else{
                    navigation.goBack();
                }
    };

    return(
        <ImageBackground source={require("../../assets/Images/HomeImage.png")} style={styles.background} resizeMode="cover">
            {/*Back button*/}
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}> Settings </Text>
            <View style={styles.box}>

                {/* Music toggle*/}
                <ToggleRow label="Music" value={music} onValueChange={setMusic} />
                <View style={styles.divider} />

                {/* Sound toggle*/}
                <ToggleRow label="Sound" value={sound} onValueChange={setSound} />
                <View style={styles.divider} />

                {/* Haptics toggle*/}
                <ToggleRow label="haptics" value={haptics} onValueChange={setHaptics} />
                <View style={styles.divider} />

                {/* Shake toggle*/}
                <ToggleRow label="Shake to Move to Next Person" value={shakeForNext} onValueChange={setShakeForNext} />
                <View style={styles.divider} />

            </View>
            
            {/* Apply changes button*/}
                <TouchableOpacity style={styles.applyButton} onPress={handleSettingsChange}>
                    <Text style={styles.applyButtonText}>Apply Changes</Text>
                </TouchableOpacity>
        </ScrollView>
    </ImageBackground>
    );
}

const styles=StyleSheet.create({
    container:{
        padding:20,
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
    title:{
        fontSize:25,
        fontWeight:'bold',
        color:'white',
        marginBottom:30,
        marginTop:70,
        textAlign:'center',
    },
    background:{
        flex:1,
    },
    box:{
    backgroundColor:'rgba(255,255,255,0.15)',
    borderRadius:12,
    padding:14,
    marginBottom:16,
  },
  divider:{
    height:1,
    backgroundColor:'rgba(255,255,255,0.15)',
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