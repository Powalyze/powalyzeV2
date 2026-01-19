"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  Eye,
  MoreVertical,
  Plus,
  Filter,
  Edit,
  Trash2,
  Users,
  Mail,
  Shield,
  X,
  Save,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// Interfaces
interface Report {
  id: string;
  title: string;
  type: "powerbi" | "excel" | "pdf";
  category: string;
  lastUpdated: string;
  views: number;
  status: "ready" | "generating" | "scheduled";
  schedule?: string;
  content?: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  function: string;
  role: "admin" | "editor" | "viewer";
  addedDate: string;
  status: "active" | "pending";
}

// Sample data
const initialReports: Report[] = [
  {
    id: "1",
    title: "Tableau de Bord Financier Q1 2026",
    type: "powerbi",
    category: "Finances",
    lastUpdated: "2026-01-15",
    views: 542,
    status: "ready",
    content: "Analyse détaillée des performances financières du premier trimestre 2026. Ce rapport inclut les revenus, dépenses, marges bénéficiaires et prévisions pour le trimestre suivant.",
  },
  {
    id: "2",
    title: "Analyse des Risques Projets",
    type: "powerbi",
    category: "Risques",
    lastUpdated: "2026-01-14",
    views: 328,
    status: "ready",
    content: "Évaluation complète des risques identifiés sur l'ensemble du portefeuille projets. Matrice de criticité, plans d'atténuation et indicateurs de suivi.",
  },
  {
    id: "3",
    title: "Performance Équipes - Janvier",
    type: "excel",
    category: "Ressources",
    lastUpdated: "2026-01-16",
    views: 215,
    status: "generating",
    content: "Rapport mensuel sur la productivité et l'allocation des ressources humaines. Taux d'utilisation, compétences disponibles et besoins de formation.",
  },
  {
    id: "4",
    title: "Rapport Exécutif Hebdomadaire",
    type: "pdf",
    category: "Executive",
    lastUpdated: "2026-01-13",
    views: 189,
    status: "scheduled",
    schedule: "Tous les lundis 08:00",
    content: "Synthèse hebdomadaire destinée au comité de direction. KPIs stratégiques, décisions en attente, alertes critiques et recommandations.",
  },
  {
    id: "5",
    title: "Budget vs Réel - Consolidé",
    type: "powerbi",
    category: "Finances",
    lastUpdated: "2026-01-12",
    views: 401,
    status: "ready",
    content: "Comparaison détaillée entre les budgets alloués et les dépenses réelles par projet et département. Analyse des écarts et justifications.",
  },
  {
    id: "6",
    title: "Indicateurs de Qualité Projets",
    type: "powerbi",
    category: "Qualité",
    lastUpdated: "2026-01-11",
    views: 267,
    status: "ready",
    content: "Suivi des métriques qualité : taux de conformité, défauts identifiés, satisfaction client et conformité aux standards ISO.",
  },
];

// StatusBadge Component
const StatusBadge: React.FC<{ status: Report["status"] }> = ({ status }) => {
  const statusConfig = {
    ready: { label: "Prêt", variant: "success" as const },
    generating: { label: "Génération", variant: "warning" as const },
    scheduled: { label: "Planifié", variant: "info" as const },
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// ReportCard Component
interface ReportCardProps {
  report: Report;
  onView: (report: Report) => void;
  onEdit: (report: Report) => void;
  onDownload: (report: Report) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onView,
  onEdit,
  onDownload,
}) => {
  const getIcon = () => {
    switch (report.type) {
      case "powerbi":
        return <BarChart3 className="w-8 h-8 text-blue-500" />;
      case "excel":
        return <FileText className="w-8 h-8 text-green-500" />;
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {getIcon()}
            <div>
              <h3 className="font-semibold text-lg">{report.title}</h3>
              <p className="text-sm text-gray-500">{report.category}</p>
            </div>
          </div>
          <StatusBadge status={report.status} />
        </div>

        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Mis à jour: {report.lastUpdated}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{report.views} vues</span>
          </div>
          {report.schedule && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{report.schedule}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(report)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            Voir
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(report)}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-1" />
            Éditer
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onDownload(report)}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-1" />
            Télécharger
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component
export default function ReportsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "Sophie Martin",
      email: "sophie.martin@powalyze.com",
      function: "Chef de Projet Senior",
      role: "admin",
      addedDate: "2025-12-01",
      status: "active",
    },
    {
      id: "2",
      name: "Thomas Dubois",
      email: "thomas.dubois@powalyze.com",
      function: "Analyste Financier",
      role: "editor",
      addedDate: "2025-12-15",
      status: "active",
    },
    {
      id: "3",
      name: "Marie Lefevre",
      email: "marie.lefevre@powalyze.com",
      function: "Contrôleur de Gestion",
      role: "viewer",
      addedDate: "2026-01-05",
      status: "pending",
    },
  ]);

  const [modals, setModals] = useState({
    view: false,
    edit: false,
    member: false,
  });

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    function: "",
    role: "viewer" as Member["role"],
  });

  // Handlers
  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setModals({ ...modals, view: true });
  };

  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setEditedContent(report.content || "");
    setModals({ ...modals, edit: true });
  };

  const handleSaveEdit = () => {
    if (selectedReport) {
      setReports(
        reports.map((r) =>
          r.id === selectedReport.id ? { ...r, content: editedContent } : r
        )
      );
      setModals({ ...modals, edit: false });
      setSelectedReport(null);
    }
  };

  const handleDownloadPDF = (report: Report) => {
    // Demander le format de téléchargement
    const format = window.prompt(
      'Choisissez le format de téléchargement:\n\n1. PDF\n2. Word (.docx)\n\nEntrez 1 ou 2:',
      '1'
    );

    if (!format || (format !== '1' && format !== '2')) {
      return; // Annulé ou choix invalide
    }

    const isPDF = format === '1';
    const fileExtension = isPDF ? 'pdf' : 'docx';
    const mimeType = isPDF ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    const downloadTask = () => {
      try {
        // Créer le contenu du document
        const content = `
RAPPORT POWALYZE
================

Titre: ${report.title}
Type: ${report.type.toUpperCase()}
Catégorie: ${report.category}
Date: ${new Date(report.lastUpdated).toLocaleDateString('fr-FR')}
Vues: ${report.views}
Statut: ${report.status}

CONTENU:
--------
${report.content || 'Aucun contenu disponible'}

---
Généré par Powalyze - ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR')}
        `;

        // Créer un blob avec le contenu
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        
        // Créer un lien de téléchargement
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${fileExtension}`;
        
        // Déclencher le téléchargement
        document.body.appendChild(link);
        link.click();
        
        // Nettoyer
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          alert(`Rapport "${report.title}" téléchargé en ${isPDF ? 'PDF' : 'Word'} avec succès!`);
        }, 100);
      } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
        alert('Une erreur est survenue lors du téléchargement. Veuillez réessayer.');
      }
    };
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => downloadTask(), { timeout: 100 });
    } else {
      setTimeout(() => downloadTask(), 0);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const tempPassword = "Powalyze2026!";
    
    const member: Member = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      function: newMember.function,
      role: newMember.role,
      addedDate: new Date().toISOString().split("T")[0],
      status: "pending",
    };

    setMembers([...members, member]);
    
    try {
      // Envoyer l'email via Formspree
      const response = await fetch('https://formspree.io/f/mblzvddg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newMember.name,
          email: newMember.email,
          function: newMember.function,
          role: newMember.role,
          password: tempPassword,
          message: `Bienvenue sur Powalyze!\n\nVotre compte a été créé avec succès.\n\nVos identifiants:\nEmail: ${newMember.email}\nMot de passe temporaire: ${tempPassword}\n\nVeuillez changer votre mot de passe lors de votre première connexion.\n\nCordialement,\nL'équipe Powalyze`
        })
      });

      if (response.ok) {
        alert(
          `Membre ajouté avec succès!\n\n` +
          `Un email de confirmation a été envoyé à ${newMember.email} via Formspree\n\n` +
          `Mot de passe temporaire: ${tempPassword}\n\n` +
          `L'utilisateur devra changer son mot de passe lors de sa première connexion.`
        );
      } else {
        throw new Error('Erreur lors de l\'envoi de l\'email');
      }
    } catch (error) {
      console.error('Erreur Formspree:', error);
      alert(
        `Membre ajouté localement mais l'email n'a pas pu être envoyé.\n\n` +
        `Veuillez contacter manuellement ${newMember.email}\n\n` +
        `Mot de passe temporaire: ${tempPassword}`
      );
    }

    setNewMember({ name: "", email: "", function: "", role: "viewer" });
  };

  const handleDeleteMember = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce membre?")) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  // Filtered reports
  const filteredReports =
    categoryFilter === "all"
      ? reports
      : reports.filter((r) => r.category === categoryFilter);

  const categories = [
    "all",
    ...Array.from(new Set(reports.map((r) => r.category))),
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rapports</h1>
          <p className="text-gray-500 mt-1">
            Gérez et consultez tous vos rapports
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setModals({ ...modals, member: true })}
          >
            <Users className="w-4 h-4 mr-2" />
            Gérer les membres
          </Button>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau rapport
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Rapports</p>
                <p className="text-3xl font-bold mt-1 text-slate-900">{reports.length}</p>
              </div>
              <FileText className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rapports PowerBI</p>
                <p className="text-3xl font-bold mt-1 text-slate-900">4</p>
              </div>
              <BarChart3 className="w-10 h-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Vues Totales</p>
                <p className="text-3xl font-bold mt-1 text-slate-900">1.4K</p>
              </div>
              <Eye className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Membres</p>
                <p className="text-3xl font-bold mt-1 text-slate-900">{members.length}</p>
              </div>
              <Users className="w-10 h-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-3">
        <Filter className="w-5 h-5 text-gray-500" />
        <div className="flex gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={categoryFilter === cat ? "primary" : "outline"}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === "all" ? "Tous" : cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onView={handleViewReport}
            onEdit={handleEditReport}
            onDownload={handleDownloadPDF}
          />
        ))}
      </div>

      {/* View Modal */}
      {modals.view && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">{selectedReport.title}</h2>
              <button
                onClick={() => setModals({ ...modals, view: false })}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Fermer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant="info">{selectedReport.type.toUpperCase()}</Badge>
                <Badge variant="neutral">{selectedReport.category}</Badge>
                <StatusBadge status={selectedReport.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Dernière mise à jour</p>
                  <p className="font-semibold">{selectedReport.lastUpdated}</p>
                </div>
                <div>
                  <p className="text-gray-500">Vues</p>
                  <p className="font-semibold">{selectedReport.views}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Contenu du rapport</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedReport.content}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  onClick={() => handleDownloadPDF(selectedReport)}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger (PDF/Word)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setModals({ ...modals, view: false });
                    handleEditReport(selectedReport);
                  }}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Éditer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modals.edit && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">Éditer: {selectedReport.title}</h2>
              <button
                onClick={() => setModals({ ...modals, edit: false })}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Fermer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Contenu du rapport
                </label>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-64 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le contenu du rapport..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleSaveEdit}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setModals({ ...modals, edit: false })}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Member Management Modal */}
      {modals.member && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gestion des membres</h2>
              <button
                onClick={() => setModals({ ...modals, member: false })}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Fermer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Add Member Form */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Ajouter un membre</h3>
                  <form onSubmit={handleAddMember} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          value={newMember.name}
                          onChange={(e) =>
                            setNewMember({ ...newMember, name: e.target.value })
                          }
                          className="w-full p-2 border rounded-lg"
                          placeholder="Ex: Jean Dupont"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={newMember.email}
                          onChange={(e) =>
                            setNewMember({ ...newMember, email: e.target.value })
                          }
                          className="w-full p-2 border rounded-lg"
                          placeholder="jean.dupont@powalyze.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Fonction
                        </label>
                        <input
                          type="text"
                          value={newMember.function}
                          onChange={(e) =>
                            setNewMember({ ...newMember, function: e.target.value })
                          }
                          className="w-full p-2 border rounded-lg"
                          placeholder="Chef de Projet, Analyste, Directeur..."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Rôle
                        </label>
                        <select
                          value={newMember.role}
                          onChange={(e) =>
                            setNewMember({
                              ...newMember,
                              role: e.target.value as Member["role"],
                            })
                          }
                          className="w-full p-2 border rounded-lg"
                          aria-label="Sélectionner le rôle"
                        >
                          <option value="viewer">Lecteur</option>
                          <option value="editor">Éditeur</option>
                          <option value="admin">Administrateur</option>
                        </select>
                      </div>
                    </div>
                    <Button type="submit" variant="primary" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter le membre
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Members List */}
              <div>
                <h3 className="font-semibold mb-4">Membres actuels ({members.length})</h3>
                <div className="space-y-3">
                  {members.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-semibold">{member.name}</h4>
                              <p className="text-sm text-gray-500">{member.function}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Mail className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{member.email}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <Badge
                                variant={
                                  member.role === "admin"
                                    ? "danger"
                                    : member.role === "editor"
                                    ? "warning"
                                    : "info"
                                }
                              >
                                <Shield className="w-3 h-3 mr-1" />
                                {member.role === "admin"
                                  ? "Admin"
                                  : member.role === "editor"
                                  ? "Éditeur"
                                  : "Lecteur"}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                Ajouté le {member.addedDate}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteMember(member.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
