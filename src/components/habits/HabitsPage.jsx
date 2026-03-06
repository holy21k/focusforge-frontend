import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import HabitList from './HabitList';
import Button from '../common/Button';
import { useHabits } from '../../store/habitStore';
import { useUI } from '../../store/uiStore';
import Loader from '../common/Loader';
import Modal from '../common/Modal';

const HabitsPage = () => {
  const { habits, loading, deleteHabit, missHabit, logHabit, logHabitForDate } = useHabits();
  const { openModal, closeModal, modalData, activeModal } = useUI();
  const [logDateModal, setLogDateModal] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [logDateError, setLogDateError] = useState('');

  const handleLogHabit = (habit) => {
    openModal('logHabit', habit);
  };

  const handleMissHabit = (habit) => {
    if (window.confirm(`Mark "${habit.name || habit.title}" as missed today?`)) {
      missHabit(habit.id);
    }
  };

  const handleLogDateClick = (habit) => {
    const now = new Date();
    setSelectedDate(now.toISOString().split('T')[0]);
    setSelectedTime(now.toTimeString().slice(0, 5));
    setLogDateError('');
    setLogDateModal(habit);
  };

  const handleLogForDate = () => {
    if (!logDateModal || !selectedDate) return;

    const today = new Date().toISOString().split('T')[0];
    const isToday = selectedDate === today;

    // Frontend check first
    if (isToday && (logDateModal.completedToday || logDateModal.missedToday)) {
      setLogDateError('Already logged today — pick a past date.');
      return;
    }

    const habitName = logDateModal.name || logDateModal.title;
    
    if (window.confirm(`Log "${habitName}" for ${selectedDate}${selectedTime ? ' at ' + selectedTime : ''}?`)) {
      logHabit(logDateModal.id, selectedDate, selectedTime || undefined)
        .then(() => {
          setLogDateModal(null);
          setLogDateError('');
        })
        .catch(err => {
          // Show error from backend
          setLogDateError(err.response?.data?.detail || 'Already logged today — pick a past date.');
        });
    }
  };

  const handleAddHabit = () => {
    openModal('createHabit');
  };

  const handleDeleteHabit = (id) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(id);
    }
  };

  const handleViewAnalytics = (habit) => {
    console.log('View analytics for', habit.name || habit.title);
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-lg font-normal text-zinc-700 dark:text-zinc-200">Habits</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{todayFormatted}</p>
        </div>
        <Button onClick={handleAddHabit} icon={Plus}>Add</Button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <HabitList
          habits={habits}
          onLog={handleLogHabit}
          onMiss={handleMissHabit}
          onLogDate={handleLogDateClick}
          onDelete={handleDeleteHabit}
          onViewAnalytics={handleViewAnalytics}
        />
      )}

      {/* Date/Time Picker Modal */}
      <Modal
        isOpen={!!logDateModal}
        title="Log Habit for Date"
        onClose={() => { setLogDateModal(null); setLogDateError(''); }}
      >
        <div className="flex flex-col gap-4">
          <p className="text-zinc-400 text-sm">
            Logging: <strong className="text-zinc-200">{logDateModal?.name || logDateModal?.title}</strong>
          </p>

          {logDateError && (
            <div className="p-3 bg-red-900/20 border border-red-800 rounded text-red-400 text-sm">
              {logDateError}
            </div>
          )}

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setLogDateError(''); }}
              className="w-full p-2 text-sm bg-zinc-900 border border-zinc-800 rounded text-zinc-200"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Time (optional)</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2 text-sm bg-zinc-900 border border-zinc-800 rounded text-zinc-200"
            />
          </div>

          {selectedDate === new Date().toISOString().split('T')[0] &&
            (logDateModal?.completedToday || logDateModal?.missedToday) && (
            <div className="p-3 bg-yellow-900/20 border border-yellow-800 rounded text-yellow-400 text-sm">
              ⚠️ Already logged today — pick a past date instead.
            </div>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="secondary" onClick={() => { setLogDateModal(null); setLogDateError(''); }}>
              Cancel
            </Button>
            <Button
              onClick={handleLogForDate}
              disabled={
                selectedDate === new Date().toISOString().split('T')[0] &&
                (logDateModal?.completedToday || logDateModal?.missedToday)
              }
            >
              Log
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HabitsPage;