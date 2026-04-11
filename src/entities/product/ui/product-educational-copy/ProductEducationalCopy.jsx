'use client';

import { Paper, Typography, Box } from '@mui/material';
import { getProductEducationalCopy } from '@/shared/config/product-card-educational-copy';

export default function ProductEducationalCopy({ product }) {
  const copy = getProductEducationalCopy(product);

  return (
    <Paper
      variant="outlined"
      component="section"
      aria-labelledby="product-educational-heading"
      sx={{
        p: 3,
        mb: 3,
        bgcolor: 'grey.50',
        borderColor: 'divider',
      }}
    >
      <Typography
        id="product-educational-heading"
        variant="h6"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        {copy.sectionTitle}
      </Typography>
      <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2, fontWeight: 500 }}>
        {copy.modelLine}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {copy.audienceLabel}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {copy.audience}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {copy.specsLabel}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {copy.specs}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {copy.trustLabel}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {copy.trust}
        </Typography>
      </Box>
    </Paper>
  );
}
