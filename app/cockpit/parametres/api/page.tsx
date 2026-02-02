'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Key, Copy, Eye, EyeOff, Trash2, Plus, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/ui/ToastProvider'

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['read'])
  const [generatedToken, setGeneratedToken] = useState<string | null>(null)
  const { showToast } = useToast()

  const supabase = createClient()

  useEffect(() => {
    fetchApiKeys()
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

  async function fetchApiKeys() {
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
        .from('api_keys')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setApiKeys(data || [])
    } catch (err: any) {
      console.error('Error fetching API keys:', err)
      showToast('error', 'Erreur', 'Impossible de charger les clés API')
    } finally {
      setLoading(false)
    }
  }

  async function createApiKey() {
    if (!newKeyName.trim()) {
      showToast('error', 'Erreur', 'Le nom de la clé est requis')
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

      // Generate random token
      const token = `pk_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`
      const tokenHash = await hashToken(token)

      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          organization_id: profile.organization_id,
          name: newKeyName,
          token_hash: tokenHash,
          permissions: newKeyPermissions,
          is_active: true
        })
        .select()
        .maybeSingle()

      if (error) throw error

      setGeneratedToken(token)
      setNewKeyName('')
      setNewKeyPermissions(['read'])
      fetchApiKeys()

      showToast('success', 'Clé API créée', 'Copiez votre clé maintenant, elle ne sera plus affichée.', 10000)
    } catch (err: any) {
      console.error('Error creating API key:', err)
      showToast('error', 'Erreur', err.message || 'Impossible de créer la clé API')
    }
  }

  async function hashToken(token: string) {
    const encoder = new TextEncoder()
    const data = encoder.encode(token)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  async function deleteApiKey(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette clé API ? Cette action est irréversible.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id)

      if (error) throw error

      fetchApiKeys()
      showToast('success', 'Clé supprimée', 'La clé API a été supprimée avec succès')
    } catch (err: any) {
      console.error('Error deleting API key:', err)
      showToast('error', 'Erreur', err.message || 'Impossible de supprimer la clé API')
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    showToast('success', 'Copié', 'Clé API copiée dans le presse-papiers', 2000)
  }

  if (isDemo) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">API Keys</h1>
            <p className="text-muted-foreground">
              Gérez vos clés API pour accéder à l'API REST de Powalyze
            </p>
          </div>

          <Card className="p-8 text-center border-2 border-dashed">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Fonctionnalité Pro</h3>
            <p className="text-muted-foreground mb-4">
              Les clés API et l'accès à l'API REST sont disponibles uniquement dans les plans Pro et Enterprise.
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
            <h1 className="text-3xl font-bold mb-2">API Keys</h1>
            <p className="text-muted-foreground">
              Gérez vos clés API pour accéder à l'API REST de Powalyze
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle clé
          </Button>
        </div>

        {/* Generated Token Modal */}
        {generatedToken && (
          <Card className="mb-6 p-6 border-2 border-green-500/20 bg-green-500/5">
            <div className="flex items-start gap-4">
              <Key className="h-6 w-6 text-green-500 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Clé API créée avec succès</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Copiez cette clé maintenant. Elle ne sera plus jamais affichée.
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    value={generatedToken}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generatedToken)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGeneratedToken(null)}
              >
                Fermer
              </Button>
            </div>
          </Card>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <Card className="mb-6 p-6 border-2">
            <h3 className="text-lg font-semibold mb-4">Créer une nouvelle clé API</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nom de la clé</label>
                <Input
                  placeholder="Ex: Production API, Jira Integration..."
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Permissions</label>
                <div className="space-y-2">
                  {['read', 'write', 'admin'].map(permission => (
                    <label key={permission} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newKeyPermissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewKeyPermissions([...newKeyPermissions, permission])
                          } else {
                            setNewKeyPermissions(newKeyPermissions.filter(p => p !== permission))
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{permission}</span>
                      <span className="text-xs text-muted-foreground">
                        {permission === 'read' && '(GET uniquement)'}
                        {permission === 'write' && '(GET, POST, PUT)'}
                        {permission === 'admin' && '(Tous les accès)'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                  setShowCreateModal(false)
                  setNewKeyName('')
                  setNewKeyPermissions(['read'])
                }}>
                  Annuler
                </Button>
                <Button onClick={createApiKey}>
                  Créer la clé
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* API Keys List */}
        <div className="space-y-4">
          {loading ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Chargement...</p>
            </Card>
          ) : apiKeys.length === 0 ? (
            <Card className="p-8 text-center border-2 border-dashed">
              <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Aucune clé API</h3>
              <p className="text-muted-foreground mb-4">
                Créez votre première clé API pour commencer à utiliser l'API REST Powalyze
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une clé
              </Button>
            </Card>
          ) : (
            apiKeys.map(key => (
              <Card key={key.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{key.name}</h3>
                      {key.is_active ? (
                        <Badge variant="default" className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {key.token_hash.substring(0, 16)}...
                      </code>
                      {key.permissions.map((perm: string) => (
                        <Badge key={perm} variant="outline" className="capitalize">
                          {perm}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Créée le {new Date(key.created_at).toLocaleDateString('fr-FR')}</span>
                      {key.last_used_at && (
                        <span>Dernière utilisation: {new Date(key.last_used_at).toLocaleDateString('fr-FR')}</span>
                      )}
                      {key.expires_at && (
                        <span>Expire le {new Date(key.expires_at).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteApiKey(key.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Documentation */}
        <Card className="mt-8 p-6 bg-muted/50">
          <h3 className="text-lg font-semibold mb-4">Documentation API</h3>
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium mb-1">Authentification</h4>
              <code className="block bg-background p-2 rounded text-xs">
                curl https://api.powalyze.com/v1/projects \<br />
                &nbsp;&nbsp;-H "Authorization: Bearer pk_live_xxxxx"
              </code>
            </div>
            <div>
              <h4 className="font-medium mb-1">Endpoints disponibles</h4>
              <ul className="space-y-1 ml-4">
                <li>• <code>GET /v1/projects</code> - Liste des projets</li>
                <li>• <code>POST /v1/projects</code> - Créer un projet</li>
                <li>• <code>GET /v1/risks</code> - Liste des risques</li>
                <li>• <code>POST /v1/risks</code> - Créer un risque</li>
                <li>• <code>GET /v1/decisions</code> - Liste des décisions</li>
                <li>• <code>POST /v1/reports/generate</code> - Générer un rapport IA</li>
              </ul>
            </div>
            <div>
              <Button variant="outline" onClick={() => window.open('/docs/api', '_blank')}>
                Voir la documentation complète →
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
