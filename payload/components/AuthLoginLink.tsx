export default function AuthLoginLink() {
  return (
    <p style={{ marginTop: "1rem" }}>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Auth0 route handled by auth0.middleware(), intentionally a plain <a> */}
      <a href="/auth/login?returnTo=/admin">Sign in with Auth0</a>
    </p>
  );
}
