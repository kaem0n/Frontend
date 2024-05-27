const Footer = () => {
  return (
    <p className="text-center py-3 fs-7">
      MeeToo &copy; {new Date().getFullYear()} by kaem0n ·{' '}
      <a
        href="https://github.com/kaem0n"
        className="link-body-emphasis underline"
      >
        GitHub
      </a>{' '}
      ·{' '}
      <a
        href="https://www.linkedin.com/in/antonio-ruggia-piquer-a086592b5/"
        className="link-body-emphasis underline"
      >
        LinkedIn
      </a>{' '}
      ·{' '}
      <a
        href="https://www.instagram.com/_antoniorp_/"
        className="link-body-emphasis underline"
      >
        Instagram
      </a>
    </p>
  )
}

export default Footer
