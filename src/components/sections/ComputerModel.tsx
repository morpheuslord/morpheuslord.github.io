import { useEffect, useRef, useState } from 'react';
import './computerModel.css';

const ComputerModel = () => {
  const computerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const computerElement = computerRef.current;
    const container = containerRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !container || !computerElement) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate rotation based on mouse position relative to center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Convert to rotation values (adjust sensitivity)
      const rotationY = (deltaX / rect.width) * 180;
      const rotationX = -(deltaY / rect.height) * 180;

      // Clamp values to reasonable ranges
      const clampedX = Math.max(-90, Math.min(90, rotationX));
      const clampedY = Math.max(-180, Math.min(180, rotationY));

      computerElement.style.transform = `rotatex(${clampedX}deg) rotatey(${clampedY}deg)`;
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      handleMouseMove(e);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // Add event listeners
    if (container) {
      container.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousedown", handleMouseDown);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div ref={containerRef} style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: isDragging ? 'grabbing' : 'grab'
    }}>

      <div className="computer" ref={computerRef}>
        <div className="screen">
          <div className="front square"></div>
          <div className="back square"></div>
          <div className="top square"></div>
          <div className="left square">
            {/* Enhanced Screen Content */}
            <div style={{
              position: 'absolute',
              top: '12%',
              left: '8%',
              width: '84%',
              height: '76%',
              background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
              borderRadius: '2px',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 20px rgba(0, 255, 136, 0.08)'
            }}>
              {/* Terminal Lines */}
              <div style={{
                position: 'absolute',
                top: '15%',
                left: '10%',
                width: '80%',
                fontSize: '4px',
                fontFamily: 'monospace',
                color: '#4EC456',
                textShadow: '0 0 3px rgba(78, 196, 86, 0.5)',
                lineHeight: '1.8'
              }}>
                <div style={{ opacity: 0.9 }}>$ npm run dev</div>
                <div style={{ opacity: 0.7 }}>✓ Ready in 1.2s</div>
                <div style={{ opacity: 0.8, marginTop: '2px' }}>
                  <span style={{ color: '#00d9ff' }}>→</span> Local: <span style={{ color: '#fff' }}>localhost</span>
                </div>
              </div>
              {/* Blinking Cursor */}
              <div style={{
                position: 'absolute',
                bottom: '20%',
                left: '10%',
                width: '3px',
                height: '6px',
                background: '#4EC456',
                boxShadow: '0 0 4px #4EC456',
                animation: 'cursorBlink 1s step-end infinite'
              }}></div>
              {/* Scanlines Overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 3px)',
                pointerEvents: 'none'
              }}></div>
              {/* Screen Glare */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, transparent 100%)',
                pointerEvents: 'none'
              }}></div>
            </div>
            <div className="progressbar"></div>
          </div>
          <div className="right square">
            <div className="intake"></div>
            <div className="intake"></div>
            <div className="intake"></div>
            <div className="intake"></div>
            <div className="intake"></div>
            <div className="intake"></div>
            <div className="intake"></div>
            <div className="intake"></div>
            <div className="intake"></div>
            <div className="intake"></div>
          </div>
          <div className="left1 square"></div>
          <div className="back1 square"></div>
          <div className="front1 square"></div>
          <div className="bottom1 square"></div>
          <div className="top1 square"></div>
        </div>
        <div className="screenbottom">
          <div className="front2 square">
            {/* Front Panel Details */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60%',
              height: '3px',
              background: 'linear-gradient(90deg, #b8a898, #d4c7b8, #b8a898)',
              borderRadius: '1px'
            }}></div>
          </div>
          <div className="top2 square"></div>
          <div className="left2 square">
            <div className="brownpart">
              <div className="disc"></div>
              {/* Power LED */}
              <div style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '4px',
                height: '4px',
                background: '#4EC456',
                borderRadius: '50%',
                boxShadow: '0 0 4px #4EC456, 0 0 8px rgba(78, 196, 86, 0.5)',
                animation: 'discPulse 2s ease-in-out infinite'
              }}></div>
              {/* Secondary LED */}
              <div style={{
                position: 'absolute',
                right: '25px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '3px',
                height: '3px',
                background: '#ff6b35',
                borderRadius: '50%',
                boxShadow: '0 0 3px #ff6b35',
                opacity: 0.8
              }}></div>
            </div>
            {/* Drive Button */}
            <div style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '8px',
              height: '8px',
              background: 'linear-gradient(180deg, #a09080 0%, #8a7a6a 100%)',
              borderRadius: '2px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)'
            }}></div>
          </div>
          <div className="right2 square"></div>
          <div className="back2 square"></div>
          <div className="bottom2 square"></div>
        </div>
        <div className="screenbottombottom">
          <div className="front3 square">
            {/* Brand Label */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '3px',
              fontFamily: 'monospace',
              color: '#8a7a6a',
              letterSpacing: '1px',
              fontWeight: 'bold'
            }}>RETRO</div>
          </div>
          <div className="left3 square"></div>
          <div className="right3 square"></div>
          <div className="bottom3 square"></div>
          <div className="back3 square"></div>
        </div>
        <div className="keyboard">
          <div className="front4 square"></div>
          <div className="back4 square"></div>
          <div className="top4 square">
            {/* Keyboard Keys Grid */}
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '5%',
              width: '90%',
              height: '70%',
              display: 'grid',
              gridTemplateColumns: 'repeat(10, 1fr)',
              gridTemplateRows: 'repeat(4, 1fr)',
              gap: '1px'
            }}>
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} style={{
                  background: 'linear-gradient(180deg, #7a6a5a 0%, #5d4d3d 100%)',
                  borderRadius: '0.5px',
                  boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.15)'
                }}></div>
              ))}
            </div>
          </div>
          <div className="left4 square"></div>
          <div className="right4 square"></div>
          <div className="bottom4 square"></div>
        </div>
        <div className="keyboardkeys">
          <div className="front5 square"></div>
          <div className="back5 square"></div>
          <div className="top5 square">
            {/* Function Keys */}
            <div style={{
              position: 'absolute',
              top: '20%',
              left: '8%',
              width: '84%',
              height: '60%',
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gridTemplateRows: 'repeat(2, 1fr)',
              gap: '1px'
            }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{
                  background: 'linear-gradient(180deg, #8a7a6a 0%, #6a5a4a 100%)',
                  borderRadius: '0.5px',
                  boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.1)'
                }}></div>
              ))}
            </div>
          </div>
          <div className="left5 square"></div>
          <div className="right5 square"></div>
          <div className="bottom5 square"></div>
        </div>
        <div className="numpad">
          <div className="front6 square"></div>
          <div className="back6 square"></div>
          <div className="top6 square">
            {/* Numpad Keys */}
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '10%',
              width: '80%',
              height: '70%',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(3, 1fr)',
              gap: '1px'
            }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{
                  background: 'linear-gradient(180deg, #8a7a6a 0%, #6a5a4a 100%)',
                  borderRadius: '0.5px',
                  boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.12)'
                }}></div>
              ))}
            </div>
          </div>
          <div className="left6 square"></div>
          <div className="right6 square"></div>
          <div className="bottom6 square"></div>
        </div>

        {/* Mouse - New Addition */}
        <div style={{
          position: 'absolute',
          width: '20px',
          height: '12px',
          transformStyle: 'preserve-3d',
          transform: 'translateY(175px) translateX(50px) translateZ(30px)'
        }}>
          {/* Mouse Top */}
          <div style={{
            position: 'absolute',
            width: '20px',
            height: '30px',
            background: 'linear-gradient(180deg, #e8ddd0 0%, #d4c7b8 100%)',
            transform: 'rotatex(90deg) translatez(6px)',
            borderRadius: '10px 10px 5px 5px'
          }}></div>
          {/* Mouse Button */}
          <div style={{
            position: 'absolute',
            width: '8px',
            height: '12px',
            background: '#c6b5a4',
            transform: 'rotatex(90deg) translatez(6px) translateY(-5px) translateX(6px)',
            borderRadius: '2px 2px 0 0'
          }}></div>
          {/* Mouse Cable */}
          <div style={{
            position: 'absolute',
            width: '2px',
            height: '25px',
            background: 'linear-gradient(90deg, #4a4a4a, #5a5a5a, #4a4a4a)',
            transform: 'rotatex(90deg) translatez(6px) translateY(-25px) translateX(9px)',
            borderRadius: '1px'
          }}></div>
        </div>
      </div>

      {/* CSS for cursor blink animation */}
      <style>{`
        @keyframes cursorBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div >
  );
};

export default ComputerModel;
