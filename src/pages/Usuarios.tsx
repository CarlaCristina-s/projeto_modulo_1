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
import axios from "axios";

interface UsuariosProps {
  navigation: NavigationProp<any>;
}

type User = {
  id: number;
  name: string;
  type: string;
  status: boolean;
};

export default function Usuarios({ navigation }: UsuariosProps) {
  function navigateNovoUsuario() {
    navigation.navigate("NovoUsuario");
  }

  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const carregarUsuarios = useCallback(() => {
    setLoading(true);
    axios
      .get(process.env.EXPO_PUBLIC_API_URL + "/users")
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch(() => {
        Alert.alert("Não foi possível encontrar o usuário");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarUsuarios();
    }, [carregarUsuarios])
  );

  function toggleStatus(userId: number, currentStatus: boolean) {
    setLoading(true);
    axios
      .patch(`${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/toggle-status`)
      .then(() => {
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((usuario) =>
            usuario.id === userId
              ? { ...usuario, status: !currentStatus }
              : usuario
          )
        );
        Alert.alert("Status atualizado com sucesso");
      })
      .catch(() => {
        Alert.alert("Erro ao atualizar o status");
      })
      .finally(() => {
        setLoading(false);
      });
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
            onPress={navigateNovoUsuario}
          >
            <Text style={styles.textUsuariosButton}>Novo usuário</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={usuarios}
          renderItem={({ item }) => {
            const textColor = item.status ? "#00AB78" : "#fff";
            return (
              <View
                style={[
                  styles.cardUsuarios,
                  item.status
                    ? { borderColor: "none" }
                    : { backgroundColor: "red" },
                ]}
              >
                <Text style={[styles.name, { color: textColor }]}>
                  {item.name}
                </Text>
                <Text style={[styles.type, { color: textColor }]}>
                  {item.type}
                </Text>
                <Switch
                  value={item.status}
                  onValueChange={() => toggleStatus(item.id, item.status)}
                  disabled={loading}
                />
              </View>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 30 }}
        />

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
  cardUsuarios: {
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
  name: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#00AB78",
  },
  type: {
    fontSize: 17,
    color: "#00AB78",
    marginBottom: 10,
  },
});
