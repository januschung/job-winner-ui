
import { gql } from '@apollo/client';

export const GET_JOB_APPLICATIONS = gql`
  query GetJobApplications {
    allJobApplication {
      id
      companyName
      description
      jobTitle
      jobUrl
      appliedDate
      salaryRange
      status
    }
  }
`;

export const GET_PROFILES = gql`
  query GetProfiles {
    allProfile {
      id
      firstName
      lastName
      addressStreet1
      addressStreet2
      addressCity
      addressState
      addressZip
      linkedin
      github
      personalWebsite
    }
  }
`
export const GET_PROFILE = gql`
  query GetProfile($id: ID!) {
    profileById(id: $id) {
      id
      firstName
      lastName
      addressStreet1
      addressStreet2
      addressCity
      addressState
      addressZip
      linkedin
      github
      personalWebsite
    }
  }
`;