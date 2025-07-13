import React, { useState } from 'react';
import './blogs.css';
import blogsData from '../../assets/stats.json';
import { TbRobot, TbShield, TbCode, TbBook } from 'react-icons/tb';

const Blogs = () => {
  const [activeModal, setActiveModal] = useState(null);

  // Define broad categories
  const broadCategories = {
    'AI & Cybersecurity': {
      name: 'AI & Cybersecurity',
      icon: TbRobot,
      description: 'AI applications in security and industry analysis',
      categories: ['AI & Industry Analysis', 'AI & Cybersecurity'],
      gradient: 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)'
    },
    'Penetration Testing': {
      name: 'Penetration Testing',
      icon: TbShield,
      description: 'Security testing, vulnerability assessment, and ethical hacking',
      categories: ['Security Testing', 'Network Security', 'Web Security', 'System Security', 'Mobile Security', 'Linux Security', 'Wireless Security'],
      gradient: 'linear-gradient(135deg, #1A365D 0%, #2C5282 100%)'
    },
    'Tools & Programming': {
      name: 'Tools & Programming',
      icon: TbCode,
      description: 'Security tools, programming, and implementation guides',
      categories: ['Security Tools', 'Security Programming', 'Password Security', 'Authentication Security', 'OSINT Tools'],
      gradient: 'linear-gradient(135deg, #1A202C 0%, #2D3748 100%)'
    },
    'Education & Setup': {
      name: 'Education & Setup',
      icon: TbBook,
      description: 'Learning resources, tutorials, and environment setup',
      categories: ['Educational Resources', 'Technical Writing', 'Cybersecurity Education', 'Operating Systems', 'Virtualization', 'Hardware Setup', 'Infrastructure Tutorial', 'Privacy Security', 'Digital Marketing'],
      gradient: 'linear-gradient(135deg, #234E52 0%, #0F4F47 100%)'
    }
  };

  // Group posts by broad categories
  const groupPostsByCategory = () => {
    const grouped = {};
    
    Object.keys(broadCategories).forEach(key => {
      grouped[key] = blogsData.posts.filter(post => 
        broadCategories[key].categories.includes(post.category)
      );
    });
    
    return grouped;
  };

  const groupedPosts = groupPostsByCategory();

  // Calculate stats
  const calculateStats = () => {
    const featuredCount = blogsData.posts.filter(post => post.featured).length;
    
    // Calculate broad categories distribution
    const broadCategoryCount = {};
    
    Object.keys(broadCategories).forEach(broadCat => {
      broadCategoryCount[broadCat] = blogsData.posts.filter(post => 
        broadCategories[broadCat].categories.includes(post.category)
      ).length;
    });
    
    // Convert to array and sort by count (largest first)
    const broadCategoryDistribution = Object.entries(broadCategoryCount)
      .sort(([,a], [,b]) => b - a);
    
    return {
      totalPosts: blogsData.metadata.totalPosts,
      totalWords: blogsData.metadata.totalWords,
      averageWords: blogsData.metadata.averageWordCount,
      featured: featuredCount,
      broadCategoryDistribution: broadCategoryDistribution,
      span: blogsData.metadata.publicationSpan
    };
  };

  const stats = calculateStats();

  // Handle card click
  const handleCardClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Import image dynamically based on blog ID
  const getImagePath = (id) => {
    try {
      return require(`../../assets/blogs/${id}.jpeg`);
    } catch (error) {
      return null;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#4ade80';
      case 'Intermediate': return '#fbbf24';
      case 'Advanced': return '#f87171';
      default: return '#6b7280';
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16'];
    return colors[category.length % colors.length];
  };

  // Get broad category color
  const getBroadCategoryColor = (broadCategory) => {
    const colorMap = {
      'AI & Cybersecurity': '#8b5cf6',
      'Penetration Testing': '#3b82f6', 
      'Tools & Programming': '#06b6d4',
      'Education & Setup': '#10b981'
    };
    return colorMap[broadCategory] || '#6b7280';
  };

  // Open modal
  const openModal = (categoryKey) => {
    setActiveModal(categoryKey);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  // Close modal
  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'unset'; // Restore background scroll
  };

  // Handle modal backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (activeModal) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeModal]);

  return (
    <section id="blogs" className="blogs">
      <div className="container">
        <h5>Recent Work</h5>
        <h2>My Blog Posts</h2>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.totalPosts}</div>
              <div className="stat-label">Total Articles</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{(stats.totalWords / 1000).toFixed(0)}K</div>
              <div className="stat-label">Words Written</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.averageWords}</div>
              <div className="stat-label">Avg. Words/Article</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.featured}</div>
              <div className="stat-label">Featured Posts</div>
            </div>
          </div>
          
          <div className="stats-details">
            <div className="content-stats">
              <h6>Content Distribution</h6>
              <div className="chart-container">
                <div className="donut-chart-3d">
                  <svg width="260" height="220" viewBox="0 0 260 220">
                    <defs>
                      {/* Gradients for 3D effect */}
                      {stats.broadCategoryDistribution.map(([broadCategory, count], index) => {
                        const baseColor = getBroadCategoryColor(broadCategory);
                        return (
                          <radialGradient key={`gradient-${index}`} id={`gradient-${index}`} cx="0.3" cy="0.3" r="0.8">
                            <stop offset="0%" stopColor={`${baseColor}dd`} />
                            <stop offset="100%" stopColor={baseColor} />
                          </radialGradient>
                        );
                      })}
                      
                      {/* Shadow filter */}
                      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
                      </filter>
                    </defs>
                    
                    {(() => {
                      let cumulativeAngle = 0;
                      const centerX = 130;
                      const centerY = 110;
                      const radius = 60;
                      const labelRadius = 90;
                      
                      return stats.broadCategoryDistribution.map(([broadCategory, count], index) => {
                        const percentage = (count / stats.totalPosts) * 100;
                        const angle = (percentage / 100) * 360;
                        const startAngle = cumulativeAngle;
                        const endAngle = cumulativeAngle + angle;
                        
                        // Convert to radians
                        const startRad = (startAngle - 90) * (Math.PI / 180);
                        const endRad = (endAngle - 90) * (Math.PI / 180);
                        const midRad = (startRad + endRad) / 2;
                        
                        // Calculate path coordinates
                        const x1 = centerX + radius * Math.cos(startRad);
                        const y1 = centerY + radius * Math.sin(startRad);
                        const x2 = centerX + radius * Math.cos(endRad);
                        const y2 = centerY + radius * Math.sin(endRad);
                        
                        // Large arc flag
                        const largeArcFlag = angle > 180 ? 1 : 0;
                        
                        // Label position
                        const labelX = centerX + labelRadius * Math.cos(midRad);
                        const labelY = centerY + labelRadius * Math.sin(midRad);
                        
                        // Line connection points
                        const lineStartX = centerX + (radius + 10) * Math.cos(midRad);
                        const lineStartY = centerY + (radius + 10) * Math.sin(midRad);
                        
                        // Text anchor based on position
                        const textAnchor = labelX > centerX ? 'start' : 'end';
                        const adjustedLabelX = labelX > centerX ? labelX + 8 : labelX - 8;
                        
                        cumulativeAngle += angle;
                        
                        return (
                          <g key={broadCategory}>
                            {/* 3D Base shadow */}
                            <path
                              d={`M ${centerX} ${centerY + 4} L ${x1 + 2} ${y1 + 4} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2 + 2} ${y2 + 4} Z`}
                              fill="#00000018"
                            />
                            
                            {/* Main pie segment */}
                            <path
                              d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                              fill={`url(#gradient-${index})`}
                              stroke="#ffffff"
                              strokeWidth="2"
                              filter="url(#shadow)"
                              style={{
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                              }}
                              className="pie-segment"
                            />
                            
                            {/* Connection line */}
                            <line
                              x1={lineStartX}
                              y1={lineStartY}
                              x2={labelX}
                              y2={labelY}
                              stroke={getBroadCategoryColor(broadCategory)}
                              strokeWidth="2"
                            />
                            
                            {/* Percentage label */}
                            <text
                              x={adjustedLabelX}
                              y={labelY - 5}
                              textAnchor={textAnchor}
                              fill={getBroadCategoryColor(broadCategory)}
                              fontSize="15"
                              fontWeight="700"
                            >
                              {Math.round(percentage)}%
                            </text>
                            
                            {/* Category name */}
                            <text
                              x={adjustedLabelX}
                              y={labelY + 12}
                              textAnchor={textAnchor}
                              fill="var(--color-light)"
                              fontSize="10"
                              fontWeight="500"
                            >
                              {broadCategory}
                            </text>
                            
                            {/* Connection dot */}
                            <circle
                              cx={lineStartX}
                              cy={lineStartY}
                              r="3"
                              fill={getBroadCategoryColor(broadCategory)}
                            />
                          </g>
                        );
                      });
                    })()}
                    
                    {/* Center circle with text */}
                    <circle
                      cx="130"
                      cy="110"
                      r="25"
                      fill="rgba(27, 27, 30, 0.9)"
                      stroke="rgba(108, 92, 231, 0.3)"
                      strokeWidth="2"
                      filter="url(#shadow)"
                    />
                    
                    <text
                      x="130"
                      y="105"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="var(--color-light)"
                      fontSize="16"
                      fontWeight="700"
                    >
                      {stats.totalPosts}
                    </text>
                    <text
                      x="130"
                      y="118"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="var(--color-primary)"
                      fontSize="9"
                      fontWeight="500"
                    >
                      Articles
                    </text>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="publication-info">
              <h6>Publication Timeline</h6>
              <p>{stats.span}</p>
              <p>Platform: <span className="highlight">HackerNoon</span></p>
              <p>Last Updated: <span className="highlight">{blogsData.metadata.lastUpdated}</span></p>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="category-grid">
          {Object.entries(broadCategories).map(([key, category]) => {
            const IconComponent = category.icon;
            return (
              <div 
                key={key}
                className="category-card"
                onClick={() => openModal(key)}
                style={{ background: category.gradient }}
              >
                <div className="category-card-content">
                  <div className="category-icon">
                    <IconComponent size={48} />
                  </div>
                  <h3 className="category-title">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                  <div className="category-stats">
                    <span className="post-count">{groupedPosts[key]?.length || 0} Posts</span>
                    <span className="view-all">View All →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Windows */}
        {activeModal && (
          <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-window">
              <div className="modal-header">
                <div className="modal-title-section">
                  <span className="modal-icon">
                    {React.createElement(broadCategories[activeModal].icon, { size: 32 })}
                  </span>
                  <h3 className="modal-title">{broadCategories[activeModal].name}</h3>
                </div>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>
              
              <div className="modal-content">
                <p className="modal-description">{broadCategories[activeModal].description}</p>
                
                <div className="modal-posts-grid">
                  {groupedPosts[activeModal]?.map((post) => (
                    <article 
                      key={post.id} 
                      className="modal-blog-card"
                      onClick={() => handleCardClick(post.url)}
                    >
                      <div className="modal-blog-image">
                        {getImagePath(post.id) ? (
                          <img 
                            src={getImagePath(post.id)} 
                            alt={post.title}
                            loading="lazy"
                          />
                        ) : (
                          <div className="modal-image-placeholder">
                            <h4>{post.title}</h4>
                            <p>{post.category}</p>
                          </div>
                        )}
                        
                        {/* Meta overlays */}
                        <div className="modal-blog-meta-overlay">
                          <span 
                            className="modal-blog-category"
                            style={{ backgroundColor: getCategoryColor(post.category) }}
                          >
                            {post.category}
                          </span>
                          <span 
                            className="modal-blog-difficulty"
                            style={{ backgroundColor: getDifficultyColor(post.difficulty) }}
                          >
                            {post.difficulty}
                          </span>
                        </div>

                        {post.featured && <div className="modal-blog-featured">Featured</div>}
                      </div>

                      <div className="modal-blog-content">
                        <h4>{post.title}</h4>
                        <p className="modal-blog-excerpt">{post.excerpt}</p>
                        
                        <div className="modal-blog-details">
                          <span className="modal-blog-date">
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short'
                            }) : 'HackerNoon'}
                          </span>
                          <span className="modal-blog-read-time">
                            {post.estimatedReadTime ? `${post.estimatedReadTime} min read` : 'Quick read'}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blogs;