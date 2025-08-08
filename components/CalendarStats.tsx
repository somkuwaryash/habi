import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useHabits } from '@/hooks/useHabits';
import { HabitCompletion } from '@/src/types/types';

interface CalendarStatsProps {
  habitId: string;
}

const CalendarStats: React.FC<CalendarStatsProps> = ({ habitId }) => {
  const { habitCompletions } = useHabits();

  const completedDatesForHabit = useMemo(() => {
    return habitCompletions
      .filter((completion) => completion.habitId === habitId)
      .map((completion) => completion.date);
  }, [habitCompletions, habitId]);
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const today = useMemo(() => new Date(), []);
  const currentMonth = useMemo(() => today.getMonth(), [today]);
  const currentYear = useMemo(() => today.getFullYear(), [today]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday, etc.
  };

  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarDays = useMemo(() => {
    const days = [];
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push(i);
    }
    return days;
  }, [daysInCurrentMonth, firstDayOfMonth]);

  const formattedCompletedDates = useMemo(() => {
    return new Set(completedDatesForHabit.map(date => new Date(date).toDateString()));
  }, [completedDatesForHabit]);

  const isDayCompleted = (day: number | null) => {
    if (day === null) return false;
    const date = new Date(currentYear, currentMonth, day);
    return formattedCompletedDates.has(date.toDateString());
  };

  const calculateCurrentStreak = (dates: string[]) => {
    if (dates.length === 0) return 0;

    const sortedDates = dates.map(dateStr => new Date(dateStr)).sort((a, b) => a.getTime() - b.getTime());
    let streak = 0;
    let tempStreak = 0;

    // Check if today is completed or yesterday was completed
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isTodayCompleted = isDayCompleted(today.getDate());
    const isYesterdayCompleted = isDayCompleted(yesterday.getDate());

    if (isTodayCompleted) {
      tempStreak = 1;
    } else if (isYesterdayCompleted) {
      tempStreak = 1;
    }

    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const currentDate = sortedDates[i];
      const previousDate = sortedDates[i - 1];

      if (i === sortedDates.length - 1 && !isTodayCompleted && currentDate.toDateString() !== yesterday.toDateString()) {
        // If the last completed date is not today or yesterday, streak is 0
        break;
      }

      if (previousDate) {
        const diffTime = Math.abs(currentDate.getTime() - previousDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1 && currentDate.toDateString() !== today.toDateString()) {
          // If there's a gap and the current date is not today, break the streak
          break;
        } else if (diffDays > 1 && currentDate.toDateString() === today.toDateString() && !isYesterdayCompleted) {
          // If today is completed but yesterday was not, streak starts from 1
          break;
        }
      }
    }
    return tempStreak;
  };

  const currentStreak = calculateCurrentStreak(completedDatesForHabit);

  const monthName = today.toLocaleString('default', { month: 'long' });

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>{monthName} - {daysInCurrentMonth} days</ThemedText>
      <View style={styles.daysOfWeekContainer}>
        {daysOfWeek.map((day, index) => (
          <ThemedText key={index} style={styles.dayOfWeekText}>{day}</ThemedText>
        ))}
      </View>
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => (
          <View key={index} style={[styles.dayCell, day !== null && isDayCompleted(day) && styles.completedDayCell]}>
            <ThemedText style={[styles.dayText, day !== null && isDayCompleted(day) && styles.completedDayText]}>
              {day}
            </ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.completedDot]} />
          <ThemedText style={styles.legendText}>All done</ThemedText>
        </View>
      </View>

      <View style={styles.streakContainer}>
        <ThemedText style={styles.streakNumber}>{currentStreak} days</ThemedText>
        <ThemedText style={styles.streakText}>Your current streak is the best</ThemedText>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2C2C2C', // Dark background for the calendar
    borderRadius: 10,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 15,
    textAlign: 'center',
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayOfWeekText: {
    color: '#A0A0A0',
    fontWeight: 'bold',
    width: 30,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderRadius: 15,
  },
  completedDayCell: {
    backgroundColor: '#4CAF50', // Green for completed days
  },
  dayText: {
    color: '#E0E0E0',
    fontSize: 14,
  },
  completedDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  completedDot: {
    backgroundColor: '#4CAF50',
  },
  someDoneDot: {
    backgroundColor: '#FFC107', // Example for 'some done'
  },
  legendText: {
    color: '#A0A0A0',
    fontSize: 12,
  },
  streakContainer: {
    backgroundColor: '#FF9800', // Orange background for streak
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  streakNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  streakText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
  },
});

export default CalendarStats;
