import React from 'react'
import About from './components/about/About'
import Contact from './components/contact/Contact'
import Experience from './components/experience/Experience'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Nav from './components/nav/Nav'
import Portfolio from './components/portfolio/Portfolio'
import Learining from './components/learning/Learining'
import Testimonials from './components/testimonials/Testimonials'
import Research from './components/research/Research'
import Certs from './components/certifications/Certs'
import Tech from './components/Tech/Tech'

// For some stupid reason this works? Why does have to Tech/Tech and not tech/Tech need to debug

const App = () => {
    return (
        <>
            <Header />
            <Nav />
            <About />
            <Experience />
            <Tech/>
            <Learining />
            <Certs />
            <Portfolio />
            <Research />
            <Testimonials/>
            <Contact />
            <Footer />
        </>
    )
}

export default App
