import './Header.css'

export default function Header() {
	const logo = '/bsj_logo.png';
	return (
		<header className="siteHeader" role="banner">
			<div className="headerInner">
				<img src={logo} alt="Black Star Journal logo" className="siteLogo" />
				<span className="separator" aria-hidden="true">Black Star Journal</span>
				<nav className="siteNav" aria-label="Main navigation">
					<a href="#" className="navLink">Home</a>
					<a href="#" className="navLink">About Us</a>
					<a href="#" className="navLink">Sections</a>
					<a href="#" className="navLink">Archives</a>
					<a href="#" className="navLink">Contact Us</a>
				</nav>
			</div>
		</header>
	)
}
