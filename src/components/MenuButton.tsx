import {TouchableOpacity,Text,StyleSheet} from "react-native";

type MenuButtonProps={
    label:string;
    onPress:()=>void;
};

export default function MenuButton({label,onPress}:MenuButtonProps){
    return(
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
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