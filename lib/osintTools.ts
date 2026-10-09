import { ToolModule } from './offensiveTools'

export const OSINT_TOOLS: ToolModule[] = [
  {
    id: 'amass_asm',
    name: 'OWASP Amass Advanced ASM (Deep Recon)',
    category: 'OSINT',
    riskLevel: 'MEDIUM',
    mitreTechnique: 'T1596 (Search Open Technical Databases)',
    mitrePhase: 'Discovery',
    description: 'Cartographie exhaustive de la surface d’attaque externe par corrélation de bases de données et graph intelligence.',
    commandTemplate: 'amass enum -d {target} -active -brute -asn -ipv4 -json amass_out.json',
    defaultArgs: { threads: '50', timeout: '25s', extraFlags: '-min-for-recursive 2 -config amass.ini' }
  },
  {
    id: 'theharvester_osint',
    name: 'TheHarvester Threat Intelligence Engine',
    category: 'OSINT',
    riskLevel: 'MEDIUM',
    mitreTechnique: 'T1589 (Gather Victim Identity Information)',
    mitrePhase: 'Discovery',
    description: 'Collecte massive d’e-mails, de sous-domaines, de collaborateurs et d’hôtes ouverts via les moteurs de recherche.',
    commandTemplate: 'theHarvester -d {target} -b all -l 500 -f harvester_report.json',
    defaultArgs: { threads: '20', timeout: '15s', extraFlags: '--shodan --dns-brute' }
  },
  {
    id: 'subfinder_fast',
    name: 'Subfinder High-Speed Subdomain Discovery',
    category: 'OSINT',
    riskLevel: 'LOW',
    mitreTechnique: 'T1590.002 (Gather Victim Network Information: DNS)',
    mitrePhase: 'Discovery',
    description: 'Énumération ultra-rapide de sous-domaines passifs en interrogeant des dizaines de sources de renseignements en ligne.',
    commandTemplate: 'subfinder -d {target} -all -silent -json -o subfinder_results.json',
    defaultArgs: { threads: '100', timeout: '10s', extraFlags: '-max-time 2' }
  },
  {
    id: 'spiderfoot_scanner',
    name: 'SpiderFoot Automated OSINT Scanner',
    category: 'OSINT',
    riskLevel: 'MEDIUM',
    mitreTechnique: 'T1596.001 (Search Open Technical Databases: Whois)',
    mitrePhase: 'Discovery',
    description: 'Automatisation complète de la collecte de renseignements (IPs, domaines, e-mails, fuites de données) à partir de centaines de sources.',
    commandTemplate: 'spiderfoot -s {target} -t ALL -m IP_ADDRESS,EMAIL,DOMAIN_NAME,LEAKSITE -o json',
    defaultArgs: { threads: '30', timeout: '40s', extraFlags: '--nui' }
  },
  {
    id: 'sherlock_osint',
    name: 'Sherlock Social Footprint Engine',
    category: 'OSINT',
    riskLevel: 'LOW',
    mitreTechnique: 'T1589.001 (Gather Victim Identity Information: Credentials / Accounts)',
    mitrePhase: 'Discovery',
    description: 'Recherche automatisée de comptes sociaux, d’alias et d’identités numériques à travers des centaines de plateformes web.',
    commandTemplate: 'sherlock --print-found --timeout 5 {target} --json',
    defaultArgs: { threads: '50', timeout: '15s', extraFlags: '--folderoutput sherlock_results' }
  }
]