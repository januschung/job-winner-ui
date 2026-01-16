import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from './App';
import AppHeader from './components/AppHeader';
import JobApplicationList from './components/JobApplicationList';

vi.mock('./components/AppHeader');
vi.mock('./components/JobApplicationList');

it('Should render Job Application list on default route', async () => {
  AppHeader.mockImplementation(() => <div>AppHeaderMock</div>);
  JobApplicationList.mockImplementation(() => (
    <div>JobApplicationListrMock</div>
  ));
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText('AppHeaderMock')).not.toBeNull();
});
