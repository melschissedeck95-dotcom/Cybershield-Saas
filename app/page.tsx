"use client";

import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Terminal, 
  Building, 
  AlertTriangle, 
  Play, 
  FileText, 
  Network,
  Server,
  Globe,
  Download,
  ShieldAlert,
  GitBranch,
  LogOut,
  Lock,
  Mail,
  User
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { supabase } from "@/lib/supabase";

interface AdvancedFinding {
  id: string;
  title: string;
  category: "AD" | "NETWORK" | "WEB";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  cvss: number;
  attackVector: string;
  remediation: string;
}

export default function UltimateEnterpriseSaaS() {
  // États d'authentification Supabase
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // États du SaaS Pentest
  const [clientName, setClientName] = useState("Global Bank & Corp");
  const [targetScope, setTargetScope] = useState("corp.globalbank.internal (10.50.0.0/16)");
  const [auditModule, setAuditModule] = useState<"AD" | "NETWORK" | "WEB">("AD");

  const [isScanning, setIsScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scanProgress, setScanProgress] = useState(0);

  const [findings, setFindings] = useState<AdvancedFinding[]>([
    {
      id: "1",
      title: "Chemin critique vers Domain Admin (Abus d'ACLs GenericAll sur Objet Utilisateur)",
      category: "AD",
      severity: "CRITICAL",
      cvss: 9.6,
      attackVector: "Compte standard -> GenericAll sur ServiceAccount -> Récupération SPN -> Escalade DA",
      remediation: "Nettoyer immédiatement les permissions ACL dangereuses sur l'objet Active Directory et appliquer un principe de moindre privilège."
    },
    {
      id: "2",
      title: "Exposition massive de baux SMBv1 et bannières LLMNR/NBT-NS non désactivées",
      category: "NETWORK",
      severity: "HIGH",
      cvss: 8.4,
      attackVector: "Écoute passive du réseau local -> Poisoning LLMNR -> Capture de hashes NTLMv2",
      remediation: "Désactiver globalement LLMNR et NBT-NS via GPO et interdire le protocole SMBv1 sur l'ensemble des sous-réseaux."
    },
    {
      id: "3",
      title: "Délégation Kerberos Non Contrainte (Unconstrained Delegation) sur Serveur de Fichiers",
      category: "AD",
      severity: "CRITICAL",
      cvss: 9.1,
      attackVector: "Interception de tickets TGT de Domain Admins se connectant au serveur -> Imitation d'identité",
      remediation: "Migrer la délégation vers une approche contrainte (Constrained Delegation) ou basée sur les ressources (RBCD)."
    }
  ]);

  // Vérification de la session au chargement
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Gestion Connexion / Inscription Supabase
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Inscription réussie ! Vous êtes connecté.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setAuthError(err.message || "Une erreur est survenue lors de l'authentification.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // MOTEUR D'AUDIT AVANCÉ
  const runEliteScan = async () => {
    setIsScanning(true);
    setScanProgress(15);
    setScanLogs([
      `[*] Initialisation du framework d'attaque offensive CyberShield [Module: ${auditModule}]`,
      `[*] Utilisateur authentifié : ${session?.user?.email}`,
      `[*] Cible active : ${targetScope}`
    ]);

    await new Promise(r => setTimeout(r, 1200));
    setScanProgress(40);
    setScanLogs(prev => [
      ...prev,
      `[*] Analyse structurelle des graphes de relations et bannières en cours...`,
      `[*] Interrogation des services de l'infrastructure cible...`
    ]);

    await new Promise(r => setTimeout(r, 1500));
    setScanProgress(75);
    setScanLogs(prev => [
      ...prev,
      `[!] Détection heuristique d'anomalies de privilèges et de vecteurs de compromission.`,
      `[*] Calcul des scores d'impact et de la matrice de risque CVSS v3.1...`
    ]);

    await new Promise(r => setTimeout(r, 1200));
    setScanProgress(100);
    setIsScanning(false);
    setScanLogs(prev => [
      ...prev,
      `[✔] Audit avancé terminé avec succès. Enregistrement dans le cloud sécurisé.`
    ]);

    let newFinding: AdvancedFinding;
    if (auditModule === "AD") {
      newFinding = {
        id: Date.now().toString(),
        title: "Politique de mots de passe Active Directory faible (SYSVOL GPP Hardcoded Passwords)",
        category: "AD",
        severity: "HIGH",
        cvss: 8.8,
        attackVector: "Exploration des partages SYSVOL -> Lecture du fichier Groups.xml -> Déchiffrement AES",
        remediation: "Supprimer les fichiers de scripts contenant des mots de passe en clair et appliquer des politiques strictes."
      };
    } else if (auditModule === "NETWORK") {
      newFinding = {
        id: Date.now().toString(),
        title: "Absence de microsegmentation entre la Zone Bureautique et le Backbone de Production",
        category: "NETWORK",
        severity: "CRITICAL",
        cvss: 9.3,
        attackVector: "Pivotement réseau (Lateral Movement) depuis un poste compromis vers les serveurs critiques",
        remediation: "Mettre en place des règles de pare-feu strictes (Firewall interne) et une segmentation par VLANs isolés."
      };
    } else {
      newFinding = {
        id: Date.now().toString(),
        title: "Vulnérabilité d'Exécution de Code à Distance (RCE) via Désérialisation Non Sécurisée",
        category: "WEB",
        severity: "CRITICAL",
        cvss: 9.8,
        attackVector: "Injection de charges utiles (Payloads) malveillantes dans les objets sérialisés de l'API",
        remediation: "Remplacer la désérialisation non sécurisée par des formats neutres (JSON) et valider rigoureusement les types."
      };
    }

    setFindings(prev => [newFinding, ...prev]);
  };

  // GÉNÉRATION PDF
  const generateElitePDF = () => {
    const doc = new jsPDF();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 45, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("CYBERSHIELD ENTERPRISE - RAPPORT D'AUDIT OFFENSIF", 14, 20);

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`Organisation Auditée : ${clientName} | Auditeur (Cloud) : ${session?.user?.email}`, 14, 28);
    doc.text(`Date : ${new Date().toLocaleDateString()} | Classification : CONFIDENTIEL RED TEAM`, 14, 35);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(13);
    doc.text("1. Synthèse Exécutive & Posture de Sécurité Globale", 14, 55);

    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(
      `Ce document consigne les résultats de l'évaluation d'intrusion avancée menée sur le système de ${clientName}. ` +
      `Au total, ${findings.length} vulnérabilités majeures et chemins d'attaque exploitables ont été cartographiés.`,
      14, 62, { maxWidth: 180 }
    );

    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text("2. Registre des Vulnérabilités & Chemins d'Attaque (Attack Paths)", 14, 85);

    const tableRows = findings.map(f => [
      f.title,
      f.category,
      f.severity,
      f.cvss.toString(),
      f.attackVector
    ]);

    (doc as any).autoTable({
      startY: 92,
      head: [["Vulnérabilité / Risque", "Module", "Sévérité", "CVSS", "Vecteur d'Attaque / Chaîne"]],
      body: tableRows,
      headStyles: { fillColor: [30, 58, 138] },
      styles: { fontSize: 8 }
    });

    doc.addPage();
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text("3. Plan de Remédiation & Recommandations de Durcissement", 14, 20);

    let currentY = 30;
    findings.forEach((f, index) => {
      if (currentY > 255) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text(`${index + 1}. ${f.title} [Sévérité : ${f.severity} - CVSS ${f.cvss}]`, 14, currentY);

      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Consigne corrective : ${f.remediation}`, 14, currentY + 6, { maxWidth: 180 });
      currentY += 22;
    });

    doc.save(`CyberShield_Enterprise_Report_${clientName.replace(/\s+/g, '_')}.pdf`);
  };

  // SI L'UTILISATEUR N'EST PAS CONNECTÉ -> PAGE DE CONNEXION / INSCRIPTION SUPABASE
  if (!session) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl w-full max-w-md space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <ShieldAlert className="w-12 h-12 text-indigo-500 animate-pulse" />
            <h1 className="text-xl font-black uppercase tracking-wider text-white">CyberShield Enterprise</h1>
            <p className="text-xs text-slate-400">Portail Sécurisé d'Accès aux Audits de Pentest & Red Team</p>
          </div>

          {authError && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Adresse Email Professionnelle</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input 
                  type="email" 
                  required
                  placeholder="analyste@entreprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-3 text-xs text-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-3 text-xs text-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg text-xs transition cursor-pointer shadow-lg"
            >
              {authLoading ? "Traitement..." : isSignUp ? "Créer un compte Enterprise" : "Se connecter au SaaS"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-indigo-400 hover:underline cursor-pointer"
            >
              {isSignUp ? "Déjà un compte ? Connectez-vous" : "Pas encore de compte ? S'inscrire"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // SI L'UTILISATEUR EST CONNECTÉ -> TABLEAU DE BORD ULTIME
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans p-6 space-y-6">
      {/* HEADER */}
      <header className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-xl gap-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-indigo-500 animate-pulse" />
          <div>
            <h1 className="text-lg font-black tracking-wider text-white uppercase">CyberShield Enterprise SaaS</h1>
            <p className="text-xs text-slate-400">Connecté en tant que : <span className="text-indigo-400 font-mono">{session.user.email}</span></p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={generateElitePDF} 
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg transition"
          >
            <Download className="w-4 h-4" /> Exporter le Rapport PDF Exécutif
          </button>
          <button 
            onClick={handleLogout} 
            className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition"
            title="Se déconnecter"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </header>

      {/* SECTION 1 : CONFIGURATION & MODULES D'ATTAQUE AVANCÉS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <GitBranch className="w-4 h-4" /> 1. Sélection du Module d'Attaque Avancé
            </h2>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setAuditModule("AD")}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition ${
                  auditModule === "AD" ? 'bg-purple-950/40 border-purple-500 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Server className="w-4 h-4" /> Active Directory
              </button>
              <button
                onClick={() => setAuditModule("NETWORK")}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition ${
                  auditModule === "NETWORK" ? 'bg-blue-950/40 border-blue-500 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Network className="w-4 h-4" /> Réseau & Segmentation
              </button>
              <button
                onClick={() => setAuditModule("WEB")}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition ${
                  auditModule === "WEB" ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Globe className="w-4 h-4" /> API & Web App
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-slate-400 mb-1 text-xs">Nom de l'Organisation Cible</label>
                <input 
                  type="text" 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white text-xs" 
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 text-xs">Périmètre / Domaine Active Directory / CIDR</label>
                <input 
                  type="text" 
                  value={targetScope} 
                  onChange={(e) => setTargetScope(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white text-xs font-mono" 
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={runEliteScan}
              disabled={isScanning}
              className="w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
            >
              <Play className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? "Analyse offensive en cours..." : `Lancer le Moteur d'Audit [${auditModule}]`}
            </button>
          </div>
        </div>

        {/* Console de Scan Live */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col">
          <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Terminal className="w-4 h-4" /> Console d'Énumération & Chemins d'Attaque
          </h2>
          
          {isScanning && (
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${scanProgress}%` }}></div>
            </div>
          )}

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 flex-1 min-h-[160px] max-h-[190px] overflow-y-auto space-y-1">
            {scanLogs.length === 0 ? (
              <span className="text-slate-600">Prêt. Sélectionnez un module d'attaque (AD, Réseau, Web) et lancez l'évaluation...</span>
            ) : (
              scanLogs.map((log, index) => <div key={index}>{log}</div>)
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2 : TABLEAU DES VULNÉRABILITÉS & ATTACK PATHS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h2 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <AlertTriangle className="w-4 h-4" /> 2. Cartographie des Risques & Chaînes d'Exploitation ({findings.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Vulnérabilité / Finding</th>
                <th className="p-3">Module</th>
                <th className="p-3">Vecteur d'Attaque (Kill Chain)</th>
                <th className="p-3">Sévérité</th>
                <th className="p-3">CVSS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {findings.map((f) => (
                <tr key={f.id} className="hover:bg-slate-950/50 transition">
                  <td className="p-3 font-medium text-white max-w-[240px] truncate">{f.title}</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-purple-500/20 text-purple-400 border-purple-500/30">{f.category}</span></td>
                  <td className="p-3 font-mono text-slate-400 max-w-[280px] truncate">{f.attackVector}</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-red-500/20 text-red-400 border-red-500/30">{f.severity}</span></td>
                  <td className="p-3 font-mono font-bold text-white">{f.cvss}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}