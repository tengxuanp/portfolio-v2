import jwt from 'jsonwebtoken';

export interface AuthUser {
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any;
    return {
      username: decoded.username,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    return null;
  }
}

export function requireAuth(request: Request): AuthUser | null {
  const cookie = request.headers.get('cookie');
  if (!cookie) return null;

  const tokenMatch = cookie.match(/auth-token=([^;]*)/);
  if (!tokenMatch) return null;

  return verifyToken(tokenMatch[1]);
}

export function requireAuthWithResponse(request: Request): { user: AuthUser | null; errorResponse: Response | null } {
  const user = requireAuth(request);
  
  if (!user) {
    return {
      user: null,
      errorResponse: new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    };
  }
  
  return { user, errorResponse: null };
}
