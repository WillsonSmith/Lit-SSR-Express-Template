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

    req.user = dbSessionTokenWithUser.user;
    return next();
  };
}
