import { Alert } from 'react-native';

import * as FileSystem from "expo-file-system";

import API from "../API";

export default class Files {
    static directory = FileSystem.documentDirectory + "/files/";

    static async createDirectory(directory) {
        const directoryInfo = await FileSystem.getInfoAsync(directory);

        if(!directoryInfo.exists)
            await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    };

    static async createFile(directory, file, content) {
        await this.createDirectory(this.directory);
        await this.createDirectory(this.directory + "/" + directory);

        await FileSystem.writeAsStringAsync(this.directory + "/" + directory + "/" + file, content);
    };

    static async uploadFiles() {
        const directory = "rides";
        
        const directoryInfo = await FileSystem.getInfoAsync(this.directory + "/" + directory + "/");

        if(!directoryInfo.exists)
            return;

        const files = await FileSystem.readDirectoryAsync(this.directory + "/" + directory + "/");

        for(let index = 0; index < files.length; index++) {
            await (new Promise((resolve) => {
                Alert.alert("Do you want to upload this file?", files[index], [
                    {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => {
                            resolve();
                        }
                    },

                    {
                        text: "Yes",

                        onPress: async () => {
                            const content = await FileSystem.readAsStringAsync(this.directory + "/" + directory + "/" + files[index]);

                            await API.put("/" + directory + "/" + files[index], content);

                            resolve();
                        }
                    }
                ]);
            }));
        }
    }
};
