'use client';

import { Tooltip } from 'flowbite-react';

export default function TruncatedWithTooltip({ text = '', length = 30 }) {
  const isTruncated = text.length > length;
  const displayedText = isTruncated ? text.slice(0, length) + '...' : text;

  return isTruncated ? (
    <Tooltip content={text}>
      <span className="cursor-help">{displayedText}</span>
    </Tooltip>
  ) : (
    <span>{displayedText}</span>
  );
}
