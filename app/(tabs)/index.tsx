import { useState, useEffect, useMemo } from 'react';
import { StyleSheet, TextInput, FlatList, TouchableOpacity, View, useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';
import HabitItem from '@/components/HabitItem';
import { Habit } from '@/app/constants/types';
import { useHabits } from '@/hooks/useHabits';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarStrip from 'react-native-calendar-strip';

export default function HomeScreen() {
  const {
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
  } = useHabits();

  const colorScheme = useColorScheme();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const filteredHabits = useMemo(() => {
    // Reverting to show all habits as per user's request.
    // Future iterations will implement more complex frequency logic.
    return habits;
  }, [habits, selectedDate]);

  const toggleTheme = () => {
    const newColorScheme = colorScheme === 'dark' ? 'light' : 'dark';
    Appearance.setColorScheme(newColorScheme);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="title" style={styles.title}>My Habits</ThemedText>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <Ionicons
              name={colorScheme === 'dark' ? 'sunny' : 'moon'}
              size={24}
              color={colorScheme === 'dark' ? 'orange' : 'black'}
            />
          </TouchableOpacity>
        </ThemedView>

        <CalendarStrip
          scrollable
          style={{ height: 100, paddingTop: 10, paddingBottom: 10 }}
          calendarHeaderStyle={{ color: colorScheme === 'dark' ? 'white' : 'black' }}
          dateNumberStyle={{ color: colorScheme === 'dark' ? 'white' : 'black' }}
          dateNameStyle={{ color: colorScheme === 'dark' ? 'white' : 'black' }}
          highlightDateNumberStyle={{ color: '#007bff' }}
          highlightDateNameStyle={{ color: '#007bff' }}
          onDateSelected={(date: any) => setSelectedDate(date.toDate())}
          selectedDate={selectedDate}
          iconContainer={{ flex: 0.1 }}
        />

        <ThemedView style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { color: colorScheme === 'dark' ? 'white' : 'black' }]}
            placeholder="Add a new habit..."
            value={newHabit}
            onChangeText={setNewHabit}
            onSubmitEditing={addHabit}
            placeholderTextColor={colorScheme === 'dark' ? 'gray' : 'darkgray'}
          />
          {newHabit.length > 0 && (
            <TouchableOpacity onPress={() => setNewHabit('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={24} color="gray" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={addHabit} style={styles.addButton}>
            <ThemedText style={styles.addButtonText}>Add</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <FlatList
          data={filteredHabits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HabitItem item={item} />
          )}
          ListEmptyComponent={
            <ThemedText style={styles.emptyListText}>No habits yet. Add one!</ThemedText>
          }
          contentContainerStyle={styles.listContentContainer}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  themeToggle: {
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 5,
  },
  listContentContainer: {
    flexGrow: 1,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});
