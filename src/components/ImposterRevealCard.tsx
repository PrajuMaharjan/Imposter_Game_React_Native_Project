import {View,Text,Image,StyleSheet,TouchableOpacity,Animated} from "react-native";
import React, {useRef,useState} from "react";

type ImposterRevealCardProps={
    imposterNames:string[];
    noImposterMode:boolean;
    multipleImposters:boolean;
    impostersCount:number;
    onFlipComplete:()=>void;
};

export default function ImposterRevealCard({imposterNames,noImposterMode,multipleImposters,impostersCount,onFlipComplete}:ImposterRevealCardProps){
    const [revealed,setRevealed]=useState<boolean>(false);

    const flipAnim=useRef(new Animated.Value(0)).current;
    
    const flipCard=():void=>{
        if(revealed) return;
        setRevealed(true);
        Animated.spring(flipAnim,{
            toValue:1,
            friction:8,
            tension:10,
            useNativeDriver:true,
        }).start(()=>onFlipComplete());
    };

    const frontRotate=flipAnim.interpolate({
        inputRange:[0,1],
        outputRange:['0deg','180deg'],
    });

    const backRotate=flipAnim.interpolate({
        inputRange:[0,1],
        outputRange:['180deg','360deg'],
    });

    const frontOpacity=flipAnim.interpolate({
        inputRange:[0.49,0.5],
        outputRange:[1,0],
    });

    const backOpacity=flipAnim.interpolate({
        inputRange:[0.49,0.5],
        outputRange:[0,1],
    });

    const renderBack=():React.ReactNode=>{
        
        if(noImposterMode){
            return(
                <>
                    <Text style={styles.cardBackName}>
                        {impostersCount>1 ? "No Imposters" : "No Imposter"}
                    </Text>
                    
                    <Text style={styles.cardBackLabel}>
                        {impostersCount>1 ? "There were no Imposters this round!" : "There was no Imposter this round!"}
                    </Text>
                </>
            );
        }

        if(multipleImposters){
            return(
            <>
                {imposterNames.map(name=>(
                    <Text key={name} style={styles.cardBackName}>{name}</Text>
                ))}
                    <Text style={styles.cardBackLabel}>were the imposters</Text>
            </>
            );
        }
            return(
                <>
                    <Text style={styles.cardBackName}>{imposterNames[0]}</Text>
                    <Text style={styles.cardBackLabel}>was the imposter</Text>
                </>
            );
    };

    return(
        <>
            <Text style={styles.cardLabel}>
                        {revealed ?
                         "" : (multipleImposters ? "TAP THE CARD TO REVEAL THE IMPOSTERS":"TAP THE CARD TO REVEAL THE IMPOSTER")}
            </Text>
                    
                <TouchableOpacity activeOpacity={1} onPress={flipCard} style={styles.cardContainer}>
                    {/* Card Front */}
                    <Animated.View style={[
                        styles.card,
                        styles.cardFront,
                        {transform:[{rotateY:frontRotate}],opacity:frontOpacity}
                    ]}>
                        <Image source={require('../../assets/Images/Reveal_Image.png')} style={styles.logo} resizeMode="cover" />    
                    </Animated.View>
                    
                    {/* Card Back */}
                    <Animated.View style={[
                        styles.card,
                        styles.cardBack,
                        {transform:[{rotateY:backRotate}],opacity:backOpacity}
                        ]}>
                        {renderBack()}
                    </Animated.View>
                </TouchableOpacity>
        </>
    );
}                     

const styles=StyleSheet.create({
    cardLabel:{
        fontSize:24,
        color:'white',
        marginBottom:16,
        textAlign:'center',
        fontWeight:'bold',
    },
    cardContainer:{
        width:260,
        height:380,
        marginBottom:32,
    },
    card:{
        width:'100%',
        height:'100%',
        borderRadius:20,
        position:'absolute',
        backfaceVisibility:'hidden',
        alignItems:'center',
        justifyContent:'center',
        padding:24,
    },
    cardFront:{
        backgroundColor:'#1a1a2e',
        borderWidth:2,
        borderColor:'rgba(255,255,255,0.2)',
        padding:0,
        overflow:'hidden',
    },
    cardBack:{
        backgroundColor:'#3b0a0a',
        borderWidth:2,
        borderColor:'rgba(255,80,80,0.5)',
        alignItems:'center',
        justifyContent:"center",
        gap:12,
    },
    cardBackLabel:{
        fontSize:14,
        color:'white',
        letterSpacing:2,
        textTransform:'uppercase',
        textAlign:'center',
    },
    cardBackName:{
        fontSize:30,
        fontWeight:'bold'   ,
        color:'white',
        textAlign:'center', 
    },
    logo:{
        width:'100%',
        height:'100%',
    },
});