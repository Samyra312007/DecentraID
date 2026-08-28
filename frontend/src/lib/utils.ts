export function truncateAddress(address: string, chars: number = 6): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function truncateDID(did: string, chars: number = 20): string {
  if (!did) return '';
  if (did.length <= chars) return did;
  return `${did.slice(0, chars)}...`;
}

export function formatTimestamp(ts: number): string {
  if (!ts) return 'N/A';
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'text-semantic-up';
    case 'revoked':
    case 'deactivated':
    case 'expired':
      return 'text-semantic-down';
    case 'suspended':
    case 'transferred':
      return 'text-accent-yellow';
    default:
      return 'text-body';
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'text-semantic-down';
    case 'high':
      return 'text-orange-500';
    case 'medium':
      return 'text-accent-yellow';
    case 'low':
      return 'text-primary';
    default:
      return 'text-semantic-up';
  }
}

export function getRiskScoreColor(score: number): string {
  if (score >= 80) return '#cf202f';
  if (score >= 60) return '#f97316';
  if (score >= 40) return '#f4b000';
  if (score >= 20) return '#0052ff';
  return '#05b169';
}

export function getRiskScoreLabel(score: number): string {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Medium';
  if (score >= 20) return 'Low';
  return 'Normal';
}

export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
