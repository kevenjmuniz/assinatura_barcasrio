
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Signature } from "@/pages/Index";
import { Save, RefreshCw, X } from "lucide-react";

interface SignatureEditorProps {
  signature: Signature;
  onSave: (updatedSignature: Signature) => void;
  onCancel: () => void;
}

export const SignatureEditor = ({ signature, onSave, onCancel }: SignatureEditorProps) => {
  const [name, setName] = useState(signature.name);
  const [role, setRole] = useState(signature.role);
  const [department, setDepartment] = useState(signature.department);
  const [phone, setPhone] = useState(signature.phone || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const templateImage = "/lovable-uploads/5de7e180-9ee3-4d58-beed-a2a422ea0f9a.png";
  
  useEffect(() => {
    const img = new Image();
    img.src = templateImage;
    img.onload = () => {
      setIsImageLoaded(true);
    };
  }, [templateImage]);

  useEffect(() => {
    if (isImageLoaded) {
      renderSignature();
    }
  }, [name, role, department, phone, isImageLoaded]);

  const renderSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 829;
    canvas.height = 414;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.src = templateImage;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.font = "bold 48px Oswald";
    ctx.fillStyle = "#005C6E";
    ctx.textAlign = "left";
    
    const nameY = 150;
    const roleY = 180;
    const departmentY = 208;
    const phoneY = 235;

    if (name) {
      ctx.fillText(name, 75, nameY);
    }

    ctx.font = "600 27px Montserrat";
    ctx.fillStyle = "#F08B2E";
    
    if (role) {
      ctx.fillText(role, 75, roleY);
    }

    ctx.font = "600 22px Montserrat";
    
    if (department) {
      ctx.fillText(department, 75, departmentY);
    }
    
    if (phone) {
      ctx.font = "600 22px Montserrat";
      ctx.fillText(phone, 75, phoneY);
    }

    const linkX = 520;
    const linkY = 230;
    const linkWidth = 150;
    const linkHeight = 20;

    canvas.setAttribute('data-link-x', linkX.toString());
    canvas.setAttribute('data-link-y', linkY.toString());
    canvas.setAttribute('data-link-width', linkWidth.toString());
    canvas.setAttribute('data-link-height', linkHeight.toString());
  };

  const handleSave = () => {
    if (!name || !role || !department) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, preencha todos os campos obrigatórios para gerar a assinatura.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      try {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 400;
        tempCanvas.height = 200;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (!tempCtx) {
          throw new Error("Could not get temporary canvas context");
        }
        
        tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 400, 200);
        
        const dataUrl = tempCanvas.toDataURL("image/png");
        
        const updatedSignature: Signature = {
          ...signature,
          name,
          role,
          department,
          phone,
          imageUrl: dataUrl,
          date: new Date().toISOString()
        };
        
        onSave(updatedSignature);
        
        toast({
          title: "Assinatura atualizada",
          description: "A assinatura foi atualizada com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro ao atualizar assinatura",
          description: "Ocorreu um erro ao gerar a imagem. Tente novamente.",
          variant: "destructive",
        });
        console.error("Error generating signature:", error);
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Editar Assinatura</CardTitle>
              <CardDescription>Modifique os dados da assinatura</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome Completo <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-name"
                  placeholder="Digite o nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="font-montserrat"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-role">Cargo <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-role"
                  placeholder="Digite o cargo"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="font-montserrat"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-department">Setor <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-department"
                  placeholder="Digite o setor"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="font-montserrat"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Telefone | Ramal <span className="text-gray-400 text-sm">(opcional)</span></Label>
                <Input
                  id="edit-phone"
                  placeholder="Digite o telefone ou ramal"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="font-montserrat"
                />
              </div>
            </div>

            <div>
              <div className="bg-gray-50 p-4 rounded-md h-full flex flex-col">
                <h3 className="text-sm font-medium mb-3 text-gray-500">Visualização</h3>
                <div className="flex-1 flex items-center justify-center bg-white rounded p-2 mb-3 overflow-hidden">
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-auto shadow-md rounded-sm"
                  />
                  
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Esta é uma visualização da assinatura atualizada
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isGenerating || !name || !role || !department}
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar Alterações
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
