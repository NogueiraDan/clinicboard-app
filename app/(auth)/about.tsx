import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Sobre o Clinicboard
      </ThemedText>
      <ThemedText style={styles.text}>
        O Clinicboard foi criado para simplificar e centralizar o atendimento do seu consultório. Nossa missão é oferecer praticidade, controle e facilidade para profissionais de saúde.
      </ThemedText>
      <Button
        title="Voltar"
        onPress={() => router.back()}
        style={styles.button}
        textStyle={{ color: '#000', fontWeight: 'bold', fontSize: 18 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: Platform.OS === "ios" ? "800" : "bold",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 38,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    opacity: 0.85,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 26,
  },
  button: {
    backgroundColor: "#E6E6E6",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
});
