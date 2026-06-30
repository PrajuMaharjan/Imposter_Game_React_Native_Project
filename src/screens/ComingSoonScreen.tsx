import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootParamList = {
    Home: undefined;
    ComingSoon: undefined;
};

type Props = {
    navigation: NativeStackNavigationProp<RootParamList, "ComingSoon">;
};

export default function ComingSoonScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>← Go Back</Text>
            </TouchableOpacity>
            <View style={styles.centerContent}>
                <Text style={styles.title}>Coming Soon</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        padding: 8,
    },
    backText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
    },
}); 