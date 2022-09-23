import Constants from "expo-constants";

import { StyleSheet } from "react-native";

import Appearance from "../Data/Appearance";

export default class HeaderStyle {
    static update() {
        this.sheet = StyleSheet.create({
            width: "100%",

            position: "relative",

            backgroundColor: Appearance.theme.colorPalette.primary,

            paddingTop: Constants.statusBarHeight,
            
            borderBottomWidth: 1,
            borderBottomColor: Appearance.theme.colorPalette.accent,

            branded: {
                backgroundColor: Appearance.theme.colorPalette.route,
                borderBottomWidth: 0,

                wave: {
                    height: 80,
                    
                    backgroundColor: Appearance.theme.colorPalette.primary,

                    fill: Appearance.theme.colorPalette.route
                }
            },

            feed: {
                color: Appearance.theme.colorPalette.secondary,

                fontWeight: "bold",
                fontSize: 26,

                padding: 12,

                textAlign: "center"
            },

            button: {
                position: "absolute",

                top: Constants.statusBarHeight + 16,

                justifyContent: "center",

                icon: {
                    color: Appearance.theme.colorPalette.secondary,
                    
                    fontSize: 26,
                    
                    marginLeft: 24,
                    marginRight: 24
                }
            },

            navigation: {
                right: 0
            }
        });

        return this;
    };
};
