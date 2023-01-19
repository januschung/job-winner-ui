import { gql, useMutation } from '@apollo/client';

const ADD_JOB_APPLICATION = gql`
    mutation AddJobApplication(
        $companyName: String!,
        $jobTitle: String!,
        $salaryRange: String!,
        $status: String!,
        $linkedInJobUrl: String!,
    ){
        addJobApplication(addJobApplicationInput: {
        companyName: $companyName,
        jobTitle: $jobTitle,
        salaryRange: $salaryRange,
        status: $status,
        linkedInJobUrl: $linkedInJobUrl
        }) {
      id
    }
  }

`

