import { useState, useMemo } from 'react';
import { StyleSheet, TextInput, FlatList, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';
import HabitItem from '@/components/HabitItem';
import { Habit } from '@/src/types/types';
import { useHabits } from '@/hooks/useHabits';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarStrip from 'react-native-calendar-strip';
import { Colors } from '@/constants/Colors';
import { useThemeController } from '@/providers/ColorSchemeProvider';

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

  const { colorScheme, toggleColorScheme } = useThemeController();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const theme = Colors[(colorScheme ?? 'light') as 'light' | 'dark'];

  const filteredHabits = useMemo(() => {
    return habits;
  }, [habits, selectedDate]);

  const toggleTheme = () => toggleColorScheme();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="title" style={styles.title}>My Habits</ThemedText>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <Ionicons name={colorScheme === 'dark' ? 'sunny' : 'moon'} size={24} color={theme.primary} />
          </TouchableOpacity>
        </ThemedView>

        <CalendarStrip
          scrollable
          style={{ height: 100, paddingTop: 10, paddingBottom: 10 }}
          calendarColor={theme.surface}
          highlightDateNumberStyle={{ color: theme.primary }}
          onDateSelected={(date: any) => setSelectedDate(date.toDate())}
          selectedDate={selectedDate}
          iconContainer={{ flex: 0.1 }}
          dateNumberStyle={{ color: theme.text }}
          dateNameStyle={{ color: theme.muted }}
          calendarHeaderStyle={{ color: theme.text }}
        />

        <ThemedView style={[styles.inputContainer, {
          backgroundColor: theme.inputBackground,
          shadowColor: theme.icon,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
        }]}> 
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Add a new habit..."
            value={newHabit}
            onChangeText={setNewHabit}
            onSubmitEditing={addHabit}
            placeholderTextColor={theme.inputPlaceholder}
          />
          {newHabit.length > 0 && (
            <TouchableOpacity onPress={() => setNewHabit('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={24} color={theme.muted} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={addHabit} style={[styles.addButton, { backgroundColor: theme.primary }]}>
            <ThemedText style={[styles.addButtonText, { color: theme.primaryContrast }]}>Add</ThemedText>
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
              selectedDate={selectedDate.toISOString().split('T')[0]}
              habitCompletions={habitCompletions}
            />
          )}
          ListEmptyComponent={
            <ThemedText style={[styles.emptyListText, { color: theme.muted }]}>No habits yet. Add one!</ThemedText>
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
    marginBottom: 16,
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
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    height: 44,
    paddingVertical: 8,
    textAlignVertical: 'center',
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginLeft: 10,
  },

  addButtonText: {
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 5,
    marginLeft: 8,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
});
