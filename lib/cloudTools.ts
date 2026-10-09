import { ToolModule } from './offensiveTools'

export const CLOUD_TOOLS: ToolModule[] = [
  {
    id: 'prowler_cloud',
    name: 'Prowler Multi-Cloud Security Assessment',
    category: 'Cloud',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1580 (Cloud Infrastructure Discovery)',
    mitrePhase: 'Discovery',
    description: 'Audit de conformité (CIS, GDPR, HIPAA) et détection de ressources mal configurées sur AWS, Azure et GCP.',
    commandTemplate: 'prowler aws --region us-east-1 --compliance cis_1.4,well_architected -M json-ocsf',
    defaultArgs: { threads: '50', timeout: '30s', extraFlags: '--verbose --ignore-exit-code-2' }
  },
  {
    id: 'pacu_framework',
    name: 'Pacu AWS Exploitation Framework',
    category: 'Cloud',
    riskLevel: 'CRITICAL',
    mitreTechnique: 'T1078 (Valid Accounts)',
    mitrePhase: 'Execution',
    description: 'Exploitation automatisée des faiblesses d’environnements AWS compromis (IAM escalation, S3 leakage).',
    commandTemplate: 'python3 pacu.py --exec "run iam__privesc_scan" --session-name audit_{target}',
    defaultArgs: { threads: '10', timeout: '20s', extraFlags: '--no-color' }
  },
  {
    id: 'scoutsuite_multi',
    name: 'ScoutSuite Multi-Cloud Auditor',
    category: 'Cloud',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1526 (Cloud Service Discovery)',
    mitrePhase: 'Discovery',
    description: 'Outil d’audit de sécurité multi-cloud agnostique générant un rapport consolidé des configurations à haut risque.',
    commandTemplate: 'scout aws --provider aws --report-dir scout_results --json',
    defaultArgs: { threads: '20', timeout: '40s', extraFlags: '--no-browser' }
  },
  {
    id: 'kube-hunter_k8s',
    name: 'Kube-Hunter Kubernetes Penetration Tester',
    category: 'Cloud',
    riskLevel: 'CRITICAL',
    mitreTechnique: 'T1190 (Exploit Public-Facing Application)',
    mitrePhase: 'Execution',
    description: 'Chasse aux failles de sécurité et aux vecteurs d’intrusion au sein des clusters et nœuds Kubernetes.',
    commandTemplate: 'kube-hunter --remote {target} --active --json',
    defaultArgs: { threads: '15', timeout: '25s', extraFlags: '--stats' }
  },
  {
    id: 'trivy_container_scanner',
    name: 'Trivy Cloud Native Image & IaC Scanner',
    category: 'Cloud',
    riskLevel: 'MEDIUM',
    mitreTechnique: 'T1610 (Deploy Container)',
    mitrePhase: 'Discovery',
    description: 'Analyse approfondie des vulnérabilités dans les conteneurs Docker, images OCI et fichiers Terraform/IaC.',
    commandTemplate: 'trivy image --severity CRITICAL,HIGH --format json {target}',
    defaultArgs: { threads: '30', timeout: '15s', extraFlags: '--security-checks vuln,config' }
  },
  {
    id: 'cloud_mapper',
    name: 'CloudMapper AWS Environment Visualizer',
    category: 'Cloud',
    riskLevel: 'MEDIUM',
    mitreTechnique: 'T1087.004 (Account Discovery: Cloud Account)',
    mitrePhase: 'Discovery',
    description: 'Analyse des relations réseau et des politiques IAM pour cartographier visuellement la surface d’attaque cloud.',
    commandTemplate: 'python3 cloudmapper.py collect --account {target} --json',
    defaultArgs: { threads: '10', timeout: '35s', extraFlags: '--access-key --secret-key' }
  }
]