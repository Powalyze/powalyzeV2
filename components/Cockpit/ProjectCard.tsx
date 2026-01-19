import { Project } from '@/types/cockpit';

interface Props {
  project: Project;
  selected: boolean;
  onSelect: () => void;
}

export default function ProjectCard({ project, selected, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-xl border px-3 py-2 text-xs transition ${
        selected
          ? 'border-amber-400 bg-slate-900'
          : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-slate-100 font-medium">{project.name}</span>
        <span
          className={`h-2 w-2 rounded-full ${
            project.rag_status === 'GREEN'
              ? 'bg-emerald-500'
              : project.rag_status === 'YELLOW'
              ? 'bg-amber-400'
              : project.rag_status === 'RED'
              ? 'bg-red-500'
              : 'bg-slate-500'
          }`}
        />
      </div>
      <div className="text-[10px] text-slate-500">
        {project.criticality === 'CRITICAL' && '🔴 '}
        {project.criticality === 'HIGH' && '🟠 '}
        Criticité : <span className="text-slate-300">{project.criticality}</span>
      </div>
      <div className="text-[10px] text-slate-500 mt-1">
        {project.completion_percentage}% · {project.status}
      </div>
    </button>
  );
}
