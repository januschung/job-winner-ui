import React from 'react';
import { useQuery } from '@apollo/client';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { GET_ALL_INTERVIEWS, GET_ALL_OFFERS } from '../graphql/query';
import { getFilteredInterviews } from '../utils/interviewUtil';

// Soft background for a palette color, e.g. tint('primary') in either scheme.
const tint = color => theme =>
  `rgba(${theme.vars.palette[color].mainChannel} / 0.12)`;

// Resolves an sx palette path ('status.active.main') to its CSS variable, for
// properties sx does not map to the palette, such as boxShadow.
const paletteVar = (theme, path) =>
  path.split('.').reduce((node, key) => node?.[key], theme.vars.palette);

function StatCard({ icon, value, label, color, bgcolor, selected, onClick }) {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 1.5, sm: 2 },
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 44,
          height: 44,
          flexShrink: 0,
          borderRadius: 2.5,
          display: 'grid',
          placeItems: 'center',
          color,
          bgcolor,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          component="div"
          sx={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.1 }}
        >
          {value}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.3 }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Card
      sx={{
        height: '100%',
        borderColor: selected ? color : 'divider',
        boxShadow: selected
          ? theme => `0 0 0 1px ${paletteVar(theme, color)}`
          : undefined,
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {onClick ? (
        <CardActionArea
          onClick={onClick}
          aria-pressed={selected}
          sx={{ height: '100%' }}
        >
          {content}
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
}

export default function StatsSummary({
  applications = [],
  selectedStatus,
  onSelectStatus,
}) {
  const { t } = useTranslation();
  const interviews = useQuery(GET_ALL_INTERVIEWS);
  const offers = useQuery(GET_ALL_OFFERS);

  const countOrDash = (result, count) =>
    result.loading || result.error ? '–' : count;

  const stats = [
    {
      key: 'applications',
      icon: <WorkOutlinedIcon />,
      value: applications.length,
      color: 'status.all.main',
      bgcolor: 'status.all.soft',
      filter: 'all',
    },
    {
      key: 'inProgress',
      icon: <TrendingUpIcon />,
      value: applications.filter(app => app.status === 'active').length,
      color: 'status.active.main',
      bgcolor: 'status.active.soft',
      filter: 'active',
    },
    {
      key: 'upcomingInterviews',
      icon: <EventAvailableOutlinedIcon />,
      value: countOrDash(
        interviews,
        getFilteredInterviews(interviews.data?.allInterview).length
      ),
      color: 'primary.main',
      bgcolor: tint('primary'),
    },
    {
      key: 'offers',
      icon: <EmojiEventsOutlinedIcon />,
      value: countOrDash(offers, offers.data?.allOffer?.length || 0),
      color: 'secondary.main',
      bgcolor: tint('secondary'),
    },
  ];

  return (
    <Grid
      container
      spacing={2}
      component="section"
      aria-label={t('stats.label')}
      sx={{ mb: 3 }}
    >
      {stats.map(({ key, filter, ...stat }) => (
        <Grid key={key} size={{ xs: 6, md: 3 }}>
          <StatCard
            {...stat}
            label={t(`stats.${key}`)}
            selected={filter !== undefined && selectedStatus === filter}
            onClick={
              filter !== undefined ? () => onSelectStatus(filter) : undefined
            }
          />
        </Grid>
      ))}
    </Grid>
  );
}
