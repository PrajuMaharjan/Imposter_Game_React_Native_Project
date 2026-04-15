import {Alert,View,Text,StyleSheet,TouchableOpacity,ImageBackground,ScrollView, BackHandler} from 'react-native';
import {useState,useMemo, useCallback} from 'react';
import {useGame} from '../GameContext';
import { useFocusEffect } from '@react-navigation/native';

export default function Results({navigation,route}){
    const {gameState}=useGame();
    const playerNames=gameState.playerNames.map(n=>typeof n==="object"?n.name:n);
    const imposterNames=gameState.imposterNames;
    const imposterCount=gameState.imposters;


    // Pass votes from VotingScreen
    const votes=route.params?.votes ?? Object.fromEntries(playerNames.map(name=>[name,0]));

    const [revealed,setRevealed]=useState(false);

    // Sorting the players by vote count
    const sortedPlayers=useMemo(()=>{
        const players=playerNames.map(name=>({name,votes:votes[name]??0}));
        if(!revealed) return players;
        return [...players].sort((a,b)=>b.votes-a.votes);
    },[revealed,playerNames,votes]);

    const sortedVoteCounts=[...new Set(Object.values(votes))].sort((a,b)=>b-a);
    const threshold=sortedVoteCounts[imposterCount-1]??0;

    // Disable go back from hardwarebackbuttonpress
    useFocusEffect(
        useCallback(()=>{
            const backhandler=BackHandler.addEventListener("hardwareBackPress",()=>true);
            return ()=>backhandler.remove();
        })
    )
    const handleReveal=()=>{
        if(!revealed){
            setRevealed(true);
        }else{
            navigation.navigate("Imposter",{
                votes,
                mostVoted:sortedPlayers[0].name,
                imposterNames,
            });
        }
    };

    const topNames=[...playerNames]
                        .map(name=>({name,votes:votes[name]??0}))
                        .sort((a,b)=>b.votes-a.votes)
                        .slice(0,imposterCount)
                        .map(p=>p.name);

    // Alert for X Press
    const handleXPress=()=>{
        Alert.alert("Are you sure you want to quit?","",
            [
                {text:'Yes',onPress:()=>navigation.navigate("Home")},
                {text:'No',style:'cancel'}
            ]
        );
    };

    return(
        <ImageBackground source={require('../../assets/Images/HomeImage.png')} style={styles.background} resizeMode='cover'>
            <View style={styles.overlay}>
                {/* X buton */}
                <TouchableOpacity style={styles.closeButton} onPress={handleXPress}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Results of Vote</Text>
                <Text style={styles.subtitle}>{revealed?"Sorted by Vote Count":'Tap to reveal the vote count'}</Text>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {sortedPlayers.map((player)=>{
                        const isHighest=revealed && topNames.includes(player.name) && player.votes>0;
                        return(
                            <View key={player.name} style={[styles.playerRow, isHighest && styles.playerRowHighlighted]}>
                                <Text style={[styles.playerName,isHighest && styles.playerNameHighlighted]}>
                                    {player.name}
                                </Text>
                            {revealed && (
                                <Text style={[styles.voteCount,isHighest && styles.voteCountHighlighted]}>
                                    Votes : {player.votes}
                                </Text>
                            )}                       
                            </View>
                        );
                    })}
                </ScrollView> 
            {/* Changing Button */}
            <TouchableOpacity style={[styles.revealBtn,revealed && styles.imposterBtn]} onPress={handleReveal}>
                <Text style={styles.revealBtnText}>
                    {revealed ? "Reveal Imposter" : "Reveal Vote Count"}
                </Text>
            </TouchableOpacity>
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
        backgroundColor:'rgba(0,0,0,0.55)',
        padding:24,
        paddingTop:60,
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
    title:{
        fontSize:28,
        fontWeight:"bold",
        color:"white",
        textAlign:"center",
        marginTop:30,
        marginBottom:6,
    },
    subtitle:{
        fontSize:18,
        fontWeight:"bold",
        color:"white",
        textAlign:"center",
        marginTop:30,
        marginBottom:26,
    },
    scrollContent:{
        paddingBottom:20,
    },
    playerRow:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        backgroundColor:"rgba(255,255,255,0.15)",
        borderRadius:12,
        padding:16,
        marginBottom:10,
        borderWidth:1,
        borderColor:"rgba(255,255,255,0.2)",
    },
    playerRowHighlighted:{
        backgroundColor:"rgba(255,50,50,0.3)",
        borderColor:"rgba(255,80,80,0.7)",
    },
    playerName:{
        fontSize:18,
        fontWeight:"bold",
        color:"white",
    },
    playerNameHighlighted:{
        color:"white",
    },
    voteCount:{
        fontSize:14,
        color:"rgba(255,255,255,0.7)",
        fontWeight:"bold",
    },
    voteCountHighlighted:{
        color:"rgba(255,180,180,1)",
        fontSize:16,
    },
    revealBtn:{
        backgroundColor:"rgba(255,255,255,0.3)",
        paddingVertical:16,
        borderRadius:12,
        alignItems:'center',
        marginTop:16,
        marginBottom:50,
        borderWidth:2,
        borderColor:'white',
    },
    imposterBtn:{
        backgroundColor:'rgba(255,50,50,0.4)',
        borderColor:"rgba(255,80,80,0.8)",
    },
    revealBtnText:{
        color:'white',
        fontSize:18,
        fontWeight:"bold",
        letterSpacing:1,
    }
});