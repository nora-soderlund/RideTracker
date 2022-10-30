import React, { Component } from "react";
import { View, TextInput } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import Appearance from "app/Data/Appearance";

import style from "./Input.component.style";

export default class Input extends Component {
    style = style.update();

    constructor(...args) {
        super(...args);

        this.input = React.createRef();
    }

    getValue() {
        return this.state?.value;
    };

    focus(...args) {
        return this.input.current?.focus(...args);
    };

    onChangeText(text) {
        this.setState({ value: text });

        if(this.props?.onChangeText)
            this.props.onChangeText(text);
    };

    render() {
        return (
            <View style={[ style.sheet, ((this.props?.border ?? true) && style.sheet.border), this.props?.style ]}>
                {this.props?.icon && (
                    <View style={style.sheet.icon}>
                        <FontAwesome5 style={style.sheet.icon.text} name={this.props?.icon} solid={this.props?.solid ?? true}/>
                    </View>
                )}

                <TextInput
                    ref={this.input}
                    onChangeText={(text) => this.onChangeText(text)}
                    style={[ style.sheet.input, (!this.props?.icon && { paddingLeft: 12 }) ]}
                    placeholder={this.props?.placeholder}
                    placeholderTextColor={Appearance.theme.colorPalette.secondary}
                    secureTextEntry={this.props?.secure}
                    autoComplete={this.props?.autoComplete}
                    autoCorrect={this.props?.autoCorrect}
                    clearTextOnFocus={this.props?.clearTextOnFocus}
                    clearButtonMode={this.props?.clearButtonMode}
                    enablesReturnKeyAutomatically={this.props?.enablesReturnKeyAutomatically}
                    keyboardType={this.props?.keyboardType}
                    autoCapitalize={this.props?.autoCapitalize}
                    returnKeyType={this.props?.returnKeyType}
                    onSubmitEditing={this.props?.onSubmitEditing}
                    />
            </View>
        );
    };
};
