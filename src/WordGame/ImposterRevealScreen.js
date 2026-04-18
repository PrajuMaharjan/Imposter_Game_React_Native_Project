import {View,Text,StyleSheet,TouchableOpacity,ImageBackground,ScrollView,Animated,BackHandler,Alert} from 'react-native';
import {useState,useRef, useCallback} from "react";
import {useGame} from "../GameContext";
import { useFocusEffect } from '@react-navigation/native';

export default function ImposterRevealScreen({navigation,route}){
    const {gameState}=useGame();
    const imposterNames=gameState.imposterNames??[];
    const impostersCount=imposterNames.length;
    const multipleImposters=impostersCount>1;

    // Decide which screen you are coming from
    const fromVotingScreen=route.params?.votes!==undefined;
    const votes=route.params?.votes>>{};
    const playerNames=gameState.playerNames.map(n=>typeof n==="object"?n.name:n);

    const topVoted=fromVotingScreen ? 
                    [...playerNames]
                    .map(name=>({name,votes:votes[name]??0}))
                    .sort((a,b)=>b.votes-a.votes)
                    .slice(0,impostersCount)
                    .map(p=>p.name)
                :[];
    
    const [revealed,setRevealed]=useState(false);
    const flipAnim=useRef(new Animated.Value(0)).current;

    const flipCard=()=>{
        if(revealed) return;
        setRevealed(true);
        Animated.spring(flipAnim,{
            toValue:1,
            friction:8,
            tension:10,
            useNativeDriver:true,
        }).start();
    };

    const frontRotate=flipAnim.interpolate({
        inputRange:[0,1],
        outputRange:['0deg','180deg'],
    });

    const backRotate=flipAnim.interpolate({
        inputRange:[0,1],
        outputRange:['180deg','360deg'],
    });

    const frontOpacity=flipAnim.interpolate({
        inputRange:[0.49,0.5],
        outputRange:[1,0],
    });

    const backOpacity=flipAnim.interpolate({
        inputRange:[0.49,0.5],
        outputRange:[0,1],
    });

    // Disable backwards navigation
    useFocusEffect(
        useCallback(()=>{
            const backhandler=BackHandler.addEventListener("hardwareBackPress",()=>true);
            return ()=>backhandler.remove();
        })
    )

    const handlePlayAgain=()=>{
        navigation.reset({
            index:0,
            routes:[{name:'Roles'}],
        });
    };

    const handleQuit=()=>{
        Alert.alert("Are you sure you want to quit","",
            [
                {text:"Yes",onPress:()=>navigation.navigate("Home")},
                {text:"No",style:'cancel'}
            ]
        );
    };

    return(
        <ImageBackground source={require('../../assets/Images/HomeImage.png')} style={styles.background} resizeMode='cover'>
            <View style={styles.overlay}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.title}>Game Over</Text>
                    
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
                    <Text style={styles.cardLabel}>
                        {revealed ?
                         (multipleImposters ? "The Imposters Were ":"The Imposter Was") : "Tap the card to reveal the Imposter(s)"}
                    </Text>
                    
                <TouchableOpacity activeOpacity={1} onPress={flipCard} style={styles.cardContainer}>
                    {/* Card Front */}
                    <Animated.View style={[
                        styles.card,
                        styles.cardFront,
                        {transform:[{rotateY:frontRotate}],opacity:frontOpacity}
                    ]}>
                        <Text style={styles.cardFrontText}>Tap to Reveal</Text>
                    </Animated.View>
                    
                    {/* Card Back */}
                    <Animated.View style={[
                        styles.card,
                        styles.cardBack,
                        {transform:[{rotateY:backRotate}],opacity:backOpacity}
                    ]}>
                        {multipleImposters?(
                            <>
                                <Text styles={styles.cardBackLabel}>The Imposters Were</Text>
                                {imposterNames.map(name=>(
                                    <Text key={name} style={styles.cardBackName}>{name}</Text>
                                ))}
                            </>
                        ):(
                            <>
                                <Text style={styles.cardBackLabel}>The Imposter Was</Text>
                                <Text style={styles.cardBackName}>{imposterNames[0]}</Text>
                            </>
                        )}
                    </Animated.View>
                </TouchableOpacity> 
                
                {/* Replay and Quit Buttons*/}
                {revealed && (
                    <>
                        <TouchableOpacity style={styles.playAgainBtn} onPress={handlePlayAgain}>
                            <Text style={styles.playAgainText}>Play Again</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.homeBtn} onPress={handleQuit}>
                            <Text style={styles.homeText}>Return To Home</Text>
                        </TouchableOpacity>
                    </>
                )}
                </ScrollView>
            </View>
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
        fontWeight:'bold',
        color:'white',
        textAlign:'center',
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
    cardLabel:{
        fontSize:14,
        color:'rgba(255,255,255,0.7)',
        marginBottom:16,
        textAlign:'center',
    },
    cardContainer:{
        width:260,
        height:360,
        marginBottom:32,
    },
    card:{
        width:'100%',
        heuight:'100%',
        borderRadius:20,
        position:'absolute',
        backfaceVisibility:'hidden',
        alignItems:'center',
        justifyContent:'center',
        padding:24,
    },
    cardFront:{
        backgroundColor:'#1a1a2e',
        borderWidth:2,
        borderColor:'rgba(255,255,255,0.2',
    },
    cardFrontText:{
        fontSize:18,
        color:'rgba(255,255,255,0.7)',
        fontWeight:'bold',
    },
    cardBack:{
        backgroundColor:'#3b0a0a',
        borderWidth:2,
        borderColor:'rgba(255,80,80,0.5)',
        alignItems:'center',
        gap:12,
    },
    cardBackLabel:{
        fontSize:14,
        color:'rgba(255,280,180,0.8)',
        letterSpacing:2,
        textTransform:'uppercase',
        textAlign:'center',
    },
    playAgainBtn:{
        backgroundColor:'rgba(255,255,255,0.3)',
        paddingVertical:16,
        borderRadius:12,
        alignItems:'center',
        width:'100%',
        marginBottom:10,
        borderWidth:2,
        borderColor:'white',
    },
    playAgainText:{
        color:'white',
        fontSize:18,
        fontWeight:'bold',
        letterSpacing:1,
    },
    homeBtn:{
        backgroundColor:'rgba(255,255,255,0.1)',
        paddingVertical:16,
        borderRadius:12,
        alignItems:'center',
        width:'100%',
        borderWidth:1,
        borderColor:'rgba(255,255,255,0.4)',
        marginBottom:80,
    },
    homeText:{
        color:'rgba(255,255,255,0.7)',
        fontSize:18,
        fontWeight:'bold',
        letterSpacing:1,
    },
});