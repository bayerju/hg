import { api } from "~/trpc/server";

export default async function Abrechnung() {
  const clearings = await api.clearing.get();
  return (
    <div>
      Abrechnung
      <div>
        {clearings.map((clearing) => {
          return <div key={clearing.id}>{clearing.id}</div>;
        })}
      </div>
    </div>
  );
}
