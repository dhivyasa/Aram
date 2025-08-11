import React from "react";

import Game from "./Game";
import { data } from "../api/data";

export default function LangPage() {
  const batchSize = 10;

  if (!data) return <h1>Loading...</h1>;

  // Calculate total number of batches
  const totalBatches = Math.ceil(data.pairs.length / batchSize);

  // Create array of batches
  const batches = [];
  for (let i = 0; i < totalBatches; i++) {
    const startIndex = i * batchSize;
    const endIndex = startIndex + batchSize;
    const batchPairs = data.pairs.slice(startIndex, endIndex);
    batches.push({
      id: i,
      pairs: batchPairs,
      title: `Batch ${i + 1}`,
    });
  }

  return (
    <main>
      <div className="multi-batch-header">
        <h1>Would you dare you pair?</h1>
        <div className="total-info">
          <span>
            {totalBatches} batches • {data.pairs.length} total pairs
          </span>
        </div>
      </div>

      <div className="all-batches-container">
        {batches.map((batch, index) => (
          <div key={batch.id} className="batch-section">
            <div className="batch-header">
              <h2>{batch.title}</h2>
              <span className="batch-count">{batch.pairs.length} pairs</span>
            </div>

            <Game
              pairs={batch.pairs}
              langA={data.langA}
              langB={data.langB}
              key={`batch-${batch.id}`}
            />

            {index < batches.length - 1 && (
              <div className="batch-divider"></div>
            )}
          </div>
        ))}
      </div>

      <div className="summary-footer">
        <p>
          🎯 Complete all {totalBatches} batches to master {data.pairs.length}{" "}
          Tamil-English pairs!
        </p>
      </div>
    </main>
  );
}
