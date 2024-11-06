import { SafeAreaView, StyleSheet, StatusBar, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import MapViewDirections from "react-native-maps-directions";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Mapa() {
  const [latitudeOrigem, setLatitudeOrigem] = useState(null);
  const [longitudeOrigem, setLongitudeOrigem] = useState(null);
  const [latitudeDestino, setLatitudeDestino] = useState(null);
  const [longitudeDestino, setLongitudeDestino] = useState(null);
  const GOOGLE_MAPS_APIKEY = "your_api_key";

  async function setCoordinates() {
    try {
      const origem = await AsyncStorage.getItem("origem");
      const destino = await AsyncStorage.getItem("destino");

      if (origem && destino) {
        const origemParse = JSON.parse(origem);
        const destinoParse = JSON.parse(destino);

        setLatitudeOrigem(parseFloat(origemParse.latitude));
        setLongitudeOrigem(parseFloat(origemParse.longitude));
        setLatitudeDestino(parseFloat(destinoParse.latitude));
        setLongitudeDestino(parseFloat(destinoParse.longitude));
      } else {
        Alert.alert("Erro", "Coordenadas de origem ou destino não encontradas.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter as coordenadas.");
    }
  }

  useEffect(() => {
    setCoordinates();
  }, []);

  if (latitudeOrigem === null || longitudeOrigem === null || latitudeDestino === null || longitudeDestino === null) {
    return null; 
  }

  const customMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ab008c"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ab008c"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ab008c"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ab008c"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ab008c"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#b3e5fc"
        }
      ]
    }
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ab008c" />

      <MapView
        style={styles.map}
        customMapStyle={customMapStyle}
        initialRegion={{
          latitude: latitudeOrigem,
          longitude: longitudeOrigem,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          key="origem"
          coordinate={{
            latitude: latitudeOrigem,
            longitude: longitudeOrigem,
          }}
          title="Origem"
          description="Local de origem"
          pinColor="#ab008c" 
        />

        <Marker
          key="destino"
          coordinate={{
            latitude: latitudeDestino,
            longitude: longitudeDestino,
          }}
          title="Destino"
          description="Local de Destino"
          pinColor="#ab008c" 
        />

        <MapViewDirections
          origin={{
            latitude: latitudeOrigem,
            longitude: longitudeOrigem,
          }}
          destination={{
            latitude: latitudeDestino,
            longitude: longitudeDestino,
          }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="#ab008c"
          lineDashPattern={[0, 5]}
          onError={(errorMessage) => {
            Alert.alert("Erro", `Não foi possível carregar a rota: ${errorMessage}`);
          }}
        />
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
