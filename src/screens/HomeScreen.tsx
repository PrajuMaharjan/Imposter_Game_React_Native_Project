import {View,StyleSheet,ImageBackground} from 'react-native';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import AppTitle from "../components/AppTitle";
import MenuButton from "../components/MenuButton";

type RootStackParamList={
  Home:undefined;
  GameSettings:undefined;
  Settings:undefined;
  ComingSoon:undefined;
};

type HomeScreenProps={
  navigation:NativeStackNavigationProp<RootStackParamList,"Home">;
};

export default function HomeScreen({navigation}:HomeScreenProps){
return (
  <ImageBackground source={require('../../assets/Images/HomeImage.png')} style={styles.background} resizeMode="cover">
    <View style={styles.container}>
      <AppTitle />
      <View style={styles.buttonContainer}>
      
        <MenuButton label="REAL LIFE PLAY"
                    onPress={()=>navigation.navigate("GameSettings")}
        />
        <MenuButton label="ONLINE PLAY"
                    onPress={()=>navigation.navigate("ComingSoon")}
        />
        <MenuButton label="LAN PLAY"
                    onPress={()=>navigation.navigate("ComingSoon")}
        />
        <MenuButton label="SETTINGS"
                    onPress={()=>navigation.navigate("Settings")}
        />

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
  buttonContainer:{
    gap:12,
    width:'100%',
    alignItems:'center',
    position:'absolute',
    bottom:180,
  },
});