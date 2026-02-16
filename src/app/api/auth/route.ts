import { NextResponse } from 'next/server';

// Mock user for demo mode when Supabase is not configured
const mockUsers: Record<string, { id: string; email: string; name: string; password: string }> = {
  'demo@restaurant.com': {
    id: 'demo-user-001',
    email: 'demo@restaurant.com',
    name: 'Restaurant Owner',
    password: 'demo',
  },
};

export async function POST(request: Request) {
  try {
    const { action, email, password, name } = await request.json();

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Demo mode if Supabase is not configured
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
      console.log('🔐 Auth: Demo mode (Supabase not configured)');

      switch (action) {
        case 'signup':
          // Demo signup
          if (mockUsers[email]) {
            return NextResponse.json(
              { success: false, error: 'User already exists' },
              { status: 400 }
            );
          }
          mockUsers[email] = {
            id: `demo-${Date.now()}`,
            email,
            name: name || email.split('@')[0],
            password,
          };
          return NextResponse.json({
            success: true,
            data: {
              user: { id: mockUsers[email].id, email, name: mockUsers[email].name },
              session: { user: mockUsers[email] },
            },
            message: 'Demo mode: Account created (not persistent)',
          });

        case 'signin':
          const user = mockUsers[email];
          if (!user || user.password !== password) {
            return NextResponse.json(
              { success: false, error: 'Invalid credentials' },
              { status: 401 }
            );
          }
          return NextResponse.json({
            success: true,
            data: {
              user: { id: user.id, email, name: user.name },
              session: { user },
            },
          });

        case 'signout':
          return NextResponse.json({
            success: true,
            message: 'Signed out successfully (demo mode)',
          });

        case 'session':
          return NextResponse.json({
            success: true,
            data: { session: null, message: 'Demo mode: No persistent sessions' },
          });

        default:
          return NextResponse.json(
            { success: false, error: 'Invalid action' },
            { status: 400 }
          );
      }
    }

    // Real Supabase auth (when configured)
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (action) {
      case 'signup': {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) throw error;
        return NextResponse.json({ success: true, data });
      }

      case 'signin': {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        return NextResponse.json({ success: true, data });
      }

      case 'signout': {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return NextResponse.json({ success: true, message: 'Signed out' });
      }

      case 'session': {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return NextResponse.json({ success: true, data });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Auth failed' },
      { status: 401 }
    );
  }
}
