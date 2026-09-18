import { LegalPage, type LegalSection } from '@/components/legal/LegalPage';

const SECTIONS: LegalSection[] = [
  {
    heading: 'Agreement to Terms',
    body: [
      'These Terms of Service ("Terms") govern your access to and use of the DecentraID platform, including the website, APIs, smart contracts, and related services (collectively, the "Service"). By creating an account, connecting a wallet, or using the Service, you agree to be bound by these Terms and our Privacy Policy.',
      'If you use the Service on behalf of an organization, you represent that you have authority to bind that organization, and "you" refers to that organization. If you do not agree to these Terms, do not use the Service.',
    ],
  },
  {
    heading: 'Eligibility',
    body: [
      'You must be at least 16 years old and able to form a binding contract to use the Service. Use of the Service may be restricted in certain jurisdictions due to sanctions or local law, and you are responsible for complying with the laws of your jurisdiction.',
    ],
  },
  {
    heading: 'The Service',
    body: [
      'DecentraID provides self-sovereign identity (DID) management, on-chain access control through smart contracts, and NFT-based digital asset custody on public blockchain networks, enhanced by AI-driven anomaly detection.',
    ],
    list: [
      'Identity: create and manage W3C-compliant decentralized identifiers anchored to your wallet.',
      'Access control: define role-based and attribute-based access policies enforced by immutable smart contracts.',
      'Assets: mint, hold, and transfer tokenized digital assets that represent verifiable ownership records.',
      'Monitoring: behavioral anomaly detection that flags suspicious activity on your account and policies.',
    ],
  },
  {
    heading: 'Accounts, Wallets, and Security',
    body: [
      'You access the Service through a self-custodial wallet. Your private keys are generated and stored on your device and are never transmitted to us. You are solely responsible for safeguarding your keys, seed phrases, and wallet credentials.',
      'If you lose access to your keys, we cannot recover your account, DIDs, or assets. You must promptly notify us at security@decentraid.id of any suspected unauthorized use of your wallet or account. You are responsible for all activity that occurs through your wallet or account.',
    ],
  },
  {
    heading: 'Acceptable Use',
    body: [
      'You agree not to misuse the Service. Without limitation, you will not:',
    ],
    list: [
      'Violate any applicable law, regulation, or third-party right, including intellectual property and privacy rights.',
      'Create DIDs, policies, or assets for unlawful purposes, fraud, money laundering, sanctions evasion, or terrorist financing.',
      'Attempt to gain unauthorized access to the Service, other accounts, or related systems, including through probing, scanning, or credential attacks.',
      'Interfere with the integrity of the blockchain networks, our smart contracts, or our anomaly detection systems, including by submitting deceptive telemetry.',
      'Circumvent rate limits, licensing restrictions, or access controls, or scrape the Service in a way that degrades performance for others.',
      'Upload malicious code or use the Service to distribute malware.',
    ],
  },
  {
    heading: 'Blockchain Transactions Are Irreversible',
    body: [
      'Transactions you initiate through the Service, such as DID anchoring, policy updates, and asset transfers, are broadcast to public blockchain networks. Once confirmed, these transactions are permanent and cannot be reversed, cancelled, or edited by us or by anyone else.',
      'You are responsible for verifying transaction details, including recipient addresses, network selection, and gas parameters, before signing. We cannot recover assets sent to the wrong address or restore state after an on-chain action.',
    ],
  },
  {
    heading: 'Fees and Payments',
    body: [
      'Network fees ("gas") for blockchain transactions are set by the network and paid by you. Any paid tiers of the Service will be described at the point of purchase, including price, billing period, and renewal terms.',
      'Unless stated otherwise, fees are non-refundable. We may change pricing with prospective notice, and continued use after a change constitutes acceptance of the new fees.',
    ],
  },
  {
    heading: 'Intellectual Property',
    body: [
      'The Service, including its software, design, documentation, and branding, is owned by DecentraID or its licensors and is protected by intellectual property laws. We grant you a limited, revocable, non-exclusive, non-transferable license to use the Service in accordance with these Terms.',
      'You retain ownership of the content and data you create, including your DIDs, policies, and assets. You grant us the limited right needed to host, transmit, and process that content solely to operate the Service.',
    ],
  },
  {
    heading: 'Third-Party Services',
    body: [
      'The Service relies on third-party infrastructure such as blockchain networks, wallet providers, and node services, and may link to third-party sites. Those services are governed by their own terms, and we are not responsible for their availability, security, or actions.',
      'Your use of a third-party wallet is subject to that provider’s terms, and disputes with such providers are between you and them.',
    ],
  },
  {
    heading: 'Termination and Suspension',
    body: [
      'You may stop using the Service and delete your account at any time. We may suspend or terminate your access if you materially breach these Terms, fail to pay amounts due, create legal risk for us or other users, or as required by law.',
      'Where feasible, we will give you notice and a chance to remediate. Sections that by their nature should survive termination, including ownership, disclaimers, liability limits, and dispute terms, survive.',
    ],
  },
  {
    heading: 'Disclaimers',
    body: [
      'The Service is provided "as is" and "as available" without warranties of any kind, whether express, implied, or statutory, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.',
      'We do not warrant that the Service will be uninterrupted, error-free, or secure against all attacks, that blockchain networks will operate as expected, or that anomaly detection will identify every threat. Use of experimental blockchain technology carries inherent risk, which you accept.',
    ],
  },
  {
    heading: 'Limitation of Liability',
    body: [
      'To the maximum extent permitted by law, DecentraID and its team members, suppliers, and licensors will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, revenues, data, or goodwill, arising from or related to your use of the Service.',
      'Our total aggregate liability for all claims will not exceed the greater of the amount you paid us in the 12 months before the claim or USD 100. Nothing in these Terms excludes liability that cannot be excluded under applicable law, such as liability for gross negligence, willful misconduct, or death or personal injury caused by negligence.',
    ],
  },
  {
    heading: 'Indemnification',
    body: [
      'You agree to indemnify and hold harmless DecentraID from claims, damages, liabilities, and reasonable costs (including legal fees) arising from your misuse of the Service, your violation of these Terms or applicable law, or content you write on-chain through the Service.',
    ],
  },
  {
    heading: 'Governing Law and Disputes',
    body: [
      'These Terms are governed by the laws of the State of Delaware, USA, without regard to conflict of laws principles. Except where prohibited, disputes will be resolved exclusively in the state or federal courts located in Delaware, and you consent to their jurisdiction.',
      'Before filing suit, the parties will attempt in good faith to resolve the dispute through informal negotiation for 30 days after written notice. Where local law grants you the right to bring claims in your local courts, that right is unaffected.',
    ],
  },
  {
    heading: 'Changes to These Terms',
    body: [
      'We may update these Terms as the Service evolves. Material changes will be announced in the platform and, where required, by email at least 14 days before they take effect. Your continued use of the Service after the effective date constitutes acceptance of the updated Terms.',
      'If you do not agree to updated Terms, you must stop using the Service before they take effect.',
    ],
  },
  {
    heading: 'Contact',
    body: [
      'Questions about these Terms can be sent to legal@decentraid.id.',
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      updated="September 18, 2026"
      intro="These terms set the ground rules for using DecentraID. They are written to be read, covering your rights, your responsibilities, and the realities of blockchain technology."
      sections={SECTIONS}
    />
  );
}
