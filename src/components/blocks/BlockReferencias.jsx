import { motion } from "framer-motion";
import { ExternalLink, BookMarked } from "lucide-react";
import { REFERENCIAS } from "../../data/mockData";
import Panel from "../ui/Panel";
import SectionHeader from "../ui/SectionHeader";

function groupByCategoria(items) {
  const groups = [];
  items.forEach((item) => {
    let group = groups.find((g) => g.categoria === item.categoria);
    if (!group) {
      group = { categoria: item.categoria, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  });
  return groups;
}

export default function BlockReferencias() {
  const grupos = groupByCategoria(REFERENCIAS);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-10">
      <SectionHeader
        kicker="Fuentes consultadas"
        title="Referencias"
        subtitle="Documentación técnica y literatura especializada utilizada para construir esta presentación, citada en formato APA. Enlaces verificados en agosto de 2026."
      />

      <div className="flex flex-col gap-8">
        {grupos.map((grupo, gi) => (
          <motion.div
            key={grupo.categoria}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.1 }}
            className="flex flex-col gap-3"
          >
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-accent-600">
              {grupo.categoria}
            </p>
            <Panel accent="accent-600" className="overflow-hidden p-0">
              <ul className="divide-y divide-slate-100">
                {grupo.items.map((ref) => (
                  <li key={ref.url} className="flex items-start gap-3 p-4">
                    <BookMarked size={16} className="mt-0.5 shrink-0 text-slate-400" strokeWidth={2} />
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm leading-relaxed text-slate-700">
                        <strong className="text-slate-900">{ref.autor}</strong>
                        {ref.anio !== "s.f." ? ` (${ref.anio})` : " (s.f.)"}. <em>{ref.titulo}</em>.
                      </p>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-600 underline decoration-accent-200 underline-offset-2 transition-colors hover:text-accent-800 hover:decoration-accent-500"
                      >
                        {ref.url.replace(/^https?:\/\//, "")}
                        <ExternalLink size={11} strokeWidth={2} />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
