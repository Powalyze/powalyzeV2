"use client";

import React from "react";
import { Users, Mail, Phone, Award, TrendingUp, Clock } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  projects: number;
  availability: number;
  performance: number;
  skills: string[];
  status: "available" | "busy" | "away";
}

const team: TeamMember[] = [
  {
    id: "1",
    name: "Sophie Martin",
    role: "Chef de Projet Senior",
    email: "sophie.martin@powalyze.com",
    phone: "+33 6 12 34 56 78",
    avatar: "SM",
    projects: 4,
    availability: 75,
    performance: 94,
    skills: ["Agile", "Azure", "PMO"],
    status: "available",
  },
  {
    id: "2",
    name: "Thomas Dubois",
    role: "Architecte Solutions",
    email: "thomas.dubois@powalyze.com",
    phone: "+33 6 23 45 67 89",
    avatar: "TD",
    projects: 3,
    availability: 60,
    performance: 96,
    skills: ["Architecture", "Cloud", "Microservices"],
    status: "busy",
  },
  {
    id: "3",
    name: "Marie Laurent",
    role: "Product Owner",
    email: "marie.laurent@powalyze.com",
    phone: "+33 6 34 56 78 90",
    avatar: "ML",
    projects: 2,
    availability: 85,
    performance: 92,
    skills: ["Product", "UX", "Agile"],
    status: "available",
  },
  {
    id: "4",
    name: "Pierre Bernard",
    role: "Tech Lead",
    email: "pierre.bernard@powalyze.com",
    phone: "+33 6 45 67 89 01",
    avatar: "PB",
    projects: 5,
    availability: 40,
    performance: 89,
    skills: ["React", "Node.js", "DevOps"],
    status: "busy",
  },
  {
    id: "5",
    name: "Claire Moreau",
    role: "Data Analyst",
    email: "claire.moreau@powalyze.com",
    phone: "+33 6 56 78 90 12",
    avatar: "CM",
    projects: 3,
    availability: 90,
    performance: 95,
    skills: ["Power BI", "SQL", "Python"],
    status: "available",
  },
  {
    id: "6",
    name: "Julien Petit",
    role: "Scrum Master",
    email: "julien.petit@powalyze.com",
    phone: "+33 6 67 89 01 23",
    avatar: "JP",
    projects: 4,
    availability: 70,
    performance: 91,
    skills: ["Scrum", "Coaching", "Facilitation"],
    status: "available",
  },
];

export default function TeamPage() {
  const stats = {
    total: team.length,
    available: team.filter(m => m.status === "available").length,
    busy: team.filter(m => m.status === "busy").length,
    avgPerformance: Math.round(team.reduce((acc, m) => acc + m.performance, 0) / team.length),
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Équipe</h1>
        <p className="text-slate-400">Gestion des membres et performance de l'équipe</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-slate-400">Membres actifs</div>
              </div>
              <div className="p-3 bg-sky-500/10 rounded-lg">
                <Users className="text-sky-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-400">{stats.available}</div>
                <div className="text-sm text-slate-400">Disponibles</div>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <Clock className="text-emerald-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-amber-400">{stats.busy}</div>
                <div className="text-sm text-slate-400">Occupés</div>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <TrendingUp className="text-amber-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-violet-400">{stats.avgPerformance}%</div>
                <div className="text-sm text-slate-400">Performance moy.</div>
              </div>
              <div className="p-3 bg-violet-500/10 rounded-lg">
                <Award className="text-violet-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {team.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <Card>
      <CardContent className="p-6">
        {/* Header with Avatar */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-2xl font-bold text-slate-950 shadow-lg">
            {member.avatar}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
            <p className="text-sm text-slate-400 mb-2">{member.role}</p>
            <StatusBadge status={member.status} />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Mail size={14} />
            {member.email}
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Phone size={14} />
            {member.phone}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {member.skills.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-800/50 rounded text-xs text-slate-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <MetricBar
            label="Disponibilité"
            value={member.availability}
            color={member.availability > 70 ? "emerald" : "amber"}
          />
          <MetricBar
            label="Performance"
            value={member.performance}
            color="sky"
          />
        </div>

        {/* Projects Count */}
        <div className="mt-4 pt-4 border-t border-slate-800 text-center">
          <div className="text-2xl font-bold text-white mb-1">{member.projects}</div>
          <div className="text-xs text-slate-400">Projets actifs</div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: TeamMember["status"] }) {
  const config = {
    available: { label: "Disponible", variant: "success" as const },
    busy: { label: "Occupé", variant: "warning" as const },
    away: { label: "Absent", variant: "neutral" as const },
  };

  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}

function MetricBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    sky: "bg-sky-500",
  };

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-semibold">{value}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
