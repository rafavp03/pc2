import { Link } from "react-router-dom";
import type { Item } from "../api/resource";

type Props = { item: Item };

export default function ItemCard({ item }: Props) {
  return (
    <Link
      to={`/mentors/${item.id}`}
      className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-blue-400 hover:shadow"
    >
      <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
      <p className="text-sm text-slate-600">Especialidad: {item.specialty}</p>
      <p className="text-sm text-slate-600">Modalidad: {item.modality}</p>
      <p className="text-sm text-slate-600">Cupos disponibles: {item.availableSlots}</p>
    </Link>
  );
}
