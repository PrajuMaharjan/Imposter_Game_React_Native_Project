import {View,Text,StyleSheet,ImageBackground,ScrollView,BackHandler} from 'react-native';
import {useState,useEffect} from 'react';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useGame} from '../../store/GameContext';
import ToggleRow from "../components/ToggleRow";
import BackButton from "../components/BackButton";
import ScreenTitle from "../components/ScreenTitle";
import NextButton from "../components/NextButton";
import ConfirmModal from "../components/ConfirmModal";

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

export default function Settings({navigation}:SettingsScreenProps){
    const {gameState,setGameState}=useGame();
    const [music,setMusic]=useState(gameState.music);
    const [sound,setSound]=useState(gameState.sound);
    const [haptics,setHaptics]=useState(gameState.haptics);
    const [shakeForNext,setShakeForNext]=useState(gameState.shakeForNext);
    const [modalVisible,setModalVisible]=useState(false);
    const [pendingAction,setPendingAction]=useState<"back" | "goBack" | null>(null);

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
    const saveSettings=():void=>{
        setGameState(prev=>({
        ...prev,
        music,
        sound,
        haptics,
        shakeForNext,
        }));
    }

    // Navigate to Home after saving settings
    const handleSettingsChange=():void=>{
        saveSettings();    
        navigation.navigate("Home");
    }

    const handleBackPress=():void=>{
        if(hasChanges){
            setPendingAction("goBack");
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
                setPendingAction("goBack");
                setModalVisible(true);
                return true;
            }
            return false;
        });
        return ()=>backHandler.remove();
    },[hasChanges,music,sound,haptics,shakeForNext]);

    return(
        <ImageBackground source={require("../../assets/Images/HomeImage.png")} style={styles.background} resizeMode="cover">
            {/*Back button*/}
                <BackButton onPress={handleBackPress} />

        <ScrollView contentContainerStyle={styles.container}>
            <ScreenTitle label="Settings" style={styles.title} />
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
                <NextButton label="Apply Changes" style={styles.applyButton} onPress={handleSettingsChange} />
        </ScrollView>

        <ConfirmModal visible={modalVisible}
                      title="Unsaved Changes"
                      body="You have unsaved changes. What would you like to do?"
                      onDismiss={()=>setModalVisible(false)}
                      buttons={[
                        {label:"Save",onPress:handleModalSave,style:"default"},
                        {label:"Discard",onPress:handleModalDiscard,style:"destructive"},
                        {label:"Save",onPress:setModalVisible(false),style:"cancel"},                       
                      ]}
        />
    </ImageBackground>
    );
}

const styles=StyleSheet.create({
    container:{
        padding:20,
    },
    title:{
        fontSize:25,
        marginBottom:30,
        marginTop:70,
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
    marginBottom:50,
  },
});