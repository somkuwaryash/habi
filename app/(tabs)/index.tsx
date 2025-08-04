import { StyleSheet, TextInput, FlatList, TouchableOpacity, View, useColorScheme, Appearance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';
import HabitItem from '@/components/HabitItem';
import { useHabits } from '@/hooks/useHabits';

export default function HomeScreen() {
  const { habits, newHabit, setNewHabit, editingHabitId, editedHabitName, setEditedHabitName, addHabit, toggleHabit, deleteHabit, startEditingHabit, saveEditedHabit, cancelEditingHabit } = useHabits();
  const colorScheme = useColorScheme();

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
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a new habit..."
            value={newHabit}
            onChangeText={setNewHabit}
            onSubmitEditing={addHabit}
            placeholderTextColor={colorScheme === 'dark' ? 'gray' : 'darkgray'} // Set placeholder color based on theme
          />
          {newHabit.length > 0 && (
            <TouchableOpacity onPress={() => setNewHabit('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={24} color="gray" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={addHabit} style={styles.addButton}>
            <ThemedText style={styles.addButtonText}>Add</ThemedText>
          </TouchableOpacity>
        </View>
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HabitItem
              item={item}
              toggleHabit={toggleHabit}
              deleteHabit={deleteHabit}
              editingHabitId={editingHabitId}
              editedHabitName={editedHabitName}
              setEditedHabitName={setEditedHabitName}
              saveEditedHabit={saveEditedHabit}
              cancelEditingHabit={cancelEditingHabit}
              startEditingHabit={startEditingHabit}
            />
          )}
          ListEmptyComponent={
            <ThemedText style={styles.emptyListText}>No habits yet. Add one!</ThemedText>
          }
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
    padding: 16,
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
    textAlign: 'center',
  },
  themeToggle: {
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    color: '#000', // Ensure text color is black for light mode
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  clearButton: {
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
  },
});
