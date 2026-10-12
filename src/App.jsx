import './i18n';
import { useState } from 'react';
import AppHeader from './components/AppHeader';
import { AppDialogsProvider } from './components/AppDialogsContext';
import JobApplicationList from './components/JobApplicationList';
import { SnackbarProvider } from './components/common/SnackbarContext';
import { ThemeContextProvider } from './components/ThemeContext';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <ThemeContextProvider>
      <SnackbarProvider>
        <AppDialogsProvider>
          <AppHeader searchTerm={searchTerm} onSearch={setSearchTerm} />
          <JobApplicationList
            searchTerm={searchTerm}
            onClearSearch={() => setSearchTerm('')}
          />
        </AppDialogsProvider>
      </SnackbarProvider>
    </ThemeContextProvider>
  );
}

export default App;
