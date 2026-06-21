import {TouchableOpacity,Text,StyleSheet} from "react-native";
import {useState} from "react";
import ConfirmModal from "../components/ConfirmModal";

type QuitButtonProps={
    onConfirm:()=>void;
};

export default function QuitButton({onConfirm}:QuitButtonProps){
    const [modalVisible,setModalVisible]=useState<boolean>(false);

    return(
        <>
            <TouchableOpacity style={styles.closeButton} onPress={()=>setModalVisible(true)}>
                    <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <ConfirmModal visible={modalVisible}
                        title="Are you sure you want to quit?"
                        onDismiss={()=>setModalVisible(false)}
                        buttons={[
                            {label:'Yes',onPress:onConfirm,style:"destructive"},
                            {label:'No',onPress:()=>setModalVisible(false),style:'cancel'},
                        ]}
            />
        </>
    );
}

const styles=StyleSheet.create({
    closeButton:{
        position:'absolute',
        top:40,
        right:20,
        zIndex:10,
        padding:8,
    },
    closeText:{
        fontSize:40,
        color:'white',
        fontWeight:'bold',
    },
})