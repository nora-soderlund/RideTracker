import React, { Component } from "react";
import { View, ScrollView } from "react-native";

import ThemedComponent from "app/Components/ThemedComponent";
import Header from "app/Components/Layouts/Header.component";
import Footer from "app/Components/Layouts/Footer.component";
import Activity from "app/Components/Activity.component";
import ActivityCompact from "app/Components/ActivityCompact.component";
import API from "app/API";
import Files from "app/Data/Files";

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
        this.setState({
            activity: id
        });
    };

    hideActivity() {
        this.setState({
            activity: null
        });
    };

    render() { 
        return (
            <View style={style.sheet.container}>
                <View style={style.sheet.content}>
                    <Header title="Home"/>

                    <ScrollView>
                        {this.state?.activities && this.state?.activities.map(id => <ActivityCompact key={id} style={style.sheet.container.activity} id={id} onPress={(id) => this.showActivity(id)}/>)}
                    </ScrollView>

                    <Footer onNavigate={(path) => this.props.onNavigate(path)}/>
                </View>

                {this.state != null && this.state.activity != null &&
                    <View style={style.sheet.container.page}>
                        <Header title="Activity" navigation="true" onNavigationPress={() => this.hideActivity()}/>

                        <ScrollView>
                            <Activity id={this.state.activity}/>
                        </ScrollView>
                    </View>
                }
            </View>
        );
    }
};