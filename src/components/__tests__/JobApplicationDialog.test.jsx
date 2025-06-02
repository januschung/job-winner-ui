import { render, screen } from "@testing-library/react";
import JobApplicationDialog from "../JobApplicationDialog";
import { MockedProvider } from "@apollo/client/testing";
import { SnackbarProvider } from "../common/SnackbarContext";
import dayjs from "dayjs";
import i18n from "../../i18n";

const mocks = [];

it("Should render New Job Application Dialog", async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <SnackbarProvider>
        <JobApplicationDialog
          jobApplication={{ status: "open" }}
          open={true}
          setOpen={false}
          isNew={true}
        />
      </SnackbarProvider>
    </MockedProvider>
  );

  expect(screen.getByText("Add Job Application")).not.toBeNull();
  const currentDate = dayjs(new Date()).format("MM/DD/YYYY");
  expect(screen.getByDisplayValue(currentDate)).not.toBeNull();
  expect(screen.getByLabelText("Company Name *")).not.toBeNull();
  expect(screen.getByLabelText("Job Title *")).not.toBeNull();
  expect(screen.getByLabelText("Salary Range *")).not.toBeNull();
  expect(screen.getByLabelText("Description")).not.toBeNull();
  expect(screen.getByLabelText("Job Link")).not.toBeNull();
});

it("Should render Edit Job Application Dialog", async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <SnackbarProvider>
        <JobApplicationDialog
          jobApplication={{
            companyName: "a",
            jobTitle: "b",
            salaryRange: "c",
            description: "d",
            jobUrl: "http://example.com",
            appliedDate: "2021-01-01",
            status: "active",
          }}
          open={true}
          setOpen={false}
          isNew={false}
        />
      </SnackbarProvider>
    </MockedProvider>
  );
  expect(screen.getByText("Edit Job Application")).not.toBeNull();
  expect(screen.getByDisplayValue("a").id).toBe("companyName");
  expect(screen.getByDisplayValue("b").id).toBe("jobTitle");
  expect(screen.getByDisplayValue("c").id).toBe("salaryRange");
  expect(screen.getByDisplayValue("d").id).toBe("description");
  expect(screen.getByDisplayValue("http://example.com").id).toBe("jobUrl");
  expect(screen.getByDisplayValue("01/01/2021")).not.toBeNull();
  expect(screen.getByDisplayValue("active")).not.toBeNull();
});
