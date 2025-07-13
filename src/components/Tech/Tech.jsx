import React, { useState, useEffect, useRef } from "react";
import * as d3 from 'd3';
import "./tech.css";

const experiences = [
  {
    title: "Cybersecurity Engineer Intern – Averlon/Avercyber",
    period: "May 2023 - Jul 2023",
    color: "#ff6b6b",
    skills: {
      // Programming & Development
      "Python": 0.95,
      "Shell Scripting/Bash": 0.85,
      "SQL": 0.7,
      "Git/GitHub": 0.9,
      "VS Code": 0.9,
      
      // Cybersecurity & Penetration Testing
      "Nmap": 0.9,
      "Wireshark": 0.85,
      "Metasploit": 0.75,
      "Burp Suite": 0.9,
      "OWASP": 0.8,
      "Vulnerability Assessment": 0.85,
      "Penetration Testing": 0.8,
      "OSINT": 0.75,
      "Network Security": 0.85,
      "Risk Assessment": 0.75,
      
      // Cloud & Infrastructure
      "AWS": 0.8,
      "Linux Administration": 0.9,
      "Docker/Docker Compose": 0.85,
      "Terraform": 0.8,
      
      // AI & Machine Learning
      "LLM (ChatGPT, Claude, LLama2)": 0.9,
      "RAG & Agentic AI": 0.9,
      
      // Research & Documentation
      "Technical Documentation": 0.95,
      "LaTeX/TexStudio": 0.95,
      
      // Tools & Collaboration
      "Postman": 0.7,
      "Slack": 0.9,
      "Jira": 0.7,
    }
  },
  {
    title: "Offensive Security Engineer Intern – Averlon/Avercyber",
    period: "Jul 2023 - Mar 2024",
    color: "#4ecdc4",
    skills: {
      // Programming & Development
      "Python": 0.95,
      "Shell Scripting/Bash": 0.85,
      "C/C++/Java": 0.3,
      "Git/GitHub": 0.9,
      "VS Code": 0.9,
      "API Development": 0.7,
      
      // Cybersecurity & Penetration Testing
      "Nmap": 0.9,
      "Wireshark": 0.85,
      "Metasploit": 0.75,
      "Burp Suite": 0.9,
      "OSINT": 0.75,
      "Penetration Testing": 0.8,
      "Network Security": 0.85,
      "NIST Framework": 0.7,
      "MITRE ATT&CK": 0.7,
      
      // Cloud & Infrastructure
      "AWS": 0.8,
      "Linux Administration": 0.9,
      "Docker/Docker Compose": 0.85,
      "Terraform": 0.8,
      "Infrastructure as Code": 0.7,
      "CI/CD": 0.6,
      
      // AI & Machine Learning
      "Prompt Engineering": 0.9,
      "LLM (ChatGPT, Claude, LLama2)": 0.9,
      
      // Research & Documentation
      "Technical Documentation": 0.95,
      "LaTeX/TexStudio": 0.95,
      
      // Tools & Collaboration
      "Project Management": 0.8,
      "Postman": 0.7,
      "Slack": 0.9,
      "Jira": 0.7,
    }
  },
  {
    title: "Freelance Researcher & Developer",
    period: "Mar 2024 - Oct 2024",
    color: "#45b7d1",
    skills: {
      // Programming & Development
      "Python": 0.95,
      "Git/GitHub": 0.9,
      "VS Code": 0.9,
      "HTML/CSS": 0.8,
      
      // AI & Machine Learning
      "LLM (ChatGPT, Claude, LLama2)": 0.9,
      "Prompt Engineering": 0.9,
      "RAG & Agentic AI": 0.9,
      
      // Research & Documentation
      "LaTeX/TexStudio": 0.95,
      "Scientific Writing": 0.9,
      "Technical Documentation": 0.95,
      "Academic Writing": 0.85,
      "Literature Review": 0.8,
      "Research Methodology": 0.8,
      "Data Analysis": 0.7,
      "Pandas/NumPy": 0.7,
      "Jupyter Notebooks": 0.8,
      
      // Cloud & Infrastructure
      "Linux Administration": 0.9,
      
      // Tools & Collaboration
      "Project Management": 0.8,
      "Slack": 0.9,
    }
  },
  {
    title: "CyberSecurity Engineer – Cygne Noir Cyber",
    period: "Oct 2024 - Present",
    color: "#6c5ce7",
    skills: {
      // Programming & Development
      "Python": 0.95,
      "Python Flask": 0.8,
      "FastAPI": 0.7,
      "Python Qt5": 0.8,
      "JavaScript": 0.7,
      "HTML/CSS": 0.8,
      "Git/GitHub": 0.9,
      "VS Code": 0.9,
      "API Development": 0.7,
      
      // Cybersecurity & Penetration Testing
      "OWASP": 0.8,
      "Network Security": 0.85,
      "Risk Assessment": 0.75,
      
      // Cloud & Infrastructure
      "AWS": 0.8,
      "Docker/Docker Compose": 0.85,
      "Linux Administration": 0.9,
      "CI/CD": 0.6,
      "MongoDB": 0.7,
      "Azure": 0.5,
      "NIST Framework": 0.7,
      "MITRE ATT&CK": 0.7,
      "Wazuh": 0.8,
      "EDR & XDR":0.8,

      // AI & Machine Learning
      "RAG & Agentic AI": 0.9,
      "LLM (ChatGPT, Claude, LLama2)": 0.9,
      "LangChain/LangGraph": 0.8,
      "Prompt Engineering": 0.9,
      "RAG Ops": 0.8,
      "MCP": 0.85,
      "Vector Databases": 0.7,
      "OpenAI API": 0.75,
      "Anthropic Claude API": 0.6,
      "Knowledge Graphs": 0.8,
      "Chroma": 0.6,
      
      // Research & Documentation
      "Technical Documentation": 0.95,
      "Ontologies": 0.8,
      "LaTeX/TexStudio": 0.95,
      "Data Analysis": 0.7,
      "Pandas/NumPy": 0.7,
      
      // Tools & Collaboration
      "Project Management": 0.8,
      "Jira": 0.7,
      "Slack": 0.9,
      "Confluence": 0.6,
    }
  }
];

const skillGraphs = [
  {
    header: "Programming & Development",
    captions: [
      "Python",
      "Shell Scripting/Bash",
      "JavaScript",
      "C/C++/Java",
      "Python Flask",
      "FastAPI",
      "Python Qt5",
      "SQL",
      "HTML/CSS",
      "Git/GitHub",
      "VS Code",
      "API Development"
    ],
    values: [0.95, 0.85, 0.7, 0.3, 0.8, 0.7, 0.8, 0.7, 0.8, 0.9, 0.9, 0.7],
    color: "#6c5ce7"
  },
  {
    header: "Cybersecurity & Penetration Testing",
    captions: [
      "Nmap",
      "Wireshark",
      "Metasploit",
      "Burp Suite",
      "OWASP",
      "Vulnerability Assessment",
      "Penetration Testing",
      "OSINT",
      "Network Security",
      "NIST Framework",
      "MITRE ATT&CK",
      "Risk Assessment",
      "Wazuh",
      "EDR & XDR"
    ],
    values: [0.9, 0.85, 0.75, 0.9, 0.8, 0.85, 0.8, 0.75, 0.85, 0.7, 0.8, 0.75, 0.8, 0.8],
    color: "#ff6b6b"
  },
  {
    header: "Cloud & Infrastructure",
    captions: [
      "AWS",
      "Docker/Docker Compose",
      "Terraform",
      "Linux Administration",
      "Azure",
      "CI/CD",
      "Infrastructure as Code",
      "MongoDB",
    ],
    values: [0.8, 0.85, 0.8, 0.9, 0.5,  0.6, 0.7, 0.7],
    color: "#4ecdc4"
  },
  {
    header: "AI & Machine Learning",
    captions: [
      "LLM (ChatGPT, Claude, LLama2)",
      "RAG & Agentic AI",
      "LangChain/LangGraph",
      "Prompt Engineering",
      "RAG Ops",
      "MCP",
      "Vector Databases",
      "OpenAI API",
      "Anthropic Claude API",
      "Knowledge Graphs",
      "Chroma",
    ],
    values: [0.9, 0.9, 0.8, 0.9, 0.8, 0.85, 0.7, 0.75, 0.6, 0.8, 0.6],
    color: "#45b7d1"
  },
  {
    header: "Research & Documentation",
    captions: [
      "LaTeX/TexStudio",
      "Scientific Writing",
      "Technical Documentation",
      "Academic Writing",
      "Literature Review",
      "Research Methodology",
      "Ontologies",
      "Data Analysis",
      "Pandas/NumPy",
      "Jupyter Notebooks",
    ],
    values: [0.95, 0.9, 0.95, 0.85, 0.8, 0.8, 0.8, 0.7, 0.7, 0.8],
    color: "#48dbfb"
  },
  {
    header: "Tools & Collaboration",
    captions: [
      "Jira",
      "Confluence",
      "Slack",
      "Project Management"
    ],
    values: [0.6, 0.6, 0.9, 0.8],
    color: "#ff9ff3"
  }
];

// Custom Radar Chart Component
const RadarChart = ({ data, color, size = 300 }) => {
  const center = size / 2;
  const radius = (size / 2) - 40;
  const levels = 5;

  const angleStep = (2 * Math.PI) / data.labels.length;

  const polarToCartesian = (angle, r) => ({
    x: center + r * Math.cos(angle - Math.PI / 2),
    y: center + r * Math.sin(angle - Math.PI / 2)
  });

  const createGridPath = (level) => {
    const r = (radius * level) / levels;
    const points = data.labels.map((_, i) => {
      const angle = i * angleStep;
      return polarToCartesian(angle, r);
    });

    return `M ${points[0].x} ${points[0].y} ` +
      points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') +
      ' Z';
  };

  const createDataPath = () => {
    const points = data.values.map((value, i) => {
      const angle = i * angleStep;
      const r = (radius * value) / 100;
      return polarToCartesian(angle, r);
    });

    return `M ${points[0].x} ${points[0].y} ` +
      points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') +
      ' Z';
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        {/* Grid lines */}
        {[...Array(levels)].map((_, i) => (
          <path
            key={i}
            d={createGridPath(i + 1)}
            fill="none"
            stroke="#444"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}

        {/* Axis lines */}
        {data.labels.map((_, i) => {
          const angle = i * angleStep;
          const endPoint = polarToCartesian(angle, radius);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="#444"
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}

        {/* Data area */}
        <path
          d={createDataPath()}
          fill={`${color}40`}
          stroke={color}
          strokeWidth="2"
        />

        {/* Data points */}
        {data.values.map((value, i) => {
          const angle = i * angleStep;
          const r = (radius * value) / 100;
          const point = polarToCartesian(angle, r);
          return (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={color}
              stroke="#fff"
              strokeWidth="2"
            />
          );
        })}

        {/* Labels */}
        {data.labels.map((label, i) => {
          const angle = i * angleStep;
          const labelRadius = radius + 25;
          const point = polarToCartesian(angle, labelRadius);
          return (
            <text
              key={i}
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              fontSize="11"
              style={{ userSelect: 'none' }}
            >
              {label.length > 15 ? label.substring(0, 12) + '...' : label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// Enhanced D3.js Mindmap Component with Responsive Design
const MindmapChart = ({ skillSet }) => {
  const svgRef = useRef();
  const simulationRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Responsive container sizing with better defaults - LARGER SIZES
  const getResponsiveSize = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Define aspect ratio constraints (16:10 for comfortable viewing)
    const aspectRatio = 16 / 10;
    
    let width, height;
    
    if (screenWidth <= 480) {
      // Mobile
      width = Math.min(screenWidth * 0.9, 450);
      height = width / aspectRatio;
    } else if (screenWidth <= 768) {
      // Tablet
      width = Math.min(screenWidth * 0.85, 700);
      height = width / aspectRatio;
    } else if (screenWidth <= 1024) {
      // Small desktop
      width = Math.min(screenWidth * 0.8, 850);
      height = width / aspectRatio;
    } else {
      // Large desktop - much larger comfortable size
      width = Math.min(screenWidth * 0.75, 1000);
      height = width / aspectRatio;
    }
    
    // Ensure minimum size
    width = Math.max(width, 400);
    height = Math.max(height, 280);
    
    // Ensure it doesn't exceed viewport but allow more space
    height = Math.min(height, screenHeight * 0.65);
    
    return { width, height };
  };

  const [containerSize, setContainerSize] = useState(getResponsiveSize());

  // Update size on window resize
  useEffect(() => {
    const handleResize = () => {
      setContainerSize(getResponsiveSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!skillSet || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = containerSize.width;
    const height = containerSize.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create mindmap data structure
    const getSkillDerivation = (skillName) => {
      return experiences.map(exp => ({
        experience: exp.title.split(' – ')[0],
        period: exp.period,
        color: exp.color,
        contribution: exp.skills[skillName] || 0
      })).filter(item => item.contribution > 0);
    };

    // Central node - scale with container size
    const baseRadius = Math.min(width, height) * 0.05;
    const centralNode = {
      id: 'center',
      name: skillSet.header,
      fx: centerX,
      fy: centerY,
      type: 'center',
      color: skillSet.color,
      radius: baseRadius * zoomLevel
    };

    // Create nodes and links
    const nodes = [centralNode];
    const links = [];

    // Add skill nodes with responsive sizing
    skillSet.captions.forEach((skill, i) => {
      const skillNode = {
        id: `skill-${i}`,
        name: skill,
        type: 'skill',
        value: skillSet.values[i],
        color: skillSet.color,
        radius: (baseRadius * 0.7) * zoomLevel,
        skillIndex: i
      };
      nodes.push(skillNode);
      links.push({
        source: 'center',
        target: `skill-${i}`,
        type: 'skill-link',
        distance: Math.min(width, height) * 0.2 * zoomLevel
      });

      // Add experience nodes for each skill
      const derivations = getSkillDerivation(skill);
      derivations.forEach((exp, j) => {
        const expNode = {
          id: `exp-${i}-${j}`,
          name: exp.experience,
          period: exp.period,
          type: 'experience',
          contribution: exp.contribution,
          color: exp.color,
          radius: (baseRadius * 0.5) * zoomLevel,
          skillIndex: i,
          expIndex: j
        };
        nodes.push(expNode);
        links.push({
          source: `skill-${i}`,
          target: `exp-${i}-${j}`,
          type: 'exp-link',
          strength: exp.contribution,
          distance: Math.min(width, height) * 0.15 * zoomLevel
        });
      });
    });

    // Create SVG with zoom behavior
    svg.attr('width', width).attr('height', height);

    const zoomBehavior = d3.zoom()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    // Main container group
    const container = svg.append('g').attr('class', 'zoom-container');

    // Add definitions for gradients and filters
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter')
      .attr('id', `glow-${skillSet.header.replace(/\s+/g, '')}`)
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Create force simulation with responsive forces
    const baseForceStrength = Math.min(width, height) * 2;
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id(d => d.id)
        .distance(d => d.distance || (Math.min(width, height) * 0.18 * zoomLevel))
        .strength(0.6))
      .force('charge', d3.forceManyBody()
        .strength(d => {
          const strengthMultiplier = d.type === 'center' ? -1.5 :
            d.type === 'skill' ? -0.8 : -0.4;
          return baseForceStrength * strengthMultiplier * zoomLevel;
        }))
      .force('center', d3.forceCenter(centerX, centerY))
      .force('collision', d3.forceCollide()
        .radius(d => (d.radius + baseRadius * 0.6) * zoomLevel)
        .strength(0.9))
      .alpha(1)
      .alphaDecay(0.05);

    simulationRef.current = simulation;

    // Create link elements with ORIGINAL GOOD styling
    const linkElements = container.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', d => d.type === 'skill-link' ? skillSet.color : '#666')
      .attr('stroke-width', d => d.type === 'skill-link' ? 3 * zoomLevel : Math.max(1, d.strength * 5 * zoomLevel))
      .attr('stroke-opacity', 0.7)
      .attr('stroke-dasharray', d => d.type === 'exp-link' ? `${5 * zoomLevel},${5 * zoomLevel}` : 'none')
      .style('opacity', 0);

    // Animate links
    linkElements
      .transition()
      .duration(1000)
      .delay((d, i) => i * 30)
      .style('opacity', 1);

    // Create node groups
    const nodeElements = container.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .style('opacity', 0);

    // Add drag behavior
    const dragBehavior = d3.drag()
      .on('start', function (event, d) {
        if (!simulationRef.current) return;
        if (!event.active) simulationRef.current.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', function (event, d) {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', function (event, d) {
        if (!simulationRef.current) return;
        if (!event.active) simulationRef.current.alphaTarget(0);
        if (d.type !== 'center') {
          d.fx = null;
          d.fy = null;
        }
      });

    nodeElements.call(dragBehavior);

    // Add circles to nodes with ORIGINAL stroke width
    nodeElements.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2 * zoomLevel)
      .attr('filter', `url(#glow-${skillSet.header.replace(/\s+/g, '')})`)
      .style('opacity', d => d.type === 'center' ? 1 : 0.9);

    // Add improved labels with responsive font sizing
    const baseFontSize = Math.max(8, Math.min(width, height) * 0.025);
    nodeElements.each(function (d) {
      const node = d3.select(this);

      if (d.type === 'center') {
        node.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .attr('fill', '#fff')
          .attr('font-size', `${baseFontSize * 1.2 * zoomLevel}px`)
          .attr('font-weight', 'bold')
          .text(d.name.length > 12 ? d.name.substring(0, 10) + '...' : d.name);
      } else {
        // Create better spacing for labels
        const labelOffset = d.radius + (baseFontSize * 2 * zoomLevel);

        // Background for better text readability
        const textBg = node.append('rect')
          .attr('fill', 'rgba(0,0,0,0.8)')
          .attr('rx', Math.max(3, baseFontSize * 0.5 * zoomLevel))
          .attr('ry', Math.max(3, baseFontSize * 0.5 * zoomLevel))
          .attr('stroke', d.color)
          .attr('stroke-width', 1 * zoomLevel);

        const text = node.append('text')
          .attr('text-anchor', 'middle')
          .attr('fill', '#fff')
          .attr('font-size', `${(d.type === 'skill' ? baseFontSize : baseFontSize * 0.8) * zoomLevel}px`)
          .attr('font-weight', d.type === 'skill' ? 'bold' : 'normal');

        // Improved text wrapping with responsive character limits
        const words = d.name.split(' ');
        const maxChars = width < 500 ? (d.type === 'skill' ? 12 : 10) : (d.type === 'skill' ? 15 : 12);
        let lines = [];
        let currentLine = '';

        words.forEach(word => {
          if ((currentLine + word).length > maxChars && currentLine.length > 0) {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
          } else {
            currentLine += word + ' ';
          }
        });

        if (currentLine.trim()) {
          lines.push(currentLine.trim());
        }

        // Add text lines
        lines.forEach((line, i) => {
          text.append('tspan')
            .attr('x', 0)
            .attr('dy', i === 0 ? `-${labelOffset}px` : `${baseFontSize * 1.2 * zoomLevel}px`)
            .text(line);
        });

        // Update background size safely
        try {
          const bbox = text.node().getBBox();
          const padding = Math.max(3, baseFontSize * 0.5 * zoomLevel);
          textBg
            .attr('x', bbox.x - padding)
            .attr('y', bbox.y - padding / 2)
            .attr('width', bbox.width + (padding * 2))
            .attr('height', bbox.height + padding);
        } catch (e) {
          // Fallback
          const fallbackWidth = d.name.length * baseFontSize * 0.6 * zoomLevel;
          const fallbackHeight = baseFontSize * 1.5 * zoomLevel;
          textBg
            .attr('x', -fallbackWidth / 2)
            .attr('y', -labelOffset - fallbackHeight / 2)
            .attr('width', fallbackWidth)
            .attr('height', fallbackHeight);
        }
      }
    });

    nodeElements
      .on('mouseover', function (event, d) {
        if (!simulationRef.current) return;
        setHoveredNode(d.id);

        const connectedNodes = new Set();
        const connectedLinks = new Set();

        links.forEach(link => {
          if (link.source.id === d.id || link.target.id === d.id) {
            connectedNodes.add(link.source.id);
            connectedNodes.add(link.target.id);
            connectedLinks.add(link);
          }
        });

        // Dim non-connected elements
        nodeElements
          .style('opacity', node => connectedNodes.has(node.id) ? 1 : 0.2);

        linkElements
          .style('opacity', link => connectedLinks.has(link) ? 1 : 0.1);

        // Scale up hovered node
        const circle = d3.select(this).select('circle');
        if (circle.node()) {
          circle
            .transition()
            .duration(200)
            .attr('r', d.radius * 1.2)
            .attr('stroke-width', 4 * zoomLevel);
        }
      })
      .on('mouseout', function (event, d) {
        setHoveredNode(null);

        // Restore all elements
        nodeElements
          .style('opacity', node => node.type === 'center' ? 1 : 0.9);

        linkElements
          .style('opacity', 0.7);

        // Scale down node
        const circle = d3.select(this).select('circle');
        if (circle.node()) {
          circle
            .transition()
            .duration(200)
            .attr('r', d.radius)
            .attr('stroke-width', 2 * zoomLevel);
        }
      })
      .on('click', function (event, d) {
        // Add click ripple effect
        const ripple = d3.select(this)
          .append('circle')
          .attr('r', d.radius)
          .attr('fill', 'none')
          .attr('stroke', d.color)
          .attr('stroke-width', 3 * zoomLevel)
          .attr('opacity', 1);

        ripple
          .transition()
          .duration(600)
          .attr('r', d.radius * 2.5)
          .attr('opacity', 0)
          .on('end', function () {
            ripple.remove();
          });
      });

    // Animate nodes entrance
    nodeElements
      .transition()
      .duration(800)
      .delay((d, i) => i * 80)
      .style('opacity', d => d.type === 'center' ? 1 : 0.9);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      if (!svgRef.current) return;

      linkElements
        .attr('x1', d => d.source.x || 0)
        .attr('y1', d => d.source.y || 0)
        .attr('x2', d => d.target.x || 0)
        .attr('y2', d => d.target.y || 0);

      nodeElements
        .attr('transform', d => `translate(${d.x || 0}, ${d.y || 0})`);
    });

    // Add title with responsive font size
    const titleFontSize = Math.max(12, baseFontSize * 1.5);
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', titleFontSize * 1.5)
      .attr('text-anchor', 'middle')
      .attr('fill', skillSet.color)
      .attr('font-size', `${titleFontSize * Math.min(zoomLevel, 1.5)}px`)
      .attr('font-weight', 'bold')
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1);

    // Cleanup function
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
      }
      svg.selectAll('*').interrupt();
      setHoveredNode(null);
    };

  }, [skillSet, zoomLevel, containerSize]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.6));
  };

  const buttonSize = Math.max(30, Math.min(containerSize.width, containerSize.height) * 0.06);
  const buttonFontSize = Math.max(14, buttonSize * 0.5);

  return (
    <div className="mindmap-container">
      {/* Zoom Controls */}
      <div className="zoom-controls">
        <button
          onClick={handleZoomOut}
          className="zoom-button"
          style={{
            width: `${buttonSize}px`,
            height: `${buttonSize}px`,
            fontSize: `${buttonFontSize}px`
          }}
        >
          −
        </button>
        <button
          onClick={handleZoomIn}
          className="zoom-button"
          style={{
            width: `${buttonSize}px`,
            height: `${buttonSize}px`,
            fontSize: `${buttonFontSize}px`
          }}
        >
          +
        </button>
      </div>

      {/* Zoom Level Indicator */}
      <div 
        className="zoom-indicator"
        style={{
          fontSize: Math.max(10, buttonFontSize * 0.8) + 'px',
          borderColor: skillSet?.color || '#6c5ce7'
        }}
      >
        Zoom: {(zoomLevel * 100).toFixed(0)}%
      </div>

      {/* SVG Container */}
      <div className="svg-container">
        <svg
          ref={svgRef}
          className="mindmap-svg"
          style={{
            border: `1px solid ${skillSet?.color || '#6c5ce7'}40`
          }}
        />
      </div>

      {/* Interactive Hint */}
      {hoveredNode && (
        <div 
          className="interactive-hint"
          style={{
            fontSize: Math.max(9, buttonFontSize * 0.7) + 'px'
          }}
        >
          Drag nodes to rearrange • Use zoom controls to explore
        </div>
      )}
    </div>
  );
};

const Tech = () => {
  const [selectedSkillSet, setSelectedSkillSet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (skillSet) => {
    setSelectedSkillSet(skillSet);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSkillSet(null);
  };

  return (
    <div className="interactive-tech-skills">
      <div className="tech-skills-container">
        <h5 className="skills-subtitle">Skill I Aquired</h5>
        <h2 className="skills-title">My Skill Graphs</h2>

        <div className="graph-grid">
          {skillGraphs.map((skillSet, index) => {
            const data = {
              labels: skillSet.captions,
              values: skillSet.values.map((v) => v * 100),
            };

            return (
              <div
                key={index}
                className="skill-card"
                onClick={() => openModal(skillSet)}
                style={{ borderColor: `${skillSet.color}50` }}
              >
                <div className="skill-card-content">
                  <h3 className="skill-header" style={{ color: skillSet.color }}>
                    {skillSet.header}
                  </h3>
                  <p className="click-hint">Click to explore skill origins →</p>
                  <div style={{ height: '300px' }}>
                    <RadarChart data={data} color={skillSet.color} size={280} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && selectedSkillSet && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {selectedSkillSet.header} - Skill Development Journey
              </h3>
              <button className="close-button" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="derivation-content">
              <div className="chart-section">
                <h4 className="chart-title">Skill Development Network</h4>
                <div className="mindmap-wrapper">
                  <MindmapChart skillSet={selectedSkillSet} />
                </div>
              </div>

              <div className="chart-section">
                <h4 className="chart-title">Experience Timeline & Legend</h4>
                <div className="experience-legend">
                  {experiences.map((exp, idx) => (
                    <div key={idx} className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: exp.color }}
                      />
                      <div>
                        <div className="legend-text">{exp.title.split(' – ')[0]}</div>
                        <div className="legend-period">{exp.period}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="about-network">
                  <h5 className="about-title">About This Network</h5>
                  <p className="about-description">
                    This mindmap visualizes how each skill in <strong>{selectedSkillSet.header}</strong> was
                    developed through your professional experiences. The network shows:
                  </p>
                  <ul className="about-list">
                    <li><strong>Center:</strong> The skill category</li>
                    <li><strong>Inner Ring:</strong> Individual skills</li>
                    <li><strong>Outer Nodes:</strong> Contributing experiences</li>
                    <li><strong>Link Thickness:</strong> Contribution strength</li>
                    <li><strong>Zoom Controls:</strong> Use +/- buttons to expand/contract view</li>
                    <li><strong>Interactive:</strong> Drag nodes to rearrange the network</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tech;