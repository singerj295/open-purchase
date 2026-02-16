import { NextResponse } from 'next/server';
import { signUp, signIn, signOut, getSession } from '@/lib/auth/supabase';

export async function POST(request: Request) {
  try {
    const { action, email, password, name } = await request.json();

    switch (action) {
      case 'signup':
        const signUpData = await signUp(email, password, { name });
        return NextResponse.json({
          success: true,
          data: {
            user: signUpData.user,
            session: signUpData.session,
          },
        });

      case 'signin':
        const signInData = await signIn(email, password);
        return NextResponse.json({
          success: true,
          data: {
            user: signInData.user,
            session: signInData.session,
          },
        });

      case 'signout':
        await signOut();
        return NextResponse.json({
          success: true,
          message: 'Signed out successfully',
        });

      case 'session':
        const session = await getSession();
        return NextResponse.json({
          success: true,
          data: { session },
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication failed' },
      { status: 401 }
    );
  }
}
