'use client';

import { useState } from 'react';
import { CockpitShell } from '@/components/cockpit/CockpitShell';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Plus, Filter } from 'lucide-react';
import { BackButton } from '@/components/BackButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslations } from '@/lib/useTranslations';

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslations();

  return (
    <CockpitShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <BackButton />
            <div className="flex items-center gap-4 mt-2">
              <h1 className="text-3xl font-bold">{t.nav.decisions || 'Décisions Stratégiques'}</h1>
              <LanguageSwitcher />
            </div>
            <p className="text-muted-foreground">
              Gérez les décisions clés de votre portefeuille
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t.common.new || 'Nouveau'} {t.nav.decisions || 'Décision'}
          </Button>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {t.common.filter || 'Filtrer'}
          </Button>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                {t.common.loading || 'Chargement...'}
              </CardContent>
            </Card>
          ) : decisions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Aucune décision enregistrée. Créez votre première décision.
              </CardContent>
            </Card>
          ) : (
            decisions.map((decision) => (
              <Card key={decision.id}>
                <CardHeader>
                  <h3 className="text-lg font-semibold">{decision.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {decision.description}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </CockpitShell>
  );
}
