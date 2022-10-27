import React, { Component } from "react";
import { View, ScrollView, Image, Text } from "react-native";

import User from "app/Data/User";

import Header from "app/Components/Layouts/Header.component";
import Footer from "app/Components/Layouts/Footer.component";

import style from "./ProfilePage.component.style";

export default class ProfilePage extends Component {
    style = style.update();

    async onLogoutPress() {
        await User.logout();

        this.props.onNavigate("/login");
    };

    render() { 
        return (
            <View style={style.sheet}>
                <Header
                    title="Profile"
                    button="sign-out-alt"
                    onButtonPress={() => this.onLogoutPress()}
                    />

                <ScrollView>
                    <View style={[ style.sheet.profile.item, style.sheet.profile.avatar ]}>
                        <Image
                            style={style.sheet.profile.avatar.image}
                            source={{
                                uri: `https://ride-tracker.nora-soderlund.se/users/nora-soderlund/avatar.png`
                            }}
                        />
                    </View>

                    <Text style={[ style.sheet.profile.item, style.sheet.profile.title ]}>Nora Söderlund</Text>

                    <Text style={[ style.sheet.profile.item, style.sheet.profile.follow ]}>FOLLOW</Text>
                </ScrollView>
                
                <Footer onNavigate={(path) => this.props.onNavigate(path)}/>
            </View>
        );
    }
};
