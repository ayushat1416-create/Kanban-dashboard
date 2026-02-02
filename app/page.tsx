"use client";

import { useEffect, useState } from "react";
import Board from "@/components/Board";
import initialData, { KanbanData } from "@/lib/initialData";
import { loadData, saveData } from "@/lib/storage";

export default function Home() {
  const [data, setData] = useState<KanbanData>(() => {
    return loadData() ?? initialData;
  });

  useEffect(() => {
    saveData(data);
  }, [data]);

  return (
    <main className="min-h-screen p-8">
      <Board data={data} setData={setData} />
    </main>
  );
}
