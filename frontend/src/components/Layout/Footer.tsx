export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer footer-center p-4 bg-base-100 text-base-content border-t border-base-300 mt-auto">
      <aside>
        <p className="text-sm">
          © {currentYear} <span className="font-semibold">SecurePress</span> - Modern, Security-First CMS
        </p>
      </aside>
    </footer>
  )
}
