import React, { Component } from "react";
import { Image, View, Text, TouchableOpacity, ScrollView } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import * as ImagePicker from "expo-image-picker";

import API from "app/Services/API";

import { Page, Form } from "app/Components";

import style from "./Creation.style";

export default class Creation extends Component {
    style = style.update();

    constructor(...args) {
        super(...args);

        this.page = React.createRef();

        this.name = React.createRef();
        this.brand = React.createRef();
        this.model = React.createRef();
        this.year = React.createRef();
    };

    async onImageUpload() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [ 16, 9 ],
            quality: 1,
            base64: true
        });

        if(!result.cancelled) {
            const base64 = result.base64;

            this.setState({ image: result.uri, base64 });
        }
    };

    async onSubmit() {
        const processing = this.props.showModal("Processing");

        const options = {
            name: this.name.current.getValue(),
            brand: this.brand.current.getValue(),
            model: this.model.current.getValue(),
            year: this.year.current.getValue()
        };

        const bikeCreateResponse = await API.post("/api/v1/bike/create", options);
        const bikeCreateId = bikeCreateResponse.content;

        if(this.state?.base64) {
            await API.post("/api/v1/bike/image", {
                bike: bikeCreateId,
                image: this.state.base64
            });
        }

        this.props.hideModal(processing);

        if(this.props.onFinish)
            this.props.onFinish(bikeCreateId);

        this.props.onClose();
    };

    render() {
        return (
            <Page ref={this.page} onClose={() => this.props.onClose()}>
                <Page.Header
                    title="Bike Creation"
                    navigation="true"
                    onNavigationPress={() => this.page.current.onClose()}
                    />

                <ScrollView style={style.sheet.section}>
                    <Form>
                        <TouchableOpacity onPress={() => this.onImageUpload()}>
                            {(this.state?.image)?(
                                <Image
                                    style={style.sheet.image}
                                    source={{
                                        uri: this.state.image
                                    }}
                                    />
                            ):(
                                <View style={[ style.sheet.form, style.sheet.placeholder ]}>
                                    <FontAwesome5 style={style.sheet.placeholder.icon} name={"image"}/>
                                </View>
                            )}
                        </TouchableOpacity>

                        <Text style={[ style.sheet.form, style.sheet.form.description ]}>You must enter either a bike name or the detail details and upload an image of the bike.</Text>

                        <Form.Field>
                            <Form.Title>What's your bike's name?</Form.Title>

                            <Form.Input
                                ref={this.name}
                                style={style.sheet.form.input}
                                placeholder="Bike name (optional)"
                                clearButtonMode={"while-editing"}
                                enablesReturnKeyAutomatically={true}
                                keyboardType={"default"}
                                autoCapitalize={"sentences"}
                                returnKeyType={"next"}
                                onSubmitEditing={() => this.brand.current.focus()}
                                />
                        </Form.Field>

                        <Form.Field>
                            <Form.Title>What model is your bike?</Form.Title>

                            <Form.Input
                                ref={this.brand}
                                style={style.sheet.form.input}
                                placeholder="Brand (optional)"
                                clearButtonMode={"while-editing"}
                                enablesReturnKeyAutomatically={true}
                                keyboardType={"default"}
                                autoCapitalize={"sentences"}
                                returnKeyType={"next"}
                                onSubmitEditing={() => this.model.current.focus()}
                                />

                            <View style={style.sheet.form.grid}>
                                <Form.Input
                                    ref={this.model}
                                    style={style.sheet.form.grid.input}
                                    placeholder="Model (optional)"
                                    clearButtonMode={"while-editing"}
                                    enablesReturnKeyAutomatically={true}
                                    keyboardType={"default"}
                                    autoCapitalize={"sentences"}
                                    returnKeyType={"next"}
                                    onSubmitEditing={() => this.year.current.focus()}
                                    />

                                <Form.Input
                                    ref={this.year}
                                    style={style.sheet.form.grid.input}
                                    placeholder="Year (optional)"
                                    clearButtonMode={"while-editing"}
                                    enablesReturnKeyAutomatically={true}
                                    keyboardType={"numeric"}
                                    returnKeyType={"next"}
                                    onSubmitEditing={() => this.onSubmit()}
                                    />
                            </View>
                        </Form.Field>

                        <Form.Field>
                            <Form.Button style={style.sheet.form.input} title="Upload bike" branded onPress={() => this.onSubmit()}/>
                        </Form.Field>
                    </Form>
                </ScrollView>
            </Page>
        );
    };
};
