import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Switch,
  Alert,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface MovimentacoesProps {
  navigation: NavigationProp<any>;
}

type User = {
  id: number;
  name: string;
  type: string;
  status: boolean;
};

export default function Movimentacoes({ navigation }: MovimentacoesProps) {
  function navigateNovaMovimentacao() {
    navigation.navigate("CadastroMovimentacoes");
  }

  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(false);

  const carregarMovimentacoes = useCallback(() => {
    setLoading(true);
    axios
      .get(process.env.EXPO_PUBLIC_API_URL + "/movements")
      .then((response) => {
        setMovimentacoes(response.data);
      })
      .catch(() => {
        Alert.alert("Não foi possível encontrar as movimentações");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarMovimentacoes();
    }, [carregarMovimentacoes])
  );

  async function handleLogout() {
    try {
      await AsyncStorage.removeItem("name");
      await AsyncStorage.removeItem("profile");

      console.log("Usuário deslogado, redirecionando para Login");

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  }

  return (
    <LinearGradient
      colors={["#00AB78", "#ACE0D9", "transparent"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradiente}
    >
      <ScrollView style={styles.container}>
        <StatusBar style="auto" />

        <View style={styles.usuarios}>
          <TouchableOpacity
            style={styles.usuariosButton}
            onPress={navigateNovaMovimentacao}
          >
            <Text style={styles.textUsuariosButton}>Nova Movimentação</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={movimentacoes}
          renderItem={({ item }) => (
            <View style={styles.cardMovimentacoes}>
              <Text style={styles.labelText}>Origem:</Text>
              <Text style={styles.valueText}>{item.origem.nome}</Text>

              <Text style={styles.labelText}>Destino:</Text>
              <Text style={styles.valueText}>{item.destino.nome}</Text>

              <Text style={styles.labelText}>Produto:</Text>
              <Text style={styles.valueText}>{item.produto.nome}</Text>

              <Text style={styles.labelText}>Status:</Text>
              <Text style={styles.valueText}>{item.status}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 30 }}
        />

        <View style={styles.logout}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradiente: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  usuarios: {
    alignItems: "flex-end",
    marginTop: 50,
    marginRight: 20,
  },
  usuariosButton: {
    backgroundColor: "#00AB78",
    width: 150,
    padding: 12,
    borderRadius: 10,
  },
  textUsuariosButton: {
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#ace0d9",
  },
  cardMovimentacoes: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#007865",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    margin: 15,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007865",
  },
  valueText: {
    fontSize: 16,
    color: "#007865",
  },
  logout: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  logoutButton: {
    padding: 10,
    width: 120,
    borderRadius: 25,
    backgroundColor: "#00AB78",
    borderWidth: 1,
    borderColor: "#bffff5",
    shadowColor: "#00AB78",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButtonText: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});
