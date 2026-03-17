import db from "@/lib/db";

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const [rows]: any = await db.query(
    "SELECT * FROM experiments WHERE uuid = ?",
    [id]
  );

  if (!rows || rows.length === 0) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Experiment not found</h2>
        <p>ID: {id}</p>
      </div>
    );
  }

  const experiment = rows[0];

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>

      <h1>{experiment.name}</h1>

      <p style={{ marginTop: "20px" }}>
        {experiment.description}
      </p>

      <h3 style={{ marginTop: "30px" }}>Components</h3>

      <p>{experiment.components}</p>

    </div>
  );
}