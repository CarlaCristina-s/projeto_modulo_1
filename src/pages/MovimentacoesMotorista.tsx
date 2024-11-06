import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Movimentacao {
  id: string;
  origem: string;
  destino: string;
  produto: string;
  quantidade: number;
  status: string;
  imagem: string;
}

interface MovimentacoesMotoristaProps {
  navigation: NavigationProp<any>;
}

export default function MovimentacoesMotorista({
  navigation,
}: MovimentacoesMotoristaProps) {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    loadMovimentacoes();
  }, []);

  const loadMovimentacoes = () => {
    axios
      .get(process.env.EXPO_PUBLIC_API_URL + "/movements")
      .then((response) => {
        setMovimentacoes(response.data);
      })
      .catch(() => {
        Alert.alert("Não foi possível carregar as movimentações");
      });
  };

  const iniciarEntrega = async (id: string) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("É necessário permitir o acesso à câmera.");
      return;
    }

    const image = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    const motorista = await AsyncStorage.getItem("name");

    if (!image.canceled) {
      const formData = new FormData();
      const photo = image.assets[0];
      formData.append("file", {
        uri: photo.uri,
        type: photo.mimeType as string,
        name: photo.fileName as string,
      });
      formData.append("motorista", motorista);

      try {
        await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/movements/${id}/start`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        Alert.alert("Entrega iniciada com sucesso!");
        loadMovimentacoes();
      } catch (error) {
        Alert.alert("Erro ao iniciar entrega. Tente novamente.");
      }
    }
  };

  const finalizarEntrega = async (id: string) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("É necessário permitir o acesso à câmera.");
      return;
    }

    const image = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!image.canceled) {
      const formData = new FormData();
      const newImage = image.assets[0];
      const motorista = await AsyncStorage.getItem("name");

      formData.append("file", {
        uri: newImage.uri,
        name: newImage.fileName as string,
        type: newImage.mimeType as string,
      });

      formData.append("motorista", motorista);

      try {
        await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/movements/${id}/end`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        Alert.alert("Entrega finalizada com sucesso!");
        loadMovimentacoes();
      } catch (error) {
        Alert.alert("Erro ao finalizar entrega. Tente novamente.");
      }
    }
  };

  const verMapa = (mov: Movimentacao) => {
    AsyncStorage.setItem(
      "origem",
      JSON.stringify({
        latitude: mov.origem.latitude,
        longitude: mov.origem.longitude,
      })
    );
    AsyncStorage.setItem(
      "destino",
      JSON.stringify({
        latitude: mov.destino.latitude,
        longitude: mov.destino.longitude,
      })
    );

    navigation.navigate("Mapa");
  };

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
        <View>
          <Text style={styles.titulo}>Aguardando Coleta</Text>
          {erro ? <Text style={styles.erro}>{erro}</Text> : null}
        </View>

        <View>
          {movimentacoes
            .filter((mov) => mov.status === "created")
            .map((mov) => (
              <View key={mov.id} style={styles.cardMovimentacoes}>
                {
                  <Image
                    source={{ uri: mov.produto.imagem }}
                    style={styles.imagemProduto}
                  />
                }
                <Text style={styles.cardMovimentacoesText}>ID: {mov.id}</Text>
                <Text style={styles.cardMovimentacoesText}>Nome: {mov.produto.nome}</Text>
                <Text style={styles.cardMovimentacoesText}>Quantidade: {mov.quantidade}</Text>
                <Text style={styles.cardMovimentacoesText}>Origem: {mov.origem.nome}</Text>
                <Text style={styles.cardMovimentacoesText}>Destino: {mov.destino.nome}</Text>
                <Text style={styles.cardMovimentacoesText}>Status: {mov.status}</Text>
                <TouchableOpacity
                  onPress={() => verMapa(mov)}
                  style={styles.btnVerMapa}
                >
                  <Text style={styles.btnVerMapaText}>Ver Mapa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnFinalizarEntrega}
                  onPress={() => iniciarEntrega(mov.id)}
                >
                  <Text style={styles.btnFinalizarEntregaText}>
                    Iniciar Entrega
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>

        <Text style={styles.titulo}>Movimentações em Trânsito</Text>
        {movimentacoes
          .filter((mov) => mov.status === "em transito")
          .map((mov) => (
            <View key={mov.id} style={styles.cardMovimentacoes}>
              {
                <Image
                  source={{ uri: mov.produto.imagem }}
                  style={styles.imagemProduto}
                />
              }
              <Text style={styles.cardMovimentacoesText}>ID: {mov.id}</Text>
              <Text style={styles.cardMovimentacoesText}>Nome: {mov.produto.nome}</Text>
              <Text style={styles.cardMovimentacoesText}>Quantidade: {mov.quantidade}</Text>
              <Text style={styles.cardMovimentacoesText}>Origem: {mov.origem.nome}</Text>
              <Text style={styles.cardMovimentacoesText}>Destino: {mov.destino.nome}</Text>
              <Text style={styles.cardMovimentacoesText}>Status: {mov.status}</Text>
              <TouchableOpacity
                onPress={() => verMapa(mov)}
                style={styles.btnVerMapa}
              >
                <Text style={styles.btnVerMapaText}>Ver Mapa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnFinalizarEntrega}
                onPress={() => finalizarEntrega(mov.id)}
              >
                <Text style={styles.btnFinalizarEntregaText}>
                  Finalizar Entrega
                </Text>
              </TouchableOpacity>
            </View>
          ))}

        <Text style={styles.titulo}>Coletas Finalizadas</Text>
        {movimentacoes
          .filter((mov) => mov.status === "Coleta finalizada")
          .map((mov) => (
            <View key={mov.id} style={styles.cardMovimentacoes}>
              {
                <Image
                  source={{ uri: mov.produto.imagem }}
                  style={styles.imagemProduto}
                />
              }
              <Text style={styles.cardMovimentacoesText}>ID: {mov.id}</Text>
              <Text style={styles.cardMovimentacoesText}>Nome: {mov.produto.nome}</Text>
              <Text style={styles.cardMovimentacoesText}>Quantidade: {mov.quantidade}</Text>
              <Text style={styles.cardMovimentacoesText}>Origem: {mov.origem.nome}</Text>
              <Text style={styles.cardMovimentacoesText}>Destino: {mov.destino.nome}</Text>
              <Text style={styles.cardMovimentacoesText}>Status: {mov.status}</Text>
            </View>
          ))}

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
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007865",
    alignSelf: "center",
    marginVertical: 20,
  },
  erro: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#00ab90",
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 5,
    color: "#007865",
  },
  btnRegistrarMovimentacao: {
    backgroundColor: "#00AB78",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 20,
  },
  btnRegistrarMovimentacaoText: {
    color: "#ace0d9",
    textAlign: "center",
  },
  cardMovimentacoes: {
    flex: 1,
    padding: 25,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#007865",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    margin: 15,
  },
  cardMovimentacoesText: {
    color: "#007865",
  },
  imagemProduto: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
  btnVerMapa: {
    backgroundColor: "#00ab90",
    padding: 6,
    borderRadius: 10,
    marginVertical: 10,
    width: 80
  },
  btnVerMapaText: {
    color: "#ace0d9",
    textAlign: "center",
  },
  btnFinalizarEntrega: {
    backgroundColor: "#00AB78",
    width: 180,
    padding: 12,
    borderRadius: 10,
    alignSelf: "center",
  },
  btnFinalizarEntregaText: {
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#ace0d9",
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
