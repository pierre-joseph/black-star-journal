import './Home.css'

export default function Home() {
    const logo = '/bsj_logo.png';
    return (
        <div className="homeContainer">
            <img src={logo} alt="Black Star Journal logo" className="homeLogo" />
            <h1 className='homeTitle'>Black Star Journal</h1>
        </div>
    )
}