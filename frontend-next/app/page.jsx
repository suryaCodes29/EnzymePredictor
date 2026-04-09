"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UploadPanel from "../components/UploadPanel";
import PredictionPanel from "../components/PredictionPanel";
import GraphSection from "../components/GraphSection";
import AnimatedBackground from "../components/AnimatedBackground";
import StatsCard from "../components/StatsCard";
import apiClient from "../lib/api";
import { initSocket, disconnectSocket } from "../lib/socket";
import { stats as initialStats, lineData as initialLineData, barData as initialBarData, initialPrediction } from "../data/dummyData";

export default function HomePage() {
  const [progress, setProgress] = useState(initialPrediction.progress);
  const [status, setStatus] = useState(initialPrediction.status);
  const [predictionResult, setPredictionResult] = useState(initialPrediction.result);
  const [lineData, setLineData] = useState(initialLineData);
  const [barData, setBarData] = useState(initialBarData);
  const [stats, setStats] = useState(initialStats);
  const [supportedWastes, setSupportedWastes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [liveData, setLiveData] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    try {
      const socket = initSocket();

      // Listen for prediction progress via WebSocket
      socket?.on('prediction_progress', (data) => {
        console.log('Prediction progress received:', data);
        setProgress(data.progress);
        setStatus(data.status || `Processing... ${data.progress}%`);
        
        // Update live 3D model data
        setLiveData({
          atoms: 24,
          bonds: 23,
          energy_level: data.energy_level || 50,
        });
      });

      // Listen for prediction completion
      socket?.on('prediction_complete', (data) => {
        console.log('Prediction completed:', data);
        setPredictionResult(data.result);
        setStatus(data.status || 'Prediction complete');
        setProgress(100);
      });

      // Listen for 3D model updates
      socket?.on('3d_update', (data) => {
        console.log('3D update received:', data);
        setLiveData(data);
      });

      return () => {
        // Clean up WebSocket listeners
        socket?.off('prediction_progress');
        socket?.off('prediction_complete');
        socket?.off('3d_update');
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }, []);

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const [healthResponse, wastesResponse] = await Promise.all([
          apiClient.getHealth(),
          apiClient.getSupportedWastes(),
        ]);

        if (healthResponse.status === 'healthy') {
          setSupportedWastes(wastesResponse.wastes || []);
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        // Fallback to dummy data if API is not available
        setSupportedWastes(['organic_waste', 'food_waste', 'paper_waste']);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLineData((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        const nextValue = Math.min(96, Math.max(28, last.activity + (Math.random() * 14 - 5)));
        next.shift();
        next.push({ time: next.length % 2 === 0 ? "00:00" : "02:00", activity: Math.round(nextValue) });
        return next;
      });
      setBarData((prev) => prev.map((item) => ({
        ...item,
        confidence: Math.max(68, Math.min(98, item.confidence + (Math.random() * 4 - 2))),
      })));
      setStats((prev) => prev.map((item) => {
        if (item.label === "Accuracy") {
          return { ...item, value: `${Math.min(99.8, parseFloat(item.value) + 0.05).toFixed(1)}%` };
        }
        return item;
      }));
    }, 5200);

    return () => clearInterval(interval);
  }, []);

  // Handle prediction progress
  useEffect(() => {
    if (status.startsWith("Analyzing")) {
      const progressTimer = setInterval(() => {
        setProgress((current) => {
          const nextProgress = Math.min(100, current + Math.random() * 12);
          if (nextProgress >= 100) {
            clearInterval(progressTimer);
            setStatus("Prediction complete — enzyme model generated");
            setPredictionResult({
              enzymeType: "Hydrolase-like AI state",
              confidence: "96.3%",
              summary: "The algorithm identified stable enzyme interactions and high substrate affinity for the uploaded dataset.",
            });
          }
          return nextProgress;
        });
      }, 650);

      return () => clearInterval(progressTimer);
    }
    return undefined;
  }, [status]);

  const handleUpload = async (file) => {
    setStatus(`Analyzing ${file.name} with enzyme AI...`);
    setProgress(6);
    setPredictionResult({
      enzymeType: "Analyzing sample",
      confidence: "-",
      summary: "Preparing the prediction pipeline with the selected dataset.",
    });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demo purposes, we'll use a mock prediction
      // In production, you would upload the file and call the actual API
      const mockWasteType = supportedWastes.length > 0 ? [supportedWastes[0]] : ['organic_waste'];
      const mockResult = {
        enzymeType: "Hydrolase-like AI state",
        confidence: "96.3%",
        summary: "The algorithm identified stable enzyme interactions and high substrate affinity for the uploaded dataset.",
        input_waste_types: mockWasteType,
      };

      setPredictionResult(mockResult);
      setStatus("Prediction complete — enzyme model generated");
      setProgress(100);

    } catch (error) {
      console.error('Prediction failed:', error);
      setStatus("Prediction failed — please try again");
      setPredictionResult({
        enzymeType: "Error",
        confidence: "-",
        summary: "Failed to process the uploaded file. Please check the file format and try again.",
      });
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_24%),linear-gradient(180deg,_#020617,_#02070f)] text-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading EnzymeAI...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_24%),linear-gradient(180deg,_#020617,_#02070f)] text-slate-100">
      <AnimatedBackground />
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-6 pb-24 pt-8 lg:px-8">
        <Sidebar />

        <section className="flex-1 space-y-8">
          <div className="glass-card rounded-[2.5rem] border border-white/10 bg-slate-950/60 p-10 shadow-glow backdrop-blur-xl">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Real-Time Enzyme Prediction System</p>
                <h1 className="text-4xl font-semibold leading-tight text-slate-100 sm:text-5xl">
                  Real-Time Enzyme Prediction System
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                  Upload protein data or an image to predict enzyme behavior with AI-driven precision, interactive graphs, and real-time insight.
                </p>
              </div>
              <div className="rounded-[2rem] border border-cyan-400/10 bg-cyan-400/5 p-8 text-slate-100 shadow-glow">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Live system metrics</p>
                <div className="mt-6 grid gap-4 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-3xl bg-slate-950/40 p-4">
                    <span>Inference queue</span>
                    <strong className="text-cyan-200">14 active</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-3xl bg-slate-950/40 p-4">
                    <span>Network latency</span>
                    <strong className="text-cyan-200">45 ms</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-3xl bg-slate-950/40 p-4">
                    <span>Sample throughput</span>
                    <strong className="text-cyan-200">23 / min</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <UploadPanel onFileUploaded={handleUpload} />
            <PredictionPanel status={status} progress={Math.round(progress)} result={predictionResult} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <GraphSection lineData={lineData} barData={barData} liveData={liveData} />
            <div className="space-y-6">
              {stats.map((item) => (
                <StatsCard key={item.label} label={item.label} value={item.value} detail={item.detail} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

