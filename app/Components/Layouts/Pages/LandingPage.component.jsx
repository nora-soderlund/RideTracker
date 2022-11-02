import React, { Component } from "react";
import { View, ScrollView, RefreshControl } from "react-native";

import Appearance from "app/Data/Appearance";

import ThemedComponent from "app/Components/ThemedComponent";
import Animation from "app/Components/Animation.component";
import Header from "app/Components/Layouts/Header.component";
import Footer from "app/Components/Layouts/Footer.component";
import Activity from "app/Components/Activity.component";
import ActivityCompact from "app/Components/ActivityCompact.component";

import Files from "app/Data/Files";

import API from "app/Services/API";

import style from "./LandingPage.component.style";

export default class LandingPage extends ThemedComponent {
    style = style.update();

    componentDidMount() {
        API.get("/api/feed").then((result) => {
            console.log(result.content);
            this.setState({
                activities: result.content
            });
        });

        Files.uploadFiles();
    };

    showActivity(id) {
        const modal = this.props.showModal(<Activity style={style.sheet.container.page} id={id} showModal={(...args) => this.props.showModal(...args)} hideModal={(...args) => this.props.hideModal(...args)} onClose={() => this.hideModal(modal)}/>);
    };

    hideModal(modal) {
        this.props.hideModal(modal);
    };

    onRefresh() {
        this.setState({ refreshing: true });

        API.get("/api/feed").then((result) => {
            this.setState({
                activities: result.content,
                refreshing: false
            });
        });
    };

    render() { 
        return (
            <View style={style.sheet.container}>
                <View style={style.sheet.content}>
                    <Header title="Home"/>

                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                tintColor={Appearance.theme.colorPalette.solid}
                                refreshing={this.state?.refreshing}
                                onRefresh={() => this.onRefresh()}
                                />
                            }
                        >
                        
                        {this.state?.activities && this.state?.activities.map(id => <ActivityCompact key={id} style={style.sheet.container.activity} id={id} onPress={(id) => this.showActivity(id)}/>)}
                    </ScrollView>
                </View>
            </View>
        );
    }
};
