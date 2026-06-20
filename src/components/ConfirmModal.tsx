import {View,Text,TouchableOpacity,Modal,StyleSheet,ViewStyle,TextStyle} from "react-native";

type ButtonStyle="default" | "destructive" | "cancel";

type ModalButton={
    label:string;
    onPress:()=>void;
    style?:ButtonStyle;
};

type ConfirmModalProps={
    visible:boolean;
    title:string;
    body?:string;
    buttons:ModalButton[];
    onDismiss?:()=>void;
};

export default function ConfirmModal({visible,title,body,buttons,onDismiss}:ConfirmModalProps){
    return(
        <Modal visible={visible} transparent animationType="fade">
            <TouchableOpacity style={styles.overlay}
                              activeOpacity={1}
                              onPress={onDismiss}
            >
                <TouchableOpacity style={styles.card} activeOpacity={1}>
                    <Text style={styles.title}>{title}</Text>
                    {body ? <Text style={styles.body}>{body}</Text> : null}

                    <View style={styles.buttons}>
                        {buttons.map((btn,index)=>(
                            <TouchableOpacity key={index}
                                              style={[styles.button,buttonContainerStyle(btn.style ?? "default")]}
                                              onPress={btn.onPress}
                            >
                                <Text style={[styles.buttonText,buttonTextStyle(btn.style ?? "default")]}>
                                    {btn.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}

function buttonContainerStyle(style:ButtonStyle):ViewStyle{
    switch(style){
        case "destructive" : return{backgroundColor:"rgba(180,30,30,0.85"};
        case "cancel" : return{backgroundColor:"rgba(255,255,255,0.08"};
        default : return{backgroundColor:"rgba(255,255,255,0.2"};
    }
}

function buttonTextStyle(style:ButtonStyle):TextStyle{
    switch(style){
        case "destructive" : return{color:"white"};
        case "cancel" : return{color:"rgba(255,255,255,0.5"};
        default : return{color:"whire"};
    }
}

const styles=StyleSheet.create({
    overlay:{
        flex:1,
        backgroundColor:"rgba(0,0,0,0.6)",
        justifyContent:"center",
        alignItems:"center",
    },
    card:{
        width:"80%",
        backgroundColor:"#1a1a2e",
        borderRadius:16,
        padding:24,
        borderWidth:1,
        borderColor:"rgba(244,244,244,0.15)",
        gap:12,
    },
    title:{
        fontSize:18,
        fontWeight:"bold",
        color:"white",
        textAlign:'center',
    },
    body:{
        fontSize:14,
        color:"rgba(255,255,255,0.7)",
        textAlign:"center",
        lineHeight:20,
    },
    buttons:{
        marginTop:8,
        gap:10,
    },
    button:{
        paddingVertical:12,
        borderRadius:10,
        alignItems:'center',
        borderWidth:1,
        borderColor:"rgba(255,255,255,0.15)",
    },
    buttonText:{
        fontSize:15,
        fontWeight:'bold',
        letterSpacing:0.5,
    }
});