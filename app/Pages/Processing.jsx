import { Component } from "react";
import { View, Text } from "react-native";

import Animation from "app/Animation";

import style from "./Processing.style";

export default class Processing extends Component {
    style = style.update();

    render() {
        return (
            <Animation
                enabled={true}
                transitions={[
                    {
                        type: "opacity",
                        duration: 200
                    }
                ]}
                style={style.sheet}
                >
                    <Text style={style.sheet.text}>{this.props?.text ?? "Your action is being processed..."}</Text>
            </Animation>
        );
    };
};
