import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Transformer } from 'react-konva';

const CANVAS_W = 800;
const CANVAS_H = 560;

const CanvasEditor = ({ activeTemplate, elements, setElements, selectedId, setSelectedId }) => {
  const [bgImage, setBgImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editPos, setEditPos] = useState({ x: 0, y: 0, width: 0, fontSize: 16 });
  const [editValue, setEditValue] = useState('');
  const stageRef = useRef(null);
  const trRef = useRef(null);
  const inputRef = useRef(null);

  // Load PNG background
  useEffect(() => {
    if (!activeTemplate?.background) return;
    const img = new window.Image();
    img.src = activeTemplate.background;
    img.onload = () => setBgImage(img);
    img.onerror = () => setBgImage(null);
  }, [activeTemplate]);

  // Transformer attach
  useEffect(() => {
    if (!trRef.current || !stageRef.current) return;
    if (selectedId) {
      const node = stageRef.current.findOne(`#${selectedId}`);
      if (node) { trRef.current.nodes([node]); trRef.current.getLayer()?.batchDraw(); }
    } else {
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId, elements]);

  useEffect(() => {
    if (editingId && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); }
  }, [editingId]);

  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) setSelectedId(null);
  };

  const handleDblClick = (el) => {
    const stageBox = stageRef.current?.container().getBoundingClientRect();
    if (!stageBox) return;
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
    setElements(prev => prev.map(el => el.id === editingId ? { ...el, content: editValue } : el));
    setEditingId(null);
    setSelectedId(editingId);
  };

  const handleDragEnd = (id, e) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, x: e.target.x(), y: e.target.y() } : el));
  };

  const handleImageDragEnd = (id, e) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, x: e.target.x(), y: e.target.y() } : el));
  };

  return (
    <div className="relative" style={{ width: CANVAS_W, height: CANVAS_H }}>
      <Stage ref={stageRef} width={CANVAS_W} height={CANVAS_H} onClick={handleStageClick}>
        <Layer>
          {/* PNG Background */}
          {bgImage && (
            <KonvaImage image={bgImage} x={0} y={0} width={CANVAS_W} height={CANVAS_H} listening={false} />
          )}

          {/* Elements — text + images */}
          {elements.map((el) => {
            if (el.type === 'text') {
              return (
                <Text
                  key={el.id} id={el.id}
                  x={el.x} y={el.y}
                  text={editingId === el.id ? '' : el.content}
                  fontSize={el.fontSize || 24}
                  fontFamily={el.fontFamily || 'DM Sans'}
                  fill={el.color || '#1A1A2E'}
                  fontStyle={[el.bold ? 'bold' : '', el.italic ? 'italic' : ''].filter(Boolean).join(' ') || 'normal'}
                  align={el.align || 'center'}
                  width={el.width || 400}
                  draggable
                  opacity={editingId === el.id ? 0 : 1}
                  onClick={() => setSelectedId(el.id)}
                  onDblClick={() => handleDblClick(el)}
                  onDragEnd={(e) => handleDragEnd(el.id, e)}
                />
              );
            }
            if (el.type === 'image' && el.imageObj) {
              return (
                <KonvaImage
                  key={el.id} id={el.id}
                  image={el.imageObj}
                  x={el.x} y={el.y}
                  width={el.width || 100}
                  height={el.height || 100}
                  draggable
                  onClick={() => setSelectedId(el.id)}
                  onDragEnd={(e) => handleImageDragEnd(el.id, e)}
                />
              );
            }
            return null;
          })}

          <Transformer ref={trRef} rotateEnabled={false}
            boundBoxFunc={(_, newBox) => newBox}
            onTransformEnd={(e) => {
              const node = e.target;
              const id = node.id();
              setElements(prev => prev.map(el => el.id === id ? {
                ...el,
                x: node.x(), y: node.y(),
                width: Math.max(50, node.width() * node.scaleX()),
                height: el.type === 'image' ? Math.max(20, node.height() * node.scaleY()) : el.height,
              } : el));
              node.scaleX(1); node.scaleY(1);
            }}
          />
        </Layer>
      </Stage>

      {/* Inline text editor */}
      {editingId && (
        <textarea
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit(); }
            if (e.key === 'Escape') setEditingId(null);
          }}
          style={{
            position: 'fixed', left: editPos.x, top: editPos.y,
            width: editPos.width, fontSize: editPos.fontSize,
            fontFamily: 'DM Sans, sans-serif',
            border: '2px solid #7C5CBF', borderRadius: '6px',
            padding: '4px 8px', background: 'rgba(255,255,255,0.97)',
            color: '#1A1A2E', outline: 'none', resize: 'none',
            zIndex: 9999, lineHeight: 1.3,
            boxShadow: '0 4px 20px rgba(124,92,191,0.25)',
            minHeight: editPos.fontSize * 1.8,
          }}
          rows={1}
        />
      )}
    </div>
  );
};

export default CanvasEditor;