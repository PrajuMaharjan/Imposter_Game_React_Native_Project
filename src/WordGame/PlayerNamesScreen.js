import {View,Text,StyleSheet,ImageBackground,TouchableOpacity,ScrollView,TextInput,Alert} from 'react-native';
import {useEffect, useState} from 'react';
import {useGame} from '../GameContext';

export default function EnterNames({navigation}){
    const {gameState,setGameState}=useGame();

    // Load names from GameContext
    const [players,setPlayers]=useState(gameState.playerNames.length>0 ? gameState.playerNames.map((name,i)=>({id:i+1,name})) : Array.from({length:gameState.players},(_,i)=>({id:i+1,name:`Player ${i+1}`})));
    const [imposters,setImposters]=useState(gameState.imposters);
    const [editingId,setEditingId]=useState(null);

    useEffect(()=>{
        if(imposters>players.length-2){
            setImposters(players.length-2);
        }
    },[players]);
    
    const addPlayer=()=>{
        const newId=players.length>0?Math.max(...players.map(p=>p.id))+1:1;
        setPlayers(prev=>[...prev,{id:newId,name:`Player ${newId}`}]);
};

    const removePlayer=(id)=>{
        if(players.length<=3){
            Alert.alert('Minimum players reached.','You need atleast 3 players');
            return;
        }
        setPlayers(prev=>prev.filter(p=>p.id!==id));
    };

    const editName=(id,name)=>{
        setPlayers(prev=>prev.map(p=>p.id===id?{...p,name}:p));
    };

    const handlePlay=()=>{
        if(imposters>=players.length){
            Alert.alert('Too many imposters','Must be less than number of total players.')
            return;
        }
        setGameState(prev=>({
            ...prev,
            players:players.length,
            imposters:imposters,
            playerNames:players.map(p=>p.name),
        }));
        navigation.navigate('Roles');
    };

    return(
<ImageBackground source={require('../../assets/Images/HomeImage.png')} style={styles.background} resizeMode="cover">
    
    {/* Back button*/}
    <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
        <Text style={styles.backArrow}>←</Text>
    </TouchableOpacity> 

    <View style={styles.container}>
        <Text style={styles.heading}>Player List</Text>
        <View style={styles.countersRow}>
            <View style={styles.counterBox}>
                <Text style={styles.counterLabel}>👥 Players</Text>
                <View style={styles.counter}>
                    <TouchableOpacity style={styles.counterButton} onPress={()=>removePlayer(players[players.length-1]?.id)}>
                        <Text style={styles.counterButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{players.length}</Text>
                    <TouchableOpacity style={styles.counterButton} onPress={addPlayer}>
                        <Text style={styles.counterButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.counterBox}>
                <Text style={styles.counterLabel}>🔪 Imposters</Text>
                <View style={styles.counter}>
                    <TouchableOpacity style={styles.counterButton} onPress={()=>setImposters(i=>Math.max(1,i-1))}>
                        <Text style={styles.counterButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{imposters}</Text>
                    <TouchableOpacity style={styles.counterButton} onPress={()=>setImposters(i=>Math.min(players.length-2,i+1))}>
                        <Text style={styles.counterButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {players.map((player,index)=>(
                <TouchableOpacity key={player.id.toString()} style={styles.playerBar} onPress={()=>setEditingId(player.id)} activeOpacity={0.5}>
                <View style={styles.playerNumber}>
                    <Text style={styles.playerNumberText}>{index+1}</Text>
                </View>
                {editingId===player.id?(
                    <TextInput style={styles.nameInput} value={player.name} onChangeText={(text)=>editName(player.id,text)} onBlur={()=>setEditingId(null)} autoFocus selectTextOnFocus />
            ) : (
                <Text style={styles.playerName}>{player.name}</Text>
            )}

                    <TouchableOpacity style={styles.trashButton} onPress={()=>removePlayer(player.id)}>
                        <Text style={styles.trashIcon}>🗑️</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            ))}
        </ScrollView>


            {/* Start game button*/}
        <TouchableOpacity style={styles.startButton} onPress={handlePlay}>
            <Text style={styles.startButtonText}>START GAME</Text>
        </TouchableOpacity>
    </View>
    </ImageBackground>
    );
}

const styles=StyleSheet.create({
    background:{
        flex:1,
    },

    container:{
       flex: 1,
        paddingTop:40,
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
    heading:{
        fontSize:24,
        fontWeight:'bold',
        color:'white',
        textAlign:'center',
        marginTop:80,
        marginBottom:50,
    },
    countersRow:{
        flexDirection:'row',
        gap:12,
        marginBottom:20,
    },
    counterBox:{
        flex:1,
        backgroundColor:'rgba(255,255,255,0.15)',
        borderRadius:12,
        padding:12,
        alignItems:'center',
    },
    counterLabel:{
        fontSize:13,
        fontWeight:'bold',
        color:'white',
        marginBottom:8,
    },
    counter:{
        flexDirection:'row',
        alignItems:'center',
        gap:12,
    },
    counterButton:{
        backgroundColor:'rgba(255,255,255,0.3)',
        width:30,
        height:30,
        borderRadius:8,
        alignItems:'center',
        justifyContent:'center',
    },
    counterButtonText:{
        color:'white',
        fontSize:18,
        fontWeight:'bold',
    },
    counterValue:{
        fontSize:20,
        fontWeight:'bold',
        color:'white',
        textAlign:'center',
    },
    scrollContent:{
        paddingBottom:20,
    },
    playerBar:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius:12,
        marginBottom:10,
        padding:12,
        gap:12,
    },
    playerNumber:{
        backgroundColor: 'rgba(255,255,255,0.4)',
        width:36,
        height:36,
        borderRadius:8,
        alignItems:'center',
        justifyContent:'center',
    },
    playerNumberText:{
        color:'black',
        fontWeight:'bold',
        fontSize:16,
    },
    playerName:{
        flex:1,
        color:'black',
        fontSize:16,
    },
    nameInput:{
        flex:1,
        color:'white',
        fontSize:16,
        borderBottomWidth:1,
        borderBottomColor:'white',
        padding:0,
    },
    trashButton:{
        padding:0,
    },
    trashIcon:{
        fontSize:18,
    },
    startButton:{
        backgroundColor:'rgba(255,255,255,0.3)',
        paddingVertical:16,
        borderRadius:12,
        alignItems:'center',
        marginTop:10,
        marginBottom:80,
        borderWidth:2,
        borderColor:'white',
    },
    startButtonText:{
        color:'white',
        fontSize:18,
        fontWeight:'bold',
        letterSpacing:1,
    },

});