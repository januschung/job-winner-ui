import { gql } from '@apollo/client';

export const GET_JOB_APPLICATIONS = gql`
  query GetJobApplications {
    allJobApplication {
      id
      companyName
      description
      note
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
      email
      telephone
    }
  }
`;

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
      email
      telephone
    }
  }
`;

export const GET_OFFER = gql`
  query GetOffer($jobApplicationId: Int!) {
    offerByJobApplicationId(jobApplicationId: $jobApplicationId) {
      id
      jobApplicationId
      offerDate
      salaryOffered
      description
    }
  }
`;

export const GET_ALL_OFFERS = gql`
  query GetOffers {
    allOffer {
      id
      jobApplicationId
      offerDate
      salaryOffered
      description
      jobApplication {
        id
        companyName
        description
        note
        jobTitle
        jobUrl
        appliedDate
        salaryRange
        status
      }
    }
  }
`;

export const GET_ALL_INTERVIEWS = gql`
  query GetAllInterviews {
    allInterview {
      id
      jobApplicationId
      interviewDate
      interviewer
      description
      status
      jobApplication {
        id
        companyName
        description
        note
        jobTitle
        jobUrl
        appliedDate
        salaryRange
        status
      }
    }
  }
`;

export const GET_INTERVIEWS_BY_JOB_APPLICATION_ID = gql`
  query GetInterviewsByJobApplicationId($jobApplicationId: Int!) {
    allInterviewByJobApplicationId(jobApplicationId: $jobApplicationId) {
      id
      jobApplicationId
      interviewDate
      interviewer
      description
      status
    }
  }
`;

export const GET_INTERVIEW_BY_ID = gql`
  query GetInterviewById($id: ID!) {
    interviewById(id: $id) {
      id
      jobApplicationId
      interviewDate
      interviewer
      description
      status
    }
  }
`;

export const GET_FREQUENT_URLS = gql`
  query GetFrequentUrls {
    allFrequentUrl {
      id
      title
      url
    }
  }
`;

export const GET_FREQUENT_URL = gql`
  query GetFrequentUrl($id: ID!) {
    frequentUrlById(id: $id) {
      id
      title
      url
    }
  }
`;

export const GET_QUESTIONS = gql`
  query GetQuestions {
    allQuestion {
      id
      question
      answer
    }
  }
`;

export const GET_QUESTION = gql`
  query GetQuestion($id: ID!) {
    questionById(id: $id) {
      id
      question
      answer
    }
  }
`;
