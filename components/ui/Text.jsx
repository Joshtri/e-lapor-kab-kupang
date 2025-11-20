'use client';
import React from 'react';

// variant: p | span | div | small | label
export default function Text({
  variant = 'p',
  as,
  children,
  className = '',
  ...rest
}) {
  const Tag = as || variant;
  return (
    <Tag className={className} {...rest}>
      {children}
    </Tag>
  );
}
