"use client";

import React, { useState } from "react";
import { 
  Shield, 
  Terminal, 
  Building, 
  AlertTriangle, 
  Play, 
  FileText, 
  Wrench,
  CheckSquare,
  Network,
  Server,
  Globe
} from "lucide-react";

interface Vulnerability {
  id: string;
  title: string;
  category: "WEB" | "NETWORK" | "AD";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  cvss: number;
  owaspOrRef: string;
  remediation: string;
}

export default function PentestSaaS() {
  const [clientName, setClientName] = useState("Acme Corp PME");
  const [targetScope, setTargetScope] = useState("192.168.10.0/24 & corp.local");
  const [auditType, setAuditType] = useState<"WEB" | "NETWORK" | "AD">("AD");

  // État du scan automatisé
  const [isScanning, setIsScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scanProgress, setScanProgress] = useState(0);

  // Registre global des vulnérabilités multi-domaines
  const [vulns, setVulns] = useState<Vulnerability[]>([
    { 
      id: "1", 
      title: "Attaque Kerberoasting sur les comptes de service Active Directory", 
      category: "AD",
      severity: "CRITICAL", 
      cvss: 9.0, 
      owaspOrRef: "MITRE ATT&CK T1558.003",
      remediation: "Renforcer la complexité des mots de passe des comptes de service (128+ caractères) ou migrer vers des Group Managed Service Accounts (gMSA)."
    },
    { 
      id: "2", 
      title: "Services SMBv1 actifs et non authentifiés sur le réseau interne", 
      category: "NETWORK",
      severity: "HIGH", 
      cvss: 8.1, 
      owaspOrRef: "CWE-1188 / Réseau",
      remediation: "Désactiver définitivement le protocole obsolète SMBv1 sur l'ensemble des contrôleurs de domaine et des serveurs Windows du réseau."
    },
    { 
      id: "3", 
      title: "Vulnérabilité Injection SQL (SQLi) sur l'application Web principale", 
      category: "WEB",
      severity: "CRITICAL", 
      cvss: 9.8, 
      owaspOrRef: "A03:2021-Injection",
      remediation: "Utiliser des requêtes préparées (Prepared Statements) dans l'ORM ou le code source de l'application."
    }
  ]);

  const [newRemediation, setNewRemediation] = useState("");

  // Lancer le pentest automatisé selon le type choisi
  const runAutomatedPentest = () => {
    setIsScanning(true);
    setScanProgress(10);
    setScanLogs([
      `[*] Initialisation du moteur d'audit CyberShield [Mode: ${auditType}]...`, 
      `[*] Cible active : ${targetScope}`
    ]);

    setTimeout(() => {
      setScanProgress(40);
      if (auditType === "AD") {
        setScanLogs(prev => [...prev, "[*] Énumération des contrôleurs de domaine (LDAP/RPC)...", "[*] Analyse des objets du domaine et des ACLs en cours..."]);
      } else if (auditType === "NETWORK") {
        setScanLogs(prev => [...prev, "[*] Scan SYN TCP des ports ouverts (Nmap engine)...", "[*] Détection des bannières de services et failles réseaux..."]);
      } else {
        setScanLogs(prev => [...prev, "[*] Analyse heuristique des points d'entrée Web & OWASP Top 10..."]);
      }
    }, 1500);

    setTimeout(() => {
      setScanProgress(80);
      if (auditType === "AD") {
        setScanLogs(prev => [...prev, "[!] Alerte AD : Chemins d'escalade de privilèges (Path to Domain Admin) détectés !"]);
      } else if (auditType === "NETWORK") {
        setScanLogs(prev => [...prev, "[!] Alerte Réseau : Ports de gestion non sécurisés exposés (Telnet/FTP)."]);
      } else {
        setScanLogs(prev => [...prev, "[!] Alerte Web : Mauvaise configuration des en-têtes de sécurité."]);
      }
    }, 3000);

    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      setScanLogs(prev => [...prev, "[✔] Audit d'infrastructure terminé. Rapport consolidé généré."]);
      
      // Ajout dynamique d'une finding contextuelle
      let dynamicVuln: Vulnerability;
      if (auditType === "AD") {
        dynamicVuln = {
          id: Date.now().toString(),
          title: "Droits de délégation non sécurisés (Unconstrained Delegation)",
          category: "AD",
          severity: "CRITICAL",
          cvss: 8.8,
          owaspOrRef: "MITRE ATT&CK T1556",
          remediation: "Restreindre la délégation Kerberos en passant à une délégation contrainte (Constrained Delegation) ou basée sur les ressources (RBCD)."
        };
      } else if (auditType === "NETWORK") {
        dynamicVuln = {
          id: Date.now().toString(),
          title: "Exposition de services SNMP avec la communauté par défaut (public)",
          category: "NETWORK",
          severity: "MEDIUM",
          cvss: 5.8,
          owaspOrRef: "CWE-1188 / SNMP",
          remediation: "Modifier les chaînes de communauté SNMP par défaut ou migrer vers SNMPv3 avec authentification et chiffrement chiffrés."
        };
      } else {
        dynamicVuln = {
          id: Date.now().toString(),
          title: "Absence de protection contre les attaques de force brute (Rate Limiting)",
          category: "WEB",
          severity: "HIGH",
          cvss: 7.5,
          owaspOrRef: "A07:2021-Identification Failures",
          remediation: "Mettre en place un système de limitation de requêtes (Rate Limiting) et un captcha sur les formulaires d'authentification."
        };
      }
      setVulns(v => [dynamicVuln, ...v]);
    }, 4500);
  };

  const removeVuln = (id: string) => {
    setVulns(vulns.filter(v => v.id !== id));
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "CRITICAL": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "HIGH": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "MEDIUM": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "AD": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "NETWORK": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans p-6 space-y-6">
      {/* HEADER */}
      <header className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-xl gap-4">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-500 animate-pulse" />
          <div>
            <h1 className="text-lg font-black tracking-wider text-white uppercase">CyberShield Pentest SaaS</h1>
            <p className="text-xs text-slate-400">Plateforme d'Audit d'Intrusion Multi-Vecteurs (Web, Réseau & Active Directory)</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => alert("Génération du rapport exécutif global d'infrastructure (Web, Réseau, AD)...")} 
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg transition"
          >
            <FileText className="w-4 h-4" /> Exporter le Rapport Global
          </button>
        </div>
      </header>

      {/* SECTION 1 : CHOIX DU MOTEUR D'AUDIT & PARAMÈTRES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paramètres & Choix de l'angle d'attaque */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <Building className="w-4 h-4" /> 1. Sélection du Vecteur d'Audit
            </h2>

            {/* Onglets de sélection du type d'audit */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setAuditType("AD")}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition ${
                  auditType === "AD" 
                    ? 'bg-purple-950/40 border-purple-500 text-purple-300 shadow-md' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Server className="w-4 h-4" /> Active Directory
              </button>
              <button
                onClick={() => setAuditType("NETWORK")}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition ${
                  auditType === "NETWORK" 
                    ? 'bg-blue-950/40 border-blue-500 text-blue-300 shadow-md' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Network className="w-4 h-4" /> Réseau / IP
              </button>
              <button
                onClick={() => setAuditType("WEB")}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition ${
                  auditType === "WEB" 
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow-md' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Globe className="w-4 h-4" /> Application Web
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-slate-400 mb-1 text-xs">Infrastructure / Client Cible</label>
                <input 
                  type="text" 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white text-xs" 
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 text-xs">
                  {auditType === "AD" ? "Nom du Domaine / Contrôleur (ex: corp.local)" : auditType === "NETWORK" ? "Plage IP / CIDR (ex: 192.168.1.0/24)" : "URL Web Cible"}
                </label>
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
              onClick={runAutomatedPentest}
              disabled={isScanning}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer ${
                isScanning 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : auditType === "AD" 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
                    : auditType === "NETWORK"
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
              }`}
            >
              <Play className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? `Scan ${auditType} en cours...` : `Lancer le Moteur d'Audit [${auditType}]`}
            </button>
          </div>
        </div>

        {/* Console de Scan en Direct */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col">
          <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Terminal className="w-4 h-4" /> Console d'Analyse Infrastructure & Logs
          </h2>
          
          {isScanning && (
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
          )}

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 flex-1 min-h-[160px] max-h-[190px] overflow-y-auto space-y-1">
            {scanLogs.length === 0 ? (
              <span className="text-slate-600">Prêt. Sélectionnez un module (Active Directory, Réseau ou Web) et lancez l'audit...</span>
            ) : (
              scanLogs.map((log, index) => (
                <div key={index}>{log}</div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2 : REGISTRE GLOBAL DES VULNÉRABILITÉS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> 2. Posture de Sécurité & Findings Consolidés ({vulns.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Vulnérabilité / Risque</th>
                <th className="p-3">Vecteur</th>
                <th className="p-3">Référentiel</th>
                <th className="p-3">Sévérité</th>
                <th className="p-3">CVSS</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {vulns.map((v) => (
                <tr key={v.id} className="hover:bg-slate-950/50 transition">
                  <td className="p-3 font-medium text-white max-w-[280px] truncate">{v.title}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCategoryBadge(v.category)}`}>
                      {v.category}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-400">{v.owaspOrRef}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(v.severity)}`}>
                      {v.severity}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-white">{v.cvss}</td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => removeVuln(v.id)} 
                      className="text-slate-500 hover:text-red-400 p-1 cursor-pointer transition"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3 : CONSIGNES DE REMÉDIATION MULTI-DOMAINES */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
          <Wrench className="w-4 h-4" /> 3. Consignes de Remédiation & Hardening Infrastructure
        </h2>
        <p className="text-xs text-slate-400">
          Plans d'action correctifs détaillés pour sécuriser les contrôleurs Active Directory, fermer les vecteurs d'attaque réseaux et durcir les applications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vulns.map((v) => (
            <div key={v.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${getCategoryBadge(v.category)}`}>
                    {v.category}
                  </span>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${getSeverityBadge(v.severity)}`}>
                    CVSS {v.cvss}
                  </span>
                </div>
                <p className="text-xs font-bold text-white pt-1">{v.title}</p>
              </div>
              <div className="text-[11px] text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800/60 space-y-1">
                <p className="font-semibold text-amber-300 flex items-center gap-1 text-[10px] uppercase">
                  <CheckSquare className="w-3 h-3" /> Correctif :
                </p>
                <p className="leading-relaxed">{v.remediation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}