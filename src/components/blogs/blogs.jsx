import React, { useState, useEffect, useRef } from 'react';
import './blogs.css';
import blogsData from '../../assets/stats.json';
import { TbRobot, TbShield, TbCode, TbBook } from 'react-icons/tb';
import * as Chart from 'chart.js';

const Blogs = () => {
  const [activeModal, setActiveModal] = useState(null);
  const chartRef = useRef(null);

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

  // Create 3D-style Chart with Chart.js
  useEffect(() => {
    if (chartRef.current && stats.broadCategoryDistribution.length > 0) {
      // Register Chart.js components
      const { Chart: ChartJS, ArcElement, Tooltip, Legend, DoughnutController } = Chart;
      
      ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

      const ctx = chartRef.current.getContext('2d');
      
      // Destroy existing chart if it exists
      if (chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }

      const labels = stats.broadCategoryDistribution.map(([category]) => category);
      const values = stats.broadCategoryDistribution.map(([, count]) => count);
      const colors = ['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981'];
      const shadowColors = ['#7c3aed', '#2563eb', '#0891b2', '#059669'];

      const chartInstance = new ChartJS(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: colors,
            borderColor: shadowColors,
            borderWidth: 3,
            hoverOffset: 15,
            offset: 5,
            borderRadius: 8,
            spacing: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
              borderColor: '#6366f1',
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              callbacks: {
                label: function(context) {
                  const percentage = ((context.parsed / stats.totalPosts) * 100).toFixed(1);
                  return `${context.label}: ${context.parsed} posts (${percentage}%)`;
                }
              }
            }
          },
          elements: {
            arc: {
              borderAlign: 'inner'
            }
          },
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1000,
            easing: 'easeOutCubic'
          },
          hover: {
            animationDuration: 300
          },
          layout: {
            padding: 20
          }
        },
        plugins: [{
          id: 'centerText',
          beforeDraw: function(chart) {
            const ctx = chart.ctx;
            const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
            const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;
            
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Draw total number
            ctx.font = 'bold 28px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(stats.totalPosts, centerX, centerY - 8);
            
            // Draw label
            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = '#6366f1';
            ctx.fillText('ARTICLES', centerX, centerY + 15);
            
            ctx.restore();
          }
        }]
      });

      chartRef.current.chartInstance = chartInstance;
    }

    return () => {
      if (chartRef.current?.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }
    };
  }, [stats]);

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
    document.body.style.overflow = 'hidden';
  };

  // Close modal
  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'unset';
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
                <div className="chart-3d-wrapper">
                  <canvas ref={chartRef} width="320" height="300"></canvas>
                  <div className="chart-legend">
                    {stats.broadCategoryDistribution.map(([category, count], index) => {
                      const colors = ['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981'];
                      const percentage = ((count / stats.totalPosts) * 100).toFixed(1);
                      return (
                        <div key={category} className="legend-item">
                          <div 
                            className="legend-color" 
                            style={{ backgroundColor: colors[index] }}
                          ></div>
                          <div className="legend-text">
                            <span className="legend-category">{category}</span>
                            <span className="legend-stats">{count} posts ({percentage}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
                
                <div className="posts-container">
                  {groupedPosts[activeModal]?.map((post) => (
                    <div 
                      key={post.id} 
                      className="blog-card"
                      onClick={() => handleCardClick(post.url)}
                    >
                      <div className="blog-image">
                        {getImagePath(post.id) ? (
                          <img 
                            src={getImagePath(post.id)} 
                            alt={post.title}
                            loading="lazy"
                          />
                        ) : (
                          <div className="image-placeholder">
                            <h4>{post.title}</h4>
                            <p>{post.category}</p>
                          </div>
                        )}
                        
                        <div className="meta-overlay">
                          <span 
                            className="category-tag"
                            style={{ backgroundColor: getCategoryColor(post.category) }}
                          >
                            {post.category}
                          </span>
                          <span 
                            className="difficulty-tag"
                            style={{ backgroundColor: getDifficultyColor(post.difficulty) }}
                          >
                            {post.difficulty}
                          </span>
                        </div>

                        {post.featured && <div className="featured-tag">Featured</div>}
                      </div>

                      <div className="blog-content">
                        <h4>{post.title}</h4>
                        <p className="blog-excerpt">{post.excerpt}</p>
                        
                        <div className="blog-details">
                          <span className="blog-date">
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short'
                            }) : 'HackerNoon'}
                          </span>
                          <span className="blog-read-time">
                            {post.estimatedReadTime ? `${post.estimatedReadTime} min read` : 'Quick read'}
                          </span>
                        </div>
                      </div>
                    </div>
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