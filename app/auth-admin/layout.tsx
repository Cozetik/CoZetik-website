export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Layout simple pour la page de login, sans vérification de session
  return <>{children}</>
}
