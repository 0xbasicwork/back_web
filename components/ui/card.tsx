import * as React from 'react';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-lg border border-gray-700 bg-gray-800 text-white shadow-md ${className}`}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export { Card };
