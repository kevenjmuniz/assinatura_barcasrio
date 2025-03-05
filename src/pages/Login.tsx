
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { login, isAuthenticated } from "@/utils/auth";
import { Lock, User } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // If already authenticated, redirect to admin
  if (isAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (login(username, password)) {
      toast({
        title: "Login bem-sucedido",
        description: "Você foi autenticado como administrador.",
      });
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } else {
      toast({
        title: "Falha na autenticação",
        description: "Usuário ou senha incorretos.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0EA5E9]/90 to-[#0891B2]/90 flex items-center justify-center p-4">
      {/* Background image with blur */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
        style={{ 
          backgroundImage: `url("/lovable-uploads/d9d25600-5406-439d-bc1a-0af1236d0cf3.png")`,
          filter: 'blur(5px)',
          opacity: 0.8,
          transform: 'scale(1.1)' // Prevent blur edges
        }}
      ></div>
      
      {/* Overlay to ensure contrast */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0EA5E9]/70 to-[#0891B2]/80"></div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-white/95 backdrop-blur-sm border-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Acesso Administrativo</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o painel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="username"
                    className="pl-10"
                    placeholder="Digite seu nome de usuário" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="password"
                    type="password" 
                    className="pl-10"
                    placeholder="Digite sua senha" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Autenticando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
