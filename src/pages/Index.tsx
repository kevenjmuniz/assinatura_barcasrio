import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Download, RefreshCw, RefreshCcw, UserCog } from "lucide-react";
import { Link } from "react-router-dom";

export interface Signature {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  date: string;
  imageUrl?: string;
}

const Index = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [userCaptchaInput, setUserCaptchaInput] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captchaRef = useRef<HTMLCanvasElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const templateImage = "/lovable-uploads/5de7e180-9ee3-4d58-beed-a2a422ea0f9a.png";
  const backgroundImage = "/lovable-uploads/d9d25600-5406-439d-bc1a-0af1236d0cf3.png";
  
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

  const generateCaptcha = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setCaptchaValue(result);
    setUserCaptchaInput("");
    
    const canvas = captchaRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#334155";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = "#94a3b8";
      ctx.stroke();
    }
    
    for (let i = 0; i < result.length; i++) {
      ctx.save();
      ctx.translate(30 + i * 25, canvas.height / 2);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(result[i], 0, 0);
      ctx.restore();
    }
    
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
    
    if (!canvas.onclick) {
      canvas.onclick = (event) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        
        const linkX = parseInt(canvas.getAttribute('data-link-x') || '0');
        const linkY = parseInt(canvas.getAttribute('data-link-y') || '0');
        const linkWidth = parseInt(canvas.getAttribute('data-link-width') || '0');
        const linkHeight = parseInt(canvas.getAttribute('data-link-height') || '0');
        
        if (
          x >= linkX && 
          x <= linkX + linkWidth && 
          y >= linkY - linkHeight && 
          y <= linkY
        ) {
          window.open('https://barcasrio.com.br', '_blank');
        }
      };
      
      canvas.onmousemove = (event) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        
        const linkX = parseInt(canvas.getAttribute('data-link-x') || '0');
        const linkY = parseInt(canvas.getAttribute('data-link-y') || '0');
        const linkWidth = parseInt(canvas.getAttribute('data-link-width') || '0');
        const linkHeight = parseInt(canvas.getAttribute('data-link-height') || '0');
        
        if (
          x >= linkX && 
          x <= linkX + linkWidth && 
          y >= linkY - linkHeight && 
          y <= linkY
        ) {
          canvas.style.cursor = 'pointer';
        } else {
          canvas.style.cursor = 'default';
        }
      };
    }
  };

  const handleProceedToDownload = () => {
    if (!name || !role || !department) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, preencha todos os campos obrigatórios para gerar a assinatura.",
        variant: "destructive",
      });
      return;
    }

    setShowCaptcha(true);
    generateCaptcha();
  };

  const handleVerifyCaptcha = () => {
    if (userCaptchaInput === captchaValue) {
      setShowCaptcha(false);
      handleDownload();
    } else {
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
        
        saveSignature(dataUrl);
        
        toast({
          title: "Assinatura gerada com sucesso!",
          description: "A imagem foi baixada para o seu dispositivo e registrada no sistema.",
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

  const saveSignature = (imageUrl: string) => {
    try {
      const id = `sig_${Date.now()}`;
      
      const signature: Signature = {
        id,
        name,
        role,
        department,
        phone,
        date: new Date().toISOString(),
        imageUrl
      };
      
      const existingSignaturesJson = localStorage.getItem('signatures');
      const existingSignatures: Signature[] = existingSignaturesJson 
        ? JSON.parse(existingSignaturesJson) 
        : [];
      
      existingSignatures.push(signature);
      localStorage.setItem('signatures', JSON.stringify(existingSignatures));
      
      console.log('Assinatura salva com sucesso:', signature);
      
    } catch (error) {
      console.error('Erro ao salvar assinatura:', error);
    }
  };

  const handleReset = () => {
    setName("");
    setRole("");
    setDepartment("");
    setPhone("");
    setShowCaptcha(false);
    
    toast({
      title: "Campos resetados",
      description: "Preencha novamente para gerar uma nova assinatura.",
    });
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          filter: 'blur(5px)',
          opacity: 0.8,
          transform: 'scale(1.1)' // Prevent blur edges
        }}
      ></div>
      
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0EA5E9]/60 to-[#0891B2]/70"></div>

      <div className="max-w-4xl w-full mx-auto relative z-10">
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-3xl font-oswald font-bold text-white mb-2">Gerador de Assinaturas</h1>
          <p className="text-white/90 font-montserrat">
            Crie sua assinatura de e-mail personalizada preenchendo os campos abaixo
          </p>
        </div>

        <div className="absolute top-0 right-0 p-4">
          <Link to="/admin">
            <Button variant="outline" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
              <UserCog className="mr-2 h-4 w-4" />
              Painel Admin
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 shadow-md border border-white/10 bg-white/95 backdrop-blur-sm animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-xl font-oswald font-bold text-barcas-teal mb-4">Informações Pessoais</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-montserrat">Nome Completo <span className="text-red-500">*</span></Label>
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
                <Label htmlFor="role" className="font-montserrat">Cargo <span className="text-red-500">*</span></Label>
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
                <Label htmlFor="department" className="font-montserrat">Setor <span className="text-red-500">*</span></Label>
                <Input
                  id="department"
                  placeholder="Digite seu setor"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="font-montserrat"
                  disabled={showCaptcha}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-montserrat">Telefone | Ramal <span className="text-gray-400 text-sm">(opcional)</span></Label>
                <Input
                  id="phone"
                  placeholder="Digite seu telefone ou ramal"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
            <Card className="p-6 shadow-md border border-white/10 bg-white/95 backdrop-blur-sm h-full flex flex-col">
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
                  Esta é uma visualização da sua assinatura. Preencha todos os campos obrigatórios para baixar a imagem final.
                </p>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-10 text-center text-white/90 text-sm font-montserrat animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <p>Gerador de Assinaturas de E-mail • <a href="https://barcasrio.com.br" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Barcas Rio</a></p>
        </div>
      </div>
    </div>
  );
};

export default Index;
