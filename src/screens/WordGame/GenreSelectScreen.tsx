import {View,StyleSheet,ImageBackground,Alert,ScrollView} from 'react-native';
import {useState,useEffect,useRef,useCallback} from 'react';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useGame} from "../../../store/GameContext"
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import GenreBox from '../../components/GenreBox';
import BackButton from "../../components/BackButton";
import ScreenTitle from "../../components/ScreenTitle";
import NextButton from "../../components/NextButton";


type Genre={
  id:string;
  label:string;
  emoji:string;
};

const GENRES:Genre[]=[
    {id:'animals',label:'Animals',emoji:'🐾'},
    {id:'fruit',label:'Fruit',emoji:'🍓'},
    {id:'food',label:'Food',emoji:'🍕'},
    {id:'objects',label:'Objects',emoji:'📦'},
    {id:'famous_people',label:'Famous People',emoji:'🌟'},
    {id:'cities',label:'Cities',emoji:'🏙️'},
    {id:'countries',label:'Countries',emoji:'🌍'},
    {id:'health',label:'Health',emoji:'❤️'},
    {id:'brands',label:'Brands',emoji:'🏷️'},
    {id:'games',label:'Games',emoji:'🎮'},
    {id:'movies',label:'Movies',emoji:'🎬'},
    {id:'sports',label:'Sports',emoji:'⚽'},
    {id:'professions',label:'Professions',emoji:'💼'},
    {id:'abstract',label:'Abstract',emoji:'☁️'},
];

type RootStackParamList={
  'Select Genre' : {players:number;imposters:number};
  Names:{players:number;imposters:number};
};

type GenreSelectScreenProps={
  navigation:NativeStackNavigationProp<RootStackParamList,"Select Genre">;
  route:RouteProp<RootStackParamList,"Select Genre">;
};

export default function GenreSelect({navigation,route}:GenreSelectScreenProps){
    const {gameState,setGameState}=useGame();
    const [selected,setSelected]=useState<string[]>(Array.isArray(gameState.genre) && gameState.genre.length>0 ? gameState.genre:GENRES.map(g=>g.id));

    const selectedRef=useRef(selected);
    useEffect(()=>{selectedRef.current=selected;},[selected]);

    useFocusEffect(
      useCallback(()=>{
        return ()=>{
          setGameState(prev=>({...prev,genre:selectedRef.current}));
        };
      },[])
    );

    const toggleGenre=(id:string)=>{
        setSelected(prev=>prev.includes(id)?prev.filter(g=>g!==id):[...prev,id]);
    };

    const handleNext=():void=>{
        if(selected.length===0){
            Alert.alert('No genre selected.','Please select at least one genre to continue');
            return;
        }
    selectedRef.current=selected;
    setGameState(prev=>({...prev,genre:selected}));
    navigation.navigate('Names',{players:route.params?.players,
                                 imposters:route.params?.imposters      
      });
    };

    const rows:Genre[][]=[];
    for(let i=0;i<GENRES.length;i+=2){
        rows.push(GENRES.slice(i,i+2));
    }

    return(
<ImageBackground source={require('../../../assets/Images/HomeImage.png')} style={styles.background} resizeMode="cover">
    
    {/* Back button*/}
    <BackButton onPress={()=>navigation.goBack()} />

    <View style={styles.container}>
        <ScreenTitle style={styles.heading} label="Select Genres" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {rows.map((row,rowIndex)=>(
                <View key={rowIndex} style={styles.row}>
                    {row.map(genre=>(
                      <GenreBox key={genre.id}
                                id={genre.id}
                                label={genre.label}
                                emoji={genre.emoji}
                                isSelected={selected.includes(genre.id)}
                                onPress={()=>toggleGenre(genre.id)}
                      />
                    ))}
                </View>
            ))}
        </ScrollView>

            {/* Start game button*/}
        <NextButton style={styles.startButton}
                    label="NEXT"
                    onPress={handleNext}
                    disabled={selected.length===0}
        />

    </View>
  </ImageBackground>
    );
}

const styles = StyleSheet.create({
  background:{
    flex:1,
  },
  container: {
    flex: 1,
    paddingTop:40,
    padding:20,
  },
  heading:{
    fontSize:28,
    marginBottom:30,
    marginTop:100,
  },

  row:{
    flexDirection:'row',
    gap:12,
    marginBottom:16,
  },
  scrollContent:{
    paddingBottom:20,
  },
  startButton:{
    borderRadius:8,
    marginBottom:50,
  },
});