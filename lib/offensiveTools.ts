export interface ToolModule {
  id: string
  name: string
  category: 'Web' | 'Active Directory' | 'Cloud' | 'Wireless' | 'OSINT'
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  mitreTechnique: string
  description: string
  commandTemplate?: string
  defaultCommand?: string
}

export const OFFENSIVE_TOOLS: ToolModule[] = [
  // --- MODULES WEB & DAST ---
  {
    id: 'nuclei_dast',
    name: 'Nuclei Enterprise DAST Suite',
    category: 'Web',
    riskLevel: 'CRITICAL',
    mitreTechnique: 'T1595.002 (Active Scanning)',
    description: 'Orchestration de scans de vulnérabilités web haut débit basés sur des templates YAML avancés.',
    commandTemplate: 'nuclei -u {target} -severity critical,high -json -silent'
  },
  {
    id: 'sqlmap_exploit',
    name: 'SQLMap Autonomous Engine',
    category: 'Web',
    riskLevel: 'CRITICAL',
    mitreTechnique: 'T1190 (Exploit Public-Facing Application)',
    description: 'Détection automatisée et exploitation de failles d’injection SQL avec extraction de données en aveugle.',
    commandTemplate: 'sqlmap -u "{target}" --batch --dump --risk=3 --level=5'
  },

  // --- MODULES ACTIVE DIRECTORY (AD) ---
  {
    id: 'bloodhound_ce',
    name: 'BloodHound AD Grapher',
    category: 'Active Directory',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1087.002 (Account Discovery: Domain Account)',
    description: 'Cartographie des relations de privilèges et des chemins d’escalade au sein d’un domaine Active Directory.',
    commandTemplate: 'bloodhound-python -u operator -p "Secur3Pass!" -d {target} -c All'
  },
  {
    id: 'kerberoast',
    name: 'Impacket Kerberoast Suite',
    category: 'Active Directory',
    riskLevel: 'CRITICAL',
    mitreTechnique: 'T558.003 (Steal or Forge Kerberos Tickets: Kerberoasting)',
    description: 'Extraction des tickets de service Kerberos associés aux comptes de domaine pour cassage de clés hors-ligne.',
    commandTemplate: 'GetUserSPNs.py corp.local/operator:Secur3Pass! -dc-ip {target} -request'
  },

  // --- MODULES CLOUD & INFRA ---
  {
    id: 'prowler_cloud',
    name: 'Prowler Cloud Security Assessment',
    category: 'Cloud',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1580 (Cloud Infrastructure Discovery)',
    description: 'Audit de conformité et d’exposition des ressources Cloud (AWS, Azure, GCP) selon les standards CIS.',
    commandTemplate: 'prowler aws --region us-east-1 --compliance cis_1.4 -M json'
  },

  // --- MODULES WIRELESS ---
  {
    id: 'wifite_auditor',
    name: 'Wifite Advanced Wi-Fi Auditor',
    category: 'Wireless',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1040 (Network Sniffing)',
    description: 'Attaques automatisées sur les réseaux sans fil (WPA2/WPA3, capture de handshake et attaques de désauthentification).',
    commandTemplate: 'wifite --interface wlan0mon --kill --dict /usr/share/wordlists/rockyou.txt'
  },

  // --- MODULES OSINT & RECON ---
  {
    id: 'amass_asm',
    name: 'OWASP Amass Advanced ASM',
    category: 'OSINT',
    riskLevel: 'MEDIUM',
    mitreTechnique: 'T1596 (Search Open Technical Databases)',
    description: 'Cartographie approfondie de la surface d’attaque externe par analyse de sources ouvertes et énumération de sous-domaines.',
    commandTemplate: 'amass enum -d {target} -active -brute -min-for-recursive 2'
  }
]