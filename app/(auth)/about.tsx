import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import React from "react";
import { Platform, ScrollView, StatusBar, StyleSheet, View } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <ThemedText style={styles.title}>
            Sobre o Clinicboard
          </ThemedText>
          
          <View style={styles.card}>
            <ThemedText style={styles.text}>
              O Clinicboard foi criado para simplificar e centralizar o atendimento do seu consultório.
            </ThemedText>
            <ThemedText style={styles.text}>
              Nossa missão é oferecer praticidade, controle e facilidade para profissionais de saúde.
            </ThemedText>
            <ThemedText style={styles.highlight}>
              Gerencie pacientes, agendamentos e consultas em um só lugar.
            </ThemedText>
          </View>
          
          <Button
            title="Voltar"
            onPress={() => router.back()}
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E27",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: Platform.OS === "ios" ? "700" : "bold",
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: "#1A1F3A",
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 24,
    textAlign: "center",
  },
  highlight: {
    fontSize: 16,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#5B67CA",
    lineHeight: 24,
    textAlign: "center",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#5B67CA",
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: "#5B67CA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
