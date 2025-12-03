'use client';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function BackButton() {
    const router = useRouter();

    return (
        <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/')}
            sx={{ mb: 4 }}
            variant="contained"
            color="primary"
        >
            Назад к категориям
        </Button>
    );
}
