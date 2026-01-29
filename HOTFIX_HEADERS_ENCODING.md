# Hotfix: Non-ISO-8859-1 Headers Error

**Date**: January 27, 2026  
**Issue**: `Failed to read the 'headers' property from 'RequestInit': String contains non ISO-8859-1 code point`

## Problem

HTTP headers must contain only ASCII characters (ISO-8859-1 range: 0-255). When the middleware set the `x-user-email` header directly with email addresses containing special characters (accented characters, emoji, etc.), it caused fetch requests to fail with the above error.

## Root Cause

In `middleware.ts` line 51, the email was being set directly:
```typescript
requestHeaders.set('x-user-email', payload.email);
```

If `payload.email` contained non-ASCII characters, this would cause fetch calls to fail.

## Solution

### Changes Made

1. **middleware.ts** - Encode email to base64 before setting header:
```typescript
requestHeaders.set('x-user-email', Buffer.from(payload.email).toString('base64'));
```

2. **lib/auth.ts** - Added helper function to decode email header:
```typescript
export function decodeEmailHeader(encodedEmail?: string | null): string | null {
  if (!encodedEmail) {
    return null;
  }
  try {
    return Buffer.from(encodedEmail, 'base64').toString('utf-8');
  } catch (error) {
    console.error('Failed to decode email header:', error);
    return null;
  }
}
```

## Usage in API Routes

If you need to read the user email from headers in any API route:

```typescript
import { decodeEmailHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id');
  const userId = request.headers.get('x-user-id');
  const role = request.headers.get('x-user-role');
  const encodedEmail = request.headers.get('x-user-email');
  
  // Decode email from base64
  const email = decodeEmailHeader(encodedEmail);
  
  // Use decoded email...
}
```

## Testing

Test with emails containing special characters:
- Accented characters: `françois@example.com`, `josé@example.com`
- Unicode characters: `user@société.fr`
- Emoji: `test😀@example.com`

All should now work without causing fetch errors.

## Notes

- Base64 encoding ensures all characters are within the safe ASCII range
- The encoding is transparent to API routes that don't currently use the email header
- This is a backward-compatible change since no API routes currently read `x-user-email`
- Similar encoding could be applied to other headers if needed in the future

## Status

✅ **Fixed** - Deployed to production
