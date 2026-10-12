import { lazy } from 'react';

// Dialogs start closed, so their code (forms, date pickers, tables) loads on
// demand instead of in the initial bundle. Render them inside
// <MountOnFirstOpen>.
const loaders = {
  JobApplicationDialog: () => import('./JobApplicationDialog'),
  FrequentUrlDialog: () => import('./FrequentUrlDialog'),
  QuestionDialog: () => import('./QuestionDialog'),
  ProfileDialog: () => import('./ProfileDialog'),
  InterviewListDialog: () => import('./InterviewListDialog'),
  OfferListDialog: () => import('./OfferListDialog'),
};

export const JobApplicationDialog = lazy(loaders.JobApplicationDialog);
export const FrequentUrlDialog = lazy(loaders.FrequentUrlDialog);
export const QuestionDialog = lazy(loaders.QuestionDialog);
export const ProfileDialog = lazy(loaders.ProfileDialog);
export const InterviewListDialog = lazy(loaders.InterviewListDialog);
export const OfferListDialog = lazy(loaders.OfferListDialog);

// Warms the dialog chunks once the browser is idle, so the first open does
// not wait on the network.
export function prefetchDialogs() {
  const load = () => Object.values(loaders).forEach(loader => loader());
  if ('requestIdleCallback' in window) window.requestIdleCallback(load);
  else setTimeout(load, 1500);
}
