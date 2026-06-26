import {View,Text,StyleSheet} from "react-native";

type InfoBoxProps={
    title:string;
    subText:string;
    highlight?:string;
};

export default function InfoBox({title,subText,highlight}:InfoBoxProps){
    return (
        <View style={styles.box}>
            <Text style={styles.boxTitle}>{title}</Text>
            <Text style={styles.highlight}>{highlight}</Text>
            <Text style={styles.boxSubText}>{subText}</Text>
         </View>
    )
}

const styles=StyleSheet.create({
    box:{
        backgroundColor:'rgba(255,255,255,0.15)',
        borderRadius:14,
        padding:16,
        marginBottom:12,
        borderWidth:1,
        borderColor:'rgba(255,255,255,0.2)'
    },
    boxTitle:{
        fontSize:15,
        fontWeight:'bold',
        color:'white',
        marginBottom:4,
    },
    highlight:{
        fontSize:22,
        fontWeight:'bold',
        color:'white',
        marginBottom:4,
    },
    boxSubText:{
        fontSize:13,
        color:'rgba(255,255,255,0.75)',
        lineHeight:18,
    },
})