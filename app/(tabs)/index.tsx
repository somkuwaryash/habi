import { useState, useEffect, useMemo } from 'react';
import { StyleSheet, TextInput, FlatList, TouchableOpacity, View, useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';
import HabitItem from '@/components/HabitItem';
import { Habit } from '@/src/types/types';
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
    habitCompletions,
  } = useHabits();

  const systemColorScheme = useColorScheme();
  const [appColorScheme, setAppColorScheme] = useState(systemColorScheme);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const filteredHabits = useMemo(() => {
    // Reverting to show all habits as per user's request.
    // Future iterations will implement more complex frequency logic.
    return habits;
  }, [habits, selectedDate]);

  useEffect(() => {
    const loadColorScheme = async () => {
      try {
        const savedColorScheme = await AsyncStorage.getItem('appColorScheme');
        if (savedColorScheme) {
          setAppColorScheme(savedColorScheme as 'light' | 'dark');
        } else {
          setAppColorScheme(systemColorScheme);
        }
      } catch (error) {
        console.error('Failed to load color scheme from AsyncStorage', error);
        setAppColorScheme(systemColorScheme);
      }
    };
    loadColorScheme();
  }, [systemColorScheme]);

  useEffect(() => {
    const saveColorScheme = async () => {
      try {
        await AsyncStorage.setItem('appColorScheme', appColorScheme || '');
      } catch (error) {
        console.error('Failed to save color scheme to AsyncStorage', error);
      }
    };
    saveColorScheme();
  }, [appColorScheme]);

  const toggleTheme = () => {
    const newColorScheme = appColorScheme === 'dark' ? 'light' : 'dark';
    setAppColorScheme(newColorScheme);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="title" style={styles.title}>My Habits</ThemedText>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <Ionicons
              name={appColorScheme === 'dark' ? 'sunny' : 'moon'}
              size={24}
              color={appColorScheme === 'dark' ? '#FFC107' : '#E65100'}
            />
          </TouchableOpacity>
        </ThemedView>

        <CalendarStrip
          scrollable
          style={{ height: 100, paddingTop: 10, paddingBottom: 10 }}
          calendarColor={appColorScheme === 'dark' ? '#3E2723' : '#FFF3E0'}
          highlightDateNumberStyle={{ color: '#FF9800' }}
          onDateSelected={(date: any) => setSelectedDate(date.toDate())}
          selectedDate={selectedDate}
          iconContainer={{ flex: 0.1 }}
          dateNumberStyle={{ color: appColorScheme === 'dark' ? '#FFE0B2' : '#5D4037' }}
          dateNameStyle={{ color: appColorScheme === 'dark' ? '#FFE0B2' : '#5D4037' }}
          calendarHeaderStyle={{ color: appColorScheme === 'dark' ? '#FFE0B2' : '#5D4037' }}
        />

        <ThemedView style={[styles.inputContainer, {
          backgroundColor: appColorScheme === 'dark' ? '#4E342E' : '#FFF8E1',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
        }]}>
          <TextInput
            style={[styles.input, { color: appColorScheme === 'dark' ? 'white' : 'black' }]}
            placeholder="Add a new habit..."
            value={newHabit}
            onChangeText={setNewHabit}
            onSubmitEditing={addHabit}
            placeholderTextColor={appColorScheme === 'dark' ? '#A1887F' : '#8D6E63'}
          />
          {newHabit.length > 0 && (
            <TouchableOpacity onPress={() => setNewHabit('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={24} color="#A1887F" />
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
            <HabitItem
              item={item}
              toggleHabit={toggleHabit}
              deleteHabit={deleteHabit}
              startEditingHabit={startEditingHabit}
              saveEditedHabit={saveEditedHabit}
              cancelEditingHabit={cancelEditingHabit}
              editingHabitId={editingHabitId}
              editedHabitName={editedHabitName}
              setEditedHabitName={setEditedHabitName}
              appColorScheme={appColorScheme}
              selectedDate={selectedDate.toISOString().split('T')[0]}
              habitCompletions={habitCompletions}
            />
          )}
          ListEmptyComponent={
            <ThemedText style={[styles.emptyListText, { color: appColorScheme === 'dark' ? '#A1887F' : '#8D6E63' }]}>No habits yet. Add one!</ThemedText>
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
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 40,
  },
  addButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
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
