import jsPDF from 'jspdf'

export interface PentestFinding {
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  cvss: string
  vector: string
  title: string
  description: string
  remediation: string
}

export interface FullPentestReport {
  clientName: string
  targetScope: string
  auditor: string
  date: string
  findings: PentestFinding[]
}

export function generateFullEnterpriseReport(report: FullPentestReport) {
  const doc = new jsPDF()
  let y = 20

  // En-tête du document
  doc.setFillColor(15, 23, 42) // Fond sombre style C2
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setTextColor(6, 182, 212) // Cyan
  doc.setFontSize(18)
  doc.text('CYBERSHIELD ENTERPRISE - RAPPORT D\'AUDIT', 14, 25)

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.text(`Date: ${report.date} | Scope: ${report.targetScope}`, 14, 33)

  y = 55
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(14)
  doc.text('1. Informations Générales de la Mission', 14, y)

  y += 10
  doc.setFontSize(10)
  doc.text(`Client: ${report.clientName}`, 14, y)
  y += 6
  doc.text(`Cible / Périmètre: ${report.targetScope}`, 14, y)
  y += 6
  doc.text(`Auditeur / Opérateur: ${report.auditor}`, 14, y)

  y += 15
  doc.setFontSize(14)
  doc.text('2. Vulnérabilités & Vecteurs Validés', 14, y)
  y += 10

  report.findings.forEach((finding) => {
    if (y > 260) {
      doc.addPage()
      y = 20
    }
    doc.setFontSize(11)
    doc.setTextColor(190, 18, 60) // Rouge/Alerte
    doc.text(`[${finding.severity}] (CVSS ${finding.cvss}) - ${finding.title}`, 14, y)
    
    y += 6
    doc.setFontSize(9)
    doc.setTextColor(70, 65, 65)
    doc.text(`Vecteur: ${finding.vector}`, 14, y)
    
    y += 6
    doc.text(`Description: ${finding.description}`, 14, y)
    
    y += 6
    doc.text(`Remédiation: ${finding.remediation}`, 14, y)
    y += 12
  })

  // Téléchargement automatique du PDF
  doc.save(`CyberShield_Report_${report.targetScope.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`)
}