'use client'

import { useEffect, useState } from 'react'
import {
    Box,
    Paper,
    Typography,
    Button,
    IconButton,
    Stack,
    Slide,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import { useCompareStore } from '@/store/compare'
import { useRouter } from 'next/navigation'

export default function ComparePanel() {
    const router = useRouter()
    const { compareItems, removeFromCompare } = useCompareStore()
    const [show, setShow] = useState(false)

    // Показываем панель только когда есть товары для сравнения
    useEffect(() => {
        setShow(compareItems.length > 0)
    }, [compareItems])

    if (!show) return null

    return (
        <Slide direction="up" in={show} mountOnEnter unmountOnExit>
            <Paper
                elevation={3}
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
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <CompareArrowsIcon color="primary" />
                        <Typography>
                            Выбрано для сравнения: {compareItems.length}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button
                            variant="contained"
                            onClick={() => router.push('/compare')}
                            disabled={compareItems.length < 2}
                        >
                            Сравнить
                        </Button>
                        <IconButton
                            size="small"
                            onClick={() => setShow(false)}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </Stack>
            </Paper>
        </Slide>
    )
}
