import React from "react";
import { View, Platform, Text, TouchableOpacity, Alert, KeyboardAvoidingView } from "react-native";

import * as AppleAuthentication from "expo-apple-authentication";

import Config from "app/Data/Config";
import User from "app/Data/User";
import API from "app/Services/API";

import ThemedComponent from "app/ThemedComponent";

import { Form } from "app/Components";

import style from "./Login.style";

import Forgotten from "./Login/Forgotten";
import Register from "./Login/Register";

export default class Login extends ThemedComponent {
    static Forgotten = Forgotten;
    static Register = Register;

    style = style.update();

    constructor(...args) {
        super(...args);

        this.email = React.createRef();
        this.password = React.createRef();
    };

    onClose() {
        this.props.onNavigate("/index");
    };

    async onAppleAuthenticationPress() {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ]
            });

            console.log(credential);
        }
        catch(error) {
            if(error.code == "ERR_CANCELED") {

            } else {

            }
        }
    };

    onGuestPress() {
        Config.user.guest = true;
        Config.saveAsync();

        this.props.onClose();
    };

    async onLoginPress() {
        const processing = this.props.showModal("Processing");

        const credentials = {
            email: this.email.current.getValue(),
            password: this.password.current.getValue()
        };

        const response = await API.post("/api/v1/user/login", credentials);

        if(!response.success) {
            this.props.showModal("Error", {
                description: response.content
            });

            this.props.hideModal(processing);

            return;
        }

        Config.user.guest = false;
        Config.user.token = response.content;
        Config.saveAsync();

        await User.authenticateAsync();

        if(!User.guest)
            this.props.onClose();

        this.props.hideModal(processing);
    };

    render() { 
        // TODO: move this to App.js, preferably as modals
        if(this.state?.page) {
            if(this.state?.page == "register")
                return (<Login.Register style={style.sheet} onRegistration={() => this.props.onClose()} {...this.props} onClose={() => this.setState({ page: null })}/>);
            else if(this.state?.page == "forgotten")
                return (<Login.Forgotten style={style.sheet} {...this.props} onClose={() => this.setState({ page: null })}/>);
        }

        return (
            <View style={style.sheet}>
                <View style={style.sheet.form}>
                    <Text style={style.sheet.header}>Ride Tracker</Text>

                    <KeyboardAvoidingView behavior={(Platform.OS == "ios")?("padding"):("height")}>
                        <Form.Input
                            ref={this.email}
                            style={style.sheet.form.input}
                            placeholder="E-mail address"
                            icon="envelope"
                            autoComplete={"email"}
                            clearButtonMode={"while-editing"}
                            enablesReturnKeyAutomatically={true}
                            keyboardType={"email-address"}
                            autoCapitalize={"none"}
                            returnKeyType={"next"}
                            onSubmitEditing={() => this.password.current.focus()}
                            />
                        <Form.Input
                            ref={this.password}
                            style={style.sheet.form.input}
                            placeholder="Password"
                            icon="lock"
                            autoComplete={"password"}
                            autoCorrect={false}
                            clearTextOnFocus={true}
                            clearButtonMode={"while-editing"}
                            enablesReturnKeyAutomatically={true}
                            autoCapitalize={"none"}
                            returnKeyType={"send"}
                            onSubmitEditing={() => this.onLoginPress()}
                            secure
                            />

                        <Form.Button style={style.sheet.form.button} margin={0} branded={true} title="Sign in" onPress={() => this.onLoginPress()}/>

                        <TouchableOpacity onPress={() => this.props.showNotification("This function is not available yet.\n\nPlease email support@ridetracker.app to recover your account.")}>
                            <Text style={style.sheet.text}>Forgot your credentials? <Text style={style.sheet.text.link}>Click here to recover</Text></Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>

                    <View style={style.sheet.form.divider}>
                        <View style={style.sheet.form.divider.line}/>
                        <Text style={style.sheet.form.divider.text}>OR</Text>
                        <View style={style.sheet.form.divider.line}/>
                    </View>

                    {/*(Platform.OS == "ios") && (
                        <AppleAuthentication.AppleAuthenticationButton style={style.sheet.form.button}
                            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
                            cornerRadius={5}
                            onPress={() => this.onAppleAuthenticationPress()}
                        />
                    )*/}

                    <Form.Button style={style.sheet.form.button} onPress={() => this.onGuestPress()} title="Continue as a guest"/>
                </View>

                <View style={style.sheet.footer}>
                    <TouchableOpacity onPress={() => this.setState({ page: "register" })}>
                        <Text style={style.sheet.text}>Don't have an account? <Text style={style.sheet.text.link}>Click here to sign up</Text></Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
};
