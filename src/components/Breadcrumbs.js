import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material'
import NextLink from 'next/link'

export default function Breadcrumbs({ items }) {
    return (
        <MuiBreadcrumbs 
            aria-label="breadcrumb"
            sx={{ 
                mb: 3,
                '& .MuiBreadcrumbs-ol': {
                    flexWrap: 'nowrap'
                },
                '& .MuiBreadcrumbs-li': {
                    minWidth: 0,
                    '& > *': {
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }
                }
            }}
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1

                if (isLast) {
                    return (
                        <Typography 
                            key={item.label}
                            color="text.primary"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {item.label}
                        </Typography>
                    )
                }

                return (
                    <Link
                        key={item.label}
                        component={NextLink}
                        href={item.href}
                        underline="hover"
                        color="inherit"
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {item.label}
                    </Link>
                )
            })}
        </MuiBreadcrumbs>
    )
}
