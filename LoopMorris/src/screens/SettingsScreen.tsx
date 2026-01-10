// Settings Screen - App configuration

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './GameScreen';
import { useSettings } from '../utils/SettingsContext';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { settings, updateSetting, resetSettings } = useSettings();

  const renderToggle = (
    title: string,
    description: string,
    value: boolean,
    onToggle: (value: boolean) => void
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#DDD', true: '#2E86AB' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Gameplay Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gameplay</Text>

          {renderToggle(
            'Highlight Legal Moves',
            'Show available moves when selecting pieces',
            settings.showLegalMoves,
            (value) => updateSetting('showLegalMoves', value)
          )}
        </View>

        {/* Accessibility Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility</Text>

          {renderToggle(
            'Haptic Feedback',
            'Vibrate on actions (may not work on all devices)',
            settings.enableHaptics,
            (value) => updateSetting('enableHaptics', value)
          )}

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Color Scheme</Text>
              <Text style={styles.settingDescription}>
                Choose colors that work best for you
              </Text>
            </View>
          </View>

          <View style={styles.colorOptions}>
            <TouchableOpacity
              style={[
                styles.colorOption,
                settings.colorScheme === 'default' && styles.colorOptionSelected,
              ]}
              onPress={() => updateSetting('colorScheme', 'default')}
            >
              <View style={styles.colorPreview}>
                <View style={[styles.colorDot, { backgroundColor: '#2E86AB' }]} />
                <View style={[styles.colorDot, { backgroundColor: '#E94F37' }]} />
              </View>
              <Text style={styles.colorOptionText}>Default</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.colorOption,
                settings.colorScheme === 'colorblind' && styles.colorOptionSelected,
              ]}
              onPress={() => updateSetting('colorScheme', 'colorblind')}
            >
              <View style={styles.colorPreview}>
                <View style={[styles.colorDot, { backgroundColor: '#0072B2' }]} />
                <View style={[styles.colorDot, { backgroundColor: '#E69F00' }]} />
              </View>
              <Text style={styles.colorOptionText}>Colorblind Safe</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reset Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetSettings}
          >
            <Text style={styles.resetButtonText}>Reset to Defaults</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutBox}>
            <Text style={styles.aboutTitle}>Loop Morris</Text>
            <Text style={styles.aboutText}>Version 1.0.0</Text>
            <Text style={styles.aboutText}>
              A strategic board game inspired by Nine Men's Morris.
              Form "loops" of three to capture opponent pieces!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF9F3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#2E86AB',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 50,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  colorOption: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderColor: '#2E86AB',
    backgroundColor: '#F0F8FF',
  },
  colorPreview: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  colorOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  resetButton: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E94F37',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#E94F37',
  },
  aboutBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
});

export default SettingsScreen;
