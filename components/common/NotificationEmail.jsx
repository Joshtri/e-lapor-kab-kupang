import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import logoApp from '@/public/fixed-logo-app.png';

import Proptypes from 'prop-types';

export default function NotificationEmail({
  previewText = 'Anda menerima notifikasi baru dari Sistem Lapor Kaka Bupati',
  greeting = 'Yth. Warga yang Terhormat,',
  intro = '',
  details = [],
  ctaLabel = '',
  ctaLink = '',
  closing = 'Hormat kami,\nTim Sistem Lapor Kaka Bupati\nPemerintah Daerah',
}) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header Section */}
          <Section style={header}>
            <div style={logoContainer}>
              <div style={logoPlaceholder}>🏛️</div>
              <div>
                <Text style={brandTitle}>Lapor Kaka Bupati</Text>
                <Text style={brandSubtitle}>Pemerintah Daerah</Text>
              </div>
            </div>
          </Section>

          <Hr style={divider} />

          {/* Notification Badge */}
          <Section style={notificationBadge}>
            <div style={badgeContainer}>
              <span style={badgeIcon}>📬</span>
              <span style={badgeText}>Notifikasi Baru</span>
            </div>
          </Section>

          {/* Main Content */}
          <Section style={contentSection}>
            <Text style={greetingText}>{greeting}</Text>

            {intro && (
              <div style={introContainer}>
                <Text style={introText}>{intro}</Text>
              </div>
            )}

            {/* Details Section */}
            {details.length > 0 && (
              <div style={detailsContainer}>
                <Text style={detailsTitle}>Detail Informasi:</Text>
                <div style={detailsBox}>
                  {details.map((item, idx) => (
                    <div key={idx} style={detailItem}>
                      <span style={detailLabel}>{item.label}</span>
                      <span style={detailValue}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            {ctaLink && (
              <Section style={ctaSection}>
                <Button href={ctaLink} style={ctaButton}>
                  <span style={ctaButtonText}>
                    {ctaLabel || 'Lihat Detail Lengkap'}
                  </span>
                </Button>
                <Text style={ctaHelper}>
                  Klik tombol di atas untuk melihat informasi lengkap
                </Text>
              </Section>
            )}
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={closingText}>{closing}</Text>
            <div style={footerInfo}>
              <Text style={footerText}>
                Email ini dikirim secara otomatis oleh sistem. Mohon tidak
                membalas email ini.
              </Text>
              <Text style={footerText}>
                Jika Anda memiliki pertanyaan, silakan hubungi layanan pelanggan
                kami.
              </Text>
            </div>
          </Section>
        </Container>

        {/* Bottom Footer */}
        <Section style={bottomFooter}>
          <Text style={copyrightText}>
            © 2024 Sistem Lapor Kaka Bupati. Semua hak dilindungi.
          </Text>
        </Section>
      </Body>
    </Html>
  );
}

// Enhanced Styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '40px 20px',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  overflow: 'hidden',
};

const header = {
  backgroundColor: '#1e40af',
  padding: '24px',
  textAlign: 'left',
};

const logoContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const logoPlaceholder = {
  fontSize: '32px',
  width: '48px',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
};

const brandTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0',
  lineHeight: '1.2',
};

const brandSubtitle = {
  fontSize: '14px',
  color: '#bfdbfe',
  margin: '4px 0 0 0',
  lineHeight: '1.2',
};

const divider = {
  border: 'none',
  borderTop: '1px solid #e2e8f0',
  margin: '0',
};

const notificationBadge = {
  padding: '20px 24px 0',
  textAlign: 'center',
};

const badgeContainer = {
  display: 'inline-flex',
  alignItems: 'center',
  backgroundColor: '#dbeafe',
  border: '1px solid #93c5fd',
  borderRadius: '20px',
  padding: '8px 16px',
  gap: '8px',
};

const badgeIcon = {
  fontSize: '16px',
};

const badgeText = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#1e40af',
  margin: '0',
};

const contentSection = {
  padding: '24px',
};

const greetingText = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1f2937',
  marginBottom: '16px',
  lineHeight: '1.5',
};

const introContainer = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '24px',
};

const introText = {
  fontSize: '15px',
  color: '#374151',
  lineHeight: '1.6',
  margin: '0',
};

const detailsContainer = {
  marginBottom: '32px',
};

const detailsTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1f2937',
  marginBottom: '12px',
};

const detailsBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '16px',
};

const detailItem = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: '1px solid #e5e7eb',
};

const detailLabel = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#6b7280',
  flex: '1',
};

const detailValue = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#1f2937',
  textAlign: 'right',
  flex: '1',
};

const ctaSection = {
  textAlign: 'center',
  marginBottom: '24px',
};

const ctaButton = {
  backgroundColor: '#dc2626',
  color: '#ffffff',
  padding: '14px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  border: 'none',
  boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)',
  transition: 'all 0.2s ease',
};

const ctaButtonText = {
  color: '#ffffff',
  textDecoration: 'none',
};

const ctaHelper = {
  fontSize: '12px',
  color: '#6b7280',
  marginTop: '8px',
  fontStyle: 'italic',
};

const footer = {
  padding: '24px',
  backgroundColor: '#f9fafb',
};

const closingText = {
  fontSize: '15px',
  color: '#374151',
  fontWeight: '500',
  marginBottom: '16px',
  lineHeight: '1.6',
  whiteSpace: 'pre-line',
};

const footerInfo = {
  borderTop: '1px solid #e5e7eb',
  paddingTop: '16px',
};

const footerText = {
  fontSize: '12px',
  color: '#6b7280',
  lineHeight: '1.5',
  margin: '4px 0',
};

const bottomFooter = {
  textAlign: 'center',
  padding: '16px',
};

const copyrightText = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '0',
};

NotificationEmail.propTypes = {
  previewText: Proptypes.string,
  greeting: Proptypes.string,
  intro: Proptypes.string,
  details: Proptypes.arrayOf(
    Proptypes.shape({
      label: Proptypes.string.isRequired,
      value: Proptypes.string.isRequired,
    }),
  ),
  ctaLabel: Proptypes.string,
  ctaLink: Proptypes.string,
  closing: Proptypes.string,
};
