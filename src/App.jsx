import React from 'react'
import About from './components/about/About'
import Contact from './components/contact/Contact'
import Experience from './components/experience/Experience'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Nav from './components/nav/Nav'
import Portfolio from './components/portfolio/Portfolio'
import Learning from './components/learning/Learining'
import Testimonials from './components/testimonials/Testimonials'
import Research from './components/research/Research'
import Certs from './components/certifications/Certs'
import Tech from './components/Tech/Tech'
import Blogs from './components/blogs/blogs'

const App = () => {
    return (
        <>
            <Header />
            <Nav />
            <About />
            <Experience />
            <Tech/>
            <Learning />
            <Certs />
            <Portfolio />
            <Research />
            <Blogs/>
            <Testimonials/>
            <Contact />
            <Footer />
        </>
    )
}

export default App
