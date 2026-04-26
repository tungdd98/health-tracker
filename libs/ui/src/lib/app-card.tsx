import { Card, type CardProps } from '@mui/material';

export function AppCard(props: CardProps) {
  return <Card elevation={0} {...props} />;
}
