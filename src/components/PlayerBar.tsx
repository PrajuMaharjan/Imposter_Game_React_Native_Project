import {View,Text,TextInput,TouchableOpacity,StyleSheet} from "react-native";

type PlayerBarProps={
    index:number;
    id:number;
    name:string;
    isEditing:boolean;
    onPress:()=>void;
    onChangeName:(text:string)=>void;
    onBlur:()=>void;
    onRemove:()=>void;
};

export default function PlayerBar({index,name,isEditing,onPress,onChangeName,onBlur,onRemove}:PlayerBarProps){
    return(
        <TouchableOpacity style={styles.playerBar} onPress={onPress} activeOpacity={0.5}>
            <View style={styles.playerNumber}>
                <Text style={styles.playerNumberText}>{index+1}</Text>
            </View>

            {isEditing ? (
                <TextInput style={styles.nameInput}
                           value={name}
                           onChangeText={onChangeName}
                           onBlur={onBlur}
                           autoFocus
                           selectTextOnFocus
                />
            ):(
                <Text style={styles.playerName}>{name}</Text>
            )}

            <TouchableOpacity style={styles.trashButton} onPress={onRemove}>
                <Text style={styles.trashIcon}>🗑️</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    playerBar:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius:12,
        marginBottom:10,
        padding:12,
        gap:12,
    },
    playerNumber:{
        backgroundColor: 'rgba(255,255,255,0.4)',
        width:36,
        height:36,
        borderRadius:8,
        alignItems:'center',
        justifyContent:'center',
    },
    playerNumberText:{
        color:'black',
        fontWeight:'bold',
        fontSize:16,
    },
    playerName:{
        flex:1,
        color:'black',
        fontSize:16,
    },
    nameInput:{
        flex:1,
        color:'white',
        fontSize:16,
        borderBottomWidth:1,
        borderBottomColor:'white',
        padding:0,
    },
    trashButton:{
        padding:0,
    },
    trashIcon:{
        fontSize:18,
    },
});