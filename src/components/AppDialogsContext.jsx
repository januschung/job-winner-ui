import React, { createContext, useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_ALL_INTERVIEWS,
  GET_ALL_OFFERS,
  GET_PROFILE,
} from '../graphql/query';
import useDialog from '../hooks/useDialog';
import useJobApplicationDialog from '../hooks/useJobApplicationDialog';
import { getFilteredInterviews } from '../utils/interviewUtil';
import FrequentUrlDialog from './FrequentUrlDialog';
import InterviewListDialog from './InterviewListDialog';
import JobApplicationDialog from './JobApplicationDialog';
import OfferListDialog from './OfferListDialog';
import ProfileDialog from './ProfileDialog';
import QuestionDialog from './QuestionDialog';

const AppDialogsContext = createContext(null);

export const useAppDialogs = () => useContext(AppDialogsContext);

// Owns the app-level dialogs (new application, bookmarks, Q&A, profile,
// interview and offer lists) so any component can open them, and the
// interview/offer counts those dialogs keep fresh.
export function AppDialogsProvider({ children }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState('');

  const {
    data: offersData,
    loading: offersLoading,
    refetch: refetchOffers,
  } = useQuery(GET_ALL_OFFERS, {
    fetchPolicy: 'network-only',
  });
  const {
    data: interviewsData,
    loading: interviewsLoading,
    refetch: refetchInterviews,
  } = useQuery(GET_ALL_INTERVIEWS, {
    fetchPolicy: 'network-only',
  });
  const { data: profileData } = useQuery(GET_PROFILE, {
    variables: { id: 1 },
  });

  const newJobApplication = useJobApplicationDialog(refetchOffers);
  const offerList = useDialog(refetchOffers);
  const interviewList = useDialog(refetchInterviews);
  const frequentUrls = useDialog();
  const questions = useDialog();

  const openProfile = () => {
    setProfileOpen(true);
    setProfile(profileData?.profileById);
  };

  const value = {
    openNewJobApplication: newJobApplication.handleOpen,
    openFrequentUrls: frequentUrls.handleOpen,
    openQuestions: questions.handleOpen,
    openInterviewList: interviewList.handleOpen,
    openOfferList: offerList.handleOpen,
    openProfile,
    interviewCount:
      getFilteredInterviews(interviewsData?.allInterview)?.length || 0,
    offerCount: offersData?.allOffer?.length || 0,
    interviewsLoading,
    offersLoading,
  };

  return (
    <AppDialogsContext.Provider value={value}>
      <JobApplicationDialog
        jobApplication={{ status: 'open' }}
        open={newJobApplication.open}
        handleClose={newJobApplication.handleClose}
        setOpen={newJobApplication.handleOpen}
        isNew
      />
      <FrequentUrlDialog
        open={frequentUrls.dialogOpen}
        handleClose={frequentUrls.handleClose}
        setOpen={frequentUrls.handleOpen}
      />
      <QuestionDialog
        open={questions.dialogOpen}
        handleClose={questions.handleClose}
        setOpen={questions.handleOpen}
      />
      <ProfileDialog
        profile={profile}
        open={profileOpen}
        handleClose={() => setProfileOpen(false)}
      />
      <InterviewListDialog
        open={interviewList.dialogOpen}
        handleClose={interviewList.handleClose}
        setOpen={interviewList.handleOpen}
      />
      <OfferListDialog
        open={offerList.dialogOpen}
        handleClose={offerList.handleClose}
        setOpen={offerList.handleOpen}
      />
      {children}
    </AppDialogsContext.Provider>
  );
}
