import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from '../lib/prisma';
import { sendEmail } from '../utils/sendEmail';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      try {
        console.log('📧 Sending verification email to:', user.email);
        console.log('🔗 Verification URL:', url);
        
        const subject = "Verify your DoDesk account";
        const text = `
Hi ${user.name || 'there'},

Welcome to DoDesk! Please verify your email address by clicking the link below:

${url}

Or use this verification token: ${token}

This link will expire in 24 hours.

If you didn't create a DoDesk account, you can safely ignore this email.

Best regards,
The DoDesk Team
        `;

        await sendEmail(user.email, subject, text);
        console.log('✅ Verification email sent successfully to:', user.email);
      } catch (error) {
        console.error('❌ Failed to send verification email:', error);
        throw new Error('Failed to send verification email');
      }
    },
    tokenExpiresIn: 60 * 60 * 24, // 24 hours in seconds
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieName: "better-auth.session",
  },
  // Only include socialProviders if environment variables are set
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && {
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectURI: `${process.env.BACKEND_URL || 'http://localhost:5033'}/api/auth/callback/google`,
      },
    },
  }),
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],
});

export type Auth = typeof auth;