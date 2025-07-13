import React, { useState, useEffect, useCallback, useMemo } from 'react'
import './nav.css'
import { BiHomeHeart } from 'react-icons/bi'
import { BiUser } from 'react-icons/bi'
import { BiBookBookmark } from 'react-icons/bi'
import { HiDocumentDuplicate } from 'react-icons/hi'
import { GiArchiveResearch } from "react-icons/gi"
import { TbCertificate } from "react-icons/tb"
import { BiMessageSquareDetail } from 'react-icons/bi'
import { BiLogoBlogger } from 'react-icons/bi'

const Nav = () => {
    const [activeNav, setActiveNav] = useState('#')
    const [hoveredNav, setHoveredNav] = useState(null)
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [navDimensions, setNavDimensions] = useState({ width: 0, itemSize: 0, gap: 0 })

    // Navigation items configuration
    const navItems = useMemo(() => [
        { href: '#', section: 'home', icon: BiHomeHeart, label: 'Home' },
        { href: '#about', section: 'about', icon: BiUser, label: 'About' },
        { href: '#experience', section: 'experience', icon: BiBookBookmark, label: 'Experience' },
        { href: '#portfolio', section: 'portfolio', icon: HiDocumentDuplicate, label: 'Portfolio' },
        { href: '#research', section: 'research', icon: GiArchiveResearch, label: 'Research' },
        { href: '#blogs', section: 'blogs', icon: BiLogoBlogger, label: 'Blogs' },
        { href: '#certifications', section: 'certifications', icon: TbCertificate, label: 'Certifications' },
        { href: '#contact', section: 'contact', icon: BiMessageSquareDetail, label: 'Contact' }
    ], [])

    // Calculate dynamic dimensions based on viewport
    const calculateDimensions = useCallback(() => {
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const aspectRatio = viewportWidth / viewportHeight
        const totalItems = navItems.length
        
        // Dynamic calculations - SMALLER DEFAULT SIZES
        const maxWidth = Math.min(viewportWidth * 0.8, 480) // Reduced from 0.9, 600
        const minItemSize = 28 // Minimum item size
        const maxItemSize = 40 // Reduced from 48
        const basePadding = 12 // Reduced from 16
        
        // Calculate optimal item size based on available width
        const availableWidth = maxWidth - (basePadding * 2)
        const maxItemsWidth = totalItems * maxItemSize + (totalItems - 1) * 6 // Reduced gap from 8
        
        let itemSize, gap
        
        if (maxItemsWidth <= availableWidth) {
            // Plenty of space - use max size
            itemSize = maxItemSize
            gap = Math.min(8, (availableWidth - totalItems * itemSize) / (totalItems - 1)) // Reduced from 12
        } else {
            // Need to shrink - calculate optimal size
            gap = Math.max(2, Math.min(6, viewportWidth * 0.008)) // Reduced multiplier
            itemSize = Math.max(minItemSize, (availableWidth - (totalItems - 1) * gap) / totalItems)
        }
        
        // Adjust for very small screens
        if (viewportWidth < 320) {
            itemSize = Math.max(26, itemSize * 0.8) // Reduced from 28
            gap = Math.max(1, gap * 0.5)
        }
        
        const finalWidth = totalItems * itemSize + (totalItems - 1) * gap + basePadding * 2
        
        setNavDimensions({
            width: finalWidth,
            itemSize: itemSize,
            gap: gap,
            padding: basePadding * 0.5,
            fontSize: Math.max(10, itemSize * 0.45), // Reduced font scale
            borderRadius: itemSize * 0.5
        })
        
        // Update CSS custom properties
        document.documentElement.style.setProperty('--nav-width', `${finalWidth}px`)
        document.documentElement.style.setProperty('--nav-item-size', `${itemSize}px`)
        document.documentElement.style.setProperty('--nav-gap', `${gap}px`)
        document.documentElement.style.setProperty('--nav-padding', `${basePadding * 0.5}px`)
        document.documentElement.style.setProperty('--nav-font-size', `${Math.max(10, itemSize * 0.45)}px`)
        document.documentElement.style.setProperty('--nav-border-radius', `${itemSize * 0.5}px`)
        document.documentElement.style.setProperty('--nav-total-items', totalItems)
        
    }, [navItems.length])

    // Auto-detect active section using Intersection Observer
    useEffect(() => {
        const sections = navItems.map(item => 
            item.section === 'home' ? document.body : document.getElementById(item.section)
        ).filter(Boolean)

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id || 'home'
                        const matchingItem = navItems.find(item => 
                            item.section === sectionId || (sectionId === '' && item.section === 'home')
                        )
                        if (matchingItem) {
                            setActiveNav(matchingItem.href)
                        }
                    }
                })
            },
            {
                threshold: 0.6,
                rootMargin: '-10% 0px -10% 0px'
            }
        )

        sections.forEach(section => {
            if (section) observer.observe(section)
        })

        return () => observer.disconnect()
    }, [navItems])

    // Handle scroll-based visibility - SHOW ON ANY SCROLL
    useEffect(() => {
        let scrollTimeout

        const handleScroll = () => {
            // Show nav when scrolling (any direction)
            setIsVisible(true)
            
            // Clear existing timeout
            clearTimeout(scrollTimeout)
            
            // Hide nav after 2 seconds of no scrolling
            scrollTimeout = setTimeout(() => {
                setIsVisible(false)
            }, 2000)
            
            setLastScrollY(window.scrollY)
        }

        const throttledScroll = throttle(handleScroll, 100)
        window.addEventListener('scroll', throttledScroll)
        
        // Show nav initially
        setIsVisible(true)
        
        return () => {
            window.removeEventListener('scroll', throttledScroll)
            clearTimeout(scrollTimeout)
        }
    }, [])

    // Handle resize and calculate dimensions
    useEffect(() => {
        calculateDimensions()
        
        const handleResize = () => {
            calculateDimensions()
        }
        
        const debouncedResize = debounce(handleResize, 150)
        window.addEventListener('resize', debouncedResize)
        return () => window.removeEventListener('resize', debouncedResize)
    }, [calculateDimensions])

    // Mouse tracking for interactive effects
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    // Smooth scroll with offset
    const handleNavClick = useCallback((e, href, section) => {
        e.preventDefault()
        setActiveNav(href)
        
        const targetElement = section === 'home' 
            ? document.body 
            : document.getElementById(section)
            
        if (targetElement) {
            const offset = section === 'home' ? 0 : 80
            const elementPosition = targetElement.offsetTop - offset
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            })
        }
    }, [])

    // Utility functions
    function throttle(func, limit) {
        let inThrottle
        return function() {
            const args = arguments
            const context = this
            if (!inThrottle) {
                func.apply(context, args)
                inThrottle = true
                setTimeout(() => inThrottle = false, limit)
            }
        }
    }

    function debounce(func, wait) {
        let timeout
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout)
                func(...args)
            }
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
        }
    }

    return (
        <>
            {/* Floating tooltip */}
            {hoveredNav && (
                <div 
                    className="nav-tooltip"
                    style={{
                        left: mousePosition.x,
                        top: mousePosition.y - 60,
                    }}
                >
                    {hoveredNav.label}
                </div>
            )}
            
            <nav 
                className={`dynamic-nav ${isVisible ? 'nav-visible' : 'nav-hidden'}`}
                style={{
                    '--nav-active-index': navItems.findIndex(item => item.href === activeNav)
                }}
            >
                {/* Background blur effect */}
                <div className="nav-background"></div>
                
                {/* Active indicator */}
                <div className="nav-active-indicator"></div>
                
                {/* Navigation items */}
                {navItems.map((item, index) => {
                    const IconComponent = item.icon
                    const isActive = activeNav === item.href
                    const isHovered = hoveredNav?.href === item.href
                    
                    return (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item.href, item.section)}
                            className={`nav-item ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
                            onMouseEnter={() => setHoveredNav(item)}
                            onMouseLeave={() => setHoveredNav(null)}
                            style={{
                                '--nav-index': index
                            }}
                        >
                            <IconComponent className="nav-icon" />
                            <span className="nav-ripple"></span>
                            
                            {/* Activity pulse for active item */}
                            {isActive && (
                                <div className="nav-pulse">
                                    <div className="pulse-ring"></div>
                                    <div className="pulse-ring"></div>
                                    <div className="pulse-ring"></div>
                                </div>
                            )}
                        </a>
                    )
                })}
            </nav>
        </>
    )
}

export default Nav