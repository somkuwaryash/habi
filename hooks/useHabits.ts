import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitCompletion } from '@/app/constants/types';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitCompletions, setHabitCompletions] = useState<HabitCompletion[]>([]);
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
    const loadHabitCompletions = async () => {
      try {
        const storedCompletions = await AsyncStorage.getItem('habitCompletions');
        if (storedCompletions) {
          setHabitCompletions(JSON.parse(storedCompletions));
        }
      } catch (error) {
        console.error('Failed to load habit completions from AsyncStorage', error);
      }
    };
    loadHabits();
    loadHabitCompletions();
  }, []);

  useEffect(() => {
    const saveHabits = async () => {
      try {
        await AsyncStorage.setItem('habits', JSON.stringify(habits));
      } catch (error) {
        console.error('Failed to save habits to AsyncStorage', error);
      }
    };
    const saveHabitCompletions = async () => {
      try {
        await AsyncStorage.setItem('habitCompletions', JSON.stringify(habitCompletions));
      } catch (error) {
        console.error('Failed to save habit completions to AsyncStorage', error);
      }
    };
    saveHabits();
    saveHabitCompletions();
  }, [habits, habitCompletions]);

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([
        ...habits,
        {
          id: Date.now().toString(),
          name: newHabit.trim(),

          createdAt: new Date().toISOString(), // Add createdAt property
        },
      ]);
      setNewHabit('');
    }
  };

  const toggleHabit = (habitId: string, date: string) => {
    const existingCompletionIndex = habitCompletions.findIndex(
      (completion) => completion.habitId === habitId && completion.date === date
    );

    if (existingCompletionIndex > -1) {
      // If completion exists, remove it (un-complete)
      const updatedCompletions = [...habitCompletions];
      updatedCompletions.splice(existingCompletionIndex, 1);
      setHabitCompletions(updatedCompletions);
    } else {
      // If completion doesn't exist, add it (complete)
      setHabitCompletions([
        ...habitCompletions,
        { habitId, date, completed: true },
      ]);
    }
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const startEditingHabit = (id: string, name: string) => {
    setEditingHabitId(id);
    setEditedHabitName(name);
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
    habitCompletions,
  };
};
