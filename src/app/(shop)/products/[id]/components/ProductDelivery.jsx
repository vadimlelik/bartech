'use client';

import { Box, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import ScheduleIcon from '@mui/icons-material/Schedule';

/**
 * Компонент информации о доставке
 */
export default function ProductDelivery() {
  return (
    <Box>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <LocalShippingIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Бесплатная доставка"
            secondary="При заказе от 1000 рублей"
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <PaymentIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Оплата при получении"
            secondary="Наличными или картой"
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <ScheduleIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Срок доставки" secondary="1-3 рабочих дня" />
        </ListItem>
      </List>
    </Box>
  );
}
