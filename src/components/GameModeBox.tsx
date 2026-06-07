import {TouchableOpacity,Text,StyleSheet} from "react-native";
import {GameMode} from "../../store/GameContext";

type GameModeBoxProps={
    emoji:string;
    label:string;
    description:string;
    mode:GameMode;
    activeMode:GameMode;
    onPress:()=>void;
};

export default function GameModeBox({emoji,label,description,mode,activeMode,onPress}:GameModeBoxProps){
    const isActive=mode===activeMode;
    return(
        <TouchableOpacity style={[styles.modeBox,isActive && styles.modeBoxActive]}
                          onPress={onPress}
        >
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={[styles.modeText,isActive && styles.modeTextActive]}>{label}</Text>
            <Text style={styles.modeDescription}>{description}</Text>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    modeBox:{
        flex:1,
        backgroundColor:'rgba(255,255,255,0.2)',
        borderRadius:12,
        padding:16,alignItems:'center',
        borderWidth:2,
        borderColor:'transparent',
    },
    modeBoxActive:{
        borderColor:'white',
        backgroundColor:'rgba(255,255,255,0.4)',
    },
    emoji:{
        fontSize:30,
        marginBottom:6,
    },
    modeText:{
        fontSize:15,
        fontWeight:'bold',
        color:'rgba(255,255,255,0.7)',
        marginBottom:4,
    },
    modeTextActive:{
        color:'white',
    },
    modeDescription:{
        fontSize:11,
        color:'rgba(255,255,255,0.7)',
        textAlign:'center',
    },
});