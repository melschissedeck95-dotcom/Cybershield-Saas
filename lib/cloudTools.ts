import { ToolModule } from './offensiveTools'

export const CLOUD_TOOLS: ToolModule[] = [
  {
    id: 'kube-hunter-active',
    name: 'Kube-Hunter Kubernetes Threat Scanner',
    description: 'Chasse active aux failles de configuration, services ouverts et pods compromis au sein des clusters K8s.',
    category: 'Cloud',
    commandTemplate: 'kube-hunter --remote {target} --active --k8s-webapp --json',
    defaultCommand: 'kube-hunter --remote <target> --active',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1613 (Container and Resource Discovery)'
  },
  {
    id: 'prowler-cis-aws',
    name: 'Prowler CIS AWS/Azure Benchmark',
    description: 'Audit de conformité de sécurité exhaustif basé sur le CIS Benchmark et les meilleures pratiques Cloud.',
    category: 'Cloud',
    commandTemplate: 'prowler aws --region eu-west-1 --compliance cis_1.5_aws,gdpr_aws --severity critical,high',
    defaultCommand: 'prowler aws --target-resource <target>',
    riskLevel: 'MEDIUM',
    mitreTechnique: 'T1078 (Valid Accounts)'
  },
  {
    id: 'trivy-container-sbom',
    name: 'Trivy Container & IaC Security Audit',
    description: 'Analyse approfondie des images de conteneurs, des configurations Terraform/Kubernetes et de la supply chain logicielle.',
    category: 'Cloud',
    commandTemplate: 'trivy image --scanners vuln,secret,config --severity HIGH,CRITICAL {target}',
    defaultCommand: 'trivy image <target>',
    riskLevel: 'HIGH',
    mitreTechnique: 'T1204.002 (User Execution: Malicious File)'
  }
]