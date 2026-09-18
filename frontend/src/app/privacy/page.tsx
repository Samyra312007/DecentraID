import { LegalPage, type LegalSection } from '@/components/legal/LegalPage';

const SECTIONS: LegalSection[] = [
  {
    heading: 'Overview',
    body: [
      'DecentraID ("we", "us", or "our") provides a decentralized identity, access control, and digital asset platform built on public blockchain infrastructure. This Privacy Policy explains what information we collect when you use the platform at decentraid.id and its subdomains, why we collect it, and the choices you have.',
      'Because DecentraID is built on self-sovereign identity principles, our architecture is designed to minimize the personal data we hold. Your cryptographic keys are generated and stored on your device or wallet, never on our servers. Most records that identify you exist as pseudonymous on-chain identifiers (DIDs) rather than in our databases.',
    ],
  },
  {
    heading: 'Information We Collect',
    body: [
      'We collect the minimum information required to operate the platform, verify your identity where necessary, and keep the service secure. The categories below describe everything we may process.',
    ],
    list: [
      'Account information: display name and email address you provide during sign up, used for account management, recovery links, and security alerts.',
      'Wallet address: the public address of the wallet you connect, used as your on-chain identifier and to associate DIDs, access policies, and assets with your account.',
      'On-chain data: DID documents, access control policies, and asset ownership records written to the blockchain. This data is public by nature and cannot be deleted once written.',
      'Platform usage data: log data such as IP address, browser type, pages viewed, and timestamps, collected to operate, secure, and troubleshoot the service.',
      'Anomaly detection signals: behavioral and security telemetry (session patterns, request metadata) processed by our AI monitoring to detect suspicious activity.',
      'Support communications: messages you send to our support or sales channels and any information you choose to include.',
    ],
  },
  {
    heading: 'How We Use Information',
    body: [
      'We process the information described above only for legitimate, disclosed purposes.',
    ],
    list: [
      'Provide, operate, maintain, and improve the DecentraID platform.',
      'Create and manage your account and associate your wallet with your DIDs and assets.',
      'Send service communications: transactional email such as recovery links, security alerts, and policy notices.',
      'Monitor for fraud, abuse, and anomalous behavior, and enforce our Terms of Service.',
      'Comply with legal obligations, respond to lawful requests, and protect the rights, property, and safety of our users and the public.',
      'Aggregate and anonymize data to understand usage trends and improve product design. We do not use your personal data for third-party advertising, and we do not sell it.',
    ],
  },
  {
    heading: 'On-Chain Data Is Public and Persistent',
    body: [
      'DecentraID uses public blockchain networks such as Polygon. Any transaction or record you write to the chain, including DID creation, policy updates, and asset transfers, is broadcast to a public network and is permanently visible to anyone.',
      'On-chain records cannot be deleted or edited by us or by you. Before anchoring a DID or writing a policy, consider carefully what metadata you include. Do not put personal information into on-chain data that you would not want to be permanently public.',
    ],
  },
  {
    heading: 'Cookies and Similar Technologies',
    body: [
      'We use a small set of cookies and equivalent browser storage to keep you signed in, remember your preferences, and understand aggregate usage of the platform.',
    ],
    list: [
      'Essential cookies: required for core functionality such as session management and security. The platform cannot operate without them.',
      'Preference storage: remembers choices such as network selection and UI state on your device.',
      'Analytics: privacy-respecting, aggregated measurement of page and feature usage. We do not use advertising or cross-site tracking cookies.',
    ],
  },
  {
    heading: 'How We Share Information',
    body: [
      'We do not sell your personal information. We share it only in the limited circumstances below.',
    ],
    list: [
      'Infrastructure providers: hosting, email delivery, and blockchain node providers that process data on our behalf under contractual confidentiality and security obligations.',
      'Analytics and security vendors: processors that help us measure usage and detect abuse, bound by data processing agreements.',
      'Legal requirements: when required by law, regulation, or valid legal process, or to protect the rights, property, or safety of DecentraID, our users, or others.',
      'Corporate events: in connection with a merger, acquisition, or asset sale, with notice to you and subject to this policy.',
      'Public blockchains: data you intentionally write on-chain is published to the network and is outside our control.',
    ],
  },
  {
    heading: 'Data Retention',
    body: [
      'We keep personal data only as long as necessary for the purposes described in this policy, unless a longer period is required by law.',
      'Account information is retained while your account is active. If you delete your account, we remove or anonymize your personal data within 90 days, except where we must retain records for legal, accounting, or security reasons. On-chain records are permanent and cannot be removed. Aggregated, de-identified analytics may be retained indefinitely.',
    ],
  },
  {
    heading: 'Your Rights and Choices',
    body: [
      'Depending on your jurisdiction, including the EU/EEA, the United Kingdom, and various U.S. states, you may have some or all of the following rights regarding your personal data.',
    ],
    list: [
      'Access: request a copy of the personal data we hold about you.',
      'Rectification: correct inaccurate account information from your account settings or by contacting us.',
      'Erasure: request deletion of your personal data, subject to legal retention duties and the permanent nature of on-chain records.',
      'Portability: receive your data in a structured, commonly used, machine-readable format.',
      'Objection and restriction: object to or restrict certain processing, including any processing based on legitimate interests.',
      'Withdrawal of consent: withdraw consent for optional processing at any time without affecting prior lawful processing.',
      'Non-discrimination: we will not degrade your service for exercising these rights.',
    ],
  },
  {
    heading: 'Security',
    body: [
      'We apply industry standard technical and organizational measures, including encryption in transit and at rest, strict access controls, audited smart contracts, and continuous AI-based anomaly monitoring.',
      'No method of transmission or storage is completely secure. If you believe your account or wallet has been compromised, contact us immediately at security@decentraid.id. Responsible security reports are welcomed under the guidelines in our public security documentation.',
    ],
  },
  {
    heading: 'Children’s Privacy',
    body: [
      'DecentraID is not directed to children under 16, and we do not knowingly collect personal data from them. If you believe a child has provided us personal data, contact us and we will delete it promptly.',
    ],
  },
  {
    heading: 'International Data Transfers',
    body: [
      'We operate globally and may process data in countries other than your own, including the United States. Where we transfer personal data out of the EU/EEA or the UK, we rely on recognized safeguards such as the European Commission’s Standard Contractual Clauses, together with supplementary technical measures.',
    ],
  },
  {
    heading: 'Changes to This Policy',
    body: [
      'We may update this Privacy Policy as the platform or applicable law evolves. Material changes will be announced in the platform and, where required, by email at least 14 days before they take effect.',
      'The "Last updated" date at the top of this page reflects the current version. Continued use of the platform after an update constitutes acceptance of the revised policy.',
    ],
  },
  {
    heading: 'Contact Us',
    body: [
      'Questions, requests, or concerns about privacy can be sent to privacy@decentraid.id. For security reports, use security@decentraid.id.',
      'You also have the right to lodge a complaint with your local data protection authority if you believe our processing violates applicable law.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="September 18, 2026"
      intro="Your identity is yours. This policy explains, in plain language, what data DecentraID collects, why we collect it, and the control you keep over it."
      sections={SECTIONS}
    />
  );
}
