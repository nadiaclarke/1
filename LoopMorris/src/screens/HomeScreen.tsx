// Home Screen - Main menu

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './GameScreen';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const [showAIOptions, setShowAIOptions] = useState(false);

  const handleStartLocal = () => {
    navigation.navigate('Game', { mode: 'local' });
  };

  const handleStartAI = (difficulty: 'easy' | 'hard') => {
    setShowAIOptions(false);
    navigation.navigate('Game', {
      mode: 'ai',
      aiDifficulty: difficulty,
      playerSide: 1,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Loop Morris</Text>
          <Text style={styles.subtitle}>A Strategic Ring Game</Text>
        </View>

        {/* Menu Buttons */}
        <View style={styles.menu}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleStartLocal}
          >
            <Text style={styles.buttonText}>Local Game</Text>
            <Text style={styles.buttonSubtext}>2 Players, 1 Device</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => setShowAIOptions(true)}
          >
            <Text style={styles.buttonText}>Play vs AI</Text>
            <Text style={styles.buttonSubtext}>Test Your Skills</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('Tutorial')}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              How to Play
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Inspired by Nine Men's Morris
          </Text>
        </View>
      </View>

      {/* AI Difficulty Modal */}
      <Modal
        visible={showAIOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAIOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Difficulty</Text>

            <TouchableOpacity
              style={[styles.button, styles.modalButton]}
              onPress={() => handleStartAI('easy')}
            >
              <Text style={styles.buttonText}>Easy</Text>
              <Text style={styles.buttonSubtext}>Relaxed gameplay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.modalButton]}
              onPress={() => handleStartAI('hard')}
            >
              <Text style={styles.buttonText}>Hard</Text>
              <Text style={styles.buttonSubtext}>Challenging AI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAIOptions(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF9F3',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2E86AB',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  menu: {
    gap: 16,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2E86AB',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2E86AB',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#2E86AB',
  },
  buttonSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 320,
    gap: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalButton: {
    backgroundColor: '#2E86AB',
  },
  cancelButton: {
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;
