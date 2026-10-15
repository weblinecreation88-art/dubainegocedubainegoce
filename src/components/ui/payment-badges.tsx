'use client';

import React from 'react';

export function CbBadge({ className = 'h-6' }: { className?: string }) {
  return (
    <div
      role="img"
      className={`inline-flex items-center justify-center bg-white border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 shadow-sm hover:shadow transition-shadow ${className}`}
      title="Carte Bancaire (CB)"
      aria-label="Carte Bancaire"
    >
      <svg viewBox="0 0 38 24" className="h-4 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="38" height="24" rx="3" fill="#007953" />
        <path
          d="M12.5 17C8.9 17 6 14.8 6 12C6 9.2 8.9 7 12.5 7C14.6 7 16.4 8 17.5 9.5L15 11C14.4 10.1 13.5 9.5 12.5 9.5C10.5 9.5 8.8 10.6 8.8 12C8.8 13.4 10.5 14.5 12.5 14.5C13.5 14.5 14.4 13.9 15 13L17.5 14.5C16.4 16 14.6 17 12.5 17Z"
          fill="#00A562"
        />
        <path
          d="M19 7.5H24C26.8 7.5 28.5 8.9 28.5 10.6C28.5 11.7 27.7 12.6 26.5 12.9C28 13.3 28.9 14.3 28.9 15.6C28.9 17.5 27 18.8 24 18.8H19V7.5ZM21.7 9.8V11.9H23.8C25 11.9 25.8 11.4 25.8 10.8C25.8 10.2 25 9.8 23.8 9.8H21.7ZM21.7 14.2V16.5H24.1C25.4 16.5 26.1 16 26.1 15.3C26.1 14.7 25.4 14.2 24.1 14.2H21.7Z"
          fill="#004A97"
        />
      </svg>
    </div>
  );
}

export function VisaBadge({ className = 'h-6' }: { className?: string }) {
  return (
    <div
      role="img"
      className={`inline-flex items-center justify-center bg-white border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 shadow-sm hover:shadow transition-shadow ${className}`}
      title="Visa"
      aria-label="Visa"
    >
      <svg viewBox="0 0 44 20" className="h-3.5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M17.8 15.2H14.8L16.6 4H19.6L17.8 15.2ZM13.1 4L10.3 11.7L9.9 10C9.4 7.8 7.5 5.5 5.3 4.3L8 15.2H11.1L16 4H13.1ZM28.7 15.2H31.5L29.1 4H26.7C26.1 4 25.6 4.4 25.4 4.9L21.7 15.2H24.8L25.4 13.4H29.1L28.7 15.2ZM26.1 11.2L27.6 7L28.5 11.2H26.1ZM23.2 7.6C23.2 6 22 5.2 20 5.2C18.2 5.2 17.1 6 17.1 6L17.6 8.2C17.6 8.2 18.5 7.6 19.6 7.6C20.4 7.6 20.9 8 20.9 8.6C20.9 10.1 16.9 9.9 16.9 12.6C16.9 14.3 18.3 15.4 20.4 15.4C21.7 15.4 22.9 14.8 22.9 14.8L22.4 12.6C22.4 12.6 21.6 13 20.7 13C19.9 13 19.5 12.6 19.5 12.1C19.5 10.5 23.2 10.4 23.2 7.6Z"
          fill="#1434CB"
        />
        <path d="M5.3 4.3C3.6 4.3 1.9 5 0.7 5.8L0.3 6.4L3.4 15.2H6.5L5.3 4.3Z" fill="#F8B122" />
      </svg>
    </div>
  );
}

export function MastercardBadge({ className = 'h-6' }: { className?: string }) {
  return (
    <div
      role="img"
      className={`inline-flex items-center justify-center bg-white border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 shadow-sm hover:shadow transition-shadow ${className}`}
      title="Mastercard"
      aria-label="Mastercard"
    >
      <svg viewBox="0 0 38 24" className="h-4 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="12" r="8" fill="#EB001B" />
        <circle cx="24" cy="12" r="8" fill="#F79E1B" />
        <path
          d="M19 6.8C20.8 8.1 22 10 22 12C22 14 20.8 15.9 19 17.2C17.2 15.9 16 14 16 12C16 10 17.2 8.1 19 6.8Z"
          fill="#FF5F00"
        />
      </svg>
    </div>
  );
}

export function ApplePayBadge({ className = 'h-6' }: { className?: string }) {
  return (
    <div
      role="img"
      className={`inline-flex items-center justify-center bg-black text-white border border-black/80 rounded px-2 py-0.5 shadow-sm hover:shadow transition-shadow ${className}`}
      title="Apple Pay (iOS)"
      aria-label="Apple Pay"
    >
      <svg viewBox="0 0 52 22" className="h-3.5 w-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        {/* Apple icon */}
        <path d="M10.2 6.8C9.6 7.5 8.7 8 7.8 7.9C7.7 7 8.1 6.1 8.6 5.5C9.2 4.8 10.2 4.4 11 4.4C11.1 5.4 10.7 6.2 10.2 6.8ZM11 8.2C9.7 8.1 8.6 9 8 9C7.3 9 6.4 8.2 5.3 8.2C3.9 8.2 2.6 9 1.9 10.3C.5 12.8 1.5 16.5 2.9 18.4C3.6 19.3 4.3 20.4 5.4 20.3C6.4 20.3 6.8 19.7 8 19.7C9.2 19.7 9.5 20.3 10.6 20.3C11.7 20.3 12.4 19.3 13.1 18.3C13.9 17.2 14.2 16 14.2 15.9C14.1 15.8 12 15 12 12.7C12 10.7 13.6 9.8 13.7 9.7C12.8 8.4 11.4 8.2 11 8.2Z" />
        {/* Pay text */}
        <path d="M19.5 6.2H23.5C25.9 6.2 27.5 7.6 27.5 9.8C27.5 12 25.9 13.4 23.5 13.4H21.5V17.5H19.5V6.2ZM21.5 11.8H23.4C24.7 11.8 25.5 11.1 25.5 9.8C25.5 8.5 24.7 7.8 23.4 7.8H21.5V11.8ZM30.7 17.5H28.9L32.1 7.8H34.1L37.3 17.5H35.4L34.7 15.1H31.4L30.7 17.5ZM31.9 13.5H34.2L33.1 9.8L31.9 13.5ZM43 12.8L40.7 7.8H42.6L44 11.3L45.4 7.8H47.2L44.1 15.1C43.5 16.5 42.6 17.2 41.2 17.2C40.8 17.2 40.3 17.1 40 17V15.5C40.3 15.6 40.7 15.7 41 15.7C41.9 15.7 42.5 15.1 43 13.8L43 12.8Z" />
      </svg>
    </div>
  );
}

export function GooglePayBadge({ className = 'h-6' }: { className?: string }) {
  return (
    <div
      role="img"
      className={`inline-flex items-center justify-center bg-white border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 shadow-sm hover:shadow transition-shadow ${className}`}
      title="Google Pay"
      aria-label="Google Pay"
    >
      <svg viewBox="0 0 54 22" className="h-3.5 w-auto" xmlns="http://www.w3.org/2000/svg">
        {/* Google G logo */}
        <path
          d="M9.2 9.2V11.5H13.1C12.9 12.7 11.9 14.1 9.2 14.1C6.8 14.1 4.8 12.1 4.8 9.7C4.8 7.3 6.8 5.3 9.2 5.3C10.6 5.3 11.5 5.9 12 6.4L13.8 4.7C12.6 3.6 11.1 3 9.2 3C5.5 3 2.5 6 2.5 9.7C2.5 13.4 5.5 16.4 9.2 16.4C13.1 16.4 15.6 13.7 15.6 9.9C15.6 9.4 15.5 9 15.4 8.7H9.2V9.2Z"
          fill="#4285F4"
        />
        {/* Pay text */}
        <path
          d="M22.5 6.2H25.6C27.5 6.2 28.7 7.3 28.7 8.9C28.7 10.5 27.5 11.6 25.6 11.6H24V15H22.5V6.2ZM24 10.3H25.4C26.5 10.3 27.2 9.8 27.2 8.9C27.2 8 26.5 7.5 25.4 7.5H24V10.3Z"
          fill="#3C4043"
        />
        <path
          d="M31.8 15H30.4L33 7.8H34.6L37.2 15H35.8L35.2 13.2H32.4L31.8 15ZM32.8 12.1H34.8L33.8 9L32.8 12.1Z"
          fill="#3C4043"
        />
        <path
          d="M41.7 12.8L39.7 7.8H41.3L42.5 11.3L43.7 7.8H45.3L42.6 14.7C42.1 16 41.3 16.6 40 16.6C39.6 16.6 39.2 16.5 38.9 16.4V15.2C39.2 15.3 39.5 15.4 39.8 15.4C40.6 15.4 41.2 14.9 41.7 13.7L41.7 12.8Z"
          fill="#3C4043"
        />
      </svg>
    </div>
  );
}

interface PaymentBadgesProps {
  className?: string;
  badgeClassName?: string;
  showTitle?: boolean;
  title?: string;
  align?: 'left' | 'center' | 'right';
}

export function PaymentBadges({
  className = '',
  badgeClassName = 'h-7',
  showTitle = true,
  title = 'Paiements 100% sécurisés :',
  align = 'center',
}: PaymentBadgesProps) {
  const alignmentClass =
    align === 'center' ? 'items-center justify-center' : align === 'right' ? 'items-end justify-end' : 'items-start justify-start';

  return (
    <div className={`flex flex-col gap-2 ${alignmentClass} ${className}`}>
      {showTitle && (
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
      )}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <CbBadge className={badgeClassName} />
        <VisaBadge className={badgeClassName} />
        <MastercardBadge className={badgeClassName} />
        <ApplePayBadge className={badgeClassName} />
        <GooglePayBadge className={badgeClassName} />
      </div>
    </div>
  );
}
