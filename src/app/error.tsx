'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your error monitoring service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="rounded-md bg-destructive/10 p-6 my-6">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
          <div className="rounded-full bg-destructive p-3">
            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-medium text-destructive-foreground mb-1">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">We encountered an error while loading this page</p>
            <div className="flex gap-3 justify-center sm:justify-start">
              <Button onClick={reset} variant="default">
                Try again
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Return home</Link>
              </Button>
            </div>
          </div>
        </div>
        {error.digest && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}