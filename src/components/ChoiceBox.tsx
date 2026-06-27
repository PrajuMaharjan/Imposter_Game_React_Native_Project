import {TouchableOpacity,Text,StyleSheet} from "react-native";

type ChoiceBoxProps={
    label:string;
    onPress:()=>void;
};

export default function ChoiceBox({label,onPress}:ChoiceBoxProps){
    return(
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    container:{
        backgroundColor:'rgba(255,255,255,0.15)',
        borderRadius:12,
        padding:18,
        marginBottom:10,
        alignItems:'center',
        borderWidth:1,
        borderColor:'rgba(255,255,255,0.2)',
    },
    label:{
        color:'white',
        fontSize:18,
        fontWeight:'bold',  
    }
})