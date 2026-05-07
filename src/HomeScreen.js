import {View,Text,TouchableOpacity,StyleSheet,ImageBackground} from 'react-native';

export default function HomeScreen({navigation}){
return (
  <ImageBackground source={require('../assets/Images/HomeImage.png')} style={styles.background} resizeMode="cover">
    <View style={styles.container}>
      <Text style={styles.title}>Who's the Imposter?</Text>
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('GameSettings')}>
        <Text style={styles.buttonText}>PLAY GAME</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('Settings')}>
        <Text style={styles.buttonText}>SETTINGS</Text>
      </TouchableOpacity>
      
      </View>
    </View>
    </ImageBackground>
  );
  
}
  
const styles = StyleSheet.create({
  background:{
    flex:1,
    backgroundColor:'black',
  },
  container: {
    flex: 1,
    alignItems:'center',
    padding:20,
  },
  title:{
    fontSize:32,
    fontWeight: 'bold',
    color: 'white',
    marginTop:200,
    letterSpacing: 1,
},
  buttonContainer:{
    gap:12,
    width:'100%',
    alignItems:'center',
    position:'absolute',
    bottom:180,
  },
  button:{
    backgroundColor:'blue',
    paddingVertical:14,
    paddingHorizontal:20,
    width:'80%',
    borderRadius:20,
    alignItems:'center',
  },
  buttonText:{
  color:'white',
  fontSize:20,
  fontWeight:'bold',
  },

});