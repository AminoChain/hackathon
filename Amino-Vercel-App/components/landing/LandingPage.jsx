import Header from './Header'
import IntroBody from './IntroBody'
import StatsBody from './StatsBody'
import InfoBody from './InfoBoxesBody'
import PoweredBody from './PoweredBody'
import Footer from './Footer'

const LandingPage = () => {
  return (
    <div className="w-screen flex flex-col bg-white">
      <Header />
      <IntroBody />
      <StatsBody />
      <InfoBody />
      <PoweredBody />
      <Footer />
    </div>
  )
}

export default LandingPage
