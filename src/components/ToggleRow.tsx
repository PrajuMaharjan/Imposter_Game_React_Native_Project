import {View,Text,Switch,StyleSheet} from "react-native";

type ToggleRowProps={
    label:string;
    value:boolean;
    onValueChange:(value:boolean)=>void;
};

export default function ToggleRow({label,value,onValueChange}:ToggleRowProps){
  return(
        <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>{label}</Text>
        `   </View>
            
            <Switch value={value} onValueChange={onValueChange} trackColor={{false:'rgba(255,255,255,0.2)',true:'#2196F3'}} thumbColor={'white'} />
        </View>
  )
};

const styles=StyleSheet.create({
 toggleInfo:{
    flex:1,
    paddingRight:12,
  },
  toggleRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingVertical:8,
  },
  toggleLabel:{
    color:'white',
    fontSize:13,
    fontWeight:'bold',
    marginBottom:2,
  },
});         