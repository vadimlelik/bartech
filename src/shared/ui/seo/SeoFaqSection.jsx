'use client';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Paper,
  Typography,
} from '@mui/material';
import { ExpandMore, QuestionAnswerOutlined } from '@mui/icons-material';

/**
 * FAQ for humans (accordion) + crawlers (full text in AccordionDetails).
 */
export default function SeoFaqSection({
  title = 'Частые вопросы',
  items = [],
  defaultExpandedIndex = 0,
}) {
  if (!items.length) return null;

  return (
    <Paper
      component="section"
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: { xs: 2, md: 2.5 },
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
      >
        <QuestionAnswerOutlined color="primary" fontSize="small" />
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontSize: { xs: '1.15rem', md: '1.35rem' }, fontWeight: 700, m: 0 }}
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ px: { xs: 1, md: 1.5 }, py: 1 }}>
        {items.map((item, index) => (
          <Accordion
            key={item.q}
            defaultExpanded={index === defaultExpandedIndex}
            disableGutters
            elevation={0}
            sx={{
              '&:before': { display: 'none' },
              bgcolor: 'transparent',
              '&:not(:last-child)': { borderBottom: '1px solid', borderColor: 'divider' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                px: { xs: 1, md: 1.5 },
                '& .MuiAccordionSummary-content': { my: 1.25 },
              }}
            >
              <Typography
                component="h3"
                variant="subtitle1"
                sx={{ fontWeight: 600, fontSize: '0.98rem', lineHeight: 1.4 }}
              >
                {item.q}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: { xs: 1, md: 1.5 }, pt: 0, pb: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.75, fontSize: '0.9375rem' }}
              >
                {item.a}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Paper>
  );
}
