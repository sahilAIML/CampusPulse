const fs = require('fs');
const path = require('path');

// 1. Load CSV dataset
const csvPath = path.join(__dirname, '..', 'students_complete_master_dataset.csv');
const rawCsv = fs.readFileSync(csvPath, 'utf8');

const lines = rawCsv.trim().split(/\r?\n/);
const headers = lines[0].split(',');

// Map column indexes
const colMap = {};
headers.forEach((h, i) => {
  colMap[h.trim()] = i;
});

// Features for Placement Risk Prediction:
// Higher aptitude, coding, mock_interview, cgpa, certs, hackathons -> lower risk
// Higher backlogs -> higher risk
const featureKeys = [
  'CGPA',
  'Active_Backlogs',
  'Avg_CIE_Marks',
  'Attendance_Percentage',
  'LMS_Completion_Percentage',
  'Certifications_Count',
  'Hackathons_Count',
  'Placement_Aptitude_Score',
  'Technical_Coding_Score',
  'Mock_Interview_Score',
  'Programming_Skill',
  'Communication_Skill',
];

const samples = [];
const labels = []; // 1 = Placement Risk (True), 0 = Safe (False)

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;

  // Simple CSV parser supporting quotes
  const parts = [];
  let inQuotes = false;
  let current = '';
  for (let c = 0; c < line.length; c++) {
    const ch = line[c];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  parts.push(current);

  const feats = featureKeys.map((k) => {
    const val = parseFloat(parts[colMap[k]]) || 0;
    return val;
  });

  const rawLabel = (parts[colMap['Placement_Risk']] || '').toUpperCase().trim();
  const label = rawLabel === 'TRUE' ? 1 : 0;

  samples.push(feats);
  labels.push(label);
}

const n = samples.length;
const d = featureKeys.length;

console.log(`Loaded ${n} samples with ${d} features from ${csvPath}`);
const positiveCount = labels.filter((y) => y === 1).length;
console.log(`Class distribution: ${positiveCount} At-Risk (1), ${n - positiveCount} Ready/Safe (0)`);

// 2. Feature Standardization (Z-Score Normalization)
const means = new Array(d).fill(0);
const stds = new Array(d).fill(0);

for (let j = 0; j < d; j++) {
  let sum = 0;
  for (let i = 0; i < n; i++) sum += samples[i][j];
  means[j] = sum / n;

  let sqDiff = 0;
  for (let i = 0; i < n; i++) sqDiff += Math.pow(samples[i][j] - means[j], 2);
  stds[j] = Math.sqrt(sqDiff / n) || 1.0;
}

const normalizedX = samples.map((row) =>
  row.map((val, j) => (val - means[j]) / stds[j])
);

// 3. Train Logistic Regression using Batch Gradient Descent with L2 Regularization
let weights = new Array(d).fill(0.0);
let bias = 0.0;

const learningRate = 0.08;
const l2Reg = 0.01;
const epochs = 1200;

function sigmoid(z) {
  return 1.0 / (1.0 + Math.exp(-Math.max(-25, Math.min(25, z))));
}

for (let epoch = 0; epoch < epochs; epoch++) {
  const dWeights = new Array(d).fill(0.0);
  let dBias = 0.0;

  for (let i = 0; i < n; i++) {
    let z = bias;
    for (let j = 0; j < d; j++) {
      z += weights[j] * normalizedX[i][j];
    }
    const pred = sigmoid(z);
    const err = pred - labels[i];

    for (let j = 0; j < d; j++) {
      dWeights[j] += err * normalizedX[i][j];
    }
    dBias += err;
  }

  // Update weights
  for (let j = 0; j < d; j++) {
    weights[j] -= learningRate * (dWeights[j] / n + l2Reg * weights[j]);
  }
  bias -= learningRate * (dBias / n);
}

// 4. Model Evaluation
let correct = 0;
let tp = 0;
let fp = 0;
let fn = 0;
let tn = 0;

for (let i = 0; i < n; i++) {
  let z = bias;
  for (let j = 0; j < d; j++) z += weights[j] * normalizedX[i][j];
  const prob = sigmoid(z);
  const pred = prob >= 0.5 ? 1 : 0;
  const actual = labels[i];

  if (pred === actual) correct++;
  if (pred === 1 && actual === 1) tp++;
  if (pred === 1 && actual === 0) fp++;
  if (pred === 0 && actual === 1) fn++;
  if (pred === 0 && actual === 0) tn++;
}

const accuracy = ((correct / n) * 100).toFixed(2);
const precision = tp + fp > 0 ? ((tp / (tp + fp)) * 100).toFixed(2) : '100.00';
const recall = tp + fn > 0 ? ((tp / (tp + fn)) * 100).toFixed(2) : '100.00';
const f1 = ((2 * tp) / (2 * tp + fp + fn) * 100).toFixed(2);

console.log(`\n=== MODEL EVALUATION RESULTS ===`);
console.log(`Accuracy:  ${accuracy}%`);
console.log(`Precision: ${precision}%`);
console.log(`Recall:    ${recall}%`);
console.log(`F1-Score:  ${f1}%`);
console.log(`TP: ${tp}, TN: ${tn}, FP: ${fp}, FN: ${fn}`);

// 5. Feature Importance (Weights magnitude)
const featureImportance = featureKeys.map((name, idx) => ({
  feature: name,
  weight: Number(weights[idx].toFixed(4)),
  mean: Number(means[idx].toFixed(2)),
  std: Number(stds[idx].toFixed(2)),
  impact: weights[idx] > 0 ? 'Increases Risk' : 'Decreases Risk (Protective)',
}));

featureImportance.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));

console.log(`\nTop Feature Coefficients:`);
featureImportance.forEach((f) => {
  console.log(`- ${f.feature}: ${f.weight} (${f.impact})`);
});

// 6. Save Model Artifacts
const modelArtifact = {
  model_name: 'PlacementRiskLogisticClassifier',
  version: '1.0.0',
  trained_at: new Date().toISOString(),
  dataset_source: 'students_complete_master_dataset.csv',
  samples_count: n,
  feature_keys: featureKeys,
  means,
  stds,
  weights,
  bias,
  metrics: {
    accuracy_pct: parseFloat(accuracy),
    precision_pct: parseFloat(precision),
    recall_pct: parseFloat(recall),
    f1_score_pct: parseFloat(f1),
  },
  feature_importance: featureImportance,
};

const outputDir = path.join(__dirname, '..', 'lib', 'ml');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'placement_model_trained.json');
fs.writeFileSync(outputPath, JSON.stringify(modelArtifact, null, 2), 'utf8');
console.log(`\nSuccessfully exported trained ML model to: ${outputPath}`);
