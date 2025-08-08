import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from './ThemedText';
import { Habit, HabitCompletion } from '@/app/constants/types';

interface HabitItemProps {
  item: Habit;
  toggleHabit: (id: string, date: string) => void;
  selectedDate: string;
  habitCompletions: HabitCompletion[];
  deleteHabit: (id: string) => void;
  startEditingHabit: (id: string, name: string) => void;
  saveEditedHabit: (id: string) => void;
  cancelEditingHabit: () => void;
  editingHabitId: string | null;
  editedHabitName: string;
  appColorScheme: 'light' | 'dark' | null | undefined;
  setEditedHabitName: (name: string) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({
  item,
  toggleHabit,
  deleteHabit,
  startEditingHabit,
  saveEditedHabit,
  cancelEditingHabit,
  editingHabitId,
  editedHabitName,
  appColorScheme,
  setEditedHabitName,
  selectedDate,
  habitCompletions,
}) => {
  const isCompleted = habitCompletions.some(
    (completion) => completion.habitId === item.id && completion.date === selectedDate
  );
  const isEditing = editingHabitId === item.id;
  const router = useRouter();

  const handlePress = () => {
    if (!isEditing) {
      router.push(`/habit-details/${item.id}`);
    }
  };

  return (
    <View style={[styles.habitItem, {
      backgroundColor: appColorScheme === 'dark' ? '#5D4037' : '#FFF8E1',
      shadowColor: appColorScheme === 'dark' ? '#FFCC80' : '#8D6E63',
    }]}>
      <TouchableOpacity onPress={() => toggleHabit(item.id, selectedDate)} style={styles.checkbox}>
        <Ionicons
          name={isCompleted ? 'checkbox-outline' : 'square-outline'}
          size={24}
          color={isCompleted ? '#FF9800' : (appColorScheme === 'dark' ? '#FFE0B2' : '#5D4037')}
        />
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          style={[styles.habitInput, { color: appColorScheme === 'dark' ? 'white' : 'black' }]} // Apply color based on theme
          value={editedHabitName}
          onChangeText={setEditedHabitName}
          onSubmitEditing={() => saveEditedHabit(item.id)}
          onBlur={() => saveEditedHabit(item.id)}
          autoFocus
        />
      ) : (
        <TouchableOpacity onPress={handlePress} style={{ flex: 1 }}>
          <ThemedText style={[styles.habitText, isCompleted && styles.completedHabitText]}>
            {item.name}
          </ThemedText>
        </TouchableOpacity>
      )}

      <View style={styles.actionsContainer}>
        {isEditing ? (
          <>
            <TouchableOpacity onPress={() => saveEditedHabit(item.id)} style={styles.actionButton}>
              <Ionicons name="checkmark-circle" size={24} color="#FF9800" />
            </TouchableOpacity>
            <TouchableOpacity onPress={cancelEditingHabit} style={styles.actionButton}>
              <Ionicons name="close-circle" size={24} color="#FF6347" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => startEditingHabit(item.id, item.name)} style={styles.actionButton}>
              <Ionicons name="create-outline" size={24} color={appColorScheme === 'dark' ? '#FFE0B2' : '#8D6E63'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteHabit(item.id)} style={styles.actionButton}>
              <Ionicons name="trash-outline" size={24} color="#FF6347" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  habitItem: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkbox: {
    marginRight: 10,
  },
  habitText: {
    flex: 1,
    fontSize: 18,
  },
  completedHabitText: {
    textDecorationLine: 'line-through',
    color: '#A1887F',
  },
  habitInput: {
    flex: 1,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 0,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionButton: {
    marginLeft: 10,
  },
});

export default HabitItem;
