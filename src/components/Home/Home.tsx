import './Home.css'
import Header from '../Header/Header'

export default function Home() {
    const logo = '/bsj_logo.png';
    return (
        <div className="homeContainer">
            <Header />
            <main className="hero">
                <div className="heroInner">
                    <div className="heroContent">
                        <h1 className="homeTitle">Black Star Journal</h1>
                        <p className="homeSubtitle">A journal of culture, art, and ideas — published biannually. Essays, poetry, and visual work from around the world.</p>
                        <div className="ctaRow">
                            <a href="#" className="btn primary">Read the Issue</a>
                            <a href="#" className="btn ghost">Subscribe</a>
                        </div>

                        {/* moved: large clickable issue card directly under the title/subtitle */}
                        <a href="/current-issue" className="issueCard" aria-label="Open current issue">
                            <img src="/bsj_issue_mock.jpg" alt="Current issue cover — Black Star Journal" className="issueThumb" />
                            <span className="issueBadge">Issue No. 10</span>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    )
}