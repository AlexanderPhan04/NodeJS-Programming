function toPublicUser(user) {
  if (!user) {
    return null;
  }

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function toPostResponse(post, author) {
  return {
    ...post,
    author: author
      ? {
          id: author.id,
          username: author.username,
          email: author.email,
          role: author.role,
        }
      : null,
  };
}

module.exports = {
  toPublicUser,
  toPostResponse,
};
