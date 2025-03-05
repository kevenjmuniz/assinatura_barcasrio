
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { 
  Trash2, 
  ArrowLeft, 
  Search, 
  SortAsc, 
  SortDesc, 
  Download,
  Eye,
  LogOut,
  Edit,
  DownloadCloud,
  LayoutDashboard,
  List
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Signature } from "./Index";
import { logout } from "@/utils/auth";
import { AdminDashboard } from "@/components/AdminDashboard";
import { SignatureEditor } from "@/components/SignatureEditor";

const Admin = () => {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [filteredSignatures, setFilteredSignatures] = useState<Signature[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedSignature, setSelectedSignature] = useState<Signature | null>(null);
  const [editingSignature, setEditingSignature] = useState<Signature | null>(null);
  const [view, setView] = useState<"list" | "dashboard">("list");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedSignatures = localStorage.getItem("signatures");
      if (storedSignatures) {
        const parsedSignatures: Signature[] = JSON.parse(storedSignatures);
        setSignatures(parsedSignatures);
        setFilteredSignatures(parsedSignatures);
      }
    } catch (error) {
      console.error("Erro ao carregar assinaturas:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as assinaturas salvas.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSignatures(signatures);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = signatures.filter(
        (sig) =>
          sig.name.toLowerCase().includes(lowercaseQuery) ||
          sig.role.toLowerCase().includes(lowercaseQuery) ||
          sig.department.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredSignatures(filtered);
    }
  }, [searchQuery, signatures]);

  const handleSort = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    
    const sorted = [...filteredSignatures].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return newDirection === "asc" ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredSignatures(sorted);
  };

  const handleDelete = (id: string) => {
    try {
      const updatedSignatures = signatures.filter((sig) => sig.id !== id);
      setSignatures(updatedSignatures);
      setFilteredSignatures(
        filteredSignatures.filter((sig) => sig.id !== id)
      );
      
      localStorage.setItem("signatures", JSON.stringify(updatedSignatures));
      
      toast({
        title: "Assinatura removida",
        description: "A assinatura foi removida com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover a assinatura.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (signature: Signature) => {
    if (!signature.imageUrl) {
      toast({
        title: "Erro ao baixar",
        description: "A imagem da assinatura não está disponível.",
        variant: "destructive",
      });
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = signature.imageUrl;
      link.download = `assinatura-${signature.name.toLowerCase().replace(/\s+/g, "-")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download iniciado",
        description: "A assinatura está sendo baixada para seu dispositivo.",
      });
    } catch (error) {
      toast({
        title: "Erro ao baixar",
        description: "Não foi possível baixar a assinatura.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDownload = () => {
    if (filteredSignatures.length === 0) {
      toast({
        title: "Nenhuma assinatura disponível",
        description: "Não há assinaturas para baixar.",
        variant: "destructive",
      });
      return;
    }

    // Create a zip file or bulk download
    try {
      let downloadCount = 0;
      
      filteredSignatures.forEach((signature, index) => {
        if (signature.imageUrl) {
          setTimeout(() => {
            const link = document.createElement("a");
            link.href = signature.imageUrl!;
            link.download = `assinatura-${signature.name.toLowerCase().replace(/\s+/g, "-")}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            downloadCount++;
          }, index * 300); // Staggered downloads to prevent browser issues
        }
      });
      
      toast({
        title: "Downloads iniciados",
        description: `Baixando ${filteredSignatures.length} assinaturas. Verifique sua pasta de downloads.`,
      });
    } catch (error) {
      toast({
        title: "Erro no download em massa",
        description: "Ocorreu um problema ao baixar as assinaturas.",
        variant: "destructive",
      });
    }
  };

  const handleEditSave = (updatedSignature: Signature) => {
    try {
      const updatedSignatures = signatures.map(sig => 
        sig.id === updatedSignature.id ? updatedSignature : sig
      );
      
      setSignatures(updatedSignatures);
      setFilteredSignatures(
        filteredSignatures.map(sig => 
          sig.id === updatedSignature.id ? updatedSignature : sig
        )
      );
      
      localStorage.setItem("signatures", JSON.stringify(updatedSignatures));
      
      setEditingSignature(null);
      
      toast({
        title: "Assinatura atualizada",
        description: "A assinatura foi atualizada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a assinatura.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do painel administrativo.",
    });
    navigate("/login");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0EA5E9]/90 to-[#0891B2]/90 p-6">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
        style={{ 
          backgroundImage: `url("/lovable-uploads/d9d25600-5406-439d-bc1a-0af1236d0cf3.png")`,
          filter: 'blur(5px)',
          opacity: 0.8,
          transform: 'scale(1.1)' // Prevent blur edges
        }}
      ></div>
      
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0EA5E9]/70 to-[#0891B2]/80"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/">
              <Button variant="outline" className="mr-4 bg-white/20 text-white hover:bg-white/30">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-3xl font-oswald font-bold text-white">
              Painel de Administração
            </h1>
          </div>
          <Button 
            variant="outline" 
            className="bg-white/20 text-white hover:bg-white/30"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>

        <div className="flex justify-end mb-4 space-x-2">
          <Button
            variant={view === "dashboard" ? "default" : "outline"}
            className={view === "dashboard" ? "bg-white text-blue-600" : "bg-white/20 text-white hover:bg-white/30"}
            onClick={() => setView("dashboard")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          
          <Button
            variant={view === "list" ? "default" : "outline"}
            className={view === "list" ? "bg-white text-blue-600" : "bg-white/20 text-white hover:bg-white/30"}
            onClick={() => setView("list")}
          >
            <List className="mr-2 h-4 w-4" />
            Listagem
          </Button>
        </div>

        {view === "dashboard" && (
          <AdminDashboard signatures={signatures} />
        )}

        {view === "list" && (
          <Card className="bg-white/95 backdrop-blur-sm border-white/10 mb-6">
            <CardHeader>
              <CardTitle>Assinaturas Emitidas</CardTitle>
              <CardDescription>
                Visualize e gerencie todas as assinaturas geradas pelo sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-2 mb-6">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar por nome, cargo ou setor..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={handleSort}
                  >
                    {sortDirection === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                    Data
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={handleBulkDownload}
                    disabled={filteredSignatures.length === 0}
                  >
                    <DownloadCloud className="h-4 w-4" />
                    <span className="hidden sm:inline">Baixar Todas</span>
                  </Button>
                </div>
              </div>

              {filteredSignatures.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  {signatures.length === 0
                    ? "Nenhuma assinatura foi gerada ainda."
                    : "Nenhuma assinatura corresponde à pesquisa."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 text-left text-sm font-medium text-gray-700">Nome</th>
                        <th className="py-3 text-left text-sm font-medium text-gray-700">Cargo</th>
                        <th className="py-3 text-left text-sm font-medium text-gray-700 hidden md:table-cell">Setor</th>
                        <th className="py-3 text-left text-sm font-medium text-gray-700 hidden lg:table-cell">Telefone</th>
                        <th className="py-3 text-left text-sm font-medium text-gray-700 hidden sm:table-cell">Data</th>
                        <th className="py-3 text-right text-sm font-medium text-gray-700">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSignatures.map((signature) => (
                        <tr
                          key={signature.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 text-sm text-gray-900">{signature.name}</td>
                          <td className="py-3 text-sm text-gray-900">{signature.role}</td>
                          <td className="py-3 text-sm text-gray-900 hidden md:table-cell">{signature.department}</td>
                          <td className="py-3 text-sm text-gray-900 hidden lg:table-cell">{signature.phone || "-"}</td>
                          <td className="py-3 text-sm text-gray-900 hidden sm:table-cell">{formatDate(signature.date)}</td>
                          <td className="py-3 text-right space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setSelectedSignature(signature)}
                              title="Visualizar"
                            >
                              <Eye className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setEditingSignature(signature)}
                              title="Editar"
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => signature.imageUrl && handleDownload(signature)}
                              disabled={!signature.imageUrl}
                              title="Baixar"
                            >
                              <Download className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleDelete(signature.id)}
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {selectedSignature && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <Card className="max-w-2xl w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{selectedSignature.name}</CardTitle>
                  <CardDescription>
                    {selectedSignature.role} - {selectedSignature.department}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setSelectedSignature(null)}
                >
                  ✕
                </Button>
              </CardHeader>
              <CardContent>
                {selectedSignature.imageUrl ? (
                  <div className="bg-gray-100 p-2 rounded">
                    <img
                      src={selectedSignature.imageUrl}
                      alt={`Assinatura de ${selectedSignature.name}`}
                      className="w-full h-auto shadow-md rounded border border-gray-200"
                    />
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    Imagem não disponível
                  </div>
                )}
                
                <div className="mt-4 flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Gerada em: {formatDate(selectedSignature.date)}
                    </p>
                    {selectedSignature.phone && (
                      <p className="text-sm text-gray-500">
                        Telefone: {selectedSignature.phone}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSignature(null);
                        setEditingSignature(selectedSignature);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(selectedSignature)}
                      disabled={!selectedSignature.imageUrl}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        handleDelete(selectedSignature.id);
                        setSelectedSignature(null);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remover
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {editingSignature && (
          <SignatureEditor 
            signature={editingSignature}
            onSave={handleEditSave}
            onCancel={() => setEditingSignature(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;
