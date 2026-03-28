import {View,Text,StyleSheet,TouchableOpacity,ImageBackground,ScrollView} from 'react-native';
import { useMemo } from 'react';
import { useGame } from '../GameContext';

export default function DiscussionScreen({navigation}){
    const {gameState}=useGame();
    const {playerNames}=gameState;

    const startingPlayer=useMemo(()=>{
        const names=playerNames.map(n=>typeof n==='object'?n.name:n);
        return names[Math.floor(Math.random()*names.length)];
    },[]);

    const handleAgain=()=>{
        navigation.reset({
        index:0,
        routes:[{name:'Roles'}],
    });
};

    return(
        <ImageBackground source={require('../../assets/Images/HomeImage.png')} style={styles.background} resizeMode="cover">
        
        {/* X button*/}
        <TouchableOpacity style={styles.closeButton} onPress={()=>navigation.navigate('Home')}>
            <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.overlay}>
            <Text style={styles.title}>Discussion Time</Text>
         
         {/*Box 1 Starting Player */}
         <View style={styles.box}>
            <Text style={styles.boxTitle}>Starting Player</Text>
            <Text style={styles.highlight}>{startingPlayer}</Text>
            <Text style={styles.boxSubText}>starts the round.</Text>
         </View>

        {/*Box 2 Group Discussion*/}
         <View style={styles.box}>
            <Text style={styles.boxTitle}>Group Discussion</Text>
            <Text style={styles.boxSubText}>Go clockwise.</Text>
         </View>

         {/* Box 3 Vote*/}
         <View style={styles.box}>
            <Text style={styles.boxTitle}>Vote</Text>
            <Text style={styles.boxSubText}>Go a few rounds. Move to Vote when ready</Text>
         </View>

        {/*Buttons*/}
        <TouchableOpacity style={styles.voteBtn} onPress={()=>navigation.navigate('Vote')}>
            <Text style={styles.voterBtnText}>Ready To Vote</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.againBtn} onPress={handleAgain}>
            <Text style={styles.againText}>Play Again</Text>
        </TouchableOpacity>
        </View>
        </ScrollView>
        </ImageBackground>
    );
}

const styles=StyleSheet.create({
    background:{
        flex:1,
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
        fontWeight:'bold',
        color:'white',
        textAlign:'center',
        marginTop:80,
        marginBottom:50,
    },
    box:{
        backgroundColor:'rgba(255,255,255,0.15)',
        borderRadius:14,
        padding:16,
        marginBottom:12,
        borderWidth:1,
        borderColor:'rgba(255,255,255,0.2)'
    },
    boxTitle:{
        fontSize:15,
        fontWeight:'bold',
        color:'white',
        marginBottom:4,
    },
    highlight:{
        fontSize:22,
        fontWeight:'bold',
        color:'white',
        marginBottom:4,
    },
    boxSubText:{
        fontSize:13,
        color:'rgba(255,255,255,0.75)',
        lineHeight:18,
    },
    voteBtn:{
        backgroundColor:'rgba(255,255,255,0.3)',
        paddingVertical:16,
        borderRadius:12,
        alignItems:'center',
        marginTop:10,
        marginBottom:10,
        borderWidth:2,
        borderColor:'white',
    },
    voterBtnText:{
        color:'white',
        fontSize:18,
        fontWeight:'bold',
        letterSpacing:1,
    },
    againBtn:{
        backgroundColor:'rgba(255,255,255,0.3)',
        paddingVertical:16,
        borderRadius:12,
        alignItems:'center',
        marginBottom:80,
        borderWidth:2,
        borderColor:'white',
    },
    againText:{
        color:'white',
        fontSize:18,
        fontWeight:'bold',
        letterSpacing:1,
    },
});