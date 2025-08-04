import React from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from './ThemedText';
import { Habit } from '@/app/types';

interface HabitItemProps {
  item: Habit;
  toggleHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  editingHabitId: string | null;
  editedHabitName: string;
  setEditedHabitName: (name: string) => void;
  saveEditedHabit: () => void;
  cancelEditingHabit: () => void;
  startEditingHabit: (habit: Habit) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({
  item,
  toggleHabit,
  deleteHabit,
  editingHabitId,
  editedHabitName,
  setEditedHabitName,
  saveEditedHabit,
  cancelEditingHabit,
  startEditingHabit,
}) => {
  return (
    <View style={styles.habitItem}>
      {editingHabitId === item.id ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editedHabitName}
            onChangeText={setEditedHabitName}
            onSubmitEditing={saveEditedHabit}
          />
          <TouchableOpacity onPress={saveEditedHabit} style={styles.saveButton}>
            <Ionicons name="save" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity onPress={cancelEditingHabit} style={styles.cancelButton}>
            <Ionicons name="close" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => toggleHabit(item.id)}
          onLongPress={() => startEditingHabit(item)}
          style={styles.habitTextContainer}>
          {item.completed && (
            <Ionicons name="checkmark-circle" size={24} color="green" style={styles.checkmarkIcon} />
          )}
          <ThemedText style={item.completed ? styles.completedHabit : styles.habitText}>
            {item.name}
          </ThemedText>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => deleteHabit(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  habitItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  habitTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkmarkIcon: {
    marginRight: 10,
  },
  habitText: {
    fontSize: 18,
  },
  completedHabit: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deleteButton: {
    padding: 5,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    padding: 5,
    marginRight: 5,
  },
  cancelButton: {
    padding: 5,
  },
});

export default HabitItem;
