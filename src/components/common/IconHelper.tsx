import React from 'react';
import {
  MailWarning,
  Smartphone,
  Lock,
  UserX,
  KeyRound,
  Users,
  WifiOff,
  Bug,
  ShoppingBag,
  AlertTriangle,
  Key,
  ShieldCheck,
  RefreshCw,
  Eye,
  Globe,
  Database,
  Wifi,
  Fingerprint,
  Sliders,
  Share2,
  CreditCard,
  ShieldAlert,
  Fish,
  AlertOctagon,
  Shield
} from 'lucide-react';

interface IconHelperProps {
  name: string;
  className?: string;
}

export const IconHelper: React.FC<IconHelperProps> = ({ name, className = 'w-5 h-5' }) => {
  const iconMap: Record<string, React.ReactNode> = {
    MailWarning: <MailWarning className={className} />,
    Smartphone: <Smartphone className={className} />,
    Lock: <Lock className={className} />,
    UserX: <UserX className={className} />,
    KeyRound: <KeyRound className={className} />,
    Users: <Users className={className} />,
    WifiOff: <WifiOff className={className} />,
    Bug: <Bug className={className} />,
    ShoppingBag: <ShoppingBag className={className} />,
    AlertTriangle: <AlertTriangle className={className} />,
    Key: <Key className={className} />,
    ShieldCheck: <ShieldCheck className={className} />,
    RefreshCw: <RefreshCw className={className} />,
    Eye: <Eye className={className} />,
    Globe: <Globe className={className} />,
    Database: <Database className={className} />,
    Wifi: <Wifi className={className} />,
    Fingerprint: <Fingerprint className={className} />,
    Sliders: <Sliders className={className} />,
    Share2: <Share2 className={className} />,
    CreditCard: <CreditCard className={className} />,
    ShieldAlert: <ShieldAlert className={className} />,
    Fish: <Fish className={className} />,
    AlertOctagon: <AlertOctagon className={className} />
  };

  return iconMap[name] || <Shield className={className} />;
};
