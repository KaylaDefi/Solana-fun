import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import Artist from '../../../../models/artist'; 
import { connectToDatabase } from '../../../../lib/db'; 

export const authOptions = {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'text', placeholder: 'email@example.com' },
          password: { label: 'Password', type: 'password' }
        },
        async authorize(credentials) {
          console.log('Authorizing credentials:', credentials);
          await connectToDatabase();
          const { email, password } = credentials;
          const artist = await Artist.findOne({ email });
          if (!artist) {
            console.warn('No artist found with this email:', email);
            throw new Error('No artist found with this email.');
          }
          const isPasswordValid = await bcrypt.compare(password, artist.password);
          console.log('Password comparison result:', isPasswordValid);
          if (!isPasswordValid) {
            console.warn('Incorrect password for artist:', email);
            throw new Error('Incorrect password.');
          }
          return { id: artist._id, email: artist.email, name: artist.name };
        }
      })
    ],
    pages: {
      signIn: '/artist/login', 
      error: '/auth/error',    
    },
    secret: process.env.NEXTAUTH_SECRET, 
    session: {
      strategy: 'jwt', 
    },
    callbacks: {
      async jwt({ token, user }) {
        console.log('JWT callback:', { token, user });
        if (user) {
          token.artistId = user.id;
        }
        return token;
      },
      async session({ session, token }) {
        console.log('Session callback:', { session, token });
        session.artistId = token.artistId;
        return session;
      }
    }
  };
  