import { Link } from 'react-router'
import { BrandMark, BrandName } from '@/components/brand/BrandMark'
import { site } from '@/content/site'
import './site-footer.css'

/** One quiet line under every page: the logo mark and the owner, and the two legal pages nothing else links to. */
export function SiteFooter() {
  return (
    <footer className="site-foot">
      <p>
        <BrandMark className="site-foot__mark" />
        {site.name} ·<span className="sr-only"> {site.brand}</span>
        <BrandName className="site-foot__name" />
      </p>
      <nav aria-label="Legal">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
      </nav>
    </footer>
  )
}
