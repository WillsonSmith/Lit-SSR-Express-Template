import prisma from '../db/client.js';
export function authenticate({ unauthorizedRedirect = '/login' } = {}) {
  return async (req, res, next) => {
    const sessionToken = req.session.sessionToken;
    if (!sessionToken) {
      return res.redirect(unauthorizedRedirect);
    }

    const dbSessionTokenWithUser = await prisma.sessionToken.findUnique({
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
    if (!dbSessionTokenWithUser) {
      return res.redirect(unauthorizedRedirect);
    }

    const user = dbSessionTokenWithUser.user;
    req.user = user;
    // if user password and route isn't password reset, redirect to password reset

    if (user.password && !req.path.includes('/password-reset')) {
      return res.redirect('/password-reset');
    }

    return next();
  };
}
