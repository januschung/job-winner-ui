import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import PrimarySearchAppBar from './components/PrimarySearchAppBar';
import JobApplicationList from './components/JobApplicationList';


jest.mock('./components/PrimarySearchAppBar')
jest.mock('./components/JobApplicationList')

it('Should render Job Application list on default route', async () => {
  PrimarySearchAppBar.mockImplementation(() => <div>PrimarySearchAppBarMock</div>)
  JobApplicationList.mockImplementation(() => <div>JobApplicationListrMock</div>)
  render(<MemoryRouter>
          <App />
        </MemoryRouter>);
  expect(screen.getByText("PrimarySearchAppBarMock")).toBeInTheDocument();
  expect(screen.getByText("JobApplicationListrMock")).toBeInTheDocument();
});