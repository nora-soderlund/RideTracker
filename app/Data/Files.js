import { Alert } from "react-native";

import * as FileSystem from "expo-file-system";

import API from "app/Services/API";

export default class Files {
    static directory = FileSystem.documentDirectory + "/files/";

    static getPath(file) {
        return this.directory + file;
    };

    static async exists(file) {
        const path = this.getPath(file);

        const directoryInfo = await FileSystem.getInfoAsync(path);

        return directoryInfo.exists;
    };

    static async write(file, content) {
        const path = this.getPath(file);

        const directoryPath = path.substring(0, path.lastIndexOf('/'));
        const directoryInfo = await FileSystem.getInfoAsync(directoryPath);

        if(!directoryInfo.exists)
            await FileSystem.makeDirectoryAsync(directoryPath, { intermediates: true });

        await FileSystem.writeAsStringAsync(path, content);
    };

    static async read(file) {
        const path = this.getPath(file);

        return await FileSystem.readAsStringAsync(path);
    };

    static async create(directory) {
        const path = this.getPath(directory) + "/";

        const directoryInfo = await FileSystem.getInfoAsync(path);

        if(!directoryInfo.exists)
            await FileSystem.makeDirectoryAsync(path, { intermediates: true });
    };

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

    static async uploadFileAsync(directory, file) {
        return new Promise((resolve) => {
            FileSystem.getInfoAsync(this.directory + "/" + directory + "/" + file).then((info) => {
                Alert.alert("Do you want to upload this file (" + info.size + " kB)?", (new Date(info.modificationTime * 1000).toLocaleString()), [
                    {
                        text: "Delete",
                        style: "cancel",
						
                        onPress: async () => {
                            await FileSystem.deleteAsync(this.directory + "/" + directory + "/" + file);

                            resolve();
                        }
                    },

                    {
                        text: "Yes",

                        onPress: async () => {
                            const content = await FileSystem.readAsStringAsync(this.directory + "/" + directory + "/" + file);

                            await API.put("/api/v1/activity/upload", JSON.parse(content));

                            resolve();
                        }
                    },
					
                    {
                        text: "Cancel",
                        style: "cancel",
						
                        onPress: () => {
                            resolve();
                        }
                    }
                ]);
            });
        });
    };

    static async uploadFiles() {
        const directory = "rides";
		
        const directoryInfo = await FileSystem.getInfoAsync(this.directory + "/" + directory + "/");

        if(!directoryInfo.exists)
            return;

        const files = await FileSystem.readDirectoryAsync(this.directory + "/" + directory + "/");

        for(let index = 0; index < files.length; index++) {
            console.log(files[index]);

            await this.uploadFileAsync(directory, files[index]);
        }
    };

    static async uploadFile(id) {
        const directory = "rides";

        console.log(this.directory + "/" + directory + "/" + id + ".json");
		
        const directoryInfo = await FileSystem.getInfoAsync(this.directory + "/" + directory + "/" + id + ".json");

        if(!directoryInfo.exists)
            return;

        const file = await FileSystem.readAsStringAsync(this.directory + "/" + directory + "/" + id + ".json");

        await this.uploadFileAsync(directory, file);
    };
};
