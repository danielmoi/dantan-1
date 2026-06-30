import {
  Body,
  Button,
  Container,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

type Props = {
  inviteUrl: string;
};

export function InvitationEmail({ inviteUrl }: Props) {
  return (
    <Html>
      <Preview>You've been invited to join the app</Preview>
      <Body style={{ backgroundColor: '#f9f9f9', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '480px', margin: '40px auto', backgroundColor: '#ffffff', borderRadius: '8px', padding: '40px' }}>
          <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
            You've been invited
          </Text>
          <Text style={{ color: '#555', marginBottom: '32px' }}>
            Click the button below to accept your invitation. This link expires in 7 days.
          </Text>
          <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Button
              href={inviteUrl}
              style={{ backgroundColor: '#000', color: '#fff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}
            >
              Accept invitation
            </Button>
          </Section>
          <Text style={{ fontSize: '12px', color: '#999' }}>
            Or copy this link: {inviteUrl}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
