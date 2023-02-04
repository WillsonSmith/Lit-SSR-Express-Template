import prisma from '../db/client.js';

type AuthenticationMiddlewareOptions = {
  unauthorizedRedirect?: string;
  authorizedRedirect?: string;
};

export function authenticationMiddleware({
  unauthorizedRedirect,
  authorizedRedirect,
}: AuthenticationMiddlewareOptions = {}) {
  return async (req, res, next) => {
    const sessionToken = req.session.sessionToken;
    if (!sessionToken) {
      req.authenticated = false;
      if (unauthorizedRedirect) {
        return res.redirect(unauthorizedRedirect);
      }
      return next();
    }

    const session = await prisma.sessionToken.findUnique({
      where: {
        token: sessionToken,
      },
      include: {
        user: {
          include: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!session) {
      req.authenticated = false;
      if (unauthorizedRedirect) {
        return res.redirect(unauthorizedRedirect);
      }
      return next();
    }

    const user = session.user;
    req.user = user;
    req.authenticated = true;

    if (authorizedRedirect) {
      return res.redirect(authorizedRedirect);
    }

    return next();
  };
}

export function requiresPermissionMiddleware(
  permission,
  authMiddlewareOptions: AuthenticationMiddlewareOptions = {},
) {
  return (req, res, next) => {
    authenticationMiddleware(authMiddlewareOptions)(req, res, () => {
      if (req.user?.role?.name === permission) {
        return next();
      }
      res.redirect('/');
    });
  };
}
