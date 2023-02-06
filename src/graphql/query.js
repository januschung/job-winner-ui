
import { gql } from '@apollo/client';

export const GET_JOB_APPLICATIONS = gql`
  query {
      allJobApplication {
          id, companyName, description, jobTitle, jobUrl, appliedDate, salaryRange, status
      }
  }
`
