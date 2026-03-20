import {View,Text,StyleSheet,ImageBackground,TouchableOpacity,ScrollView,Alert} from 'react-native';
import {useState} from 'react';
import {useGame} from '../GameContext';

const genres=[
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

export default function GenreSelect({navigation}){
    const {gameState,setGameState}=useGame();
    const [selected,setSelected]=useState(gameState.genre.length>0 ? gameState.genre:genres.map(g=>g.id));

    const toggleGenre=(id)=>{
        setSelected(prev=>prev.includes(id)?prev.filter(g=>g!==id):[...prev,id]);
    };

    const handleNext=()=>{
        if(selected.length===0){
            Alert.alert('No genre selected.','Please select at least one genre to continue');
            return;
        }
    setGameState(prev=>({...prev,genre:selected}));
    navigation.navigate('Names');
    };

    const rows=[];
    for(let i=0;i<genres.length;i+=2){
        rows.push(genres.slice(i,i+2));
    }

    return(
<ImageBackground source={require('../../assets/Images/HomeImage.png')} style={styles.background} resizeMode="cover">
    
    {/* Back button*/}
    <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
        <Text style={styles.backArrow}>←</Text>
    </TouchableOpacity>

    <View style={styles.container}>
        <Text style={styles.heading}>Select Genres</Text>
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {rows.map((row,rowIndex)=>(
                <View key={rowIndex} style={styles.row}>
                    {row.map(genre=>{
                        const isSelected=selected.includes(genre.id);
                        return(
                            <TouchableOpacity key={genre.id} style={[styles.box ,isSelected && styles.boxSelected]} onPress={()=>toggleGenre(genre.id)}>
                                <Text style={styles.emoji}>{genre.emoji}</Text>
                                <Text style={[styles.boxLabel,isSelected && styles.boxLabelSelected]}>{genre.label}</Text>
                            </TouchableOpacity>
                                );
                        })}
                </View>
            ))}
        </ScrollView>

            {/* Start game button*/}
        <TouchableOpacity style={[styles.startButton,selected.length===0 && styles.startButtonDisabled]} onPress={handleNext}>
            <Text style={styles.startButtonText}>NEXT</Text>
        </TouchableOpacity>
    </View>
    </ImageBackground>
    );
}

const styles = StyleSheet.create({
  background:{
    flex:1,
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
  container: {
    flex: 1,
    paddingTop:40,
    padding:20,
  },
  heading:{
    fontSize:28,
    fontWeight:'bold',
    color:'white',
    marginBottom:30,
    marginTop:100,
    textAlign:'center',
  },

  row:{
    flexDirection:'row',
    gap:12,
    marginBottom:16,
  },
  scrollContent:{
    paddingBottom:20,
  },
  box:{
    flex:1,
    backgroundColor:'rgba(255,255,255,0.2)',
    borderRadius:12,
    padding:16,
    alignItems:'center',
    borderWidth:2,
    borderColor:'transparent',
  },
  boxLabel:{
    fontSize:11,
    fontWeight:'bold',
    color:'white',
    marginBottom:12,
    textAlign:'center',
  },
  boxLabelSelected:{
    color:'white',
  },
  boxSelected:{
    backgroundColor:'rgba(255,255,255,0.35)',
    borderColor:'green',
  },
  emoji:{
    fontSize:30,
    marginBottom:6,
  },
  startButton:{
    backgroundColor:'rgba(255,255,255,0.3)',
    paddingVertical:16,
    borderRadius:8,
    alignItems:'center',
    marginTop:10,
    marginBottom:50,
    borderWidth:2,
    borderColor:'white',
  },
  startButtonText:{
    color:'white',
    fontSize:18,
    fontWeight:'bold',
    letterSpacing:1,
  },
  startButtonDisabled:{
    borderColor:'rgba(255,255,255,0.3)',
    backgroundColor:'rgba(255,255,255,0.1)',
  },
});