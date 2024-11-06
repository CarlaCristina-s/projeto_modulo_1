import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { NavigationProp, CommonActions } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../componentes/Header";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface HomeProps {
  navigation: NavigationProp<any>;
}

export default function Home({ navigation }: HomeProps) {
  function navigateEstoqueButton() {
    navigation.navigate("Produtos");
  }

  function navigateUsuariosButton() {
    navigation.navigate("Usuarios");
  }

  function navigateHistoricoButton() {
    navigation.navigate("HistoricoMovimentacoes");
  }

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
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar translucent backgroundColor="#00ab90" />

        <>
          <Header />
        </>

        <View style={styles.gerenciar}>
          <View style={styles.box}>
            <FontAwesome5 name="box-open" size={36} color="#00AB78" />
            <Text style={styles.textBox}>Estoque</Text>
          </View>

          <View style={styles.buttonsHome}>
            <TouchableOpacity
              style={styles.gerenciarButton}
              onPress={navigateEstoqueButton}
            >
              <Text style={styles.textGerenciarButton}>Gerenciar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.gerenciar}>
          <View style={styles.box}>
            <FontAwesome5 name="user-alt" size={36} color="#00AB78" />
            <Text style={styles.textBox}>Usuários</Text>
          </View>

          <View style={styles.buttonsHome}>
            <TouchableOpacity
              style={styles.gerenciarButton}
              onPress={navigateUsuariosButton}
            >
              <Text style={styles.textGerenciarButton}>Gerenciar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.gerenciar}>
          <View style={styles.box}>
            <FontAwesome name="history" size={36} color="#00AB78" />
            <Text style={styles.textBox}>Histórico</Text>
          </View>

          <View style={styles.buttonsHome}>
            <TouchableOpacity
              style={styles.historicoButton}
              onPress={navigateHistoricoButton}
            >
              <Text style={styles.historicoButtonText}>Verificar</Text>
            </TouchableOpacity>
          </View>
        </View>

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
  gerenciar: {
    padding: 20,
    borderRadius: 10,
    height: 130,
    elevation: 3,
    shadowColor: "#007865",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    margin: 20,
  },
  box: {
    flexDirection: "row",
    gap: 10,
  },
  textBox: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00AB78",
  },
  buttonsHome: {
    alignItems: "flex-end",
  },
  gerenciarButton: {
    backgroundColor: "#00AB78",
    width: 120,
    padding: 12,
    borderRadius: 10,
  },
  textGerenciarButton: {
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#ace0d9",
  },
  logout: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -60 }],
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
  historicoButton: {
    backgroundColor: "#00AB78",
    width: 120,
    padding: 12,
    borderRadius: 10,
  },
  historicoButtonText: {
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#ace0d9",
  },
});
