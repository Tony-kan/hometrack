import {Text, View} from "react-native";
import {Link} from "expo-router";

export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text className="text-lg font-rubik-semibold my-10">Welcome to Home Track a real estate mobile app</Text>

        </View>
    );
}
