'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Webhook, Trash2, Plus, AlertCircle, CheckCircle, XCircle, Activity } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const AVAILABLE_EVENTS = [
  { name: 'project.created', category: 'project', label: 'Projet créé' },
  { name: 'project.updated', category: 'project', label: 'Projet mis à jour' },
  { name: 'project.status_changed', category: 'project', label: 'Statut projet changé' },
  { name: 'risk.created', category: 'risk', label: 'Risque créé' },
  { name: 'risk.escalated', category: 'risk', label: 'Risque escaladé' },
  { name: 'risk.resolved', category: 'risk', label: 'Risque résolu' },
  { name: 'decision.created', category: 'decision', label: 'Décision créée' },
  { name: 'decision.approved', category: 'decision', label: 'Décision approuvée' },
  { name: 'report.generated', category: 'report', label: 'Rapport généré' },
  { name: 'resource.overallocated', category: 'resource', label: 'Ressource sur-allouée' },
  { name: 'sprint.completed', category: 'agile', label: 'Sprint terminé' },
]

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [webhookStats, setWebhookStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[]
  })
  const { toast } = useToast()

  const supabase = createClient()

  useEffect(() => {
    fetchWebhooks()
    checkPlan()
  }, [])

  async function checkPlan() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .maybeSingle()

    setIsDemo(profile?.plan === 'demo')
  }

  async function fetchWebhooks() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile) return

      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setWebhooks(data || [])

      // Fetch stats
      const { data: stats } = await supabase
        .rpc('get_webhook_stats', {
          p_organization_id: profile.organization_id,
          p_period_days: 30
        })

      setWebhookStats(stats)
    } catch (err: any) {
      console.error('Error fetching webhooks:', err)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les webhooks',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  async function createWebhook() {
    if (!newWebhook.name.trim() || !newWebhook.url.trim() || newWebhook.events.length === 0) {
      toast({
        title: 'Erreur',
        description: 'Tous les champs sont requis',
        variant: 'destructive'
      })
      return
    }

    if (!newWebhook.url.startsWith('http://') && !newWebhook.url.startsWith('https://')) {
      toast({
        title: 'Erreur',
        description: 'L\'URL doit commencer par http:// ou https://',
        variant: 'destructive'
      })
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile) return

      // Generate secret
      const secret = `whsec_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`

      const { data, error } = await supabase
        .from('webhooks')
        .insert({
          organization_id: profile.organization_id,
          name: newWebhook.name,
          url: newWebhook.url,
          secret: secret,
          events: newWebhook.events,
          is_active: true,
          created_by: user.id
        })
        .select()
        .maybeSingle()

      if (error) throw error

      setNewWebhook({ name: '', url: '', events: [] })
      setShowCreateModal(false)
      fetchWebhooks()

      toast({
        title: 'Webhook créé',
        description: 'Le webhook a été créé avec succès'
      })
    } catch (err: any) {
      console.error('Error creating webhook:', err)
      toast({
        title: 'Erreur',
        description: err.message || 'Impossible de créer le webhook',
        variant: 'destructive'
      })
    }
  }

  async function deleteWebhook(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce webhook ? Cette action est irréversible.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', id)

      if (error) throw error

      fetchWebhooks()
      toast({
        title: 'Webhook supprimé',
        description: 'Le webhook a été supprimé avec succès'
      })
    } catch (err: any) {
      console.error('Error deleting webhook:', err)
      toast({
        title: 'Erreur',
        description: err.message || 'Impossible de supprimer le webhook',
        variant: 'destructive'
      })
    }
  }

  async function toggleWebhook(id: string, isActive: boolean) {
    try {
      const { error } = await supabase
        .from('webhooks')
        .update({ is_active: !isActive })
        .eq('id', id)

      if (error) throw error

      fetchWebhooks()
      toast({
        title: isActive ? 'Webhook désactivé' : 'Webhook activé',
        description: 'Le statut du webhook a été mis à jour'
      })
    } catch (err: any) {
      console.error('Error toggling webhook:', err)
      toast({
        title: 'Erreur',
        description: err.message || 'Impossible de modifier le webhook',
        variant: 'destructive'
      })
    }
  }

  if (isDemo) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Webhooks</h1>
            <p className="text-muted-foreground">
              Recevez des notifications en temps réel sur les événements de votre portefeuille
            </p>
          </div>

          <Card className="p-8 text-center border-2 border-dashed">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Fonctionnalité Pro</h3>
            <p className="text-muted-foreground mb-4">
              Les webhooks sont disponibles uniquement dans les plans Pro et Enterprise.
            </p>
            <Button onClick={() => window.location.href = '/pricing'}>
              Passer en Pro
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Webhooks</h1>
            <p className="text-muted-foreground">
              Recevez des notifications en temps réel sur les événements de votre portefeuille
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau webhook
          </Button>
        </div>

        {/* Stats */}
        {webhookStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total déclenchements</span>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{webhookStats.total_triggers}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Succès</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-500">{webhookStats.successful_triggers}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Échecs</span>
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-500">{webhookStats.failed_triggers}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Taux de succès</span>
              </div>
              <p className="text-2xl font-bold">{webhookStats.success_rate || 0}%</p>
            </Card>
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <Card className="mb-6 p-6 border-2">
            <h3 className="text-lg font-semibold mb-4">Créer un nouveau webhook</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nom du webhook</label>
                <Input
                  placeholder="Ex: Jira Integration, Slack Notifications..."
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">URL de destination</label>
                <Input
                  placeholder="https://your-domain.com/webhook"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  L'URL doit être accessible publiquement et accepter des requêtes POST
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Événements écoutés</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {AVAILABLE_EVENTS.map(event => (
                    <label key={event.name} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newWebhook.events.includes(event.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewWebhook({ ...newWebhook, events: [...newWebhook.events, event.name] })
                          } else {
                            setNewWebhook({ ...newWebhook, events: newWebhook.events.filter(ev => ev !== event.name) })
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{event.label}</span>
                      <Badge variant="outline" className="text-xs">{event.category}</Badge>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                  setShowCreateModal(false)
                  setNewWebhook({ name: '', url: '', events: [] })
                }}>
                  Annuler
                </Button>
                <Button onClick={createWebhook}>
                  Créer le webhook
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Webhooks List */}
        <div className="space-y-4">
          {loading ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Chargement...</p>
            </Card>
          ) : webhooks.length === 0 ? (
            <Card className="p-8 text-center border-2 border-dashed">
              <Webhook className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Aucun webhook</h3>
              <p className="text-muted-foreground mb-4">
                Créez votre premier webhook pour recevoir des notifications en temps réel
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un webhook
              </Button>
            </Card>
          ) : (
            webhooks.map(webhook => (
              <Card key={webhook.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{webhook.name}</h3>
                      {webhook.is_active ? (
                        <Badge variant="default" className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {webhook.url}
                      </code>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {webhook.events.map((event: string) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {AVAILABLE_EVENTS.find(e => e.name === event)?.label || event}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Créé le {new Date(webhook.created_at).toLocaleDateString('fr-FR')}</span>
                      {webhook.last_triggered_at && (
                        <span>Dernier déclenchement: {new Date(webhook.last_triggered_at).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleWebhook(webhook.id, webhook.is_active)}
                    >
                      {webhook.is_active ? 'Désactiver' : 'Activer'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteWebhook(webhook.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Documentation */}
        <Card className="mt-8 p-6 bg-muted/50">
          <h3 className="text-lg font-semibold mb-4">Exemple de payload webhook</h3>
          <pre className="bg-background p-4 rounded text-xs overflow-x-auto">
{`{
  "event": "risk.escalated",
  "timestamp": "2026-02-02T15:00:00Z",
  "data": {
    "id": "risk_xyz",
    "title": "Dépassement budget",
    "severity": "high",
    "project_id": "prj_abc123"
  }
}`}
          </pre>
          <p className="text-sm text-muted-foreground mt-4">
            Votre endpoint doit retourner un code HTTP 2xx pour confirmer la réception. En cas d'échec, Powalyze réessaiera jusqu'à 3 fois.
          </p>
        </Card>
      </div>
    </div>
  )
}
