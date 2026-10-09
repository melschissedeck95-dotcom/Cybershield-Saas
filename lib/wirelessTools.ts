import { ToolModule } from './offensiveTools'

export const WIRELESS_TOOLS: ToolModule[] = [
  {
    id: 'wifite-deauth-handshake',
    name: 'Wifite Advanced Wi-Fi Auditor & Deauth',
    description: 'Automatisation de la mise en mode monitor, ciblage BSSID, injection de paquets de désauthentification et capture de handshake WPA2/WPA3.',
    category: 'Wireless',
    commandTemplate: 'sudo wifite --bssid {target} --clients --deauth 10 --kill --dict /usr/share/wordlists/rockyou.txt',
    defaultCommand: 'sudo wifite --bssid <target> --kill',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1040 (Network Sniffing)'
  },
  {
    id: 'kismet-rf-drone',
    name: 'Kismet Enterprise RF & Wireless Inspector',
    description: 'Inspection passive multispectrale des ondes radio, identification des points d’accès clandestins (Rogue AP) et des clients associés.',
    category: 'Wireless',
    commandTemplate: 'kismet -c wlan0mon --server-name CyberShield-C2-RF --override-lock --no-logging-gps',
    defaultCommand: 'kismet -c wlan0mon --server-name CyberShield-RF',
    riskLevel: 'LOW',
    mitreTechnique: 'T1590.001 (Gather Victim Network Information: IP/MAC Addresses)'
  }
]