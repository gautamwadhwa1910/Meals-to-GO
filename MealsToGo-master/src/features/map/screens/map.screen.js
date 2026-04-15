// npx expo install react-native-maps
// yarn add react-native-maps
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import styled from 'styled-components/native';
import { MapCallout } from '../components/map-callout.component';
import { TouchableOpacity } from 'react-native';
import { Search } from '../components/search.component';

import { RestaurantContext } from '../../../services/restaurants/restaurants.context'
import { LocationContext } from '../../../services/location/location.context'

// Only import MapView on native platforms
let MapView, Marker, Callout;
if (Platform.OS !== 'web') {
    const mapImport = require('react-native-maps');
    MapView = mapImport.default;
    Marker = mapImport.Marker;
    Callout = mapImport.Callout;
}

const Map = Platform.OS === 'web'
    ? styled.View`
        width: 100%;
        height: 100%;
        background-color: #f0f0f0;
        justify-content: center;
        align-items: center;
    `
    : styled(MapView)`
        width: 100%;
        height: 100%;
    `;

const MapPlaceholder = styled.View`
    width: 100%;
    height: 100%;
    background-color: #e8e8e8;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

export const MapScreen = ({ navigation }) => {
    const { location } = useContext(LocationContext)
    const { restaurants = [] } = useContext(RestaurantContext)

    // to figure out where to render map markers:
    const [latDelta, setLatDelta] = useState(0);
    const { lat, lng, viewport } = location;

    useEffect(() => {
        const northEastLat = viewport.northeast.lat;
        const southWestLat = viewport.southwest.lat;
        const calculatedLatDelta = northEastLat - southWestLat
        setLatDelta(calculatedLatDelta)
    }, [location, viewport])

    if (Platform.OS === 'web') {
        return (
            <>
                <Search />
                <MapPlaceholder>
                    <Text style={{ fontSize: 18, marginBottom: 10 }}>📍 Map View</Text>
                    <Text>Map is not available on web</Text>
                </MapPlaceholder>
            </>
        );
    }

    return (
        <>
            <Search />
            <Map
                region={{
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: latDelta,
                    longitudeDelta: 0.02,
                }}
            >
                {restaurants.map((restaurant) => {
                    return <Marker
                        key={restaurant.name}
                        title={restaurant.name}
                        coordinate={{
                            latitude: restaurant.geometry.location.lat,
                            longitude: restaurant.geometry.location.lng,
                        }}
                    >
                        <Callout onPress={() => {
                            console.log("I was pressed")
                            navigation.navigate("Restaurants", {
                                screen: "RestaurantDetail",
                                params: { restaurant },
                            });
                        }
                        }
                        >
                            <MapCallout
                                restaurant={restaurant}
                            >

                            </MapCallout>

                        </Callout>

                    </Marker>;
                })}
            </Map >
        </>
    );
}