import {View,Text,StyleSheet,ImageBackground,TouchableOpacity,Animated,Image,ActivityIndicator} from 'react-native';
import {useState,useEffect,useRef,useCallback} from 'react';
import { useGame } from '../GameContext';
import {getRandomWord,getRandomHint,getCategoryLabel} from './GamePlayFunctions';
import {Accelerometer} from 'expo-sensors';

export default function RoleRevealScreen({navigation}){
    const {gameState}=useGame();
    const {playerNames,imposters,genre,hintsForImposter,showGenreToImposter,noImposterMode,shakeForNext}=gameState;
    const [currentIndex,setCurrentIndex]=useState(0);
    const [isFlipped,setIsFlipped]=useState(false);
    const [roles,setRoles]=useState(null);
    const [loading,setLoading]=useState(true);

    const flipAnimation=useRef(new Animated.Value(0)).current;

    // Assign roles to all players
    useEffect(()=>{
        async function assignRoles() {
            const wordEntry=await getRandomWord(genre);

            const names=playerNames.map(p=>typeof p==="object" ? p.name:p);

            // No imposter mode
            const noImposterTriggered=noImposterMode && Math.random()<0.1;
            
            const imposterIndices=[];
            if (!noImposterTriggered){
                const playerpool=[...Array(playerNames.length).keys()];
                for (let i=0;i<imposters;i++){
                    const randomPos=Math.floor(Math.random()*playerpool.length);
                    imposterIndices.push(playerpool[randomPos]);
                    playerpool.splice(randomPos,1);                 
            }
        }
        const assigned=playerNames.map((name,i)=>{
            const isImposter=imposterIndices.includes(i);
            return{
                name,
                isImposter,
                word:wordEntry?wordEntry.word:'???',
                hint:(isImposter && wordEntry) ? getRandomHint(wordEntry.hints):null,
                category:wordEntry ? wordEntry.category:null,
                noImposterTriggered,
            };
        });
        const shuffled=[...assigned].sort(()=>Math.random()-0.5);
        setRoles(shuffled);
        setLoading(false);
    }
    assignRoles();
}, []);

    //Flip Animation
    const flipCard=useCallback(()=>{
        if(isFlipped) return;
        setIsFlipped(true);
        Animated.spring(flipAnimation,{
            toValue:1,
            friction:8,
            tension:10,
            useNativeDriver:true,
        }).start();
    },[isFlipped,flipAnimation]);

    // Shake functionality
    useEffect(()=>{
        if(!shakeForNext) return;
        let lastX=0,lastY=0,lastZ=0;
        const subscription=Accelerometer.addListener(({x,y,z})=>{
            const diff=Math.abs(x-lastX)+Math.abs(y-lastY)+Math.abs(x-lastZ);
            if (diff>5) flipCard();
            lastX=x;lastY=y;lastZ=z;
        });
        Accelerometer.setUpdateInterval(100);
        return ()=>subscription.remove();
    }, [isFlipped,shakeForNext,flipCard]);

    // Next Player
    useEffect(()=>{
        flipAnimation.setValue(0);
        setIsFlipped(false);
    },[currentIndex]);
    
    const frontRotate=flipAnimation.interpolate({
        inputRange:[0,1],
        outputRange:['0deg',"180deg"],
    });

    const backRotate=flipAnimation.interpolate({
        inputRange:[0,1],
        outputRange:['180deg',"360deg"],
    });
    
    const frontOpacity=flipAnimation.interpolate({
        inputRange:[0.5,0.51],
        outputRange:[1,0],
    });
    
    const backOpacity=flipAnimation.interpolate({
        inputRange:[0.49,0.5],
        outputRange:[0,1],
    });
    
    //Next player/Start Discussion
    const handleNext=()=>{
        if (currentIndex<roles.length-1){
            setCurrentIndex(i=>i+1);
        }else{
            navigation.navigate('Discussion');
        }
    };

    // Loading State
    if(loading || !roles){
        return(
        <ImageBackground source={require('../../assets/Images/HomeImage.png')} style={styles.background} resizeMode="cover">
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='white'/>
            </View>
        </ImageBackground>
    );
    }
    if(!roles[currentIndex]){
        return null;
    }

    const currentRole=roles[currentIndex];
    const isLastPlayer=currentIndex===roles.length-1;

    // Back of card
    const renderCardBack=()=>{
        if (currentRole.isImposter){
            return(
                <View style={styles.cardBackContent}>
                    {showGenreToImposter && currentRole.category && (
                        <Text style={styles.cardGenre}>{getCategoryLabel(currentRole.category)}</Text>
                    )}
                    <Text style={styles.cardBackTitle}>You are the {'\n'}Imposter</Text>
                    {hintsForImposter && currentRole.hint && (
                        <Text style={styles.cardHint}>"{currentRole.hint}"</Text>
                    )}
                    <Text style={styles.cardSubText}>Use this hint to blend in</Text>
                </View>
            );
        }
        return(
            <View style={styles.cardBackContent}>
                {currentRole.category && (
                    <Text style={styles.cardGenre}>{getCategoryLabel(currentRole.category)}</Text>
                )}
                <Text style={styles.cardBackTitle}>The Word is</Text>
                <Text style={styles.cardWord}>{currentRole.word}</Text>
                <Text style={styles.cardSubText}>Find the imposter</Text>
            </View>
        );
    };

    // Main render
    return(
        <ImageBackground source={require('../../assets/Images/HomeImage.png')} style={styles.background} resizeMode="cover">
            <View style={styles.overlay}>
            {/* X button*/}
            <TouchableOpacity style={styles.closeButton} onPress={()=>navigation.navigate('Home')}>
                <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            {/*Player's name */}
            <Text style={styles.playerName}>{currentRole.name}</Text>
            
            {/* Instructions */}
            {!isFlipped && (
                <Text style={styles.instruction}>
                    Tap the card or shake the screen to reveal the word.{"\n"}Make sure no one else sees it!
                </Text>
            )}

            {/* Card Front*/}
            <TouchableOpacity activeOpacity={1} onPress={flipCard} style={styles.cardContainer}>
                {/*Logo of the caard */}
                <Animated.View style={[styles.card,styles.cardFront,{transform:[{rotateY:frontRotate}],opacity:frontOpacity},]}>
                    <Image source={require('../../assets/Images/Card_Image.png')} style={styles.logo} resizeMode='cover' />
                </Animated.View>
            {/*Card Back */}
            <Animated.View style={[styles.card,styles.cardBack,currentRole.isImposter && !currentRole.noImposterTriggered ? styles.cardBackImposter : styles.cardBackCrew,{transform:[{rotateY:backRotate}],opacity:backOpacity},]}>
                {renderCardBack()}
            </Animated.View>
            </TouchableOpacity>
            {/* Pass to Next Person / Start Discussion button*/}
            {isFlipped && (
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>
                        {isLastPlayer ? 'START DISCUSSION':`Pass to ${roles[currentIndex+1].name}`}
                    </Text>
                </TouchableOpacity>
            )}
            </View>
        </ImageBackground>
    )
}
const styles=StyleSheet.create({
    background:{
        flex:1,
    },
    overlay:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.55)',
        alignItems:'center',
        paddingTop:60,
        paddingHorizontal:24,
    },
    loadingContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    closeButton:{
        position:'absolute',
        top:40,
        right:20,
        zIndex:10,
        padding:8,
    },
    closeText:{
        fontSize:40,
        color:'white',
        fontWeight:'bold',
    },
    playerName:{
        fontSize:28,
        fontWeight:'bold',
        color:'white',
        marginBottom:10,
        marginTop:30,
    },
    instruction:{
        fontSize:13,
        color:'rgba(255,255,255,0.75)',
        textAlign:'center',
        marginBottom:30,
        lineHeight:20,
    },
    cardContainer:{
        width:260,
        height:380,
        marginTop:10,
    },
    card:{
        width:'100%',
        height:'100%',
        borderRadius:20,
        position:"absolute",
        backfaceVisibility:'hidden',
        alignItems:'center',
        justifyContent:'center',
        padding:24,
    },
    cardFront:{
        backgroundColor:'#1a1a2e',
        borderWidth:2,
        borderColor:'rgba(255,255,255,0.2)',
        padding:0,
        overflow:'hidden',
    },
    cardBack:{
        borderWidth:2,
        borderColor:"rgba(255,255,255,0.2)",
    },
    cardBackCrew:{
        backgroundColor:'#0d3b6e',
    },
    cardBackImposter:{
        backgroundColor:"#1a0a0a",
    },
    logo:{
        width:'100%',
        height:'100%',
    },
    cardBackContent:{
        alignItems:"center",
        gap:12,
    },
    cardGenre:{
        fontSize:13,
        color:'rgba(255,255,255,0.6)',
        letterSpacing:2,
        textTransform:"uppercase",
        marginBottom:4,
    },
    cardBackTitle:{
        fontSize:22,
        fontWeight:'bold',
        color:'white',
        textAlign:'center',
        lineHeight:30,
    },
    cardWord:{
        fontSize:32,
        fontWeight:'bold',
        color:'white',
        textAlign:'center',
    },
    cardHint:{
        fontSize:18,
        fontWeight:'bold',
        color:'rgba(255,255,255,0.9)',
        textAlign:'center',
        fontStyle:'italic',
    },
    cardSubText:{
        fontSize:13,
        color:'rgba(255,255,255,0.6)',
        textAlign:'center',
        marginTop:4,
    },
    nextButton:{
        marginTop:36,
        backgroundColor:'rgba(255,255,255,0.2)',
        paddingVertical:14,
        paddingHorizontal:32,
        borderRadius:12,
        borderWidth:1,
        borderColor:'rgba(255,255,255,0.4)',
    },
    nextButtonText:{
        color:'white',
        fontSize:15,
        fontWeight:'bold',
        letterSpacing:1,
    },
});