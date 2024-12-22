import { render, screen } from '@testing-library/react';
import JobApplicationDialog from '../JobApplicationDialog';
import { MockedProvider } from "@apollo/client/testing";
import dayjs from 'dayjs';


const mocks = [];

it('Should render New Job Application Dialog', async() => {
    render(<MockedProvider mocks={mocks} addTypename={false}>
            <JobApplicationDialog 
                jobApplication={{"status": "open"}}
                open={true} 
                setOpen={false}
                isNew={true} />
        </MockedProvider>
  );
    
    expect(screen.getByText("Add Job Application")).toBeInTheDocument();
    expect(screen.getByDisplayValue("open")).toBeInTheDocument();
    const currentDate = dayjs(new Date()).format('MM/DD/YYYY')
    expect(screen.getByDisplayValue(currentDate)).toBeInTheDocument();
    expect(screen.getByLabelText("Company Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Job Title *")).toBeInTheDocument();
    expect(screen.getByLabelText("Salary Range *")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Job Link")).toBeInTheDocument();

});

it('Should render Edit Job Application Dialog', async() => {
  render(<MockedProvider mocks={mocks} addTypename={false}>
            <JobApplicationDialog 
                jobApplication={{"companyName": "a",
                                "jobTitle": "b",
                                "salaryRange": "c",
                                "description": "d",
                                "jobUrl": "http://example.com",
                                "appliedDate": '2021-01-01',
                                "status": "active"}}
                open={true} 
                setOpen={false}
                isNew={false} />
        </MockedProvider>
  );
    expect(screen.getByText("Edit Job Application")).toBeInTheDocument();
    expect(screen.getByDisplayValue("a")).toHaveAttribute('id', 'companyName');
    expect(screen.getByDisplayValue("b")).toHaveAttribute('id', 'jobTitle');
    expect(screen.getByDisplayValue("c")).toHaveAttribute('id', 'salaryRange');
    expect(screen.getByDisplayValue("d")).toHaveAttribute('id', 'description');
    expect(screen.getByDisplayValue("http://example.com")).toHaveAttribute('id', 'jobUrl');
    expect(screen.getByDisplayValue('01/01/2021')).toBeInTheDocument();
    expect(screen.getByDisplayValue("active")).toBeInTheDocument();
});