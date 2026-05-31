'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import { HelpOutline, ExpandMore, ExpandLess } from '@mui/icons-material';

/**
 * GEO citability block — full answer stays in DOM for crawlers; visually collapsed by default.
 */
export default function SeoCitabilityPanel({
  question,
  answer,
  defaultExpanded = false,
  label = 'Полезно знать',
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Paper
      component="section"
      elevation={0}
      sx={{
        overflow: 'hidden',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main}0d 0%, ${theme.palette.background.paper} 55%)`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 1.5, md: 2 },
          p: { xs: 2, md: 2.5 },
          alignItems: 'flex-start',
        }}
      >
        <Box
          aria-hidden
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: 1,
          }}
        >
          <HelpOutline />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="overline"
            color="primary.main"
            sx={{ fontWeight: 700, letterSpacing: 0.6, lineHeight: 1.2 }}
          >
            {label}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontSize: { xs: '1.05rem', md: '1.15rem' },
              fontWeight: 700,
              lineHeight: 1.35,
              mt: 0.5,
              mb: 1.5,
            }}
          >
            {question}
          </Typography>
          <Typography
            component="p"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.75,
              fontSize: '0.9375rem',
              m: 0,
              ...(!expanded && {
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }),
            }}
          >
            {answer}
          </Typography>
          <Button
            size="small"
            onClick={() => setExpanded((prev) => !prev)}
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            sx={{ mt: 1, px: 0, minWidth: 0, textTransform: 'none', fontWeight: 600 }}
          >
            {expanded ? 'Свернуть' : 'Читать полностью'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
