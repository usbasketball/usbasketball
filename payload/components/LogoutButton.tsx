// Payload's own logout only clears its cookie, but admin access comes from the
// Auth0 session (payload/auth0-strategy.ts), so the next request would sign the
// editor straight back in. Send them through the Auth0 logout instead.
export default function LogoutButton() {
  return (
    // eslint-disable-next-line @next/next/no-html-link-for-pages -- Auth0 route handled by auth0.middleware(), intentionally a plain <a>
    <a href="/auth/logout" aria-label="Log out" title="Log out">
      Log out
    </a>
  );
}
