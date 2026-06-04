import {Text,StyleSheet} from "react-native";

export default function AppTitle(){
    return(
        <Text style={styles.title}>Who's the Imposter</Text>
    );
}

const styles=StyleSheet.create({
    title:{
    fontSize:32,
    fontWeight: 'bold',
    color: 'white',
    marginTop:200,
    letterSpacing: 1,
    }
})