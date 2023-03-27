
import { gql } from '@apollo/client';

export const GET_JOB_APPLICATIONS = gql`
  query {
      allJobApplication {
          id, companyName, description, jobTitle, jobUrl, appliedDate, salaryRange, status
      }
  }
`

export const GET_PROFILES = gql`
  query {
      allProfile {
          id, firstName, lastName, addressStreet1, addressStreet2, addressCity, addressState, addressZip, linkedin, github, personalWebsite
      }
  }
`
