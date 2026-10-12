import React from 'react';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { statusColor } from '../config/status';
import { formatCalendarDate } from '../utils/dateUtil';

function StatusBadge({ status }) {
  const { t } = useTranslation();
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        height: 24,
        px: 1.25,
        borderRadius: 999,
        flexShrink: 0,
        fontSize: '0.75rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        bgcolor: statusColor(status, 'soft', 'action.hover'),
        color: statusColor(status, 'text', 'text.secondary'),
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: statusColor(status, 'main', 'text.disabled'),
        }}
      />
      {t(`jobStatusBar.${status}`, { defaultValue: status })}
    </Box>
  );
}

function Meta({ icon, children, title }) {
  const content = (
    <Box
      component="span"
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}
    >
      {icon}
      {children}
    </Box>
  );
  return title ? (
    <Tooltip title={title} placement="top">
      {content}
    </Tooltip>
  ) : (
    content
  );
}

export default function JobApplicationCard({
  jobApplication,
  onEdit,
  onDelete,
}) {
  const { t, i18n } = useTranslation();
  const { companyName, jobTitle, jobUrl, status, appliedDate, salaryRange } =
    jobApplication;
  const date = formatCalendarDate(appliedDate, i18n.resolvedLanguage);
  const metaIcon = { fontSize: 16 };

  return (
    <Card
      component="article"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        p: 2.25,
        pb: 1.5,
        transition: theme =>
          theme.transitions.create(['transform', 'box-shadow', 'border-color']),
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.10)',
          transform: 'translateY(-2px)',
        },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '&:hover': { transform: 'none' },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Typography
          component="h2"
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: '1.0625rem',
            fontWeight: 650,
            letterSpacing: '-0.01em',
            overflowWrap: 'anywhere',
          }}
        >
          {jobUrl ? (
            <Link
              href={jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              color="inherit"
              aria-label={t('jobApplicationList.card.openPosting', {
                company: companyName,
              })}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}
            >
              {companyName}
              <OpenInNewIcon
                aria-hidden
                sx={{ fontSize: 15, color: 'text.secondary' }}
              />
            </Link>
          ) : (
            companyName
          )}
        </Typography>
        <StatusBadge status={status} />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: -0.75 }}>
        {jobTitle}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: 2,
          rowGap: 0.5,
          fontSize: '0.8125rem',
          color: 'text.secondary',
        }}
      >
        <Meta
          icon={<CalendarTodayOutlinedIcon sx={metaIcon} />}
          title={date?.relative}
        >
          {t('jobApplicationList.card.applied', {
            date: date?.absolute ?? appliedDate,
          })}
        </Meta>
        {salaryRange && (
          <Meta icon={<PaymentsOutlinedIcon sx={metaIcon} />}>
            {salaryRange}
          </Meta>
        )}
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          lineHeight: 1.55,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          overflow: 'hidden',
        }}
      >
        {jobApplication.description}
      </Typography>

      <Box
        sx={{
          mt: 'auto',
          pt: 1,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 0.5,
        }}
      >
        <Tooltip title={t('jobApplicationList.card.edit')}>
          <IconButton
            size="small"
            aria-label={t('jobApplicationList.card.editLabel', {
              company: companyName,
            })}
            onClick={onEdit}
            sx={{ borderRadius: 2, color: 'text.secondary' }}
          >
            <EditOutlinedIcon fontSize="small" data-testid="edit-icon" />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('jobApplicationList.card.delete')}>
          <IconButton
            size="small"
            aria-label={t('jobApplicationList.card.deleteLabel', {
              company: companyName,
            })}
            onClick={onDelete}
            sx={{
              borderRadius: 2,
              color: 'text.secondary',
              '&:hover': { color: 'error.main' },
            }}
          >
            <DeleteOutlinedIcon fontSize="small" data-testid="delete-icon" />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
}
