import { Card } from "~/components/ui/card";
import { api } from "~/trpc/server";

export default async function Abrechnung() {
  const clearings = await api.clearing.get();
  return (
    <div>
      Abrechnung
      <div className="flex flex-col gap-3">
        {clearings.map((clearing) => {
          return <Card key={clearing.id}>{clearing.name}</Card>;
        })}
      </div>
    </div>
  );
}
