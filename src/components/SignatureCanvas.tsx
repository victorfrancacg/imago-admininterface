import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, PencilBrush } from 'fabric';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface SignatureCanvasProps {
  label: string;
  onSignatureChange: (dataUrl: string | null) => void;
}

export function SignatureCanvas({ label, onSignatureChange }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = new FabricCanvas(canvasRef.current, { 
      width: 400, 
      height: 150, 
      backgroundColor: '#ffffff'
    });

    const brush = new PencilBrush(canvas);
    brush.color = '#1a1a2e';
    brush.width = 2;
    canvas.freeDrawingBrush = brush;
    canvas.isDrawingMode = true;

    canvas.on('path:created', () => onSignatureChange(canvas.toDataURL({ format: 'png', multiplier: 1 })));
    setFabricCanvas(canvas);
    
    return () => { canvas.dispose(); };
  }, []);

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#ffffff';
    fabricCanvas.renderAll();
    onSignatureChange(null);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          {label}
          <Button variant="ghost" size="sm" onClick={clearCanvas}><RotateCcw className="h-4 w-4 mr-1" />Limpar</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} className="w-full" />
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">Desenhe sua assinatura acima</p>
      </CardContent>
    </Card>
  );
}