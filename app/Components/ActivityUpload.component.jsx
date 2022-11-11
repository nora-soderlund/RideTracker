import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";

import API from "app/Services/API";
import Files from "app/Data/Files";
import User from "app/Data/User";

import Button from "app/Components/Button.component";
import Header from "app/Components/Layouts/Header.component";
import SubPage from "app/Components/SubPage.component";

import { Form } from "app/Components";

import style from "./ActivityUpload.component.style";

export default class ActivityUpload extends Component {
    style = style.update();

    constructor(...args) {
        super(...args);

        this.page = React.createRef();
        this.title = React.createRef();
        this.description = React.createRef();
        this.bike = React.createRef();
    };

    componentDidMount() {
        API.get("/api/v1/user/bikes/names", { user: User.id }).then((bikes) => {
            this.setState({
                bikes: bikes.content.map((bike) => {
                    return {
                        value: bike.id,
                        text: bike.name
                    };
                })
            });
        });
    };

    async onPress() {
        const processing = this.props.showModal("Processing");

        const content = await Files.read(`/recordings/local/${this.props.recording}.json`);
        const recording = JSON.parse(content);

        const response = await API.post("/api/v1/activity/upload", {
            recording,

            title: this.title.current.getValue(),
            description: this.description.current.getValue(),
            bike: this.bike.current.getValue()
        });

        //await Files.uploadFile(id);

        this.onClose();

        this.props.onFinish(response.content.activity);

        this.props.hideModal(processing);

        //Alert.alert(this.recorder.data.meta.id + ".json", "Saved");
    };

    onClose() {
        this.props.onClose();
    };

    render() {
        return (
            <SubPage ref={this.page} onClose={() => this.onClose()}>
                <Header title={"Publish Activity"} hidePadding/>

                <Form>
                    <Form.Field>
                        <Form.Title text={"Activity Title"}/>
                        <Form.Description text={"This will be shown above your activity."}/>
                        <Form.Input
                            ref={this.title}
                            placeholder="Activity title (optional)"
                            clearButtonMode={"while-editing"}
                            enablesReturnKeyAutomatically={true}
                            keyboardType={"default"}
                            autoCapitalize={"sentences"}
                            returnKeyType={"next"}
                            onSubmitEditing={() => this.description.current.focus()}
                            />
                    </Form.Field>
                        
                    <Form.Field>
                        <Form.Title text={"Activity Description"}/>
                        <Form.Description text={"This will be shown on your activity page."}/>
                        <Form.Input
                            ref={this.description}
                            placeholder="Activity description (optional)"
                            clearButtonMode={"while-editing"}
                            enablesReturnKeyAutomatically={true}
                            keyboardType={"default"}
                            autoCapitalize={"sentences"}
                            returnKeyType={"next"}
                            onSubmitEditing={() => this.description.current.focus()}
                            />
                    </Form.Field>
                        
                    <Form.Field>
                        <Form.Title text={"Bike (optional)"}/>
                        <Form.Description text={"This will be shown on your activity page."}/>
                        <Form.Selection
                            ref={this.bike}
                            items={this.state?.bikes}
                            />
                    </Form.Field>

                    <Form.Field>
                        <Button branded title={"Upload"} onPress={() => this.onPress()}/>
                    </Form.Field>
                </Form>
            </SubPage>
        );
    };
};