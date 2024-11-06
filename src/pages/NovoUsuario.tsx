import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";

interface NovoUsuarioProps {
  navigation: NavigationProp<any>;
}

export default function NovoUsuario({ navigation }: NovoUsuarioProps) {
  const [user, setUser] = useState("");
  const [nameUser, setNameUser] = useState("");
  const [documento, setDocumento] = useState("");
  const [endereco, setEndereco] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const formatDocumento = (value: string) => {
    value = value.replace(/\D/g, "");

    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      value = value.replace(/^(\d{2})(\d)/, "$1.$2");
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
      value = value.replace(/(\d{4})(\d)/, "$1-$2");
    }

    setDocumento(value);
  };

  const handleSubmit = async () => {
    if (!user || !nameUser || !documento || !endereco || !email || !senha) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await axios.post(
        process.env.EXPO_PUBLIC_API_URL + "/register",
        {
          profile: user,
          name: nameUser,
          document: documento,
          full_address: endereco,
          email: email,
          password: senha,
        }
      );
      if (response.status === 201) {
        alert("Usuário registrado com sucesso!");
        navigation.navigate("Home");
      }
    } catch (erro) {
      setErro("Erro ao registrar usuário. Tente novamente.");
    }
  };

  return (
    <LinearGradient
      colors={["#00AB78", "#ACE0D9", "transparent"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradiente}
    >
      <ScrollView style={styles.container}>
        <StatusBar style="auto" />

        <View style={styles.containerForm}>
          <View style={styles.containerUsuario}>
            <Text style={styles.containerUsuarioText}>Cadastro de Usuário</Text>
          </View>

          <View style={styles.inputForm}>
            <Picker
              selectedValue={user}
              onValueChange={(option) => setUser(option)}
              style={styles.inputForm}
              dropdownIconColor="#007865"
            >
              <Picker.Item value="" label="Selecione um usuário" />
              <Picker.Item label="Motorista" value="motorista" />
              <Picker.Item label="Filial" value="filial" />
            </Picker>
          </View>

          <TextInput
            placeholder="Nome completo"
            placeholderTextColor="#007865"
            value={nameUser}
            onChangeText={setNameUser}
            style={styles.inputForm}
          />

          <TextInput
            placeholder="CPF/CNPJ"
            placeholderTextColor="#007865"
            value={documento}
            onChangeText={formatDocumento}
            style={styles.inputForm}
            keyboardType="numeric"
          />

          <TextInput
            placeholder="Endereço"
            placeholderTextColor="#007865"
            value={endereco}
            onChangeText={setEndereco}
            style={styles.inputForm}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#007865"
            value={email}
            onChangeText={setEmail}
            style={styles.inputForm}
            keyboardType="email-address"
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

          {erro ? <Text style={styles.erroText}>{erro}</Text> : null}

          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.btnNovoUsuario}
          >
            <Text style={styles.btnNovoUsuarioText}>Cadastrar</Text>
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
  containerUsuario: {
    alignSelf: "center",
    marginBottom: 10,
  },
  containerUsuarioText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007865",
  },
  containerForm: {
    marginHorizontal: 30,
    marginVertical: 50,
  },
  inputForm: {
    borderWidth: 1,
    borderColor: "#00ab90",
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    color: "#007865",
  },
  inputFormText: {
    color: "#007865",
  },
  erroText: {
    marginVertical: 10,
    color: "#007865",
    alignSelf: "center",
  },
  passwordContainer: {
    borderWidth: 1,
    borderColor: "#00ab90",
    borderRadius: 10,
    marginVertical: 10,
    padding: 5,
    color: "#007865",
    flexDirection: "row",
    alignItems: "center",
  },
  inputPassword: {
    flex: 1,
    height: 60,
    paddingLeft: 10,
    borderColor: "transparent",
  },
  btnNovoUsuario: {
    backgroundColor: "#00AB78",
    width: 180,
    padding: 12,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 15
  },
  btnNovoUsuarioText: {
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#ace0d9",
  },
});
