import {View,Text,StyleSheet} from 'react-native';

export default function ImposterRevealScreen({navigation}){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>ImposterReveal</Text>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
    },
    title:{
        fontSize:24,
        fontWeight:'bold',
        color:'black',
        justifyContent:'center',
        alignItems:'center',
    },
});