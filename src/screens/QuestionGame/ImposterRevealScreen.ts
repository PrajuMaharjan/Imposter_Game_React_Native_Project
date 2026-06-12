import React from "react";
// We import the components but we cannot use them as XML tags
import { View, Text } from "react-native";

export default function DiscussionScreen(): React.JSX.Element {
  // This replaces: <View style={{ flex: 1 }}><Text>Placeholder</Text></View>
  return React.createElement(
    View,
    {
      style: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      },
    },
    React.createElement(
      Text,
      {
        style: {
          fontSize: 14,
          color: "rgba(0, 0, 0, 0.4)",
          fontWeight: "500",
        },
      },
      "Discussion Screen Placeholder"
    )
  );
}