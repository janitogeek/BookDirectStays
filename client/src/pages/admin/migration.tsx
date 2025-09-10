import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { migrationProcessor } from '@/lib/migration-processor';

interface MigrationStats {
  totalSubmissions: number;
  processedSubmissions: number;
  createdSlugs: number;
  errors: string[];
}

export default function MigrationAdmin() {
  const [isRunning, setIsRunning] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [migrationStats, setMigrationStats] = useState<MigrationStats | null>(null);
  const [migrationStatus, setMigrationStatus] = useState<{ needsMigration: boolean; reason: string } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const checkMigrationStatus = async () => {
    setIsChecking(true);
    try {
      addLog('Checking migration status...');
      const status = await migrationProcessor.getMigrationStatus();
      setMigrationStatus(status);
      addLog(`Status check complete: ${status.reason}`);
    } catch (error) {
      addLog(`Error checking status: ${error}`);
    } finally {
      setIsChecking(false);
    }
  };

  const runMigration = async () => {
    setIsRunning(true);
    setMigrationStats(null);
    setLogs([]);
    
    try {
      addLog('🚀 Starting migration of all existing submissions...');
      
      // Override console.log to capture logs
      const originalLog = console.log;
      console.log = (...args) => {
        addLog(args.join(' '));
        originalLog(...args);
      };
      
      const stats = await migrationProcessor.processAllExistingSubmissions();
      setMigrationStats(stats);
      
      // Restore console.log
      console.log = originalLog;
      
      if (stats.errors.length === 0) {
        addLog('✅ Migration completed successfully!');
      } else {
        addLog(`⚠️ Migration completed with ${stats.errors.length} errors`);
      }
      
    } catch (error) {
      addLog(`❌ Migration failed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Submission Migration Admin
          </h1>
          <p className="text-gray-600">
            Process all existing Airtable submissions to integrate them properly into the system
          </p>
        </div>

        {/* Status Check Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Migration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center mb-4">
              <Button 
                onClick={checkMigrationStatus}
                disabled={isChecking}
                variant="outline"
              >
                {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Check Status
              </Button>
              
              {migrationStatus && (
                <Badge 
                  variant={migrationStatus.needsMigration ? "destructive" : "default"}
                  className="flex items-center gap-1"
                >
                  {migrationStatus.needsMigration ? (
                    <AlertTriangle className="w-3 h-3" />
                  ) : (
                    <CheckCircle className="w-3 h-3" />
                  )}
                  {migrationStatus.needsMigration ? 'Migration Needed' : 'Up to Date'}
                </Badge>
              )}
            </div>
            
            {migrationStatus && (
              <Alert>
                <AlertDescription>
                  {migrationStatus.reason}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Migration Control Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Run Migration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Alert className="mb-4">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  <strong>Important:</strong> This will process ALL existing submissions in Airtable and may take several minutes. 
                  It will clear all caches and regenerate the entire directory structure.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={runMigration}
                disabled={isRunning}
                className="w-full"
                size="lg"
              >
                {isRunning && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isRunning ? 'Processing Migration...' : 'Run Full Migration'}
              </Button>
            </div>
            
            {migrationStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{migrationStats.totalSubmissions}</div>
                  <div className="text-sm text-gray-600">Total Submissions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{migrationStats.processedSubmissions}</div>
                  <div className="text-sm text-gray-600">Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{migrationStats.createdSlugs}</div>
                  <div className="text-sm text-gray-600">Unique Slugs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{migrationStats.errors.length}</div>
                  <div className="text-sm text-gray-600">Errors</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logs Card */}
        {logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Migration Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
