import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";

interface CadastroMovimentacoesProps {
  navigation: NavigationProp<any>;
}

export default function CadastroMovimentacoes({
  navigation,
}: CadastroMovimentacoesProps) {

  const [filiaisOrigem, setFiliaisOrigem] = useState([]);
  const [filiaisDestino, setFiliaisDestino] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filiaisResponse, produtosResponse] = await Promise.all([
          axios.get(`${process.env.EXPO_PUBLIC_API_URL}/branches/options`),
          axios.get(`${process.env.EXPO_PUBLIC_API_URL}/products/options`),
        ]);
        setFiliaisOrigem(filiaisResponse.data);
        setFiliaisDestino(filiaisResponse.data);
        setProdutos(produtosResponse.data);
      } catch (error) {
        Alert.alert("Erro ao carregar dados. Tente novamente.");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!origem || !destino || !produto || !quantidade) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    if (origem === destino) {
      setErro("As filiais de origem e destino devem ser diferentes.");
      return;
    }

    try {
      const response = await axios.post(
        process.env.EXPO_PUBLIC_API_URL + "/movements",
        {
          originBranchId: parseInt(origem),
          destinationBranchId: parseInt(destino),
          productId: parseInt(produto),
          quantity: parseInt(quantidade),
        }
      );

      if (response.status === 201) {
        Alert.alert("Movimentação registrada com sucesso!");
        navigation.goBack();
      }
    } catch (error) {
      setErro(error.response.data.error);
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
        <View style={styles.formCadastroMovimentacoes}>
          <View style={styles.cadastrarMovimentacoes}>
            <Text style={styles.cadastrarMovimentacoesText}>
              Cadastro de Movimentações
            </Text>
          </View>

          <View style={styles.inputFormPicker}>
            <Picker
              selectedValue={origem}
              onValueChange={(option) => setOrigem(option)}
              style={styles.inputForm}
              dropdownIconColor="#007865"
            >
              <Picker.Item value="" label="Selecione a filial de origem" />
              {filiaisOrigem.map((filial) => (
                <Picker.Item
                  key={filial.id}
                  value={filial.id}
                  label={filial.name}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.inputFormPicker}>
            <Picker
              selectedValue={destino}
              onValueChange={(option) => setDestino(option)}
              style={styles.inputForm}
              dropdownIconColor="#007865"
            >
              <Picker.Item value="" label="Selecione a filial de destino" />
              {filiaisDestino.map((filial) => (
                <Picker.Item
                  key={filial.id}
                  value={filial.id}
                  label={filial.name}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.inputFormPicker}>
            <Picker
              selectedValue={produto}
              onValueChange={(option) => setProduto(option)}
              style={styles.inputForm}
              dropdownIconColor="#007865"
            >
              <Picker.Item value="" label="Selecione o produto desejado" />
              {produtos.map((produto) => (
                <Picker.Item
                  key={produto.product_id}
                  value={produto.product_id}
                  label={produto.product_name}
                />
              ))}
            </Picker>
          </View>

          <TextInput
            style={styles.inputForm}
            value={quantidade}
            onChangeText={setQuantidade}
            keyboardType="numeric"
            placeholder="Quantidade do produto selecionado"
            placeholderTextColor="#007865"
          />

          <TextInput
            style={styles.inputForm}
            value={observacoes}
            onChangeText={setObservacoes}
            placeholder="Observações adicionais"
            placeholderTextColor="#007865"
            multiline={true}
            numberOfLines={4}
            maxLength={200}
          />

          {erro ? <Text style={styles.erroText}>{erro}</Text> : null}

          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.btnCadastroMovimentacoes}
          >
            <Text style={styles.btnCadastroMovimentacoesText}>Cadastrar</Text>
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
  formCadastroMovimentacoes: {
    marginHorizontal: 30,
    marginVertical: 50,
  },
  cadastrarMovimentacoes: {
    alignSelf: "center",
    marginBottom: 10,
  },
  cadastrarMovimentacoesText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007865",
  },
  inputFormPicker: {
    borderWidth: 1,
    borderColor: "#00ab90",
    borderRadius: 10,
    marginVertical: 10,
  },
  inputForm: {
    borderWidth: 1,
    borderColor: "#00ab90",
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
    color: "#007865",
  },
  erroText: {
    marginVertical: 10,
    color: "#ff0000",
    alignSelf: "center",
  },
  btnCadastroMovimentacoes: {
    backgroundColor: "#00AB78",
    width: 180,
    padding: 12,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 20,
  },
  btnCadastroMovimentacoesText: {
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#ace0d9",
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
