import {Text,StyleSheet,TouchableOpacity,ViewStyle} from 'react-native';

type NextButtonProps={
    label:string;
    onPress:()=>void;
    disabled?:boolean;
    style?:ViewStyle;
};

export default function NextButton({label,onPress,disabled=false,style}:NextButtonProps){
    return(
        <TouchableOpacity style={[styles.button,disabled && styles.buttonDisabled,style]}
                          onPress={onPress}
                          disabled={disabled}
        >
            <Text style={styles.buttonText}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    button:{
        backgroundColor:'rgba(255,255,255,0.3)',
        paddingVertical:16,
        borderRadius:12,
        alignItems:'center',
        marginBottom:10,
        borderWidth:2,
        borderColor:'white'
    },
    buttonDisabled:{
        borderColor:'rgba(255,255,255,0.3)',
        backgroundColor:"rgba(255,255,255,0.1)",
    },
    buttonText:{
        color:'white',
        fontSize:18,
        fontWeight:'bold',
        letterSpacing:1,
    }
});