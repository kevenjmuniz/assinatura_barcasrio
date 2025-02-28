
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Download, RefreshCw } from "lucide-react";

const Index = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const templateImage = "/lovable-uploads/28030f02-72f4-4cb3-8411-0c70005973c3.png";
  
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
  }, [name, role, department, isImageLoaded]);

  const renderSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match the template image
    canvas.width = 829;
    canvas.height = 414;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the template image
    const img = new Image();
    img.src = templateImage;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Set text styles for name - 48px per requirements
    ctx.font = "bold 48px Oswald";
    ctx.fillStyle = "#005C6E";
    ctx.textAlign = "left";
    
    // Position name text
    if (name) {
      ctx.fillText(name, 48, 110);
    }

    // Set text styles for role - 27px per requirements
    ctx.font = "600 27px Montserrat";
    ctx.fillStyle = "#F08B2E";
    
    // Position role text - Ajustado para ficar mais próximo do nome
    if (role) {
      ctx.fillText(role, 48, 165);
    }

    // Set text styles for department - 22px per requirements
    ctx.font = "600 22px Montserrat";
    
    // Position department text - Ajustado para ficar mais próximo do cargo
    if (department) {
      ctx.fillText(department, 48, 195);
    }
  };

  const handleDownload = () => {
    if (!name || !role || !department) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, preencha todos os campos para gerar a assinatura.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      try {
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `assinatura-${name.toLowerCase().replace(/\s+/g, "-")}.png`;
        link.href = dataUrl;
        link.click();
        
        toast({
          title: "Assinatura gerada com sucesso!",
          description: "A imagem foi baixada para o seu dispositivo.",
        });
      } catch (error) {
        toast({
          title: "Erro ao gerar assinatura",
          description: "Ocorreu um erro ao gerar a imagem. Tente novamente.",
          variant: "destructive",
        });
        console.error("Error generating signature:", error);
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  const handleReset = () => {
    setName("");
    setRole("");
    setDepartment("");
    
    toast({
      title: "Campos resetados",
      description: "Preencha novamente para gerar uma nova assinatura.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
      <div className="max-w-4xl w-full mx-auto">
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-3xl font-oswald font-bold text-barcas-teal mb-2">Gerador de Assinaturas</h1>
          <p className="text-gray-600 font-montserrat">
            Crie sua assinatura de e-mail personalizada preenchendo os campos abaixo
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 shadow-md border border-gray-100 bg-white animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-xl font-oswald font-bold text-barcas-teal mb-4">Informações Pessoais</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-montserrat">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Ex: Weverton Amorim"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="font-montserrat"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role" className="font-montserrat">Cargo</Label>
                <Input
                  id="role"
                  placeholder="Ex: Gerente de RH"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="font-montserrat"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department" className="font-montserrat">Setor</Label>
                <Input
                  id="department"
                  placeholder="Ex: Recursos Humanos"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="font-montserrat"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={handleDownload} 
                  className="flex-1 bg-barcas-teal hover:bg-barcas-teal/90 text-white font-montserrat"
                  disabled={isGenerating || !name || !role || !department}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Baixar Assinatura
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleReset} 
                  variant="outline" 
                  className="font-montserrat border-gray-300"
                >
                  Limpar
                </Button>
              </div>
            </div>
          </Card>
          
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Card className="p-6 shadow-md border border-gray-100 bg-white h-full flex flex-col">
              <h2 className="text-xl font-oswald font-bold text-barcas-teal mb-4">Visualização</h2>
              
              <div 
                className="flex-1 flex items-center justify-center bg-gray-50 rounded-md p-2 overflow-hidden"
                ref={signatureRef}
              >
                <div className="relative w-full max-w-[600px]">
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-auto shadow-md rounded-sm"
                  />
                  
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
                    </div>
                  )}
                  
                  {isImageLoaded && !name && !role && !department && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                      <p className="text-gray-500 font-montserrat text-sm text-center px-4">
                        Preencha os campos ao lado para visualizar sua assinatura
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500 font-montserrat">
                  Esta é uma visualização da sua assinatura. Preencha todos os campos para baixar a imagem final.
                </p>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-10 text-center text-gray-500 text-sm font-montserrat animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <p>Gerador de Assinaturas de E-mail • Barcas Rio</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
