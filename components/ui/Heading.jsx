'use client';
import React from 'react';

export default function Heading({
  level = 1,
  as,
  children,
  className = '',
  ...rest
}) {
  const Tag = as || `h${level}`;
  return (
    <Tag className={className} {...rest}>
      {children}
    </Tag>
  );
}
