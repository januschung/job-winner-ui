import dayjs from 'dayjs';

/**
 * Filters interviews based on date and status.
 * @param {Array} interviews - List of interview objects.
 * @returns {Array} - Filtered interviews.
 */
export const getFilteredInterviews = interviews => {
  return (
    interviews?.filter(interview => {
      const interviewDate = dayjs(interview.interviewDate);
      if (!interviewDate.isValid()) {
        console.warn(
          'Invalid dayjs object for interviewDate:',
          interview.interviewDate
        );
        return false;
      }

      return (
        (interviewDate.isSame(dayjs(), 'day') ||
          interviewDate.isAfter(dayjs(), 'day')) &&
        ['open', 'pending'].includes(interview.status)
      );
    }) || []
  );
};
