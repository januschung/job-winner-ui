import { createContext, useContext, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
  GET_ALL_INTERVIEWS,
  GET_ALL_OFFERS,
  GET_PROFILE,
} from '../graphql/query';
import useDialog from '../hooks/useDialog';
import { getFilteredInterviews } from '../utils/interviewUtil';
import MountOnFirstOpen from './common/MountOnFirstOpen';
import {
  FrequentUrlDialog,
  InterviewListDialog,
  JobApplicationDialog,
  OfferListDialog,
  ProfileDialog,
  QuestionDialog,
} from './lazyDialogs';

export const AppDialogsContext = createContext(null);

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

  const newJobApplication = useDialog(refetchOffers);
  const offerList = useDialog(refetchOffers);
  const interviewList = useDialog(refetchInterviews);
  const frequentUrls = useDialog();
  const questions = useDialog();

  const openProfile = () => {
    setProfileOpen(true);
    setProfile(profileData?.profileById);
  };

  const value = {
    // Wrapped so click events passed by onClick are not taken as the item.
    openNewJobApplication: () => newJobApplication.handleOpen(),
    openFrequentUrls: () => frequentUrls.handleOpen(),
    openQuestions: () => questions.handleOpen(),
    openInterviewList: () => interviewList.handleOpen(),
    openOfferList: () => offerList.handleOpen(),
    openProfile,
    profileName: [
      profileData?.profileById?.firstName,
      profileData?.profileById?.lastName,
    ]
      .filter(Boolean)
      .join(' '),
    interviewCount:
      getFilteredInterviews(interviewsData?.allInterview)?.length || 0,
    offerCount: offersData?.allOffer?.length || 0,
    interviewsLoading,
    offersLoading,
  };

  return (
    <AppDialogsContext.Provider value={value}>
      <MountOnFirstOpen open={newJobApplication.open}>
        <JobApplicationDialog
          jobApplication={{ status: 'open' }}
          open={newJobApplication.open}
          handleClose={newJobApplication.handleClose}
          isNew
        />
      </MountOnFirstOpen>
      <MountOnFirstOpen open={frequentUrls.open}>
        <FrequentUrlDialog
          open={frequentUrls.open}
          handleClose={frequentUrls.handleClose}
        />
      </MountOnFirstOpen>
      <MountOnFirstOpen open={questions.open}>
        <QuestionDialog
          open={questions.open}
          handleClose={questions.handleClose}
        />
      </MountOnFirstOpen>
      <MountOnFirstOpen open={profileOpen}>
        <ProfileDialog
          profile={profile}
          open={profileOpen}
          handleClose={() => setProfileOpen(false)}
        />
      </MountOnFirstOpen>
      <MountOnFirstOpen open={interviewList.open}>
        <InterviewListDialog
          open={interviewList.open}
          handleClose={interviewList.handleClose}
        />
      </MountOnFirstOpen>
      <MountOnFirstOpen open={offerList.open}>
        <OfferListDialog
          open={offerList.open}
          handleClose={offerList.handleClose}
        />
      </MountOnFirstOpen>
      {children}
    </AppDialogsContext.Provider>
  );
}
