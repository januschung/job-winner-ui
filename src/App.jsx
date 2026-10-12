import './i18n';
import { useEffect, useState } from 'react';
import AppHeader from './components/AppHeader';
import { AppDialogsProvider } from './components/AppDialogsContext';
import JobApplicationList from './components/JobApplicationList';
import { prefetchDialogs } from './components/lazyDialogs';
import { SnackbarProvider } from './components/common/SnackbarContext';
import { ThemeContextProvider } from './components/ThemeContext';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(prefetchDialogs, []);

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
