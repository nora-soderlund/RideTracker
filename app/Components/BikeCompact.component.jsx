import React, { Component } from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";

import API from "app/Services/API";

import style from "./BikeCompact.style";

export default class BikeCompact extends Component {
    style = style.update();

    componentDidMount() {
        API.get("/api/bike", { bike: this.props.id }).then((data) => {
            this.setState({ bike: data.content });
        });
        
        API.get("/api/bike/stats", { id: this.props.id }).then((data) => {
            this.setState({ stats: data.content });
        });
    };

    render() {
        return (
            <TouchableOpacity style={[ style.sheet, this.props?.style ]} onPress={() => this.props.onPress(this.props.id)}>
                <View style={style.sheet.grid}>
                    {this.state?.bike && this.state.bike?.image && (
                        <Image
                            style={style.sheet.image}
                            source={{
                                uri: this.state.bike.image
                            }}
                            />
                    )}

                    <View style={style.sheet.grid.stretch}>
                        {(this.state?.bike) && (
                            (this.state.bike?.name)?(
                                <Text style={style.sheet.text}>{this.state.bike.name}</Text>
                            ):(
                                <Text style={style.sheet.text}>{([ this.state.bike?.brand, this.state.bike?.model, this.state.bike?.year ]).filter(x => x != null).join(' ')}</Text>
                            )
                        )}

                        {this.state?.stats && (
                            <View style={style.sheet.stats}>
                                <View style={style.sheet.stats.item}>
                                    <Text style={style.sheet.stats.item.title}>{this.state.stats.rides}</Text>
                                    <Text style={style.sheet.stats.item.description}>rides</Text>
                                </View>
                                
                                <View style={style.sheet.stats.item}>
                                    <Text style={style.sheet.stats.item.title}>{this.state.stats.distance} km</Text>
                                    <Text style={style.sheet.stats.item.description}>distance</Text>
                                </View>
                                
                                <View style={style.sheet.stats.item}>
                                    <Text style={style.sheet.stats.item.title}>{this.state.stats.elevation} m</Text>
                                    <Text style={style.sheet.stats.item.description}>elevation</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
};
