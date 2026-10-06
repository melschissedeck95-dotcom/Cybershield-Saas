"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  User,
  LogOut,
  LogIn,
  UserPlus,
  KeyRound,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Database,
  Building,
  Printer,
  Save,
  Activity
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Remediation {
  id: string;
  finding: string;
  severity: "Critique" | "Élevée" | "Moyenne" | "Faible";
  recommendation: string;
}

export default function PentestSaaS() {
  const [user, setUser] = useState<any>(null);
  const [authView, setAuthView] = useState<"signin" | "signup" | "forgot">("signin");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Champs Auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("Senior Pentester");

  // Données du Rapport de Pentest (Réel & Concret)
  const [clientName, setClientName] = useState("Acme Corp PME");
  const [targetScope, setTargetScope] = useState("https://app.acmecorp.com (IP: 192.168.10.50)");
  const [pentestType, setPentestType] = useState<"Black Box" | "Grey Box" | "White Box">("Grey Box");
  const [executiveSummary, setExecutiveSummary] = useState("L'audit d'intrusion de type boîte grise réalisé sur l'infrastructure web a mis en évidence des vulnérabilités critiques d'injection et de gestion d'authentification nécessitant un correctif immédiat.");
  const [cvssScore, setCvssScore] = useState(9.8);
  
  // Les 8 Étapes du Pentest
  const [step1Scope, setStep1Scope] = useState("Validation des Rules of Engagement (RoE) et signature du contrat de test.");
  const [step2Recon, setStep2Recon] = useState("Découverte des sous-domaines, analyse DNS et énumération des services actifs (Nmap/Amass).");
  const [step3Scan, setStep3Scan] = useState("Identification des versions de logiciels obsolètes et des points d'entrée API non sécurisés.");
  const [step4Exploit, setStep4Exploit] = useState("Exploitation réussie d'une faille d'injection SQL (SQLi) sur l'API d'authentification.");
  const [step5PostExploit, setStep5PostExploit] = useState("Élévation de privilèges et récupération des tokens de session administrateur.");
  const [step6Risk, setStep6Risk] = useState("Calcul de criticité CVSS v3.1 : 9.8 (Impact critique sur la confidentialité et l'intégrité).");
  const [step7Remediation, setStep7Remediation] = useState("Application de requêtes préparées et mise en place d'une authentification multifacteur (MFA).");
  const [step8Conclusion, setStep8Conclusion] = useState("Niveau de sécurité global insuffisant pour la production avant correction des points critiques.");

  const [remediations, setRemediations] = useState<Remediation[]>([
    { id: "1", finding: "Injection SQL sur le paramètre id_user", severity: "Critique", recommendation: "Utiliser des requêtes préparées (Prepared Statements) systématiquement." },
    { id: "2", finding: "Absence de limitation de taux (Rate Limiting) sur la route de login", severity: "Élevée", recommendation: "Implémenter un mécanisme de blocage par IP après 5 tentatives échouées." }
  ]);
  const [newFinding, setNewFinding] = useState("");
  const [newRec, setNewRec] = useState("");
  const [newSev, setNewSev] = useState<"Critique" | "Élevée" | "Moyenne" | "Faible">("Critique");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) fetchProfile(data.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) {
      setFullName(data.full_name);
      setCompanyName(data.company_name);
      setJobTitle(data.job_title);
    }
  };

  // Gestion de l'authentification réelle
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (authView === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, company_name: companyName, job_title: jobTitle }
        }
      });
      if (error) setMessage(`Erreur : ${error.message}`);
      else { setMessage("Compte créé avec succès ! Vérifiez vos e-mails si la confirmation est requise."); setShowAuthModal(false); }
    } else if (authView === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(`Erreur : ${error.message}`);
      else { setMessage("Connexion réussie !"); setShowAuthModal(false); }
    } else if (authView === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
      if (error) setMessage(`Erreur : ${error.message}`);
      else { setMessage("E-mail de réinitialisation envoyé !"); }
    }
    setLoading(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update({
      full_name: fullName,
      company_name: companyName,
      job_title: jobTitle
    }).eq("id", user.id);

    if (error) alert(`Erreur de mise à jour : ${error.message}`);
    else { alert("Profil mis à jour avec succès !"); setShowProfileModal(false); }
    setLoading(false);
  };

  const handleSaveReportToDB = async () => {
    if (!user) { alert("Veuillez vous connecter pour sauvegarder le rapport dans votre espace sécurisé."); setShowAuthModal(true); return; }
    setLoading(true);

    const { error } = await supabase.from("audit_reports").insert([{
      user_id: user.id,
      client_name: clientName,
      target_scope: targetScope,
      pentest_type: pentestType,
      executive_summary: executiveSummary,
      cvss_score: cvssScore,
      steps_data: {
        step1: step1Scope,
        step2: step2Recon,
        step3: step3Scan,
        step4: step4Exploit,
        step5: step5PostExploit,
        step6: step6Risk,
        step7: step7Remediation,
        step8: step8Conclusion
      },
      remediations: remediations
    }]);

    if (error) alert(`Erreur de sauvegarde : ${error.message}`);
    else alert("Rapport de Pentest professionnel enregistré et synchronisé dans la base de données !");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* HEADER PROFESSIONNEL */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-500 animate-pulse" />
          <div>
            <h1 className="text-lg font-black tracking-wider text-white uppercase">CyberShield Pentest SaaS</h1>
            <p className="text-xs text-slate-400">Plateforme d'Audit d'Intrusion & Conformité (PTES / ISO 27001 / PCI DSS)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <button onClick={() => setShowProfileModal(true)} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 text-xs flex items-center gap-2 cursor-pointer">
                <User className="w-4 h-4 text-blue-400" /> {fullName || user.email}
              </button>
              <button onClick={() => supabase.auth.signOut()} className="bg-red-600/20 hover:bg-red-600/30 text-red-400 p-2 rounded-lg border border-red-500/30 cursor-pointer" title="Déconnexion">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => { setAuthView("signin"); setShowAuthModal(true); }} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow">
              <LogIn className="w-4 h-4" /> Connexion / Inscription
            </button>
          )}

          <button onClick={handleSaveReportToDB} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer">
            <Save className="w-4 h-4" /> Sauvegarder Rapport
          </button>
          <button onClick={() => window.print()} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer border border-slate-700">
            <Printer className="w-4 h-4" /> Export PDF Exécutif
          </button>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        
        {/* COLONNE GAUCHE : CONFIGURATION ET RÈGLES D'ENGAGEMENT (SCOPE LÉGAL) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <Building className="w-4 h-4" /> 1. Cadre Légal & Paramètres de l'Audit
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Client / PME Audité</label>
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Type de Pentest (Méthodologie)</label>
                <select value={pentestType} onChange={(e) => setPentestType(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white font-bold">
                  <option value="Black Box">Black Box (Boîte Noire)</option>
                  <option value="Grey Box">Grey Box (Boîte Grise)</option>
                  <option value="White Box">White Box (Boîte Blanche)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Périmètre Validé (Scope & IP/URL autorisées par contrat)</label>
              <input type="text" value={targetScope} onChange={(e) => setTargetScope(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white font-mono" />
              <p className="text-[10px] text-emerald-400 mt-1">✓ Autorisation légale validée par signature électronique des Rules of Engagement (RoE).</p>
            </div>
          </div>

          {/* RÉSUMÉ EXÉCUTIF & SCORE CVSS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <AlertTriangle className="w-4 h-4" /> 2. Résumé Exécutif & Criticité Globale
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block text-slate-400 mb-1">Synthèse pour la Direction (CEO/CFO)</label>
                <textarea rows={3} value={executiveSummary} onChange={(e) => setExecutiveSummary(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Score CVSS Global</label>
                <input type="number" step="0.1" max="10" value={cvssScore} onChange={(e) => setCvssScore(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-red-400 font-extrabold text-center text-lg" />
                <span className="block text-[10px] text-center text-slate-500 mt-1">Niveau : CRITIQUE</span>
              </div>
            </div>
          </div>

          {/* PLAN DE REMÉDIATION CORRECTIF */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-xs">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <CheckCircle2 className="w-4 h-4" /> 3. Plan de Remédiation & Recommandations
            </h2>
            <div className="space-y-2">
              {remediations.map((rem, idx) => (
                <div key={rem.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-start">
                  <div>
                    <span className="font-bold text-white">#{idx + 1} - {rem.finding}</span>
                    <p className="text-slate-400 mt-1">Recommandation : {rem.recommendation}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400">{rem.severity}</span>
                    <button onClick={() => setRemediations(remediations.filter(r => r.id !== rem.id))} className="text-red-400 hover:text-red-300">✕</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
              <input type="text" placeholder="Vulnérabilité constatée..." value={newFinding} onChange={(e) => setNewFinding(e.target.value)} className="bg-slate-950 border border-slate-800 rounded p-2 text-white" />
              <input type="text" placeholder="Recommandation technique..." value={newRec} onChange={(e) => setNewRec(e.target.value)} className="bg-slate-950 border border-slate-800 rounded p-2 text-white" />
              <div className="flex gap-2">
                <select value={newSev} onChange={(e) => setNewSev(e.target.value as any)} className="bg-slate-950 border border-slate-800 rounded p-2 text-white font-bold">
                  <option value="Critique">Critique</option>
                  <option value="Élevée">Élevée</option>
                  <option value="Moyenne">Moyenne</option>
                  <option value="Faible">Faible</option>
                </select>
                <button onClick={() => { if (newFinding && newRec) { setRemediations([...remediations, { id: Math.random().toString(), finding: newFinding, severity: newSev, recommendation: newRec }]); setNewFinding(""); setNewRec(""); }}} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded font-bold cursor-pointer flex-1">Ajouter</button>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : LES 8 ÉTAPES OFFICIELLES DU PENTEST (PTES) */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-xs">
            <h2 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <Terminal className="w-4 h-4" /> 4. Les 8 Étapes Internationales du Pentest (PTES / OWASP)
            </h2>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              <div>
                <label className="block text-purple-300 font-bold mb-1">1. Interactions Préalables & Scope</label>
                <textarea rows={2} value={step1Scope} onChange={(e) => setStep1Scope(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" />
              </div>
              <div>
                <label className="block text-purple-300 font-bold mb-1">2. Reconnaissance & OSINT</label>
                <textarea rows={2} value={step2Recon} onChange={(e) => setStep2Recon(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" />
              </div>
              <div>
                <label className="block text-purple-300 font-bold mb-1">3. Analyse & Scan de Vulnérabilités</label>
                <textarea rows={2} value={step3Scan} onChange={(e) => setStep3Scan(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" />
              </div>
              <div>
                <label className="block text-purple-300 font-bold mb-1">4. Exploitation & Preuves de Concept (PoC)</label>
                <textarea rows={2} value={step4Exploit} onChange={(e) => setStep4Exploit(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" />
              </div>
              <div>
                <label className="block text-purple-300 font-bold mb-1">5. Post-Exploitation & Mouvement Latéral</label>
                <textarea rows={2} value={step5PostExploit} onChange={(e) => setStep5PostExploit(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" />
              </div>
              <div>
                <label className="block text-purple-300 font-bold mb-1">6. Évaluation des Risques & Scoring CVSS</label>
                <textarea rows={2} value={step6Risk} onChange={(e) => setStep6Risk(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" />
              </div>
              <div>
                <label className="block text-purple-300 font-bold mb-1">7. Plan de Remédiation Technique</label>
                <textarea rows={2} value={step7Remediation} onChange={(e) => setStep7Remediation(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" />
              </div>
              <div>
                <label className="block text-purple-300 font-bold mb-1">8. Conclusion & Synthèse Exécutive</label>
                <textarea rows={2} value={step8Conclusion} onChange={(e) => setStep8Conclusion(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALE AUTHENTIFICATION (CONNEXION, INSCRIPTION, MOT DE PASSE OUBLIÉ) */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative text-xs">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">✕</button>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">
                {authView === "signin" ? "Connexion à CyberShield SaaS" : authView === "signup" ? "Création de Compte Pentester" : "Réinitialisation de Mot de Passe"}
              </h3>
              <p className="text-slate-400">Accédez à votre espace sécurisé d'audit d'intrusion.</p>
            </div>

            {message && (
              <div className={`p-3 rounded ${message.includes("succès") || message.includes("envoyé") ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-3">
              {authView === "signup" && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-1">Nom Complet</label>
                    <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jean Dupont" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Cabinet / Entreprise</label>
                    <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white" />
                  </div>
                </>
              )}

              <div>
                <label className="block text-slate-400 mb-1">Adresse E-mail</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="expert@cyber.com" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white" />
              </div>

              {authView !== "forgot" && (
                <div>
                  <label className="block text-slate-400 mb-1">Mot de Passe</label>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white" />
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-2.5 rounded-lg cursor-pointer">
                {authView === "signin" ? "Se connecter" : authView === "signup" ? "Créer mon compte" : "Envoyer le lien de réinitialisation"}
              </button>
            </form>

            <div className="border-t border-slate-800 pt-3 flex flex-col gap-2 text-center">
              {authView === "signin" && (
                <>
                  <button onClick={() => setAuthView("signup")} className="text-blue-400 hover:underline cursor-pointer">Pas de compte ? S'inscrire</button>
                  <button onClick={() => setAuthView("forgot")} className="text-slate-400 hover:underline cursor-pointer">Mot de passe oublié ?</button>
                </>
              )}
              {authView === "signup" && (
                <button onClick={() => setAuthView("signin")} className="text-blue-400 hover:underline cursor-pointer">Déjà un compte ? Se connecter</button>
              )}
              {authView === "forgot" && (
                <button onClick={() => setAuthView("signin")} className="text-blue-400 hover:underline cursor-pointer">Retour à la connexion</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODALE GESTION DU PROFIL UTILISATEUR */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative text-xs">
            <button onClick={() => setShowProfileModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">✕</button>
            <h3 className="text-base font-bold text-white">Gestion de votre Compte Pentester</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Nom complet</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Cabinet / Entreprise</label>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Rôle technique</label>
                <select value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-bold">
                  <option value="Senior Pentester">Senior Pentester</option>
                  <option value="Lead Red Teamer">Lead Red Teamer</option>
                  <option value="Auditeur QSA / Conformité">Auditeur QSA / Conformité</option>
                  <option value="Cyber Security Manager">Cyber Security Manager</option>
                </select>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-2.5 rounded-lg cursor-pointer">Enregistrer les modifications</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}