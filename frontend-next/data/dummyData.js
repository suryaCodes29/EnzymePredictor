export const stats = [
  { label: "Accuracy", value: "96.3%", detail: "Model confidence across batch predictions" },
  { label: "Processing Time", value: "1.9s", detail: "Average inference time per sample" },
  { label: "Dataset Size", value: "62.4k", detail: "Protein structures analyzed" },
  { label: "Active Models", value: "4", detail: "AI ensembles running in parallel" },
];

export const lineData = [
  { time: "00:00", activity: 14 },
  { time: "02:00", activity: 18 },
  { time: "04:00", activity: 27 },
  { time: "06:00", activity: 35 },
  { time: "08:00", activity: 42 },
  { time: "10:00", activity: 52 },
  { time: "12:00", activity: 63 },
  { time: "14:00", activity: 58 },
  { time: "16:00", activity: 68 },
  { time: "18:00", activity: 78 },
  { time: "20:00", activity: 82 },
  { time: "22:00", activity: 91 },
];

export const barData = [
  { model: "EnzymeNet", confidence: 92 },
  { model: "ProteinFlow", confidence: 84 },
  { model: "BioPulse", confidence: 76 },
  { model: "CycleAI", confidence: 88 },
];

export const initialPrediction = {
  status: "Ready to analyze your sample",
  progress: 0,
  result: {
    enzymeType: "-",
    confidence: "-",
    summary: "Upload a protein sequence, image, or dataset to begin real-time enzyme prediction.",
  },
};
