import { Appearance as ReactAppearance } from "react-native";

import Config from "app/Data/Config";

import Styles from "app/Data/Config/Styles.json";
import ThemeStyles from "app/Data/Config/ThemeStyles.json";

ReactAppearance.addChangeListener((theme) => Appearance.onSystemThemeChange(theme));

export default class Appearance {
    static theme = null;
    static styles = Styles;

    static systemThemeChanged = false;
    
    static readConfig() {
        this.systemThemeChanged = false;
        
        let theme = Config.user?.theme || "dark-magenta";

        const newSystemTheme = ReactAppearance.getColorScheme();

        if(Config.user?.lastSystemTheme != newSystemTheme) {
            Config.user.lastSystemTheme = newSystemTheme;
            Config.saveAsync();

            if(theme == "system")
                this.systemThemeChanged = true;
        }
        
        if(theme == "system")
            theme = newSystemTheme;
        
        if(ThemeStyles[theme] == undefined)
            theme = "light";

        this.theme = ThemeStyles[theme];

        this.theme.id = theme;
    };

    static setTheme(theme) {
        Config.user.theme = theme;

        this.readConfig();

        this.#listeners.filter(x => x.type == "change").forEach((item) => {
            item.listener(Math.random() * 100);
        });

        Config.saveAsync();
    };

    static #listeners = [];

    static addEventListener(type, listener) {
        this.#listeners.push({
            type, listener
        });
    };

    static onSystemThemeChange(theme) {
        if(Config.user?.theme != "system")
            return;

        this.setTheme("system");
    };

    static hasSystemThemeChanged() {
        if(this.systemThemeChanged) {
            this.systemThemeChanged = false;

            return true;
        }

        return false;
    }
};
