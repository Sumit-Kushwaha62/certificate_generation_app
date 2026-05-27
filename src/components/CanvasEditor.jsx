import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Transformer } from 'react-konva';
import { svgToDataURL } from '../utils/svgToDataURL';
import ReactDOMServer from 'react-dom/server';

const CANVAS_W = 800;
const CANVAS_H = 560;

const CanvasEditor = ({ activeTemplate, elements, setElements, selectedId, setSelectedId }) => {
  const [bgImage, setBgImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editPos, setEditPos] = useState({ x: 0, y: 0, width: 0 });
  const [editValue, setEditValue] = useState('');
  const stageRef = useRef(null);
  const trRef = useRef(null);
  const inputRef = useRef(null);

  // Load background SVG as image whenever template changes
  useEffect(() => {
    if (!activeTemplate) return;
    const Component = activeTemplate.component;
    const svgString = ReactDOMServer.renderToString(<Component />);
    // Wrap in proper SVG if not already
    const fullSvg = svgString.startsWith('<svg') ? svgString :
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560" width="800" height="560">${svgString}</svg>`;

    svgToDataURL(fullSvg, CANVAS_W, CANVAS_H).then((dataURL) => {
      const img = new window.Image();
      img.src = dataURL;
      img.onload = () => setBgImage(img);
    }).catch(() => {
      // fallback — blank bg
      setBgImage(null);
    });
  }, [activeTemplate]);

  // Attach transformer to selected node
  useEffect(() => {
    if (!trRef.current || !stageRef.current) return;
    if (selectedId) {
      const node = stageRef.current.findOne(`#${selectedId}`);
      if (node) {
        trRef.current.nodes([node]);
        trRef.current.getLayer()?.batchDraw();
      }
    } else {
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId, elements]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  const handleElementClick = (id) => {
    setSelectedId(id);
  };

  const handleDblClick = (el) => {
    const node = stageRef.current?.findOne(`#${el.id}`);
    if (!node) return;

    const stageBox = stageRef.current.container().getBoundingClientRect();
    const scale = stageBox.width / CANVAS_W;

    setEditPos({
      x: stageBox.left + el.x * scale,
      y: stageBox.top + el.y * scale,
      width: (el.width || 300) * scale,
      fontSize: (el.fontSize || 24) * scale,
    });
    setEditValue(el.content);
    setEditingId(el.id);
    setSelectedId(null);
  };

  const commitEdit = () => {
    if (!editingId) return;
    setElements((prev) =>
      prev.map((el) => el.id === editingId ? { ...el, content: editValue } : el)
    );
    setEditingId(null);
    setSelectedId(editingId);
  };

  const handleDragEnd = (id, e) => {
    setElements((prev) =>
      prev.map((el) => el.id === id ? { ...el, x: e.target.x(), y: e.target.y() } : el)
    );
  };

  return (
    <div className="relative" style={{ width: CANVAS_W, height: CANVAS_H }}>
      <Stage
        ref={stageRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onClick={handleStageClick}
      >
        <Layer>
          {/* Background template image */}
          {bgImage && (
            <KonvaImage
              image={bgImage}
              x={0} y={0}
              width={CANVAS_W}
              height={CANVAS_H}
              listening={false}
            />
          )}

          {/* Editable elements */}
          {elements.map((el) => {
            if (el.type === 'text') {
              return (
                <Text
                  key={el.id}
                  id={el.id}
                  x={el.x}
                  y={el.y}
                  text={editingId === el.id ? '' : el.content}
                  fontSize={el.fontSize || 24}
                  fontFamily={el.fontFamily || 'DM Sans'}
                  fill={el.color || '#1A1A2E'}
                  fontStyle={`${el.bold ? 'bold' : 'normal'} ${el.italic ? 'italic' : ''}`}
                  align={el.align || 'center'}
                  width={el.width || 400}
                  draggable
                  onClick={() => handleElementClick(el.id)}
                  onDblClick={() => handleDblClick(el)}
                  onDragEnd={(e) => handleDragEnd(el.id, e)}
                  opacity={editingId === el.id ? 0 : 1}
                />
              );
            }
            return null;
          })}

          <Transformer
            ref={trRef}
            rotateEnabled={false}
            boundBoxFunc={(oldBox, newBox) => newBox}
          />
        </Layer>
      </Stage>

      {/* Floating inline text editor */}
      {editingId && (
        <textarea
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit(); }
            if (e.key === 'Escape') { setEditingId(null); }
          }}
          style={{
            position: 'fixed',
            left: editPos.x,
            top: editPos.y,
            width: editPos.width,
            fontSize: editPos.fontSize,
            fontFamily: 'DM Sans, sans-serif',
            border: '2px solid #7C5CBF',
            borderRadius: '6px',
            padding: '4px 8px',
            background: 'rgba(255,255,255,0.95)',
            color: '#1A1A2E',
            outline: 'none',
            resize: 'none',
            zIndex: 9999,
            lineHeight: 1.3,
            boxShadow: '0 4px 20px rgba(124,92,191,0.3)',
            minHeight: editPos.fontSize * 1.6,
          }}
          rows={1}
        />
      )}
    </div>
  );
};

export default CanvasEditor;