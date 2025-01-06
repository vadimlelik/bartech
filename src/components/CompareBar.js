'use client';

import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Stack, Slide } from '@mui/material';
import Link from 'next/link';
import { useCompareStore } from '@/store/compare';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

export default function CompareBar() {
  const { compareItems, removeFromCompare } = useCompareStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(compareItems.length >= 2);
  }, [compareItems]);

  if (!show) return null;

  return (
    <Slide direction="up" in={show}>
      <Paper
        elevation={4}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          p: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Box
          sx={{
            maxWidth: 'lg',
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <CompareArrowsIcon color="primary" />
            <Typography variant="subtitle1">
              {compareItems.length} товара для сравнения
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              component={Link}
              href="/compare"
              variant="contained"
              startIcon={<CompareArrowsIcon />}
            >
              Сравнить
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Slide>
  );
}
