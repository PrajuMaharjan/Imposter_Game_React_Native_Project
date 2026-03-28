import {View,Text,StyleSheet,TouchableOpacity,ImageBackground,ScrollView} from 'react-native';
import { useState } from 'react';
import {useGame} from '../GameContext';

export default function VotingScreen({navigation}){
    const {gameState}=useGame();
    const playerNames=gameState.playerNames.map(n=>typeof n==='object'?n.name:n);

    const [currentVoterIndex,setCurrentVoterIndex]=useState(0);

    // Storing votes as { playerName : voteCount }
    const [votes,setVotes]=useState(Object.fromEntries(playerNames.map(name=>[name,0])));

    const currentVoter=playerNames[currentVoterIndex];
    const isLastVoter=currentVoterIndex===playerNames.length-1;

    // Record the vote,move to next voter and navigate to the ResultsScreen if last voter
    const handleVote=(votedFor)=>{
        const updatedVotes={
            ...votes,
            [votedFor]:votes[votedFor]+1,
        };
        setVotes(updatedVotes);
        if(isLastVoter){
            navigation.navigate('Results',{votes:updatedVotes});
        }else{
            setCurrentVoterIndex(i=>i+1);
        }
    };

    return(
        <ImageBackground source={require('../../assets/Images/HomeImage.png')} style={styles.background} resizeMode="cover">
            <View style={styles.overlay}>
                {/* X buton */}
                <TouchableOpacity style={styles.closeButton} onPress={()=>navigation.navigate('Home')}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Vote</Text>
                <Text style={styles.subtitle}>Who do you think is the imposter?</Text>

                {/*Current Voter*/}
                <View style={styles.voterBox}>
                    <Text style={styles.voterLabel}>Current Voter</Text>
                    <Text style={styles.voterName}>{currentVoter}</Text>
                    <Text style={styles.voterCounter}>{currentVoterIndex+1} of {playerNames.length}</Text>
                </View>

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
        fontWeight:'bold',
        color:'white',
        textAlign:'center',
        marginTop:60,
        marginBottom:6,
    },
    subtitle:{
        fontSize:14,
        color:'rgba(255,255,255,0.7)',
        textAlign:'center',
        marginBottom:24
    },
    voterBox:{
        backgroundColor:'rgba(255,255,255,0.15)',
        borderRadius:14,
        padding:16,
        alignItems:'center',
        marginBottom:24,
        borderWidth:1,
        borderColor:'rgba(255,255,255,0.3)',
    },
    voterLabel:{
        fontSize:12,
        color:'rgba(255,255,255,0.6)',
        letterSpacing:2,
        textTransform:'uppercase',
        marginBottom:4,
    },
    voterName:{
        fontSize:26,
        fontWeight:'bold',
        color:'white',
        marginBottom:4,
    },
    voterCounter:{
        fontSize:12,
        color:'rgba(255,255,0.5)',
    },

});