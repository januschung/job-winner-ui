import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import AppHeader from './components/AppHeader';
import JobApplicationList from './components/JobApplicationList';


jest.mock('./components/AppHeader')
jest.mock('./components/JobApplicationList')

it('Should render Job Application list on default route', async () => {
  AppHeader.mockImplementation(() => <div>AppHeaderMock</div>)
  JobApplicationList.mockImplementation(() => <div>JobApplicationListrMock</div>)
  render(<MemoryRouter>
          <App />
        </MemoryRouter>);
  expect(screen.getByText("AppHeaderMock")).toBeInTheDocument();
});