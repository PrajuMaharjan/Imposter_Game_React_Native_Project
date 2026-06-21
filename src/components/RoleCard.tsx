import {View,Image,StyleSheet,TouchableOpacity,Animated,ViewStyle} from "react-native";
import React, {useEffect,useRef} from "react";
import {Accelerometer} from 'expo-sensors';

type RoleCardProps={
    isFlipped:boolean;
    onFlip:()=>void;
    renderBack:()=>React.ReactNode;
    cardBackStyle?:ViewStyle;
    shakeForNext:boolean;
};

export default function RoleCard({isFlipped,onFlip,renderBack,cardBackStyle,shakeForNext}:RoleCardProps){
    const flipAnimation=useRef(new Animated.Value(0)).current;

    // Flip Animation
    useEffect(()=>{
        if(!isFlipped) return;
        Animated.spring(flipAnimation,{
            toValue:1,
            friction:8,
            tension:10,
            useNativeDriver:true,
        }).start();
    },[isFlipped]);

    // Shake functionality
    useEffect(()=>{
        if(!shakeForNext) return;
        let lastX=0,lastY=0,lastZ=0;
        const subscription=Accelerometer.addListener(({x,y,z})=>{
            const diff=Math.abs(x-lastX)+Math.abs(y-lastY)+Math.abs(x-lastZ);
            if (diff>5) onFlip();
            lastX=x;lastY=y;lastZ=z;
        });
        Accelerometer.setUpdateInterval(100);
        return ()=>subscription.remove();
    }, [onFlip,shakeForNext]);

    const frontRotate=flipAnimation.interpolate({
        inputRange:[0,1],
        outputRange:['0deg',"180deg"],
    });

    const backRotate=flipAnimation.interpolate({
        inputRange:[0,1],
        outputRange:['180deg',"360deg"],
    });
    
    const frontOpacity=flipAnimation.interpolate({
        inputRange:[0.5,0.51],
        outputRange:[1,0],
    });
    
    const backOpacity=flipAnimation.interpolate({
        inputRange:[0.49,0.5],
        outputRange:[0,1],
    });

    return(
        // Card Front
        <TouchableOpacity activeOpacity={1} onPress={onFlip} style={styles.cardContainer}>

            {/*Logo of the caard */}
            <Animated.View style={[styles.card,styles.cardFront,{transform:[{rotateY:frontRotate}],opacity:frontOpacity},]}>
                <Image source={require('../../assets/Images/Card_Image.png')} style={styles.logo} resizeMode='cover' />
            </Animated.View>

            {/*Card Back */}
            <Animated.View style={[styles.card,styles.cardBack,cardBackStyle,{transform:[{rotateY:backRotate}],opacity:backOpacity}]}>
                {renderBack()}
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    cardContainer:{
        width:260,
        height:380,
        marginTop:10
    },
    card:{
        width:'100%',
        height:'100%',
        borderRadius:20,
        position:"absolute",
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
        borderWidth:2,
        borderColor:"rgba(255,255,255,0.2)",
    },
    logo:{
        width:'100%',
        height:'100%',
    },
})