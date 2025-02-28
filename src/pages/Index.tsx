
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Download, RefreshCw, RefreshCcw } from "lucide-react";

const Index = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [userCaptchaInput, setUserCaptchaInput] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captchaRef = useRef<HTMLCanvasElement>(null);
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

  // Função para gerar um CAPTCHA aleatório
  const generateCaptcha = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setCaptchaValue(result);
    setUserCaptchaInput("");
    
    // Renderiza o CAPTCHA no canvas
    const canvas = captchaRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar o fundo
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Definir o estilo do texto
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#334155";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Adicionar ruído (linhas)
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = "#94a3b8";
      ctx.stroke();
    }
    
    // Desenhar o texto com caracteres ligeiramente rotacionados
    for (let i = 0; i < result.length; i++) {
      ctx.save();
      ctx.translate(30 + i * 25, canvas.height / 2);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(result[i], 0, 0);
      ctx.restore();
    }
    
    // Adicionar mais ruído (pontos)
    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, Math.PI * 2);
      ctx.fillStyle = "#94a3b8";
      ctx.fill();
    }
  };

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
    
    // Position name text - Ajustado com base na imagem de referência para perfeito alinhamento com o logotipo
    if (name) {
      ctx.fillText(name, 48, 118); // Ajustado para baixo para alinhar com o logotipo
    }

    // Set text styles for role - 27px per requirements
    ctx.font = "600 27px Montserrat";
    ctx.fillStyle = "#F08B2E";
    
    // Position role text - Mantendo a proporção visual com o nome
    if (role) {
      ctx.fillText(role, 48, 173); // Ajustado proporcionalmente à nova posição do nome
    }

    // Set text styles for department - 22px per requirements
    ctx.font = "600 22px Montserrat";
    
    // Position department text - Mantendo a proporção visual com o cargo
    if (department) {
      ctx.fillText(department, 48, 203); // Ajustado proporcionalmente à nova posição do cargo
    }
  };

  const handleProceedToDownload = () => {
    if (!name || !role || !department) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, preencha todos os campos para gerar a assinatura.",
        variant: "destructive",
      });
      return;
    }

    setShowCaptcha(true);
    generateCaptcha();
  };

  const handleVerifyCaptcha = () => {
    if (userCaptchaInput === captchaValue) {
      // CAPTCHA correto, prosseguir com o download
      setShowCaptcha(false);
      handleDownload();
    } else {
      // CAPTCHA incorreto
      toast({
        title: "CAPTCHA incorreto",
        description: "O código digitado não corresponde à imagem. Tente novamente.",
        variant: "destructive",
      });
      generateCaptcha();
    }
  };

  const handleDownload = () => {
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
    setShowCaptcha(false);
    
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
                  placeholder="Digite seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="font-montserrat"
                  disabled={showCaptcha}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role" className="font-montserrat">Cargo</Label>
                <Input
                  id="role"
                  placeholder="Digite seu cargo"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="font-montserrat"
                  disabled={showCaptcha}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department" className="font-montserrat">Setor</Label>
                <Input
                  id="department"
                  placeholder="Digite seu setor"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="font-montserrat"
                  disabled={showCaptcha}
                />
              </div>
              
              {!showCaptcha ? (
                <div className="flex space-x-3 pt-4">
                  <Button 
                    onClick={handleProceedToDownload} 
                    className="flex-1 bg-barcas-teal hover:bg-barcas-teal/90 text-white font-montserrat"
                    disabled={!name || !role || !department}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Assinatura
                  </Button>
                  
                  <Button 
                    onClick={handleReset} 
                    variant="outline" 
                    className="font-montserrat border-gray-300"
                  >
                    Limpar
                  </Button>
                </div>
              ) : (
                <div className="mt-4 space-y-4 animate-fade-in">
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                    <div className="text-center mb-3">
                      <h3 className="font-montserrat font-semibold text-gray-700">Verificação de Segurança</h3>
                      <p className="text-sm text-gray-500">Digite os caracteres que você vê na imagem abaixo</p>
                    </div>
                    
                    <div className="flex justify-center mb-3">
                      <div className="relative">
                        <canvas 
                          ref={captchaRef} 
                          width="200" 
                          height="70" 
                          className="border border-gray-300 rounded-md"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute -right-2 -top-2 h-8 w-8 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-100"
                          onClick={generateCaptcha}
                        >
                          <RefreshCcw className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                    
                    <Input
                      placeholder="Digite o código"
                      className="mb-3 font-montserrat text-center tracking-wider"
                      value={userCaptchaInput}
                      onChange={(e) => setUserCaptchaInput(e.target.value)}
                    />
                    
                    <div className="flex space-x-3">
                      <Button 
                        onClick={handleVerifyCaptcha} 
                        className="flex-1 bg-barcas-teal hover:bg-barcas-teal/90 text-white font-montserrat"
                        disabled={!userCaptchaInput}
                      >
                        Verificar e Baixar
                      </Button>
                      
                      <Button 
                        onClick={() => setShowCaptcha(false)} 
                        variant="outline" 
                        className="font-montserrat border-gray-300"
                      >
                        Voltar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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
          <p>Gerador de Assinaturas de E-mail • <a href="https://barcasrio.com.br" target="_blank" rel="noopener noreferrer" className="text-barcas-teal hover:underline">Barcas Rio</a></p>
        </div>
      </div>
    </div>
  );
};

export default Index;
