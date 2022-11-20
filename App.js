import React, { Component, useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Platform, Text, TouchableOpacity, Alert, BackHandler, LogBox } from "react-native";
import uuid from "react-native-uuid";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

LogBox.ignoreAllLogs();

import * as Location from "expo-location";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";

import LoginPage from "app/Components/Layouts/Pages/LoginPage.component";
import ThemedComponent from "app/Components/ThemedComponent";
import BikeCreation from "app/Components/BikeCreation.component";
import Activity from "app/Components/Activity.component";

import Config from "app/Data/Config";
import User from "app/Data/User";
import Appearance from "app/Data/Appearance";

import Production from "./app/Services/Production";

import Footer from "app/Components/Layouts/Footer.component";

import LandingPage from "app/Components/Layouts/Pages/LandingPage.component";
import RecordPage from "app/Components/Layouts/Pages/RecordPage.component";
import SettingsPage from "app/Components/Layouts/Pages/SettingsPage.component";
import ProfilePage from "app/Components/Layouts/Pages/ProfilePage.component";
import Routes from "app/Components/Layouts/Pages/Routes.component";
import ProfileSettings from "app/Components/Layouts/Pages/Profile/Settings.component";
import FilterPage from "app/Components/FilterPage.component";
import Prompt from "app/Components/Prompt";
import Processing from "app/Components/Processing.component";
import ActivityUpload from "app/Components/ActivityUpload.component";

SplashScreen.preventAutoHideAsync();

import Animation from "app/Animation";

import style from "./App.style";

export default class App extends ThemedComponent {
    modalProps = {
        showModal: (...args) => this.showModal(...args),
        hideModal: (...args) => this.hideModal(...args),
        
        showNotification: (...args) => this.showNotification(...args),
        hideNotification: (...args) => this.hideNotification(...args),

        onNavigate: (page) => this.setState({ page })
    };

    pageProps = {
        ...this.modalProps
    };
    
    modals = {
        "LoginPage": (key, props) => (<LoginPage {...this.modalProps} onClose={() => this.hideModal(key)} {...props}/>),
        "ProfilePage": (key, props) => (<ProfilePage {...this.modalProps} onClose={() => this.hideModal(key)} {...props}/>),
        "Routes": (key, props) => (<Routes {...this.modalProps} onClose={() => this.hideModal(key)} {...props}/>),
        "Activity": (key, props) => (<Activity {...this.modalProps} onClose={() => this.hideModal(key)} {...props}/>),
        "ProfileSettings": (key, props) => (<ProfileSettings {...this.modalProps} onClose={() => this.hideModal(key)} {...props}/>),
        "BikeCreation": (key, props) => (<BikeCreation {...this.modalProps} onClose={() => this.hideModal(key)} {...props}/>),
        "RecordPage": (key, props) => (<RecordPage {...this.modalProps} onClose={() => this.hideModal(key)} {...props}/>),
        "FilterPage": (key, props) => (<FilterPage {...this.modalProps} onClose={() => this.hideModal(key)} {...props}/>),
        "Processing": (key, props) => (<Processing {...this.modalProps} onClose={() => this.hideModal(key)} {...props}/>),
        "ActivityUpload": (key, props) => (<ActivityUpload {...this.modalProps} onClose={() => this.hideModal(key)} {...props}/>),
        "Prompt": (key, props) => (<Prompt {...this.modalProps} onClose={() => this.hideModal(key)} {...props}/>),
    };

    showModal(component, props = {}) {
        const key = uuid.v4();

        const modals = this.state?.modals ?? [];
        modals.push({ key, component, props });

        this.setState({ modals });

        return key;
    };

    hideModal(key) {
        const modals = this.state.modals.filter((modal) => modal.key != key);

        this.setState({ modals });
    };

    showNotification(text) {
        const key = uuid.v4();

        const notifications = this.state?.notifications ?? [];
        notifications.push({ key, text, animation: React.createRef() });

        this.setState({ notifications });

        setTimeout(() => {
            this.hideNotification(key);
        }, 3000);

        return key;
    };

    hideNotification(key) {
        this.setState({ notifications: this.state.notifications.filter((notification) => notification.key != key) });
    };

    pages = {
        "/index": (<LandingPage  {...this.pageProps}/>),
        "/routes": (<Routes  {...this.pageProps}/>),
        "/record": (<RecordPage  {...this.pageProps}/>),
        "/profile": (<ProfilePage  {...this.pageProps}/>),
        "/settings": (<SettingsPage  {...this.pageProps}/>)
    };

    async componentDidMount() {
        // uncomment to debug login dialog
        // await Config.resetAsync();

        await Config.readAsync();
        Appearance.readConfig();

        if(Config.user?.token) {
            User.authenticateAsync().then((success) => {
                if(!success) {
                    const modal = this.showModal("LoginPage", { onClose: () => this.hideModal(modal) });
                }
            });
        }
        else if(Config.user.guest == null) {
            const modal = this.showModal("LoginPage", { onClose: () => this.hideModal(modal) });
        }

        this.style = style.update();

        await SplashScreen.hideAsync();

        if(Config.user?.prompt != "shown") {
            if(Production.prompt()) {
                Config.user.prompt = "shown";

                Config.saveAsync();
            }
        }

        //Appearance.addEventListener("change", (theme) => this.setState({ theme }));

        this.setState({ page: "/index" });

        BackHandler.addEventListener("hardwareBackPress", () => {
            if(!this.state?.modals)
                return false;

            const currentModal = this.state.modals[this.state.modals.length - 1];

            if(!currentModal)
                return false;

            this.hideModal(currentModal.key);

            return true;
        });
    };

    render() {
        if(!this.state?.page)
            return null;

        if(User.guest) {
            switch(this.state.page) {
                case "/record": {
                    this.showModal("LoginPage");

                    this.setState({ page: "/index" });

                    return null;
                }
            }
        }

        if(this.state?.page == "/record") {
            if((!this.state?.modals || !this.state.modals.length) || this.state.modals[this.state.modals.length - 1].component != "Prompt") {
                Location.getBackgroundPermissionsAsync().then((event) => {
                    if(event.status == "undetermined") {
                        this.showModal("Prompt");
                    }
                    else if(event.status == "denied") {
                        Location.getForegroundPermissionsAsync().then((event) => {
                            if(!event.granted) {
                                this.showModal("Prompt", {
                                    onFinish: () => {
                                        this.setState({ page: "/index" });
                                    }
                                });
            
                                return null;
                            }
                        });
                    }
                });
            }
        }
        
        if(Platform.OS == "android") {
            NavigationBar.setBackgroundColorAsync(Appearance.theme.colorPalette.common);
            NavigationBar.setButtonStyleAsync(Appearance.theme.colorPalette.contrast);
        }

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: Appearance.theme.colorPalette.common
                }}
                >
                <StatusBar style={Appearance.theme.colorPalette.contrast}/>

                {this.pages[this.state.page]}

                <Footer onNavigate={(page) => this.setState({ page })}/>

                {this.state?.modals && this.state.modals.map((modal) => (
                    <View key={modal.key} style={{
                        position: "absolute",
                        
                        left: 0,
                        top: 0,

                        width: "100%",
                        height: "100%"
                    }}>
                        {this.modals[modal.component](modal.key, modal.props)}
                    </View>
                ))}

                {this.state?.notifications?.map((notification, index) => (
                    <Animation
                        ref={notification.animation}
                        key={notification.key}
                        enabled={true}
                        style={style.sheet.notifications}
                        transitions={[
                            {
                                type: "opacity",
                                duration: 200
                            }
                        ]}
                        >
                        <TouchableOpacity style={[ style.sheet.notifications.item, { marginBottom: 12 * index } ]} onPress={() => notification.animation.current.setTransitions([
                            {
                                type: "opacity",
                                direction: "out",
                                duration: 200,
                                callback: () => this.hideNotification(notification.key)
                            }
                        ])}>
                            <Text style={style.sheet.notifications.item.text}>{notification.text}</Text>

                            <FontAwesome5 style={style.sheet.notifications.item.icon} name={"times"}/>
                        </TouchableOpacity>
                    </Animation>
                ))}
            </View>
        );
    };
};
