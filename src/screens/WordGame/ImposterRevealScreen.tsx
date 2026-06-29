import {View,Text,StyleSheet,ImageBackground,ScrollView,BackHandler} from 'react-native';
import {useState, useCallback} from "react";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RouteProp} from "@react-navigation/native";
import {useGame} from "../../../store/GameContext";
import { useFocusEffect } from '@react-navigation/native';
import ScreenTitle from "../../components/ScreenTitle";
import NextButton from "../../components/NextButton"; 
import ConfirmModal from "../../components/ConfirmModal";
import ImposterRevealCard from "../../components/ImposterRevealCard";

type RootParamList={
    Roles:undefined;
    Imposter:{votes?:Record<string,number>;mostVoted?:string;imposterNames?:string[]};
    Home:undefined;
};

type ImposterRevealScreenProps={
    navigation:NativeStackNavigationProp<RootParamList,"Imposter">;
    route:RouteProp<RootParamList,"Imposter">;
};

export default function ImposterRevealScreen({navigation,route}:ImposterRevealScreenProps){
    const {gameState}=useGame();
    const imposterNames=gameState.imposterNames??[];
    const impostersCount=imposterNames.length;
    const multipleImposters=impostersCount>1;

    const noImposterMode=imposterNames.length==0;

    // Decide which screen you are coming from
    const fromVotingScreen=route.params?.votes!==undefined;
    const votes=route.params?.votes??{};
    const playerNames=gameState.playerNames.map(n=>typeof n==="object"?(n as {name:string}).name:n);

    const topVoted:string[]=fromVotingScreen ? 
                    [...playerNames]
                    .map(name=>({name,votes:(votes as Record<string,number>)[name]??0}))
                    .sort((a,b)=>b.votes-a.votes)
                    .slice(0,impostersCount)
                    .map(p=>p.name)
                :[];
    
    const [revealed,setRevealed]=useState<boolean>(false);
    const [quitModalVisible,setQuitModalVisible]=useState<boolean>(false);

    // Disable backwards navigation
    useFocusEffect(
        useCallback(()=>{
            const backhandler=BackHandler.addEventListener("hardwareBackPress",()=>true);
            return ()=>backhandler.remove();
        },[])
    );

    const handlePlayAgain=():void=>{
        navigation.reset({
            index:0,
            routes:[{name:'Roles'}],
        });
    };

    const handleQuitConfirm=():void=>{
        navigation.reset({index:0,routes:[{name:"Home"}]});
    };

    return(
        <ImageBackground source={require('../../../assets/Images/HomeImage.png')} style={styles.background} resizeMode='cover'>
            <View style={styles.overlay}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <ScreenTitle style={styles.title} label="Game Over" />
                    
                    {/* People voted for imposter - Only visible in full voting flow*/}
                    {fromVotingScreen && (
                        <View style={styles.box}>
                            {multipleImposters?(
                                <>
                                    {topVoted.map(name=>(
                                        <Text key={name} style={styles.boxHighlight}>{name}</Text>
                                    ))}
                                    <Text style={styles.boxSubText}> WERE VOTED AS THE IMPOSTERS.</Text>
                                </>
                            ):(
                                <>
                                    <Text style={styles.boxHighlight}>{topVoted[0]}</Text>
                                    <Text style={styles.boxSubText}> WAS VOTED AS THE IMPOSTER.</Text>
                                </>
                            )}
                        </View>
                    )}
                    {/*Card Flip Animation */}
                    <ImposterRevealCard imposterNames={imposterNames}
                                        noImposterMode={noImposterMode}
                                        multipleImposters={multipleImposters}
                                        impostersCount={impostersCount}
                                        onFlipComplete={()=>setRevealed(true)}
                    />
                
                {/* Replay and Quit Buttons*/}
                {revealed && (
                    <>
                        <NextButton label="Play Again"
                                    style={styles.playAgainBtn}
                                    onPress={handlePlayAgain}
                        />
                        <NextButton label="Return To Home"
                                    onPress={()=>setQuitModalVisible(true)}
                                    style={styles.homeBtn}
                        />
                    </>
                )}
                </ScrollView>
            </View>

            <ConfirmModal visible={quitModalVisible}
                          title="Are you sure you want to quit?"
                          onDismiss={()=>setQuitModalVisible(false)}
                          buttons={[
                            {label:"Yes",onPress:handleQuitConfirm,style:"destructive"},
                            {label:"No",onPress:()=>setQuitModalVisible(false),style:"cancel"}
                          ]}
            />
        </ImageBackground>
    );
}

const styles=StyleSheet.create({
    background:{
        flex:1,
    },
    overlay:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.6)',
    },
    scrollContent:{
        padding:24,
        paddingTop:70,
        alignItems:"center",
        paddingBottom:40,
    },
    title:{
        fontSize:30,
        marginBottom:24,
    },
    box:{
        backgroundColor:'rgba(255,255,255,0.15)',
        borderRadius:14,
        padding:20,
        marginBottom:24,
        borderWidth:1,
        borderColor:'rgba(255,255,255,0.2)',
        width:'100%',
        alignItems:'center',
    },
    boxHighlight:{
        fontSize:24,
        fontWeight:'bold',
        color:'white',
        marginBottom:4,
    },
    boxSubText:{
        fontSize:13,
        color:'white',
        letterSpacing:2,
        fontWeight:'bold',
        marginTop:8,
    },
    
    playAgainBtn:{
        width:'100%',
        marginBottom:10,
    },
    homeBtn:{
        width:'100%',
        marginBottom:10,
    },
});