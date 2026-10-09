import { WEB_TOOLS } from './webTools'
import { AD_TOOLS } from './adTools'
import { CLOUD_TOOLS } from './cloudTools'
import { WIRELESS_TOOLS } from './wirelessTools'
import { OSINT_TOOLS } from './osintTools'

export interface ToolModule {
  id: string
  name: string
  description: string
  category: 'Web' | 'Network' | 'Active Directory' | 'Cloud' | 'Wireless' | 'OSINT' | 'Exfiltration'
  commandTemplate: string
  defaultCommand: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  mitreTechnique: string
}

// Fusion globale et centralisée de tout l'arsenal offensif "Advanced & Pro"
export const OFFENSIVE_TOOLS: ToolModule[] = [
  ...WEB_TOOLS,
  ...AD_TOOLS,
  ...CLOUD_TOOLS,
  ...WIRELESS_TOOLS,
  ...OSINT_TOOLS
]