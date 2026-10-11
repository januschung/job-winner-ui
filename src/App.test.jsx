import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
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
    <MockedProvider mocks={[]} addTypename={false}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </MockedProvider>
  );
  expect(screen.getByText('AppHeaderMock')).not.toBeNull();
  expect(screen.getByText('JobApplicationListrMock')).not.toBeNull();
});
