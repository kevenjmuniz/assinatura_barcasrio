
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { RefreshCcw } from 'lucide-react';

interface DatabaseState {
  connected: boolean;
  message: string;
  lastChecked: Date | null;
}

const DatabaseStatus = () => {
  const [dbStatus, setDbStatus] = useState<DatabaseState>({
    connected: false,
    message: 'Verificando status do banco de dados...',
    lastChecked: null
  });
  const [loading, setLoading] = useState(false);

  const checkDatabaseStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/healthcheck');
      const data = await response.json();
      
      setDbStatus({
        connected: data.connected,
        message: data.message,
        lastChecked: new Date()
      });

      if (data.connected) {
        toast({
          title: 'Banco de dados conectado',
          description: 'A conexão com o PostgreSQL está funcionando corretamente',
          variant: 'default'
        });
      } else {
        toast({
          title: 'Falha na conexão com o banco',
          description: data.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      setDbStatus({
        connected: false,
        message: `Erro ao verificar o banco: ${error instanceof Error ? error.message : String(error)}`,
        lastChecked: new Date()
      });
      
      toast({
        title: 'Erro na verificação',
        description: 'Não foi possível verificar a conexão com o banco de dados',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  return (
    <div className="flex items-center space-x-2 bg-white/95 p-3 rounded-md shadow-sm">
      <div 
        className={`h-3 w-3 rounded-full ${dbStatus.connected ? 'bg-green-500' : 'bg-red-500'}`} 
        title={dbStatus.connected ? 'Conectado' : 'Desconectado'}
      />
      <div className="flex-1">
        <p className="text-sm font-medium">
          {dbStatus.connected ? 'PostgreSQL Conectado' : 'PostgreSQL Desconectado'}
        </p>
        <p className="text-xs text-gray-500 truncate max-w-[250px]" title={dbStatus.message}>
          {dbStatus.lastChecked 
            ? `Última verificação: ${dbStatus.lastChecked.toLocaleTimeString()}` 
            : 'Verificando...'}
        </p>
      </div>
      <Button 
        size="sm" 
        variant="outline" 
        className="h-8 px-2"
        onClick={checkDatabaseStatus}
        disabled={loading}
      >
        <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};

export default DatabaseStatus;
