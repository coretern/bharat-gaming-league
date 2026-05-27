import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { addLog } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !(token as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Find all users with role 'admin'
    const admins = await User.find({ role: 'admin' }).select('name email image role').lean();
    
    const superAdminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    
    // Check if superadmin is already in the list
    const hasSuperAdmin = admins.some(a => a.email.toLowerCase() === superAdminEmail);
    
    let result = admins.map(a => ({
      name: a.name || 'Admin',
      email: a.email,
      image: a.image || '',
      isSuperAdmin: a.email.toLowerCase() === superAdminEmail,
    }));

    if (!hasSuperAdmin && superAdminEmail) {
      // Find superadmin in DB to get their actual profile info
      const saUser = await User.findOne({ email: superAdminEmail }).select('name email image').lean();
      if (saUser) {
        result.unshift({
          name: saUser.name || 'Super Admin',
          email: saUser.email,
          image: saUser.image || '',
          isSuperAdmin: true,
        });
      } else {
        // Fallback placeholder for superadmin if they haven't registered yet
        result.unshift({
          name: 'Super Admin (System)',
          email: superAdminEmail,
          image: '',
          isSuperAdmin: true,
        });
      }
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('GET /api/admin/admins error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !(token as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, action } = await req.json();
    if (!email || !action) {
      return NextResponse.json({ error: 'Email and action are required' }, { status: 400 });
    }

    const targetEmail = email.toLowerCase().trim();
    const superAdminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();

    if (targetEmail === superAdminEmail) {
      return NextResponse.json({ error: 'Cannot modify Super Admin privileges' }, { status: 400 });
    }

    await connectDB();

    if (action === 'appoint') {
      const user = await User.findOne({ email: targetEmail });
      if (!user) {
        return NextResponse.json({ 
          error: 'No registered user found with this email. Users must register first before they can be promoted to Admin.' 
        }, { status: 404 });
      }

      user.role = 'admin';
      await user.save();

      await addLog({
        action: 'Promote Admin',
        category: 'user',
        details: `Appointed administrator: ${targetEmail}`,
        performedBy: token.email || 'System'
      });

      return NextResponse.json({ success: true, message: `Successfully appointed ${targetEmail} as Administrator` });
    }

    if (action === 'revoke') {
      const user = await User.findOne({ email: targetEmail });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      user.role = 'user';
      await user.save();

      await addLog({
        action: 'Revoke Admin',
        category: 'user',
        details: `Revoked administrator privileges from ${targetEmail}`,
        performedBy: token.email || 'System'
      });

      return NextResponse.json({ success: true, message: `Successfully revoked administrator privileges from ${targetEmail}` });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('POST /api/admin/admins error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
