import React from 'react'
import './learining.css'
import { BsCheckLg } from 'react-icons/bs'

const Learining = () => {
    return (
        <section id='services'>
            <h5>What I Know</h5>
            <h2>Learning and Achievement</h2>

            <div className="container services__containter">
                <article className="service service--cyber">
                    <div className="service__head">
                        <h3>Cybersecurity Skills</h3>
                    </div>
                    <ul className='service__list'>
                        <li>
                            <BsCheckLg className='service__list-icon' />
                            <p>Advanced Network Security</p>
                        </li>
                        <li>
                            <BsCheckLg className='service__list-icon' />
                            <p>Cloud Infrastructure Security (AWS & Azure)</p>
                        </li>
                        <li>
                            <BsCheckLg className='service__list-icon' />
                            <p>Red Team Tactics and Penetration Testing</p>
                        </li>
                        <li>
                            <BsCheckLg className='service__list-icon' />
                            <p>Ethical Hacking</p>
                        </li>
                        <li>
                            <BsCheckLg className='service__list-icon' />
                            <p>Incident Response and Threat Hunting</p>
                        </li>
                    </ul>
                </article>
                <article className="service service--achieve">
                    <div className="service__head">
                        <h3>Achieve</h3>
                    </div>
                    <ul className='service__list'>
                        <li>
                            <BsCheckLg className='service__list-icon' />
                            <p><b>Certification </b>CEH V12, CND V2</p>
                        </li>
                        <li>
                            <BsCheckLg className='service__list-icon' />
                            <p><b>TryHackMe</b> Level Max, completed 140+ rooms</p>
                        </li>
                        <li>
                            <BsCheckLg className='service__list-icon' />
                            <p><b>Research Scholar</b> Have 4+ Research</p>
                        </li>
                        <li>
                            <BsCheckLg className='service__list-icon' />
                            <p><b>Projects</b> Have 7+ Open-source Projects</p>
                        </li>
                    </ul>
                </article>
                <article className="service service--research">
                    <div className="service__head">
                        <h3>Research Platform</h3>
                    </div>
                    <ul className='service__list'>
                        <li>
                            <BsCheckLg className='service__list-icon' />
                            <p>Development of Security Automation Tools</p>
                        </li>
                        <li>
                            <BsCheckLg className='service__list-icon' />
                            <p>AI Integration for Threat Detection</p>
                        </li>
                        <li>
                            <BsCheckLg className='service__list-icon' />
                            <p>Research on Optimizing Linux Security</p>
                        </li>
                        <li>
                            <BsCheckLg className='service__list-icon' />
                            <p>Contributions to Open Source Security Projects</p>
                        </li>
                    </ul>
                </article>
            </div>
        </section>
    )
}

export default Learining