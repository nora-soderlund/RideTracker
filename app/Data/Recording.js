import { getPreciseDistance } from "geolib";

export default class Recording {
    constructor(data) {
        this.data = data;
    };

    getLatLngCoordinates() {
        const sections = [];

        for(let index = 0; index < this.data.sections.length; index++) {
            sections.push({
                index,

                coordinates: this.data.sections[index].coordinates.map(x => {
                    return {
                        latitude: x.coords.latitude,
                        longitude: x.coords.longitude
                    };
                })
            });
        }

        return sections;
    };

    getMapCoordinates() {
        return this.data.sections.map((section, index) => {
            return {
                index,

                coordinates: section.coordinates.map((coordinate) => coordinate.coords)
            };
        });
    };

    getAllLatLngCoordinates() {
        let coordinates = [];

        this.data.sections.map(section => {
            section.coordinates.map(x => {
                coordinates.push({
                    latitude: x.coords.latitude,
                    longitude: x.coords.longitude
                });
            });
        });

        return coordinates;
    };

    getAllCoordinates(ignoreAccuracy = false) {
        let coordinates = [];

        this.data.sections.forEach((section) => {
            section.coordinates.forEach((coordinate) => {
                if(!ignoreAccuracy && coordinate.coords.accuracy - coordinate.coords.speed > 0)
                    return;

                coordinates.push(coordinate.coords);
            });
        });

        return coordinates;
    };

    getAverageSpeed() {
        const speeds = this.getAllCoordinates(true).map((coordinate) => coordinate.speed);

        if(speeds.length == 0)
            return 0;

        const averageMetersPerSecond = speeds.reduce((a, b) => (a + b)) / speeds.length;

        const averageKilometersPerHour = averageMetersPerSecond * 3.6;

        return Math.round(averageKilometersPerHour * 10) / 10;
    };

    getSectionCoordinateSpeed(sectionIndex, coordinateIndex) {
        if(!this.data.sections[sectionIndex] || !this.data.sections[sectionIndex].coordinates[coordinateIndex])
            return 0;

        const section = this.data.sections[sectionIndex];
        const coordinate = section.coordinates[coordinateIndex];

        const kilometersPerHour = coordinate.coords.speed * 3.6;

        return Math.round(kilometersPerHour * 10) / 10;
    };

    getSectionCoordinateDistance(sectionIndex, coordinateIndex) {
        if(!this.data.sections[sectionIndex] || !this.data.sections[sectionIndex].coordinates[coordinateIndex])
            return 0;

        let distance = 0;

        for(let index = 0; index <= sectionIndex; index++) {
            const section = this.data.sections[index];

            for(let coordinate = 0; coordinate < section.coordinates.length - 1; coordinate++) {
                if(sectionIndex == index && coordinateIndex == coordinate)
                    break;
                
                const accuracy = [
                    section.coordinates[coordinate].coords.accuracy,
                    section.coordinates[coordinate + 1].coords.accuracy
                ];

                distance += getPreciseDistance(
                    {
                        latitude: section.coordinates[coordinate].coords.latitude,
                        longitude: section.coordinates[coordinate].coords.longitude
                    },

                    {
                        latitude: section.coordinates[coordinate + 1].coords.latitude,
                        longitude: section.coordinates[coordinate + 1].coords.longitude
                    },

                    accuracy.reduce((a, b) => (a + b)) / accuracy.length
                );
            }
        }

        const kilometers = distance / 1000;

        return Math.round(kilometers * 10) / 10;
    };

    getSectionCoordinateElevation(sectionIndex, coordinateIndex) {
        let coordinates = [];

        if(!this.data.sections[sectionIndex] || !this.data.sections[sectionIndex].coordinates[coordinateIndex])
            return 0;
        
        for(let index = 0; index <= sectionIndex; index++) {
            if(sectionIndex == index) {
                for(let coordinate = 0; coordinate <= coordinateIndex; coordinate++)
                    coordinates.push(this.data.sections[index].coordinates[coordinate].coords);
            }
            else {
                coordinates = coordinates.concat(this.data.sections[index].coordinates);
            }
        }
        
        let elevation = 0;

        for(let index = 0; index < coordinates.length - 1; index++) {
            const altitude = (coordinates[index + 1].altitude - coordinates[index].altitude) / coordinates[index].altitudeAccuracy;

            if(altitude >= 0) // we only want the gained elevation
                elevation += altitude;
        }
        
        return Math.round(elevation);
    };

    getDistance() {
        const coordinates = this.getAllCoordinates(true);

        let distance = 0;
        
        for(let index = 0; index < coordinates.length - 1; index++) {
            const accuracy = [
                coordinates[index].accuracy,
                coordinates[index + 1].accuracy
            ];

            distance += getPreciseDistance(
                {
                    latitude: coordinates[index].latitude,
                    longitude: coordinates[index].longitude
                },

                {
                    latitude: coordinates[index + 1].latitude,
                    longitude: coordinates[index + 1].longitude
                },

                accuracy.reduce((a, b) => (a + b)) / accuracy.length
            );
        }

        const kilometers = distance / 1000;

        return Math.round(kilometers * 10) / 10;
    };

    getElevation() {
        const coordinates = this.getAllCoordinates(true);
        
        let elevation = 0;

        for(let index = 0; index < coordinates.length - 1; index++) {
            const altitude = (coordinates[index + 1].altitude - coordinates[index].altitude) / coordinates[index].altitudeAccuracy;

            if(altitude >= 0) // we only want the gained elevation
                elevation += altitude;
        }
        
        return Math.round(elevation);
    };

    getMaxSpeed() {
        const coordinates = this.getAllCoordinates();

        return Math.max(...coordinates.map((coordinate) => {
            const kilometersPerHour = coordinate.speed * 3.6;

            return Math.round(kilometersPerHour * 10) / 10;
        }), 0);
    };
};
