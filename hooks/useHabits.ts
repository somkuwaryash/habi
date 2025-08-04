import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '@/app/types';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editedHabitName, setEditedHabitName] = useState('');

  useEffect(() => {
    const loadHabits = async () => {
      try {
        const storedHabits = await AsyncStorage.getItem('habits');
        if (storedHabits) {
          setHabits(JSON.parse(storedHabits));
        }
      } catch (error) {
        console.error('Failed to load habits from AsyncStorage', error);
      }
    };
    loadHabits();
  }, []);

  useEffect(() => {
    const saveHabits = async () => {
      try {
        await AsyncStorage.setItem('habits', JSON.stringify(habits));
      } catch (error) {
        console.error('Failed to save habits to AsyncStorage', error);
      }
    };
    saveHabits();
  }, [habits]);

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([...habits, { id: Date.now().toString(), name: newHabit.trim(), completed: false }]);
      setNewHabit('');
    }
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const startEditingHabit = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setEditedHabitName(habit.name);
  };

  const saveEditedHabit = () => {
    if (editingHabitId && editedHabitName.trim()) {
      setHabits(habits.map(habit =>
        habit.id === editingHabitId ? { ...habit, name: editedHabitName.trim() } : habit
      ));
      setEditingHabitId(null);
      setEditedHabitName('');
    }
  };

  const cancelEditingHabit = () => {
    setEditingHabitId(null);
    setEditedHabitName('');
  };

  return {
    habits,
    newHabit,
    setNewHabit,
    editingHabitId,
    editedHabitName,
    setEditedHabitName,
    addHabit,
    toggleHabit,
    deleteHabit,
    startEditingHabit,
    saveEditedHabit,
    cancelEditingHabit,
  };
};
