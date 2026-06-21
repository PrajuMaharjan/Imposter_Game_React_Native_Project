import {View,Text,StyleSheet,ImageBackground,TouchableOpacity,BackHandler,ActivityIndicator,ViewStyle} from 'react-native';
import {useState,useEffect,useCallback} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import { useGame } from '../../../store/GameContext';
import {getRandomWord,getRandomHint,getCategoryLabel} from '../../../constants/GamePlayFunctions_WordGame';
import RoleCard from "../../components/RoleCard";
import QuitButton from "../../components/QuitButton";

type RootParamList={
    Roles:undefined;
    Discussion:undefined;
    Home:undefined;
};

type RoleRevealScreenProps={
    navigation:NativeStackNavigationProp<RootParamList,"Roles">;
};

type AssignedRole={
    name:string;
    isImposter:boolean;
    word:string;
    hint:string | null;
    category:string | null;
    noImposterTriggered:boolean;
};

export default function RoleRevealScreen({navigation}:RoleRevealScreenProps){
    const {gameState,setGameState}=useGame();
    const {playerNames,imposters,genre,hintsForImposter,showGenreToImposter,noImposterMode,shakeForNext}=gameState;
    const [currentIndex,setCurrentIndex]=useState<number>(0);
    const [isFlipped,setIsFlipped]=useState<boolean>(false);
    const [roles,setRoles]=useState<AssignedRole[] | null>(null);
    const [loading,setLoading]=useState<boolean>(true);

    // Assign roles to all players
    useEffect(()=>{
        async function assignRoles():Promise<void> {
            const wordEntry=await getRandomWord(genre);

            const names=playerNames.map(p=>typeof p==="object" ? (p as {name:string}).name:p);

            // No imposter mode
            const noImposterTriggered=noImposterMode && Math.random()<0.1;
            
            const imposterIndices:number[]=[];
            if (!noImposterTriggered){
                const playerpool=[...Array(playerNames.length).keys()];
                for (let i=0;i<imposters;i++){
                    const randomPos=Math.floor(Math.random()*playerpool.length);
                    imposterIndices.push(playerpool[randomPos]);
                    playerpool.splice(randomPos,1);                 
            }
        }
        const assigned:AssignedRole[]=names.map((name,i)=>{
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
        setGameState(prev=>({
            ...prev,
            imposterNames:assigned.filter(p=>p.isImposter).map(p=>p.name),
    }));
        setLoading(false);
    }
    assignRoles();

}, []);
    
    // Disable go back from harwarebackbuttonpress
    useFocusEffect(
        useCallback(()=>{
            const backhandler=BackHandler.addEventListener('hardwareBackPress',()=>true);
            return ()=>backhandler.remove();
    },[]));


    const handleFlip=useCallback(():void=>{
        if(isFlipped) return;
        setIsFlipped(true);
    },[isFlipped]);

    // Next player/Start Discussion
    const handleNext=():void=>{
        if(!roles) return;
        if (currentIndex<roles.length-1){
            setCurrentIndex(i=>i+1);
            setIsFlipped(false);
        }else{
            navigation.navigate('Discussion');
        }
    };

    // Back of card
    const renderCardBack=():React.ReactNode=>{
        if(!roles) return null;
        const currentRole=roles[currentIndex];

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

    const getCardBackStyle=():ViewStyle=>{
        if(!roles) return {};
        const currentRole=roles[currentIndex];
        return currentRole.isImposter && !currentRole.noImposterTriggered ? styles.cardBackImposter : styles.cardBackCrew;
    };

    // Loading State
    if(loading || !roles){
        return(
        <ImageBackground source={require('../../../assets/Images/HomeImage.png')} style={styles.background} resizeMode="cover">
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
    
    // Main render
    return(
        <ImageBackground source={require('../../../assets/Images/HomeImage.png')} style={styles.background} resizeMode="cover">
            <View style={styles.overlay}>
            {/* X button*/}
            <QuitButton onConfirm={()=>navigation.reset({index:0,routes:[{name:'Home'}]})} />
                
            {/*Player's name */}
            <Text style={styles.playerName}>{currentRole.name}</Text>
            
            {/* Instructions */}
            {!isFlipped && (
                <Text style={styles.instruction}>
                    Tap the card or shake the screen to reveal the word.{"\n"}Make sure no one else sees it!
                </Text>
            )}

            {/*  Le Card */}
            <RoleCard key={currentIndex}
                      isFlipped={isFlipped}
                      onFlip={handleFlip}
                      renderBack={renderCardBack}
                      cardBackStyle={getCardBackStyle()}
                      shakeForNext={shakeForNext}
            />

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
    cardBackCrew:{
        backgroundColor:'#0d3b6e',
    },
    cardBackImposter:{
        backgroundColor:"#1a0a0a",
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