import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  Alert,
  Animated,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { CommonActions, NavigationProp } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";

interface LoginProps {
  navigation: NavigationProp<any>;
}

export default function Login({ navigation }: LoginProps) {
  const scaleAnimation = useRef(new Animated.Value(1)).current; 

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const name = await AsyncStorage.getItem("name");
        if (name) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Home" }],
            })
          );
        }
      } catch (error) {
        console.error("Erro ao buscar o nome no AsyncStorage", error);
      }
    };
    checkLogin();
  }, []);

  async function handleLogin() {
    try {
      const response = await axios.post(
        process.env.EXPO_PUBLIC_API_URL + "/login",
        {
          email: email,
          password: senha,
        }
      );
      if (response.data.profile === "admin") {
        await AsyncStorage.setItem("name", response.data.name);
        await AsyncStorage.setItem("profile", response.data.profile);
        navigation.navigate("Home");
      } else if (response.data.profile === "filial") {
        await AsyncStorage.setItem("name", response.data.name);
        await AsyncStorage.setItem("profile", response.data.profile);
        navigation.navigate("Movimentacoes");
      } else if (response.data.profile === "motorista") {
        await AsyncStorage.setItem("name", response.data.name);
        await AsyncStorage.setItem("profile", response.data.profile);
        navigation.navigate("MovimentacoesMotorista");
      }
    } catch (error) {
      Alert.alert("Erro", "Email e/ou senha incorretos");
    }
  }

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 1.2, 
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnimation]);

  return (
    <LinearGradient
      colors={["#00AB78", "#ACE0D9", "transparent"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradiente}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.containerLogo}>
          <Animated.Image
            source={require("../../assets/logo.png")}
            style={[styles.logo, { transform: [{ scale: scaleAnimation }] }]}
          />
        </View>

        <View style={styles.containerLogin}>
          <TextInput
            style={styles.inputLogin}
            placeholder="Email"
            placeholderTextColor="#007865"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              placeholder="Senha"
              placeholderTextColor="#007865"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Entypo
                name={showPassword ? "eye" : "eye-with-line"}
                size={24}
                color="#007865"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
  containerLogo: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  logo: {
    width: 220,
    height: 220,
  },
  containerLogin: {
    justifyContent: "center",
    marginHorizontal: 20,
  },
  inputLogin: {
    height: 60,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: "#007865",
    borderRadius: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "#007865",
    borderRadius: 10,
    paddingRight: 10,
  },
  inputPassword: {
    flex: 1,
    height: 60,
    paddingLeft: 10,
    borderColor: "transparent",
  },
  loginButton: {
    borderRadius: 25,
    width: 150,
    alignSelf: "center",
    marginTop: 20,
    padding: 10,
    backgroundColor: "#00AB78",
    borderWidth: 1,
    borderColor: "#bffff5",
    shadowColor: "#00AB78",
  },
  loginButtonText: {
    textAlign: "center",
    color: "#bffff5",
    textTransform: "uppercase",
    fontSize: 18,
    fontWeight: "bold",
  },
});
