export interface ToolModule {
  id: string
  name: string
  category: 'Web' | 'Active Directory' | 'Cloud' | 'Wireless' | 'OSINT'
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  mitreTechnique: string
  mitrePhase: 'Initial Access' | 'Execution' | 'Discovery' | 'Exfiltration'
  description: string
  commandTemplate: string
  defaultCommand?: string

  defaultArgs?: {
    threads?: string
    timeout?: string
    extraFlags?: string
  }
}

import { WEB_TOOLS } from './webTools'
import { AD_TOOLS } from './adTools'
import { CLOUD_TOOLS } from './cloudTools'
import { WIRELESS_TOOLS } from './wirelessTools'
import { OSINT_TOOLS } from './osintTools'

export const OFFENSIVE_TOOLS: ToolModule[] = [
  ...WEB_TOOLS,
  ...AD_TOOLS,
  ...CLOUD_TOOLS,
  ...WIRELESS_TOOLS,
  ...OSINT_TOOLS
]