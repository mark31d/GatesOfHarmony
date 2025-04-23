import React, { createContext, useState } from 'react';

// Контекст для сохранённых элементов, статистики медитации и выполненных задач/цитат
export const SavedContext = createContext({
  savedItems: [],
  addSavedItem: () => {},
  removeSavedItem: () => {},
  meditationSeconds: 0,
  addMeditationSeconds: () => {},
  quotesCompleted: 0,
  tasksCompleted: 0,
  incrementQuotes: () => {},
  incrementTasks: () => {},
});

export function SavedProvider({ children }) {
  const [savedItems, setSavedItems] = useState([]);
  const [meditationSeconds, setMeditationSeconds] = useState(0);
  const [quotesCompleted, setQuotesCompleted] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);

  // Добавить уникальный сохранённый элемент
  const addSavedItem = item => {
    if (!savedItems.some(i => i.id === item.id)) {
      setSavedItems(prev => [...prev, item]);
    }
  };

  // Удалить по id
  const removeSavedItem = id => {
    setSavedItems(prev => prev.filter(i => i.id !== id));
  };

  // Увеличить общее время медитации
  const addMeditationSeconds = seconds => {
    setMeditationSeconds(prev => prev + seconds);
  };

  // Увеличить счётчик просмотренных цитат
  const incrementQuotes = () => {
    setQuotesCompleted(prev => prev + 1);
  };

  // Увеличить счётчик выполненных задач
  const incrementTasks = () => {
    setTasksCompleted(prev => prev + 1);
  };

  return (
    <SavedContext.Provider
      value={{
        savedItems,
        addSavedItem,
        removeSavedItem,
        meditationSeconds,
        addMeditationSeconds,
        quotesCompleted,
        tasksCompleted,
        incrementQuotes,
        incrementTasks,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
}
