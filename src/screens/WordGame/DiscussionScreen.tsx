import {View,StyleSheet,ImageBackground,BackHandler,ScrollView} from 'react-native';
import { useMemo,useCallback } from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import { useGame } from '../../../store/GameContext';
import QuitButton from "../../components/QuitButton";
import ScreenTitle from "../../components/ScreenTitle";
import NextButton from "../../components/NextButton";
import InfoBox from "../../components/InfoBox";

type RootParamList={
    Roles:undefined;
    Discussion:undefined;
    Vote:undefined;
    Imposter:undefined;
    Home:undefined;
};

type DiscussionScreenProps={
    navigation:NativeStackNavigationProp<RootParamList,"Discussion">;
};

export default function DiscussionScreen({navigation}:DiscussionScreenProps){
    const {gameState}=useGame();
    const {playerNames}=gameState;
    
    // Disable go back from hardwarebackbuttonpress
    useFocusEffect(
        useCallback(()=>{
        const backhandler=BackHandler.addEventListener('hardwareBackPress',()=>true);
        return ()=>backhandler.remove();
    },[]));
    
    const startingPlayer=useMemo(()=>{
        const names=playerNames.map(n=>typeof n==='object'?(n as{name:string}).name:n);
        return names[Math.floor(Math.random()*names.length)];
    },[]);

    const handleAgain=():void=>{
        navigation.reset({
        index:0,
        routes:[{name:'Roles'}],
    });
};

    return(
        <ImageBackground source={require('../../../assets/Images/HomeImage.png')} style={styles.background} resizeMode="cover">
        
            {/* X button*/}
            <QuitButton onConfirm={()=>navigation.reset({index:0,routes:[{name:"Home"}]})} />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.overlay}>
                    <ScreenTitle label="Discussion Time" style={styles.title} />
                
                    {/*Box 1 Starting Player */}
                    <InfoBox title="Starting Player" highlight={startingPlayer} subText="starts the round." />

                    {/*Box 2 Group Discussion*/}
                    <InfoBox title="Group Discussion" subText="Go clockwise." />

                    {/* Box 3 Vote*/}
                    <InfoBox title="Vote" subText="Go a few rounds. Move to Vote when ready" />

                    {/*Buttons*/}
                    <NextButton label="Ready To Vote" style={styles.voteBtn} onPress={()=>navigation.navigate('Vote')} />
                    
                    <NextButton label="Reveal Imposter" style={styles.skipToFinaleBtn} onPress={()=>navigation.navigate('Imposter')} />
                        
                    <NextButton label="Play Again" style={styles.againBtn} onPress={handleAgain} />
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

const styles=StyleSheet.create({
    background:{
        flex:1,
    },
    scrollContent:{
        paddingBottom:20,
  },
    overlay:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.45)',
        padding:20,
        paddingTop:60,
    },
    title:{
        fontSize:26,
        marginTop:80,
        marginBottom:50,
    },
    voteBtn:{
        marginTop:10,
    },
    skipToFinaleBtn:{
        marginTop:10,
        marginBottom:10,
    },
    againBtn:{
        marginBottom:80,
    },
});