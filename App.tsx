import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./src/pages/Home";
import Login from "./src/pages/Login";
import Usuarios from "./src/pages/Usuarios";
import NovoUsuario from "./src/pages/NovoUsuario";
import Produtos from "./src/pages/Produtos";
import Movimentacoes from "./src/pages/Movimentacoes";
import CadastroMovimentacoes from "./src/pages/CadastroMovimentacoes";
import MovimentacoesMotorista from "./src/pages/MovimentacoesMotorista";
import Mapa from "./src/pages/Mapa";
import HistoricoMovimentacoes from "./src/pages/HistoricoMovimentacoes";


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>

        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>

        <Stack.Screen name="Usuarios" component={Usuarios} options={{ headerShown: false }}/>

        <Stack.Screen name="NovoUsuario" component={NovoUsuario} options={{ headerShown: false }}/>

        <Stack.Screen name="Produtos" component={Produtos} options={{ headerShown: false }}/>

        <Stack.Screen name="Movimentacoes" component={Movimentacoes} options={{ headerShown: false }}/>

        <Stack.Screen name="CadastroMovimentacoes" component={CadastroMovimentacoes} options={{ headerShown: false }}/>

        <Stack.Screen name="MovimentacoesMotorista" component={MovimentacoesMotorista} options={{ headerShown: false }}/>

        <Stack.Screen name="Mapa" component={Mapa} options={{ headerShown: false }}/>

        <Stack.Screen name="HistoricoMovimentacoes" component={HistoricoMovimentacoes} options={{ headerShown: false }}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}
