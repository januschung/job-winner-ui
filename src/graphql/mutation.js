import { gql } from '@apollo/client';

export const ADD_JOB_APPLICATION = gql`
  mutation AddJobApplication(
      $companyName: String!,
      $jobTitle: String!,
      $description: String!,
      $salaryRange: String!,
      $status: String!,
      $jobUrl: String!,
      $appliedDate: String!
  ){
      addJobApplication(addJobApplicationInput: {
      companyName: $companyName,
      jobTitle: $jobTitle,
      description: $description,
      salaryRange: $salaryRange,
      status: $status,
      jobUrl: $jobUrl,
      appliedDate: $appliedDate
      }) {
      id, companyName, description, jobTitle, jobUrl, appliedDate, salaryRange, status
  }
  }

`

export const UPDATE_JOB_APPLICATION = gql`
  mutation UpdateJobApplication(
      $id: ID!,
      $companyName: String!,
      $jobTitle: String!,
      $description: String!,
      $salaryRange: String!,
      $status: String!,
      $jobUrl: String!,
      $appliedDate: String!
  ){
      updateJobApplication(jobApplication: {
      id: $id,
      companyName: $companyName,
      jobTitle: $jobTitle,
      description: $description,
      salaryRange: $salaryRange,
      status: $status,
      jobUrl: $jobUrl,
      appliedDate: $appliedDate
      }) {
      id, companyName, description, jobTitle, jobUrl, appliedDate, salaryRange, status
  }
  }

`

export const DELETE_JOB_APPLICATION = gql`
  mutation DeleteJobApplication(
      $id: ID!
  ){
      deleteJobApplication(
        id: $id
      ) {
      id, companyName, description, jobTitle, jobUrl, appliedDate, salaryRange, status
  }
  }

`