import NextAuth, { type NextAuthConfig } from 'next-auth'
import credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import bcryptjs from 'bcryptjs';
import prisma from './lib/prisma';

const authenticatedRoutes = [
  '/cart',
  'empty',
  '/profile',
  '/checkout',
  '/orders'
]
const isOnAuthenticatedRoutes = (onRoute: string) => {
  return authenticatedRoutes.some((authRoutes) =>
    onRoute.startsWith(authRoutes)
  );
};


/**
 * Configuration object for authentication in the application.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login', // The page for signing in
    newUser: '/auth/new-account', // The page for creating a new account
  },
  callbacks: {

    authorized({ auth, request: { nextUrl } }) {

      //console.log({ auth });

      const isLoggedIn = !!auth?.user;

      if (isOnAuthenticatedRoutes(nextUrl.pathname)) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },

    /**
     * Callback function for manipulating the JWT token.
     * @param token - The JWT token
     * @param user - The user object
     * @returns The modified JWT token
     */
    jwt({token, user}) {
      if (user) {
        token.data = user
      }
      return token
    },

    /**
     * Callback function for manipulating the session object.
     * @param session - The session object
     * @param token - The JWT token
     * @param user - The user object
     * @returns The modified session object
     */
    session({ session, token, user }) {
      session.user = token.data as any
      return session
    },

  },
  providers: [
    credentials({
      async authorize(credentials) {
        
        // Validar las credenciales
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        // Si las credenciales no son válidas, regresar null
        if (!parsedCredentials.success) return null
          
        // Extraer el correo y la contraseña
        const { email, password } = parsedCredentials.data;

        // Buscar el correo
        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
          
        // Si no se encuentra el usuario, regresar null
        if (!user) return null;

        // Comparar las contraseñas
        if ( !bcryptjs.compareSync(password, user.password) ) return null; 

        // Regresar el usuario sin el password
        const { password: _, ...rest } = user

        console.log({rest});
        
        // Regresar el usuario
        return rest;

      },
    }),
  ]
}

// Exportar las funciones de autenticación
export const { signIn, signOut, auth, handlers } = NextAuth( authConfig) 