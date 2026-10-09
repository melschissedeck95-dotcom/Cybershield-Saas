import { ToolModule } from './offensiveTools'

export const WEB_TOOLS: ToolModule[] = [
  {
    id: 'nuclei_dast',
    name: 'Nuclei Enterprise DAST Suite (Hyper-Scan)',
    category: 'Web',
    riskLevel: 'CRITICAL',
    mitreTechnique: 'T1595.002 (Active Scanning)',
    mitrePhase: 'Execution',
    description: 'Scans de vulnérabilités web asynchrones ultra-rapides basés sur des templates YAML compilés et personnalisés.',
    commandTemplate: 'nuclei -u {target} -severity critical,high,medium -json -silent -rate-limit 150',
    defaultArgs: { threads: '150', timeout: '5s', extraFlags: '-random-agent -c 50' }
  },
  {
    id: 'sqlmap_exploit',
    name: 'SQLMap Autonomous Engine (Multi-Threaded)',
    category: 'Web',
    riskLevel: 'CRITICAL',
    mitreTechnique: 'T1190 (Exploit Public-Facing Application)',
    mitrePhase: 'Execution',
    description: 'Moteur d’injection SQL automatisé avec extraction massive de données en aveugle et contournement WAF.',
    commandTemplate: 'sqlmap -u "{target}" --batch --dump --risk=3 --level=5 --threads=10',
    defaultArgs: { threads: '10', timeout: '15s', extraFlags: '--tamper=space2comment --tor' }
  },
  {
    id: 'ffuf_fuzzer',
    name: 'FFUF High-Speed Web Fuzzer',
    category: 'Web',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1595.003 (Wordlist Scanning)',
    mitrePhase: 'Discovery',
    description: 'Découverte ultrarapide de répertoires cachés, de fichiers sensibles de configuration et d’API endpoints.',
    commandTemplate: 'ffuf -u {target}/FUZZ -w /usr/share/wordlists/dirb/common.txt -json -s',
    defaultArgs: { threads: '200', timeout: '3s', extraFlags: '-fc 404,403 -ac' }
  },
  {
    id: 'zap_baseline',
    name: 'OWASP ZAP Automated DAST Baseline',
    category: 'Web',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1595.002 (Active Scanning)',
    mitrePhase: 'Execution',
    description: 'Scan automatisé de vulnérabilités web et analyse de conformité OWASP Top 10 via le framework ZAP headless.',
    commandTemplate: 'zap-cli quick-scan --self-contained --start-options "-config api.disablekey=true" {target}',
    defaultArgs: { threads: '20', timeout: '40s', extraFlags: '--spider --ajax-spider' }
  }
]