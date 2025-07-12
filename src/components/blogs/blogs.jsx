import React, { useState, useEffect } from 'react';
import './blogs.css';
import blogsData from '../../assets/stats.json';

const Blogs = () => {
  const [currentBatch, setCurrentBatch] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const POSTS_PER_BATCH = 9; // 3x3 grid
  const SCROLL_INTERVAL = 10000; // 6 seconds

  // Calculate total batches
  const totalBatches = Math.ceil(blogsData.posts.length / POSTS_PER_BATCH);

  // Auto-scroll functionality with smooth transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentBatch((prev) => (prev + 1) % totalBatches);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    }, SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [totalBatches]);

  // Get current batch of posts
  const getCurrentBatchPosts = () => {
    const startIndex = currentBatch * POSTS_PER_BATCH;
    const endIndex = startIndex + POSTS_PER_BATCH;
    return blogsData.posts.slice(startIndex, endIndex);
  };

  // Handle card click to open blog in new tab
  const handleCardClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Import image dynamically based on blog ID
  const getImagePath = (id) => {
    try {
      return require(`../../assets/blogs/${id}.jpeg`);
    } catch (error) {
      // Fallback to a default image or placeholder
      return null;
    }
  };

  // Difficulty color mapping
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return '#4ade80'; // green
      case 'Intermediate':
        return '#fbbf24'; // yellow
      case 'Advanced':
        return '#f87171'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  // Category color mapping
  const getCategoryColor = (category) => {
    const colors = [
      '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981',
      '#f59e0b', '#ef4444', '#ec4899', '#84cc16'
    ];
    return colors[category.length % colors.length];
  };

  const currentPosts = getCurrentBatchPosts();

  return (
    <section id="blogs" className="blogs">
      <h5>Recent Work</h5>
      <h2>My Blog Posts</h2>

      <div className="container">
        <div className={`portfolio__container ${isTransitioning ? 'transitioning' : ''}`}>
          {currentPosts.map((post) => (
            <article 
              key={post.id} 
              className="portfolio__item"
              onClick={() => handleCardClick(post.url)}
            >
              <div className="portfolio__item-image">
                {getImagePath(post.id) ? (
                  <img 
                    src={getImagePath(post.id)} 
                    alt={post.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '220px',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                ) : (
                  <div 
                    className="image-placeholder"
                    style={{
                      width: '100%',
                      height: '220px',
                      background: 'linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'var(--color-light)',
                      textAlign: 'center',
                      padding: '1rem',
                      boxSizing: 'border-box'
                    }}
                  >
                    <h4 style={{
                      fontSize: '0.9rem',
                      marginBottom: '0.5rem',
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {post.title}
                    </h4>
                    <p style={{
                      fontSize: '0.7rem',
                      color: 'var(--color-primary)',
                      margin: 0
                    }}>
                      {post.category}
                    </p>
                  </div>
                )}
                
                {/* Meta overlays */}
                <div className="blog__meta-overlay">
                  <span 
                    className="blog__category"
                    style={{ backgroundColor: getCategoryColor(post.category) }}
                  >
                    {post.category}
                  </span>
                  <span 
                    className="blog__difficulty"
                    style={{ backgroundColor: getDifficultyColor(post.difficulty) }}
                  >
                    {post.difficulty}
                  </span>
                </div>

                {post.featured && <div className="blog__featured">Featured</div>}
              </div>

              <h3>{post.title}</h3>
              <p className="blog__excerpt">{post.excerpt}</p>
              
              <div className="blog__details">
                <span className="blog__date">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short'
                  }) : 'HackerNoon'}
                </span>
                <span className="blog__read-time">
                  {post.estimatedReadTime ? `${post.estimatedReadTime} min read` : 'Quick read'}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination indicators */}
        <div className="blogs__pagination">
          {Array.from({ length: totalBatches }, (_, index) => (
            <button
              key={index}
              className={`pagination__dot ${index === currentBatch ? 'active' : ''}`}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentBatch(index);
                  setTimeout(() => {
                    setIsTransitioning(false);
                  }, 50);
                }, 300);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;