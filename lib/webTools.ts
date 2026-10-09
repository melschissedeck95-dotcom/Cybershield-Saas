import { ToolModule } from './offensiveTools'

export const WEB_TOOLS: ToolModule[] = [
  {
    id: 'nuclei-enterprise',
    name: 'Nuclei Enterprise DAST Suite',
    description: 'Scan de vulnérabilités hautement ciblé avec templates personnalisés, détection de CVE 0-day et rate-limiting optimisé.',
    category: 'Web',
    commandTemplate: 'nuclei -u https://{target} -t cves/,vulnerabilities/,misconfiguration/ -severity critical,high,medium -rate-limit 150 -json -o scan_results.json',
    defaultCommand: 'nuclei -u https://<target> -t cves/ -severity critical,high',
    riskLevel: 'CRITICAL',
    mitreTechnique: 'T1595.002 (Active Scanning)'
  },
  {
    id: 'sqlmap-advanced-tamper',
    name: 'SQLMap Enterprise Engine + Tamper WAF',
    description: 'Injection SQL automatisée en mode aveugle (Boolean/Time-based) avec scripts de contournement WAF (space2comment, charencode).',
    category: 'Web',
    commandTemplate: 'sqlmap -u "https://{target}/api/v1/resource?id=1" --tamper=space2comment,between --risk=3 --level=4 --dbs --batch --threads=5',
    defaultCommand: 'sqlmap -u "https://<target>/api/v1/resource?id=1" --dump',
    riskLevel: 'CRITICAL',
    mitreTechnique: 'T1190 (Exploit Public-Facing Application)'
  },
  {
    id: 'ffuf-fuzzing',
    name: 'FFUF High-Speed Web Fuzzing',
    description: 'Énumération ultra-rapide de répertoires cachés, paramètres GET/POST et sous-domaines virtuels.',
    category: 'Web',
    commandTemplate: 'ffuf -u https://{target}/FUZZ -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-medium-directories.txt -fc 403,404 -t 80',
    defaultCommand: 'ffuf -u https://<target>/FUZZ -w common.txt',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1583.008 (Acquire Infrastructure: Web Services)'
  }
]