import {TouchableOpacity,Text,StyleSheet} from "react-native";

type GenreBoxProps={
    id:string;
    label:string;
    emoji:string;
    isSelected:boolean;
    onPress:()=>void;
};

export default function GenreBox({label,emoji,isSelected,onPress}:GenreBoxProps){
    return(
        <TouchableOpacity style={[styles.box,isSelected && styles.boxSelected]} onPress={onPress}>
            <Text style={[styles.emoji]}>{emoji}</Text>
            <Text style={[styles.boxLabel,isSelected && styles.boxLabelSelected]}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    box:{
        flex:1,
        backgroundColor:'rgba(255,255,255,0.2)',
        borderRadius:12,
        padding:16,
        alignItems:'center',
        borderWidth:2,
        borderColor:'transparent',
    },
    boxSelected:{
        backgroundColor:'rgba(255,255,255,0.35)',
        borderColor:'green',
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
    emoji:{
        fontSize:30,
        marginBottom:6,
    },
});