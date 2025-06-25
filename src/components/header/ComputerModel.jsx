// Original ComputerModel with Cursor Control - No Buttons
import React, { useEffect, useRef, useState } from 'react';
import './computerModel.css';

const ComputerModel = () => {
  const computerRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const computerElement = computerRef.current;
    const container = containerRef.current;

    const handleMouseMove = (e) => {
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

    const handleMouseDown = (e) => {
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
      height: '50vh',
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
          <div className="front2 square"></div>
          <div className="top2 square"></div>
          <div className="left2 square">
            <div className="brownpart">
              <div className="disc"></div>
            </div>
          </div>
          <div className="right2 square"></div>
          <div className="back2 square"></div>
          <div className="bottom2 square"></div>
        </div>
        <div className="screenbottombottom">
          <div className="front3 square"></div>
          <div className="left3 square"></div>
          <div className="right3 square"></div>
          <div className="bottom3 square"></div>
          <div className="back3 square"></div>
        </div>
        <div className="keyboard">
          <div className="front4 square"></div>
          <div className="back4 square"></div>
          <div className="top4 square"></div>
          <div className="left4 square"></div>
          <div className="right4 square"></div>
          <div className="bottom4 square"></div>
        </div>
        <div className="keyboardkeys">
          <div className="front5 square"></div>
          <div className="back5 square"></div>
          <div className="top5 square"></div>
          <div className="left5 square"></div>
          <div className="right5 square"></div>
          <div className="bottom5 square"></div>
        </div>
        <div className="numpad">
          <div className="front6 square"></div>
          <div className="back6 square"></div>
          <div className="top6 square"></div>
          <div className="left6 square"></div>
          <div className="right6 square"></div>
          <div className="bottom6 square"></div>
        </div>
      </div>
    </div>
  );
};

export default ComputerModel;