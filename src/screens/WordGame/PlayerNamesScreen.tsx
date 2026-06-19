import {View,Text,StyleSheet,ImageBackground,ScrollView,Alert} from 'react-native';
import {useEffect, useState,useCallback,useRef} from 'react';
import {useGame} from '../../../store/GameContext';
import { useFocusEffect } from '@react-navigation/native';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RouteProp} from "@react-navigation/native";
import PlayerBar from "../../components/PlayerBar";
import BackButton from "../../components/BackButton";
import ScreenTitle from "../../components/ScreenTitle";
import NextButton from "../../components/NextButton";
import CounterBox from "../../components/CounterBox";

type RootParamList={
    Names : {players:number; imposters:number};
    Roles:undefined;
};

type PlayerEntry={
    id:number;
    name:string;
};

type Props={
    navigation:NativeStackNavigationProp<RootParamList,"Names">;
    route:RouteProp<RootParamList,"Names">;
};

export default function EnterNames({navigation,route}:Props){
    const {gameState,setGameState}=useGame();

    // Load names from GameContext
    const [players,setPlayers]=useState<PlayerEntry[]>(gameState.playerNames.length>0 ? gameState.playerNames.map((name,i)=>({id:i+1,name})) : Array.from({length:gameState.players},(_,i)=>({id:i+1,name:`Player ${i+1}`})));
    const [imposters,setImposters]=useState<number>(gameState.imposters);
    const [editingId,setEditingId]=useState<number | null>(null);

    const gameStateRef=useRef(gameState);
    const playersRef=useRef(players);
    const impostersRef=useRef(imposters);
    
    useEffect(()=>{gameStateRef.current=gameState;},[gameState]);
    useEffect(()=>{playersRef.current=players;},[players]);
    useEffect(()=>{impostersRef.current=imposters;},[imposters]);

    useFocusEffect(
        useCallback(()=>{
            const currentGameState=gameStateRef.current;
            const playerCount=route.params?.players??currentGameState.players;
            const imposterCount=route.params?.imposters??currentGameState.imposters;
        
            const savedNames=currentGameState.playerNames.map(name=>
                typeof name==='object'?(name as {name:string}).name:name
            );
            const names:PlayerEntry[]=Array.from({length:playerCount},(_,i)=>({
                id:i+1,
                name:savedNames[i]??`Player ${i+1}`,
            }));
            setPlayers(names);
            setImposters(imposterCount);
            
        return()=>{
            setGameState(prev=>({
                ...prev,
                players:playersRef.current.length,
                imposters:impostersRef.current,
                playerNames:playersRef.current.map(p=>p.name),
            }));
        };
        },[route.params])
    );
    
    useEffect(()=>{
        if(players.length>0 && imposters>players.length-2){
            setImposters(Math.max(1,players.length-2));
        }
    },[players]);
    
    const addPlayer=():void=>{
        const newId=players.length>0?Math.max(...players.map(p=>p.id))+1:1;
        setPlayers(prev=>[...prev,{id:newId,name:`Player ${newId}`}]);
};

    const removePlayer=(id:number):void=>{
        if(players.length<=3){
            Alert.alert('Minimum players reached.','You need atleast 3 players');
            return;
        }
        setPlayers(prev=>prev.filter(p=>p.id!==id));
    };

    const editName=(id:number,name:string):void=>{
        setPlayers(prev=>prev.map(p=>p.id===id?{...p,name}:p));
    };

    const handlePlay=():void=>{
        if(imposters>=players.length){
            Alert.alert('Too many imposters','Must be less than number of total players.')
            return;
        }
        setGameState(prev=>({
            ...prev,
            players:players.length,
            imposters,
            playerNames:players.map(p=>p.name),
        }));
        navigation.navigate('Roles');
    };

    return(
<ImageBackground source={require('../../../assets/Images/HomeImage.png')} style={styles.background} resizeMode="cover">
    
    {/* Back button*/}
    <BackButton onPress={()=>navigation.goBack()} />

    <View style={styles.container}>
        <ScreenTitle label="Player List" style={styles.heading} />
        <View style={styles.countersRow}>
                <CounterBox emoji="👥"
                            label="Players"
                            value={players.length}
                            onDecrement={()=>removePlayer(players[players.length-1]?.id)}
                            onIncrement={addPlayer}
                            style={styles.counterBoxCompact}
                />
                
                <CounterBox emoji="🔪"
                            label="Imposters"
                            value={imposters}
                            onDecrement={()=>setImposters(i=>Math.max(1,i-1))}
                            onIncrement={()=>setImposters(i=>Math.min(players.length-2,i+1))}
                            style={styles.counterBoxCompact}
                />
                </View>
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {players.map((player,index)=>(
                   <PlayerBar key={player.id.toString()}
                              index={index}
                              id={player.id}
                              name={player.name}
                              isEditing={editingId===player.id}
                              onPress={()=>setEditingId(player.id)}
                              onChangeName={(text)=>editName(player.id,text)}
                              onBlur={()=>setEditingId(null)}
                              onRemove={()=>removePlayer(player.id)}
                    />
            ))}
        </ScrollView>

            {/* Start game button*/}
        <NextButton label="START GAME" style={styles.startButton} onPress={handlePlay} />
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
    heading:{
        fontSize:24,
        marginTop:80,
        marginBottom:50,
    },
    countersRow:{
        flexDirection:'row',
        gap:12,
        marginBottom:20,
    },
    counterBoxCompact:{
        backgroundColor:'rgba(255,255,255,0.15)',
        padding:12,
    },
    scrollContent:{
        paddingBottom:20,
    },
    
    startButton:{
        marginBottom:80,
    },
});