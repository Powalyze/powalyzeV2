'use client';

import { useState, useEffect } from 'react';
import { CockpitShell } from '@/components/cockpit/CockpitShell';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Plus, Filter, Calendar, User, AlertCircle, CheckCircle2, Clock, X, Save } from 'lucide-react';
import { BackButton } from '@/components/BackButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslations } from '@/lib/useTranslations';
import { getDemoData, Decision } from '@/lib/cockpitData';

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'validated' | 'late'>('all');
  const { t } = useTranslations();

  const [newDecision, setNewDecision] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    origin: '',
    committee: '',
    owner: '',
    impact: 'medium' as 'high' | 'medium' | 'low',
    status: 'pending' as 'pending' | 'validated' | 'late',
    deadline: '',
  });

  useEffect(() => {
    // Charger les données démo
    const data = getDemoData();
    setDecisions(data.decisions);
    setLoading(false);
  }, []);

  const handleCreateDecision = () => {
    const decision: Decision = {
      id: String(decisions.length + 1),
      ...newDecision,
      source: 'real'
    };
    setDecisions([...decisions, decision]);
    setShowModal(false);
    setNewDecision({
      title: '',
      date: new Date().toISOString().split('T')[0],
      origin: '',
      committee: '',
      owner: '',
      impact: 'medium',
      status: 'pending',
      deadline: '',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validated': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-orange-500" />;
      case 'late': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'validated': return t.decisions?.validated || 'Validée';
      case 'pending': return t.decisions?.pending || 'En attente';
      case 'late': return t.decisions?.late || 'En retard';
      default: return status;
    }
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      high: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
      medium: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200',
      low: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    };
    return colors[impact as keyof typeof colors] || colors.medium;
  };

  const filteredDecisions = decisions.filter(d => 
    filterStatus === 'all' || d.status === filterStatus
  );

  const stats = {
    total: decisions.length,
    pending: decisions.filter(d => d.status === 'pending').length,
    validated: decisions.filter(d => d.status === 'validated').length,
    late: decisions.filter(d => d.status === 'late').length,
  };

  return (
    <CockpitShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <BackButton />
            <div className="flex items-center gap-4 mt-2">
              <h1 className="text-3xl font-bold">{t.decisions?.title || 'Décisions Stratégiques'}</h1>
              <LanguageSwitcher />
            </div>
            <p className="text-muted-foreground">
              {t.decisions?.title || 'Gérez les décisions clés de votre portefeuille'}
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t.decisions?.createNew || 'Nouvelle décision'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-500">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">{t.decisions?.pending || 'En attente'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-500">{stats.validated}</div>
              <div className="text-sm text-muted-foreground">{t.decisions?.validated || 'Validées'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-500">{stats.late}</div>
              <div className="text-sm text-muted-foreground">{t.decisions?.late || 'En retard'}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <div className="flex gap-2">
          {(['all', 'pending', 'validated', 'late'] as const).map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'Toutes' : getStatusLabel(status)}
            </Button>
          ))}
        </div>

        {/* Liste des décisions */}
        <div className="grid gap-4">
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                {t.common?.loading || 'Chargement...'}
              </CardContent>
            </Card>
          ) : filteredDecisions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                {t.decisions?.empty || 'Aucune décision enregistrée'}
              </CardContent>
            </Card>
          ) : (
            filteredDecisions.map((decision) => (
              <Card key={decision.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{decision.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {decision.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {decision.owner}
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(decision.status)}
                          <span>{getStatusLabel(decision.status)}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getImpactBadge(decision.impact)}`}>
                      Impact: {decision.impact}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-muted-foreground">Origine</div>
                      <div>{decision.origin}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">Comité</div>
                      <div>{decision.committee}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">Échéance</div>
                      <div>{decision.deadline || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">Responsable</div>
                      <div>{decision.owner}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Modal de création */}
        {showModal && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40" 
              onClick={() => setShowModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{t.decisions?.createNew || 'Nouvelle décision'}</h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Titre *</label>
                    <input
                      type="text"
                      value={newDecision.title}
                      onChange={(e) => setNewDecision({ ...newDecision, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Ex: Choix du nouveau fournisseur cloud"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Date</label>
                      <input
                        type="date"
                        value={newDecision.date}
                        onChange={(e) => setNewDecision({ ...newDecision, date: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Échéance</label>
                      <input
                        type="date"
                        value={newDecision.deadline}
                        onChange={(e) => setNewDecision({ ...newDecision, deadline: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Origine</label>
                      <input
                        type="text"
                        value={newDecision.origin}
                        onChange={(e) => setNewDecision({ ...newDecision, origin: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Ex: COMEX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Comité</label>
                      <input
                        type="text"
                        value={newDecision.committee}
                        onChange={(e) => setNewDecision({ ...newDecision, committee: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Ex: Stratégique"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Responsable</label>
                    <input
                      type="text"
                      value={newDecision.owner}
                      onChange={(e) => setNewDecision({ ...newDecision, owner: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Ex: CTO"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Impact</label>
                      <select
                        value={newDecision.impact}
                        onChange={(e) => setNewDecision({ ...newDecision, impact: e.target.value as any })}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="low">Faible</option>
                        <option value="medium">Moyen</option>
                        <option value="high">Élevé</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Statut</label>
                      <select
                        value={newDecision.status}
                        onChange={(e) => setNewDecision({ ...newDecision, status: e.target.value as any })}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="pending">En attente</option>
                        <option value="validated">Validée</option>
                        <option value="late">En retard</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleCreateDecision}
                      disabled={!newDecision.title}
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {t.common?.save || 'Enregistrer'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowModal(false)}
                      className="flex-1"
                    >
                      {t.common?.cancel || 'Annuler'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </CockpitShell>
  );
}
