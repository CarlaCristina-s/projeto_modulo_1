import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

const HistoricoMovimentacoes = () => {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    axios
      .get(process.env.EXPO_PUBLIC_API_URL + "/movements")
      .then((response) => {
        setMovimentacoes(response.data);
      })
      .catch((error) => {
        setErro("Erro ao carregar movimentações");
      });
  }, []);

  const gerarRelatorio = () => {
    const aguardandoColeta = movimentacoes.filter(
      (mov) => mov.status === "created"
    );
    const emTransito = movimentacoes.filter(
      (mov) => mov.status === "em transito"
    );
    const coletasFinalizadas = movimentacoes.filter(
      (mov) => mov.status === "Coleta finalizada"
    );

    let relatorio = "Relatório de Movimentações\n\n";
    relatorio += "Aguardando Coleta:\n";
    aguardandoColeta.forEach((mov) => {
      relatorio += `- ID: ${mov.id}, Produto: ${mov.produto}, Quantidade: ${mov.quantidade}\n`;
    });
    relatorio += "\nMovimentações em Trânsito:\n";
    emTransito.forEach((mov) => {
      relatorio += `- ID: ${mov.id}, Produto: ${mov.produto}, Quantidade: ${mov.quantidade}\n`;
    });
    relatorio += "\nColetas Finalizadas:\n";
    coletasFinalizadas.forEach((mov) => {
      relatorio += `- ID: ${mov.id}, Produto: ${mov.produto}, Quantidade: ${mov.quantidade}\n`;
    });
    return relatorio;
  };

  const getCardColor = (status: string) => {
    switch (status) {
      case "created":
        return "#FFDD57"; // Cor para Aguardando Coleta (ex: Amarelo)
      case "em transito":
        return "#FF7043"; // Cor para Movimentações em Trânsito (ex: Laranja)
      case "Coleta finalizada":
        return "#66BB6A"; // Cor para Coletas Finalizadas (ex: Verde)
      default:
        return "#FFFFFF"; // Cor padrão (ex: Branco)
    }
  };

  const getQuantityColor = (status: string) => {
    switch (status) {
      case "created":
        return "#ab3900";
      case "em transito":
        return "#780062"; 
      case "Coleta finalizada":
        return "#002a78"; 
      default:
        return "#007865";
    }
  };

  const salvarRelatorio = async () => {
    const relatorio = gerarRelatorio();
    Alert.alert("Relatório Gerado", relatorio);
  };

  return (
    <LinearGradient
      colors={["#00AB78", "#ACE0D9", "transparent"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradiente}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.titutlo}>Histórico de Movimentações</Text>

        {erro ? (
          <Text style={styles.erro}>{erro}</Text>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.cardText}>Aguardando Coleta</Text>
              <Text
                style={[
                  styles.quantityText,
                  { color: getQuantityColor("created") },
                ]}
              >
                {movimentacoes.filter((mov) => mov.status === "created").length}{" "}
                Movimentações
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardText}>Movimentações em Trânsito</Text>
              <Text
                style={[
                  styles.quantityText,
                  { color: getQuantityColor("em transito") },
                ]}
              >
                {
                  movimentacoes.filter((mov) => mov.status === "em transito")
                    .length
                }{" "}
                Movimentações
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardText}>Coletas Finalizadas</Text>
              <Text
                style={[
                  styles.quantityText,
                  { color: getQuantityColor("Coleta finalizada") },
                ]}
              >
                {
                  movimentacoes.filter(
                    (mov) => mov.status === "Coleta finalizada"
                  ).length
                }{" "}
                Movimentações
              </Text>
            </View>

            <TouchableOpacity onPress={salvarRelatorio} style={styles.buttonRelatorio}>
              <Text style={styles.buttonRelatorioText}>Gerar Relatório</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradiente: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  titutlo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007865",
    alignSelf: "center",
    marginVertical: 40,
  },
  erro: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
  card: {
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
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007865",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "normal",
  },
  buttonRelatorio: {
    backgroundColor: "#00AB78",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 50,
    marginVertical: 30
  },
  buttonRelatorioText: {
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#ace0d9",
  },
});

export default HistoricoMovimentacoes;
