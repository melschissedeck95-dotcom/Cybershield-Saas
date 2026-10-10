import { ToolModule } from './offensiveTools'

export const NETWORK_TOOLS: ToolModule[] = [
  // --- Groupe 1 : Scans de Découverte & Ports (TCP/UDP/SCTP) ---
  {
    id: 'nmap_stealth_syn',
    name: 'Nmap Stealth SYN Scanner (Half-Open)',
    category: 'Network',
    riskLevel: 'MEDIUM',
    mitreTechnique: 'T1046 (Network Service Discovery)',
    mitrePhase: 'Discovery',
    description: 'Scan SYN furtif semi-ouvert haut débit pour identifier les ports TCP ouverts sans établir de connexion complète.',
    commandTemplate: 'nmap -sS -T4 -p- --min-rate 1000 -v {target}',
    defaultArgs: { threads: '50', timeout: '20s', extraFlags: '-Pn --defeat-rst-ratelimit' }
  },
  {
    id: 'nmap_tcp_connect',
    name: 'Nmap Full TCP Connect Scan',
    category: 'Network',
    riskLevel: 'LOW',
    mitreTechnique: 'T1046 (Network Service Discovery)',
    mitrePhase: 'Discovery',
    description: 'Scan TCP complet établissant les poignées de main (handshake 3-way), idéal en l’absence de privilèges raw socket.',
    commandTemplate: 'nmap -sT -T4 --top-ports 1000 {target}',
    defaultArgs: { threads: '30', timeout: '25s', extraFlags: '-v' }
  },
  {
    id: 'nmap_udp_scan',
    name: 'Nmap UDP Port & Service Scanner',
    category: 'Network',
    riskLevel: 'MEDIUM',
    mitreTechnique: 'T1046 (Network Service Discovery)',
    mitrePhase: 'Discovery',
    description: 'Cartographie des services UDP critiques (DNS, SNMP, DHCP, NTP, TFTP) souvent omis lors des audits.',
    commandTemplate: 'nmap -sU --top-ports 100 --open {target}',
    defaultArgs: { threads: '30', timeout: '60s', extraFlags: '--max-retries 2' }
  },
  {
    id: 'nmap_sctp_init',
    name: 'Nmap SCTP INIT Scan',
    category: 'Network',
    riskLevel: 'MEDIUM',
    mitreTechnique: 'T1046 (Network Service Discovery)',
    mitrePhase: 'Discovery',
    description: 'Scan des services basés sur le protocole SCTP (Stream Control Transmission Protocol) utilisés en télécoms et VoIP.',
    commandTemplate: 'nmap -sY -p- --min-rate 500 {target}',
    defaultArgs: { threads: '20', timeout: '30s', extraFlags: '-Pn' }
  },
  {
    id: 'nmap_ping_sweep',
    name: 'Nmap ICMP / ARP Discovery Ping Sweep',
    category: 'Network',
    riskLevel: 'LOW',
    mitreTechnique: 'T1018 (Remote System Discovery)',
    mitrePhase: 'Discovery',
    description: 'Identification rapide de tous les hôtes actifs sur un sous-réseau sans exécuter de port scan complet.',
    commandTemplate: 'nmap -sn -PE -PR {target}',
    defaultArgs: { threads: '100', timeout: '10s', extraFlags: '--min-parallelism 50' }
  },

  // --- Groupe 2 : Fingerprinting, OS & Evasion de Pare-feu ---
  {
    id: 'nmap_os_service_fingerprint',
    name: 'Nmap OS & Service Version Fingerprinting',
    category: 'Network',
    riskLevel: 'LOW',
    mitreTechnique: 'T1082 (System Information Discovery)',
    mitrePhase: 'Discovery',
    description: 'Détection précise de la version des services et de l’OS par analyse des réponses de la pile TCP/IP.',
    commandTemplate: 'nmap -sV -O --version-intensity 5 {target}',
    defaultArgs: { threads: '15', timeout: '30s', extraFlags: '--osscan-guess' }
  },
  {
    id: 'nmap_aggressive_all',
    name: 'Nmap Aggressive Comprehensive Scan (-A)',
    category: 'Network',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1046 (Network Service Discovery)',
    mitrePhase: 'Discovery',
    description: 'Scan combinant détection d’OS, versioning, scripts NSE par défaut et traçage de route (traceroute).',
    commandTemplate: 'nmap -A -T4 -v {target}',
    defaultArgs: { threads: '25', timeout: '40s', extraFlags: '--traceroute' }
  },
  {
    id: 'nmap_firewall_evasion',
    name: 'Nmap Firewall Evasion (Decoys & Fragment)',
    category: 'Network',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1562 (Impair Defenses)',
    mitrePhase: 'Discovery',
    description: 'Contournement des règles de filtrage par fragmentation de paquets et leurres d’adresses IP.',
    commandTemplate: 'nmap -f -D RND:10 --spoof-mac Apple -p 80,443,3389 {target}',
    defaultArgs: { threads: '20', timeout: '30s', extraFlags: '--mtu 8' }
  },
  {
    id: 'nmap_idle_zombie',
    name: 'Nmap Idle / Zombie Scan (IPID Spoofing)',
    category: 'Network',
    riskLevel: 'CRITICAL',
    mitreTechnique: 'T1046 (Network Service Discovery)',
    mitrePhase: 'Discovery',
    description: 'Scan de ports aveugle exploitant un hôte tiers (zombie) via les numéros de séquence IPID.',
    commandTemplate: 'nmap -sI {extraFlags} -p- {target}',
    defaultArgs: { threads: '1', timeout: '30s', extraFlags: 'zombie_host.local:80' }
  },
  {
    id: 'nmap_badsum_scan',
    name: 'Nmap Bad Checksum Probe Scan',
    category: 'Network',
    riskLevel: 'LOW',
    mitreTechnique: 'T1046 (Network Service Discovery)',
    mitrePhase: 'Discovery',
    description: 'Envoi de paquets avec sommes de contrôle erronées pour tester la présence de systèmes d’inspection ou pare-feux.',
    commandTemplate: 'nmap --badsum -p 80,443,445 {target}',
    defaultArgs: { threads: '10', timeout: '15s', extraFlags: '-sT' }
  },

  // --- Groupe 3 : Audits NSE Spécifiques (Services & Infrastructures) ---
  {
    id: 'nmap_smb_enum',
    name: 'Nmap SMB Enumeration Suite (NSE)',
    category: 'Network',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1087.002 (Account Discovery: Domain Account)',
    mitrePhase: 'Discovery',
    description: 'Énumération des partages SMB, comptes utilisateurs, sessions anonymes et dialectes supportés.',
    commandTemplate: 'nmap --script smb-enum-shares,smb-enum-users,smb-protocols -p 445 {target}',
    defaultArgs: { threads: '10', timeout: '25s', extraFlags: '--script-args=unsafe=1' }
  },
  {
    id: 'nmap_http_enum',
    name: 'Nmap HTTP Web Server Enumerator (NSE)',
    category: 'Network',
    riskLevel: 'MEDIUM',
    mitreTechnique: 'T1595.003 (Wordlist Scanning)',
    mitrePhase: 'Discovery',
    description: 'Cartographie des répertoires web, méthodes HTTP autorisées et en-têtes de sécurité.',
    commandTemplate: 'nmap --script http-enum,http-methods,http-headers -p 80,443 {target}',
    defaultArgs: { threads: '15', timeout: '20s', extraFlags: '--script-args http-enum.basepath=/' }
  },
  {
    id: 'nmap_ssl_tls_cipher',
    name: 'Nmap SSL/TLS Cipher & Certificate Auditor',
    category: 'Network',
    riskLevel: 'MEDIUM',
    mitreTechnique: 'T1573 (Encrypted Channel)',
    mitrePhase: 'Discovery',
    description: 'Inspection des suites de chiffrement SSL/TLS, vérification des dates d’expiration et des certificats.',
    commandTemplate: 'nmap --script ssl-enum-ciphers,ssl-cert -p 443,8443 {target}',
    defaultArgs: { threads: '10', timeout: '25s', extraFlags: '--script-args tls.servername=target' }
  },
  {
    id: 'nmap_dns_brute',
    name: 'Nmap DNS Zone Transfer & Subdomain Bruter',
    category: 'Network',
    riskLevel: 'MEDIUM',
    mitreTechnique: 'T1590.002 (Gather Victim Network Information: DNS)',
    mitrePhase: 'Discovery',
    description: 'Vérification du transfert de zone (AXFR) et énumération de sous-domaines par dictionnaire.',
    commandTemplate: 'nmap --script dns-zone-transfer,dns-brute -p 53 {target}',
    defaultArgs: { threads: '25', timeout: '30s', extraFlags: '--script-args dns-brute.domain=target.local' }
  },
  {
    id: 'nmap_rdp_enum',
    name: 'Nmap RDP Configuration & Security Audit',
    category: 'Network',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1021.001 (Remote Services: Remote Desktop Protocol)',
    mitrePhase: 'Discovery',
    description: 'Analyse du niveau de chiffrement RDP, support du NLA (Network Level Authentication) et certificats.',
    commandTemplate: 'nmap --script rdp-enum-encryption,rdp-ntlm-info -p 3389 {target}',
    defaultArgs: { threads: '5', timeout: '20s', extraFlags: '-sV' }
  },

  // --- Groupe 4 : Bases de Données, Vulnérabilités & Protocoles Avancés ---
  {
    id: 'nmap_vuln_nse',
    name: 'Nmap Scripting Engine (NSE) Vulnerability Scan',
    category: 'Network',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1595.002 (Active Scanning)',
    mitrePhase: 'Discovery',
    description: 'Détection automatisée des failles de sécurité connues (CVE) via la catégorie "vuln" du NSE.',
    commandTemplate: 'nmap --script vuln -p 80,443,445,3389,8080 {target}',
    defaultArgs: { threads: '20', timeout: '45s', extraFlags: '--script-timeout 10s' }
  },
  {
    id: 'nmap_database_enum',
    name: 'Nmap Database Engines Multi-Auditor',
    category: 'Network',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1046 (Network Service Discovery)',
    mitrePhase: 'Discovery',
    description: 'Analyse et identification des instances de bases de données (MySQL, MSSQL, PostgreSQL, Oracle, MongoDB).',
    commandTemplate: 'nmap --script ms-sql-info,mysql-info,pgsql-bloat -p 1433,3306,5432,27017 {target}',
    defaultArgs: { threads: '15', timeout: '25s', extraFlags: '-sV' }
  },
  {
    id: 'nmap_snmp_enum',
    name: 'Nmap SNMP Community & MIB Walker',
    category: 'Network',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1082 (System Information Discovery)',
    mitrePhase: 'Discovery',
    description: 'Audit des chaînes de communauté SNMP par défaut (public/private) et extraction des MIBs système.',
    commandTemplate: 'nmap -sU --script snmp-brute,snmp-sysdescr,snmp-interfaces -p 161 {target}',
    defaultArgs: { threads: '10', timeout: '30s', extraFlags: '--script-args snmpbrute.communitiesdb=communities.txt' }
  },
  {
    id: 'nmap_sip_voip',
    name: 'Nmap SIP / VoIP Infrastructure Audit',
    category: 'Network',
    riskLevel: 'MEDIUM',
    mitreTechnique: 'T1046 (Network Service Discovery)',
    mitrePhase: 'Discovery',
    description: 'Énumération des passerelles VoIP/SIP, des comptes et des méthodes supportées (PBX, Asterisk).',
    commandTemplate: 'nmap -sU --script sip-enum-users,sip-methods -p 5060,5061 {target}',
    defaultArgs: { threads: '10', timeout: '20s', extraFlags: '-sV' }
  },
  {
    id: 'nmap_ftp_bounce',
    name: 'Nmap FTP Bounce Vulnerability Tester',
    category: 'Network',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1210 (Exploitation of Remote Services)',
    mitrePhase: 'Discovery',
    description: 'Contrôle des serveurs FTP pour identifier s’ils permettent de relayer des connexions TCP (FTP Bounce attack).',
    commandTemplate: 'nmap -b anon:anon@{target} -p 21 {target}',
    defaultArgs: { threads: '5', timeout: '15s', extraFlags: '-v' }
  }
]