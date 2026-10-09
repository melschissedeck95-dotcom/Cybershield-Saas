import { ToolModule } from './offensiveTools'

export const WIRELESS_TOOLS: ToolModule[] = [
  {
    id: 'wifite_auditor',
    name: 'Wifite Advanced Wi-Fi Auditor (Automated)',
    category: 'Wireless',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1040 (Network Sniffing)',
    mitrePhase: 'Initial Access',
    description: 'Attaques automatisées et simultanées sur les réseaux Wi-Fi cibles (captures de handshake WPA/WPA2, PMKID et attaques WPS pin).',
    commandTemplate: 'wifite --interface wlan0mon --kill --dict /usr/share/wordlists/rockyou.txt --nodeauth',
    defaultArgs: { threads: '1', timeout: '45s', extraFlags: '--daemon --aircrack' }
  },
  {
    id: 'kismet_wireless',
    name: 'Kismet Enterprise RF & Wireless Sniffer',
    category: 'Wireless',
    riskLevel: 'MEDIUM',
    mitreTechnique: 'T1040 (Network Sniffing)',
    mitrePhase: 'Discovery',
    description: 'Cartographie passive et active du spectre RF, détection des points d’accès clandestins (rogue AP) et des clients associés.',
    commandTemplate: 'kismet -c wlan0mon --server-name CyberShield-RF --telemetry-broadcast',
    defaultArgs: { threads: '10', timeout: '60s', extraFlags: '--daemonize --no-ncurses' }
  },
  {
    id: 'aircrack_ng_suite',
    name: 'Aircrack-ng High-Speed Handshake Cracker',
    category: 'Wireless',
    riskLevel: 'CRITICAL',
    mitreTechnique: 'T1110.002 (Brute Force: Password Cracking)',
    mitrePhase: 'Initial Access',
    description: 'Cassage haute performance par force brute et dictionnaires des clés pré-partagées (PSK) WPA/WPA2 à partir de captures capturées.',
    commandTemplate: 'aircrack-ng -w /usr/share/wordlists/rockyou.txt -b {target} capture_handshake.cap',
    defaultArgs: { threads: '8', timeout: '30s', extraFlags: '-z -e TargetSSID' }
  },
  {
    id: 'eaphammer_enterprise',
    name: 'Eaphammer Rogue AP & Evil Twin Engine',
    category: 'Wireless',
    riskLevel: 'CRITICAL',
    mitreTechnique: 'T1557.001 (Adversary-in-the-Middle: LLMNR/NBT-NS Poisoning / Evil Twin)',
    mitrePhase: 'Initial Access',
    description: 'Cadre d’attaque par Evil Twin ciblant spécifiquement les réseaux WPA2/WPA3 Enterprise (PEAP/MSCHAPv2) pour interception de credentials.',
    commandTemplate: 'eaphammer -i wlan0mon --essid "Corporate-Secure" --auth wpa2 --creds --negotiate',
    defaultArgs: { threads: '4', timeout: '90s', extraFlags: '--karma --dns-spoof' }
  }
]