import { ToolModule } from './offensiveTools'

export const OSINT_TOOLS: ToolModule[] = [
  {
    id: 'theharvester-deep-recon',
    name: 'TheHarvester Deep Recon & Footprinting',
    description: 'Extraction exhaustive d’e-mails, hôtes virtuels, bases de données de fuites et sous-domaines via plus de 20 moteurs sources.',
    category: 'OSINT',
    commandTemplate: 'theharvester -d {target} -b all -l 1000 -p -c -n -f cybershield_osint_report',
    defaultCommand: 'theharvester -d <target> -b all',
    riskLevel: 'MEDIUM',
    mitreTechnique: 'T1589.001 (Gather Victim Identity Information: Credentials)'
  },
  {
    id: 'sherlock-global-search',
    name: 'Sherlock Global Username Footprinter',
    description: 'Recherche croisée et instantanée de pseudos et d’identités numériques sur plus de 400 plateformes et réseaux sociaux.',
    category: 'OSINT',
    commandTemplate: 'python3 sherlock.py {target} --timeout 8 --print-found --folderoutput ./osint_results',
    defaultCommand: 'python3 sherlock.py <target>',
    riskLevel: 'LOW',
    mitreTechnique: 'T1296 (Software Deployment / Footprinting)'
  },
  {
    id: 'amass-subdomain-enum',
    name: 'OWASP Amass Advanced ASM Engine',
    description: 'Cartographie de la surface d’attaque externe par analyse de graphes, certificats SSL et DNS récursifs.',
    category: 'OSINT',
    commandTemplate: 'amass enum -active -d {target} -tr -ipv4 -include-unresolved -config amass-config.ini',
    defaultCommand: 'amass enum -d <target>',
    riskLevel: 'MEDIUM',
    mitreTechnique: 'T1590.002 (Gather Victim Network Information: DNS)'
  }
]