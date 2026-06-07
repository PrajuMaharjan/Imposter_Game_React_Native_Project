import {View,Text,TouchableOpacity,StyleSheet} from "react-native";

type CounterBoxProps={
    emoji:string;
    label:string;
    value:number;
    onDecrement:()=>void;
    onIncrement:()=>void;
};

export default function CounterBox({emoji, label, value, onDecrement, onIncrement}:CounterBoxProps){
    return(
        <View style={styles.box}>
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={styles.boxLabel}>{label}</Text>
            <View style={styles.counter}>
                <TouchableOpacity style={styles.counterButton} onPress={onDecrement}>
                    <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{value}</Text>
                <TouchableOpacity style={styles.counterButton} onPress={onIncrement}>
                    <Text style={styles.counterButtonText}>+</Text>        
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    box:{
        flex:1,
        backgroundColor:'rgba(255,255,255,0.2)',
        borderRadius:12,
        padding: 16,
        alignItems:'center',
    },
    boxLabel:{
        fontSize:11,
        fontWeight:'bold',
        color:'white',
        marginBottom:12,
        textAlign:'center',
    },
    emoji:{
        fontSize:30,
        marginBottom:6,
    },
    counter:{
        flexDirection:"row",
        alignItems:"center",
        gap:16,
    },
    counterButton:{
        backgroundColor:'rgba(255,255,255,0.3)',
        width:32,
        height:32,
        borderRadius:8,
        alignItems:'center',
        justifyContent:'center',
    },
    counterButtonText:{
        color:'white',
        fontSize:20,
        fontWeight:'bold',
    },
    counterValue:{
        fontSize:22,
        fontWeight:'bold',
        color:'white',
        minWidth:36,
        textAlign:'center',
    },
})