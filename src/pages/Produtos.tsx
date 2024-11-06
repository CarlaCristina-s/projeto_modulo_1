import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  TextInput,
  Animated,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface ProdutosProps {
  navigation: NavigationProp<any>;
}

export default function Produtos({ navigation }: ProdutosProps) {
  const [produtos, setProdutos] = useState([]);
  const [nonFiltered, setNonFiltered] = useState([]);
  const [filter, setFilter] = useState("");

  const animacao = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    axios
      .get(process.env.EXPO_PUBLIC_API_URL + "/products")
      .then((response) => {
        setProdutos(response.data);
        setNonFiltered(response.data);
        Animated.timing(animacao, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      })
      .catch(() => {
        Alert.alert("Não foi possível encontrar o usuário");
      });
  }, [animacao]);

  useEffect(() => {
    if (filter === null || filter === "") {
      setProdutos(nonFiltered);
      return;
    }

    const filteredProducts = nonFiltered.filter(({ product_name }) =>
      product_name.toLowerCase().startsWith(filter.toLowerCase())
    );

    setProdutos(filteredProducts);
  }, [filter]);

  const renderItem = ({ item }) => (
    <Animated.View style={{ opacity: animacao }}>
      <View style={styles.cardProdutos}>
        <Text style={styles.cardProdutosText}>
          <MaterialCommunityIcons name="pill" size={20} color="#007865" />
          {item.product_name}
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={["#00AB78", "#ACE0D9", "transparent"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradiente}
    >
      <ScrollView style={styles.container}>
        <StatusBar style="auto" />
        <View>
          <Text style={styles.containerText}>Produtos</Text>
        </View>

        <TextInput
          style={styles.inputProdutos}
          placeholder="Buscar produtos"
          placeholderTextColor="#007865"
          value={filter}
          maxLength={25}
          autoCorrect={true}
          onChangeText={setFilter}
        />

        <FlatList
          data={produtos}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  gradiente: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007865",
    alignSelf: "center",
    marginVertical: 30,
  },
  cardProdutos: {
    marginHorizontal: 20,
  },
  cardProdutosText: {
    fontSize: 18,
    color: "#007865",
    marginVertical: 8,
  },
  inputProdutos: {
    borderWidth: 1,
    borderColor: "#00ab90",
    borderRadius: 10,
    padding: 5,
    marginHorizontal: 20,
    marginBottom: 30,
  },
});
