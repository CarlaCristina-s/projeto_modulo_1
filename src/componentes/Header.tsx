import { StatusBar } from "expo-status-bar";
import { Text, StyleSheet, View, Image, Animated } from "react-native";
import { useEffect, useRef } from "react";

interface Props {
  title: string;
}

const Header: React.FC<Props> = () => {
  const imageAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(imageAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(imageAnimation, {
          toValue: 2,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 2 }
    ).start();
  }, [imageAnimation]);

  const interpolar = imageAnimation.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["0deg", "180deg", "360deg"],
  });

  return (
    <View style={styles.header}>
      <View style={styles.containerUsuarioHome}>
        <Animated.View style={{ transform: [{ rotateY: interpolar }] }}>
          <Image
            style={styles.imageUsuarioHome}
            source={require("../../assets/elvis.jpg")}
          />
        </Animated.View>
        <Text style={styles.textUsuarioHome}>Olá, Elvis!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#00AB78",
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 25,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    borderWidth: 1,
    borderColor: "#bffff5",
  },
  containerUsuarioHome: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 50,
    padding: 5,
  },
  imageUsuarioHome: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#bffff5",
    backfaceVisibility: "hidden",
  },
  textUsuarioHome: {
    fontSize: 24,
    color: "#bffff5",
  },
});

export default Header;