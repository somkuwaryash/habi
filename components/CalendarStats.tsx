import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useHabits } from '@/hooks/useHabits';
import { HabitCompletion } from '@/src/types/types';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface CalendarStatsProps {
  habitId: string;
}

const CalendarStats: React.FC<CalendarStatsProps> = ({ habitId }) => {
  const { habitCompletions, toggleHabit } = useHabits();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [userName, setUserName] = useState<string>('');

  const completedDatesForHabit = useMemo(() => {
    return habitCompletions
      .filter((completion) => completion.habitId === habitId)
      .map((completion) => completion.date);
  }, [habitCompletions, habitId]);
  const totalCompletionsAllTime = useMemo(() => completedDatesForHabit.length, [completedDatesForHabit]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('userName');
        if (mounted && stored) setUserName(stored);
      } catch (e) {
        // noop
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const today = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(today.getMonth());
  const [visibleYear, setVisibleYear] = useState(today.getFullYear());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday, etc.
  };

  const daysInCurrentMonth = getDaysInMonth(visibleYear, visibleMonth);
  const firstDayOfMonth = getFirstDayOfMonth(visibleYear, visibleMonth);

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
    const date = new Date(visibleYear, visibleMonth, day);
    return formattedCompletedDates.has(date.toDateString());
  };

  // Monthly summary metrics (visible month)
  const completionsThisMonth = useMemo(() => {
    let count = 0;
    completedDatesForHabit.forEach((ds) => {
      const d = new Date(ds);
      if (d.getFullYear() === visibleYear && d.getMonth() === visibleMonth) {
        // If viewing current month, only count up to today
        if (
          visibleYear === today.getFullYear() &&
          visibleMonth === today.getMonth()
        ) {
          if (d.getDate() <= today.getDate()) count += 1;
        } else {
          count += 1;
        }
      }
    });
    return count;
  }, [completedDatesForHabit, visibleMonth, visibleYear, today]);

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

  const { currentStreak, longestStreak } = useMemo(() => {
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const toDayId = (d: Date) => {
      const nd = new Date(d);
      nd.setHours(0, 0, 0, 0);
      return Math.floor(nd.getTime() / MS_PER_DAY);
    };

    const todayId = toDayId(today);
    // Consider only days up to today (ignore any future dates)
    const idsUpToToday = completedDatesForHabit
      .map((ds) => {
        const d = new Date(ds);
        d.setHours(0, 0, 0, 0);
        return Math.floor(d.getTime() / MS_PER_DAY);
      })
      .filter((id) => id <= todayId);
    const dayIds = new Set<number>(idsUpToToday);

    // Current streak: counts consecutive days up to today (or yesterday if today not done)
    let cur = 0;
    let startId: number | null = null;
    if (dayIds.has(todayId)) startId = todayId;
    else if (dayIds.has(todayId - 1)) startId = todayId - 1;
    if (startId !== null) {
      let id = startId;
      while (dayIds.has(id)) {
        cur++;
        id -= 1;
      }
    }

    // Longest streak: scan all sequences
    let longest = 0;
    for (const id of dayIds) {
      if (!dayIds.has(id - 1)) {
        let len = 1;
        let next = id + 1;
        while (dayIds.has(next)) {
          len++;
          next++;
        }
        if (len > longest) longest = len;
      }
    }

    return { currentStreak: cur, longestStreak: longest };
  }, [completedDatesForHabit, today]);

  const monthName = new Date(visibleYear, visibleMonth, 1).toLocaleString('default', { month: 'long' });

  const goPrevMonth = () => {
    const m = visibleMonth - 1;
    if (m < 0) {
      setVisibleMonth(11);
      setVisibleYear(visibleYear - 1);
    } else {
      setVisibleMonth(m);
    }
  };

  const goNextMonth = () => {
    const m = visibleMonth + 1;
    if (m > 11) {
      setVisibleMonth(0);
      setVisibleYear(visibleYear + 1);
    } else {
      setVisibleMonth(m);
    }
  };

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const handleToggleDay = (day: number | null) => {
    if (day === null) return;
    const dateStr = `${visibleYear}-${pad(visibleMonth + 1)}-${pad(day)}`;
    toggleHabit(habitId, dateStr);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.navRow}>
          <TouchableOpacity style={styles.navButton} onPress={goPrevMonth}>
            <Text style={[styles.navButtonText, { color: theme.text }]}>{'\u2039'}</Text>
          </TouchableOpacity>
          <ThemedText type="title" style={[styles.monthTitle, { color: theme.text }]}>
            {monthName} {visibleYear}
          </ThemedText>
          <TouchableOpacity style={styles.navButton} onPress={goNextMonth}>
            <Text style={[styles.navButtonText, { color: theme.text }]}>{'\u203A'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.daysOfWeekContainer}>
          {daysOfWeek.map((day, index) => (
            <View key={index} style={styles.headerCell}>
              <ThemedText style={[styles.dayOfWeekText, { color: theme.muted }]}>{day}</ThemedText>
            </View>
          ))}
        </View>
        <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => {
          if (day === null) return <View key={index} style={styles.dayCell} />;
          const isToday = new Date(visibleYear, visibleMonth, day).toDateString() === today.toDateString();
          const completed = isDayCompleted(day);
          return (
            <View key={index} style={styles.dayCell}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => handleToggleDay(day)}
                style={[
                  styles.dayBubble,
                  { borderColor: theme.border },
                  completed && { backgroundColor: theme.success, borderColor: 'transparent' },
                  isToday && { borderColor: theme.primary, borderWidth: 2 },
                ]}
              >
                <ThemedText
                  style={[
                    styles.dayText,
                    { color: theme.text },
                    completed && { color: theme.primaryContrast, fontWeight: 'bold' },
                  ]}
                >
                  {day}
                </ThemedText>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

        <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
          <ThemedText style={[styles.summaryValue, { color: theme.text }]}>{completionsThisMonth}</ThemedText>
          <ThemedText style={[styles.summaryLabel, { color: theme.muted }]}>Completions this month</ThemedText>
        </View>
        {/* Removed completion rate card as requested */}
        </View>
        <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.success }]} />
          <ThemedText style={[styles.legendText, { color: theme.muted }]}>Completed</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendRing, { borderColor: theme.primary }]} />
          <ThemedText style={[styles.legendText, { color: theme.muted }]}>Today</ThemedText>
        </View>
        </View>

        <View style={styles.streakRow}>
        <View style={[styles.streakCard, { backgroundColor: theme.primary }]}>
          <Text style={[styles.streakNumber, { color: theme.primaryContrast }]}>
            {currentStreak} days
          </Text>
          <Text style={[styles.streakLabel, { color: theme.primaryContrast, fontWeight: '600' }]}>Current streak</Text>
        </View>
        <View style={[styles.streakCard, styles.streakCardBelow, { backgroundColor: theme.primary }]}>
          <Text style={[styles.streakNumber, { color: theme.primaryContrast }]}>
            {longestStreak} days
          </Text>
          <Text style={[styles.streakLabel, { color: theme.primaryContrast, fontWeight: '600' }]}>Longest streak</Text>
        </View>
        {/* Removed inline best-streak note; will show at bottom instead */}
      </View>
      {currentStreak === longestStreak && (
        <View style={styles.congratsContainer}>
          <ThemedText style={[styles.congratsText, { color: theme.text }]}> 
            🎊 Congrats {userName || 'buddy'}!{'\n'}
            Your current streak is the best.
          </ThemedText>
        </View>
      )}
    </ScrollView>
  </ThemedView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    paddingBottom: 0,
    borderRadius: 0,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    width: 40,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  navButtonText: {
    fontSize: 22,
    fontWeight: '700',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'nowrap',
    marginBottom: 8,
  },
  headerCell: {
    flexBasis: '14.2857%',
    minWidth: '14.2857%',
    maxWidth: '14.2857%',
    alignItems: 'center',
  },
  dayOfWeekText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
  },
  dayCell: {
    flexBasis: '14.2857%',
    minWidth: '14.2857%',
    maxWidth: '14.2857%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 8,
  },
  dayBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  dayText: {
    fontSize: 14,
  },
  completedDayText: {
    fontWeight: 'bold',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  },
  legendRing: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    marginRight: 5,
    backgroundColor: 'transparent',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginTop: 12,
  },
  summaryCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  summaryCardRight: {
    marginLeft: 12,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  summaryLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  streakRow: {
    marginTop: 16,
  },
  streakCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  streakCardBelow: {
    marginTop: 12,
  },
  streakNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  streakLabel: {
    fontSize: 14,
    marginTop: 6,
  },
  streakBestText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  congratsContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  congratsText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default CalendarStats;
