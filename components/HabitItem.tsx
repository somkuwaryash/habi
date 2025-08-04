import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { Habit } from '@/app/constants/types';

interface HabitItemProps {
  item: Habit;
}

const HabitItem: React.FC<HabitItemProps> = ({ item }) => {
  return (
    <View style={styles.habitItem}>
      <ThemedText>{item.name}</ThemedText>
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
});

export default HabitItem;
