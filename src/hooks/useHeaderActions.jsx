import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import { useTranslation } from 'react-i18next';
import { useAppDialogs } from '../components/AppDialogsContext';

// Secondary header actions, shared by the desktop toolbar and the mobile menu.
export default function useHeaderActions() {
  const { t } = useTranslation();
  const {
    openFrequentUrls,
    openQuestions,
    openInterviewList,
    openOfferList,
    interviewCount,
    offerCount,
    interviewsLoading,
    offersLoading,
  } = useAppDialogs();

  return [
    {
      key: 'bookmarks',
      label: t('appHeader.bookmarks'),
      icon: <BookmarksOutlinedIcon />,
      onClick: openFrequentUrls,
    },
    {
      key: 'qa',
      label: t('appHeader.qa'),
      icon: <QuestionAnswerOutlinedIcon />,
      onClick: openQuestions,
    },
    {
      key: 'interviews',
      label: t('appHeader.interviewList'),
      icon: <EventAvailableOutlinedIcon />,
      onClick: openInterviewList,
      badge: interviewsLoading ? 0 : interviewCount,
    },
    {
      key: 'offers',
      label: t('appHeader.offerList'),
      icon: <EmojiEventsOutlinedIcon />,
      onClick: openOfferList,
      badge: offersLoading ? 0 : offerCount,
    },
  ];
}
