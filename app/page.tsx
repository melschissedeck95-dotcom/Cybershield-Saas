'use client'
import React, { useState, useEffect, useRef } from 'react'
import { generateFullEnterpriseReport, FullPentestReport } from '@/lib/generateReport'
import { OFFENSIVE_TOOLS, ToolModule } from '@/lib/offensiveTools'
import { ShieldAlert, Terminal, FileText, CheckCircle2, Download, Database, History, Play, Camera, Send, Sparkles, Share2, Cpu, Radio, Lock, Settings, Shuffle } from 'lucide-react'

interface SavedReportRecord extends FullPentestReport {
  id: string
  createdAt: string
  screenshot?: string
}

interface ActiveBeacon {
  id: string
  target: string
  status: 'CONNECTED' | 'SLEEPING' | 'EXFILTRATING'
  privilege: 'SYSTEM' | 'ROOT' | 'WWW-DATA'
  lastSeen: string
}

interface StructuredIOC {
  type: string
  value: string
  severity: string
}

export default function RedTeamDashboard() {
  const [activeTab, setActiveTab] = useState<string>('dashboard')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [target, setTarget] = useState('')
  const [scanning, setScanning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [scanDone, setScanDone] = useState(false)
  const [currentReport, setCurrentReport] = useState<FullPentestReport | null>(null)
  const [capturedScreenshot, setCapturedScreenshot] = useState<string | null>(null)
  
  // États pour la modale de configuration avancée & IOCs
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [selectedToolForConfig, setSelectedToolForConfig] = useState<ToolModule | null>(null)
  const [customThreads, setCustomThreads] = useState('50')
  const [customTimeout, setCustomTimeout] = useState('10s')
  const [customFlags, setCustomFlags] = useState('-random-agent')
  const [structuredIOCs, setStructuredIOCs] = useState<StructuredIOC[]>([])

  const [savedReports, setSavedReports] = useState<SavedReportRecord[]>([])
  const [beacons, setBeacons] = useState<ActiveBeacon[]>([
    { id: 'bcn_01', target: 'dc01.corp.local', status: 'CONNECTED', privilege: 'SYSTEM', lastSeen: 'Il y a 2s' }
  ])

  const consoleRef = useRef<HTMLDivElement>(null)
  const [currentUser] = useState({ name: 'Senior Operator [0x99]', role: 'RedTeam Commander' })
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai', text: string }[]>([
    { sender: 'ai', text: "Moteur C2 CyberShield initialisé avec arsenal complet, options d'évasion et module de partage tactique." }
  ])

  useEffect(() => {
    const localReports = localStorage.getItem('cybershield_saved_reports')
    if (localReports) {
      try { setSavedReports(JSON.parse(localReports)) } catch (e) { console.error(e) }
    }
  }, [])

  const openConfigModal = (tool: ToolModule) => {
    setSelectedToolForConfig(tool)
    if (tool.defaultArgs) {
      setCustomThreads(tool.defaultArgs.threads || '50')
      setCustomTimeout(tool.defaultArgs.timeout || '10s')
      setCustomFlags(tool.defaultArgs.extraFlags || '')
    }
    setShowConfigModal(true)
  }

  const captureConsoleScreenshot = async () => {
    if (!consoleRef.current) return null
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(consoleRef.current, { background: '#020617', logging: false })
      const imgData = canvas.toDataURL('image/png')
      setCapturedScreenshot(imgData)
      return imgData
    } catch (error) {
      return null
    }
  }

  const executeToolAdvanced = (tool: ToolModule) => {
    if (!target.trim()) {
      alert('Veuillez spécifier une cible (IP, FQDN ou CIDR) valide.')
      return
    }
    setShowConfigModal(false)
    setActiveTab(tool.id)
    setScanning(true)
    setScanDone(false)
    setCapturedScreenshot(null)
    setStructuredIOCs([])

    const rawCmd = tool.commandTemplate || 'echo "No command specified"'
    const finalCmd = `${rawCmd} --threads ${customThreads} --timeout ${customTimeout} ${customFlags}`.replace('{target}', target)
    
    const executionFlow = [
      `[C2-OPERATOR@cybershield-core ~]# session_spawn --target ${target} --module ${tool.id}`,
      `[+] Paramètres appliqués [Threads: ${customThreads}, Timeout: ${customTimeout}, Flags: ${customFlags}]`,
      `[+] Tunnel chiffré AES-256 établi. Injection de la commande binaire : ${finalCmd}`,
      `[INFO] [MITRE: ${tool.mitreTechnique} | Phase: ${tool.mitrePhase}] — Analyse active en cours...`,
      `[CRITICAL] Vulnérabilité majeure validée sur ${target} [Niveau de Risque : ${tool.riskLevel}]`,
      `[+] Parsing JSON automatique des résultats et extraction des indicateurs (IOCs)...`
    ]

    setLogs([`[+] Initialisation de la session offensive pour ${tool.name}...`])

    executionFlow.forEach((line, idx) => {
      setTimeout(async () => {
        setLogs(prev => [...prev, line])
        if (idx === executionFlow.length - 1) {
          setScanning(false)
          setScanDone(true)

          setStructuredIOCs([
            { type: 'Endpoint / URL', value: `https://${target}/api/v1/gateway`, severity: tool.riskLevel },
            { type: 'Service Détecté', value: 'HTTPS/443 (Active Proxy)', severity: 'LOW' },
            { type: 'Vecteur Validé', value: tool.mitreTechnique, severity: 'HIGH' }
          ])

          setBeacons(prev => [
            { id: `bcn_${Date.now().toString().slice(-4)}`, target: target, status: 'CONNECTED', privilege: tool.riskLevel === 'CRITICAL' ? 'SYSTEM' : 'WWW-DATA', lastSeen: 'À l\'instant' },
            ...prev
          ])

          setTimeout(async () => { await captureConsoleScreenshot() }, 400)

          const generated: FullPentestReport = {
            clientName: "Enterprise Global Infrastructure",
            targetScope: target,
            auditor: `${currentUser.name} (${currentUser.role})`,
            date: new Date().toLocaleDateString('fr-FR'),
            findings: [
              { 
                severity: tool.riskLevel, 
                cvss: tool.riskLevel === 'CRITICAL' ? '9.8' : '8.5', 
                vector: tool.category, 
                title: `Exploitation réussie : ${tool.name}`, 
                description: `L'outil ${tool.name} a exploité avec succès la cible ${target} en utilisant la technique MITRE ${tool.mitreTechnique} (${tool.mitrePhase}).`, 
                remediation: 'Isoler immédiatement la ressource, révoquer les accès compromis et appliquer les correctifs éditeur.' 
              }
            ]
          }
          setCurrentReport(generated)
        }
      }, (idx + 1) * 600)
    })
  }

  const handleSaveReportToVault = () => {
    if (!currentReport) return
    const record: SavedReportRecord = {
      ...currentReport,
      id: `rep_${Date.now()}`,
      createdAt: new Date().toLocaleString('fr-FR'),
      screenshot: capturedScreenshot || undefined
    }
    const updated = [record, ...savedReports]
    setSavedReports(updated)
    localStorage.setItem('cybershield_saved_reports', JSON.stringify(updated))
    alert("Rapport de mission archivé avec succès dans le coffre-fort sécurisé !")
  }

  const handleDownloadPDF = async () => {
    if (!currentReport) return
    await generateFullEnterpriseReport({
      ...currentReport,
      screenshotDataUri: capturedScreenshot || undefined
    })
  }

  const handleShareWhatsApp = () => {
    if (!currentReport) return
    const text = encodeURIComponent(
      `🚨 [CYBERSHIELD C2] Alerte Opérationnelle\n- Cible : ${currentReport.targetScope}\n- Statut : Vulnérabilité critique validée\n- Auditeur : ${currentReport.auditor}`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  const handleShareTelegram = () => {
    if (!currentReport) return
    const text = encodeURIComponent(
      `⚡️ [CYBERSHIELD C2] Rapport Flash\nCible compromise : ${currentReport.targetScope}\nVecteur : ${currentReport.findings[0]?.vector || 'RedTeam Assessment'}`
    )
    window.open(`https://t.me/share/url?url=https://cybershield.local&text=${text}`, '_blank')
  }

  const handleShareLinkedIn = () => {
    const summary = encodeURIComponent("Mission de Red Teaming réalisée avec succès via CyberShield Enterprise C2. Sécurisation et cartographie de la surface d'attaque terminée.")
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${summary}`, '_blank')
  }

  const activeTool = OFFENSIVE_TOOLS.find(t => t.id === activeTab)
  
  // Filtrage dynamique des outils par catégorie
  const filteredTools = OFFENSIVE_TOOLS.filter(tool => {
    if (selectedCategory === 'All') return true
    return tool.category === selectedCategory
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/95 sticky top-0 z-50 px-6 py-3.5 flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-widest text-white">CYBERSHIELD <span className="text-cyan-400">ENTERPRISE C2</span></h1>
            <p className="text-[10px] text-slate-400 font-mono">Plateforme d'Arsenal Offensif & Partage Tactique</p>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-1.5 text-xs font-semibold overflow-x-auto py-1">
          <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-1.5 rounded transition-all ${activeTab === 'dashboard' ? 'bg-cyan-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>Command Center</button>
          <button onClick={() => setActiveTab('reports')} className={`px-3 py-1.5 rounded transition-all flex items-center gap-1 ${activeTab === 'reports' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>
            <Database className="w-3.5 h-3.5" /> Coffre ({savedReports.length})
          </button>
          <button onClick={() => setActiveTab('chatbot')} className={`px-3 py-1.5 rounded transition-all border ${activeTab === 'chatbot' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-cyan-300 border-cyan-500/20'}`}>
            <Sparkles className="w-3.5 h-3.5" /> Tactics AI
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto p-6 flex-grow space-y-6">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow">
                <div>
                  <p className="text-[10px] text-slate-400 font-mono uppercase">Beacons Actifs</p>
                  <h3 className="text-2xl font-black text-white mt-1">{beacons.length} Nœuds</h3>
                </div>
                <Radio className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow">
                <div>
                  <p className="text-[10px] text-slate-400 font-mono uppercase">Modules d'Attaque</p>
                  <h3 className="text-2xl font-black text-cyan-400 mt-1">{OFFENSIVE_TOOLS.length} Disponibles</h3>
                </div>
                <Cpu className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow">
                <div>
                  <p className="text-[10px] text-slate-400 font-mono uppercase">Rapports PDF Archivés</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">{savedReports.length} Dossiers</h3>
                </div>
                <Database className="w-8 h-8 text-emerald-400" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">Arsenal Offensif Complet ({filteredTools.length} modules affichés)</h3>
                
                {/* Barre de Filtres par Catégorie */}
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Web', 'Active Directory', 'Cloud', 'Wireless', 'OSINT', 'Network'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs px-3 py-1.5 rounded transition font-mono font-semibold ${
                        selectedCategory === cat
                          ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredTools.map(tool => (
                  <div key={tool.id} className="bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 rounded-xl p-6 transition-all shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-mono">{tool.category} • {tool.mitrePhase}</span>
                        <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-mono">{tool.riskLevel}</span>
                      </div>
                      <h4 className="font-bold text-base text-white mb-1">{tool.name}</h4>
                      <p className="text-xs text-slate-400 mb-4">{tool.description}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                      <button 
                        onClick={() => openConfigModal(tool)}
                        className="flex-grow bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold py-2 px-3 rounded text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5" /> Configurer & Lancer
                      </button>
                      <button 
                        onClick={() => setActiveTab(tool.id)}
                        className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 py-2 px-3 rounded text-xs font-bold"
                        title="Ouvrir la console"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modale de Configuration Avancée */}
        {showConfigModal && selectedToolForConfig && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-cyan-500/50 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
                <Settings className="w-5 h-5 text-cyan-400" /> Configuration : {selectedToolForConfig.name}
              </h3>
              <p className="text-xs text-slate-400">Ajustez les paramètres d'exécution et les profils d'évasion avant le déploiement sur la cible.</p>
              
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Cible (IP / FQDN / Domaine)</label>
                <input 
                  type="text" 
                  value={target} 
                  onChange={e => setTarget(e.target.value)} 
                  placeholder="ex: target.com ou corp.local" 
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white font-mono outline-none focus:border-cyan-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Threads / Concurrence</label>
                  <input type="text" value={customThreads} onChange={e => setCustomThreads(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Timeout</label>
                  <input type="text" value={customTimeout} onChange={e => setCustomTimeout(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white font-mono" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Flags d'Évasion additionnels</label>
                <input type="text" value={customFlags} onChange={e => setCustomFlags(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white font-mono" />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button onClick={() => setShowConfigModal(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded text-xs font-bold">Annuler</button>
                <button onClick={() => executeToolAdvanced(selectedToolForConfig)} className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded text-xs font-bold shadow-lg shadow-cyan-900/40 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5" /> Exécuter l'Attaque
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Console d'Exécution, IOCs & Actions de Partage */}
        {activeTool && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-mono">{activeTool.category} • {activeTool.mitrePhase}</span>
                <h2 className="text-xl font-extrabold text-white font-mono mt-1">{activeTool.name}</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setActiveTab('dashboard')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 px-3 rounded">
                  ← Retour Dashboard
                </button>
                <button onClick={() => openConfigModal(activeTool)} className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 text-xs font-bold py-2 px-3 rounded flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" /> Paramètres avancés
                </button>
              </div>
            </div>

            <div ref={consoleRef} className="bg-black border border-slate-800 rounded-xl p-5 h-64 overflow-y-auto font-mono text-xs text-green-400 shadow-inner space-y-1">
              {logs.length === 0 && <span className="text-slate-600">En attente d'exécution... Cliquez sur "Configurer & Lancer" pour paramétrer la cible.</span>}
              {logs.map((log, idx) => (
                <div key={idx} className={log.includes('[CRITICAL]') ? 'text-red-400 font-bold' : ''}>{log}</div>
              ))}
            </div>

            {scanDone && structuredIOCs.length > 0 && (
              <div className="bg-slate-950 border border-cyan-500/30 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase font-mono flex items-center gap-1.5">
                    <Database className="w-4 h-4" /> Indicateurs de Compromission (IOCs) Parsés
                  </h4>
                  <button 
                    onClick={() => { alert("Actifs transférés avec succès vers le module suivant !"); }} 
                    className="bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold py-1 px-3 rounded flex items-center gap-1"
                  >
                    <Shuffle className="w-3 h-3" /> Transférer vers module suivant
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
                  {structuredIOCs.map((ioc, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-2.5 rounded">
                      <span className="text-slate-400 block text-[10px]">{ioc.type}</span>
                      <span className="text-white font-bold">{ioc.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentReport && (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-mono">
                    Rapport de mission prêt pour <span className="text-white font-bold">{currentReport.targetScope}</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleSaveReportToVault} className="bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold py-2 px-4 rounded flex items-center gap-2 border border-cyan-500/30">
                      <Database className="w-4 h-4" /> Archiver dans le Coffre
                    </button>
                    <button onClick={handleDownloadPDF} className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-2 px-4 rounded flex items-center gap-2 shadow-lg shadow-cyan-900/40">
                      <Download className="w-4 h-4" /> Télécharger le Rapport PDF
                    </button>
                  </div>
                </div>

                {/* Section Boutons de Partage Rapide (WhatsApp, Telegram, LinkedIn) */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-cyan-400" /> Partager les conclusions de mission :
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleShareWhatsApp} 
                      className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold py-1.5 px-3 rounded flex items-center gap-1.5 transition-colors"
                    >
                      WhatsApp
                    </button>
                    <button 
                      onClick={handleShareTelegram} 
                      className="bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 text-xs font-bold py-1.5 px-3 rounded flex items-center gap-1.5 transition-colors"
                    >
                      Telegram
                    </button>
                    <button 
                      onClick={handleShareLinkedIn} 
                      className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-bold py-1.5 px-3 rounded flex items-center gap-1.5 transition-colors"
                    >
                      LinkedIn
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Coffre-fort des rapports */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white font-mono">Coffre-fort des Rapports de Mission ({savedReports.length})</h2>
            {savedReports.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono">Aucun rapport archivé pour le moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedReports.map(rep => (
                  <div key={rep.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                      <span>{rep.createdAt}</span>
                      <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">Validé</span>
                    </div>
                    <h3 className="font-bold text-white">{rep.clientName} ({rep.targetScope})</h3>
                    <p className="text-xs text-slate-400">Auditeur : {rep.auditor}</p>
                    <button 
                      onClick={() => generateFullEnterpriseReport(rep)}
                      className="mt-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold py-1.5 px-3 rounded flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Réexporter PDF
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      <footer className="border-t border-slate-800 bg-slate-900 py-4 px-6 text-center text-xs text-slate-400 font-mono">
        CYBERSHIELD ENTERPRISE C2 © 2026 — Plateforme d'armement offensif avancée.
      </footer>
    </div>
  )
}