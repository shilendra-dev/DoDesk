import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from '../lib/prisma';
import { sendEmail } from '../utils/sendEmail';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: `${process.env.BACKEND_URL || 'http://localhost:5033'}/api/auth/callback/google`,
      // Always ask to select an account for better UX
      prompt: "select_account",
      // Get refresh token for better token management
      accessType: "offline",
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }) => {
      try {
        console.log('Sending password reset email to:', user.email);
        console.log('Reset URL:', url);
        
        const subject = "Reset your DoDesk password";
        const text = `
          Hi ${user.name || 'there'},

          You requested to reset your DoDesk password. Click the link below to set a new password:

          ${url}

          Or use this reset token: ${token}

          This link will expire in 1 hour.

          If you didn't request a password reset, you can safely ignore this email.

          Best regards,
          The DoDesk Team
        `;

        await sendEmail(user.email, subject, text);
        console.log('Password reset email sent successfully to:', user.email);
      } catch (error) {
        console.error('Failed to send password reset email:', error);
        throw new Error('Failed to send password reset email');
      }
    },
    onPasswordReset: async ({ user }) => {
      console.log(`Password reset successfully for user: ${user.email}`);
    },
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour in seconds

  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      try {
        console.log('Sending verification email to:', user.email);
        console.log('Verification URL:', url);
        
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
        console.log('Verification email sent successfully to:', user.email);
      } catch (error) {
        console.error('Failed to send verification email:', error);
        throw new Error('Failed to send verification email');
      }
    },
    tokenExpiresIn: 60 * 60, // 1 hours in seconds
    
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieName: "better-auth.session",
  },

  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],
});

export type Auth = typeof auth;