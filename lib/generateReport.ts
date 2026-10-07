import jsPDF from 'jspdf'

export interface VulnerabilityItem {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  cvss: string
  vector: 'Web' | 'Network' | 'Active Directory' | 'API' | 'Proxy'
  title: string
  description: string
  remediation: string
}

export interface ScanReportData {
  clientName: string
  targetScope: string
  auditor: string
  date: string
  findings: VulnerabilityItem[]
}

export type FullPentestReport = ScanReportData

export const generateEnterprisePentestPDF = (report: ScanReportData) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPos = 20

  // En-tête du document
  doc.setFillColor(15, 23, 42)
  doc.rect(0, 0, pageWidth, 40, 'F')

  doc.setTextColor(6, 182, 212)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('CYBERSHIELD ENTERPRISE', 15, 25)

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.text('Rapport Officiel d’Intervention RedTeam & Pentesting', 15, 33)

  yPos = 55

  // Informations de mission
  doc.setTextColor(30, 41, 59)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('DÉTAILS DE LA MISSION', 15, yPos)

  yPos += 8
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Client : ${report.clientName}`, 15, yPos)
  doc.text(`Cible / Scope : ${report.targetScope}`, 110, yPos)
  yPos += 6
  doc.text(`Opérateur : ${report.auditor}`, 15, yPos)
  doc.text(`Date d'audit : ${report.date}`, 110, yPos)

  yPos += 15
  doc.setLineWidth(0.5)
  // Utilisation de setDrawColor compatible avec toutes les versions de jsPDF
  doc.setDrawColor(200, 200, 200)
  doc.line(15, yPos, pageWidth - 15, yPos)

  yPos += 12

  // Liste des vulnérabilités
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('VULNÉRABILITÉS ET FAILLES IDENTIFIÉES', 15, yPos)

  yPos += 8

  report.findings.forEach((item, index) => {
    if (yPos > 260) {
      doc.addPage()
      yPos = 20
    }

    doc.setFillColor(248, 250, 252)
    doc.roundedRect(15, yPos, pageWidth - 30, 32, 2, 2, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(15, 23, 42)
    doc.text(`${index + 1}. [${item.severity}] (CVSS ${item.cvss}) - ${item.title}`, 20, yPos + 8)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(71, 85, 105)
    doc.text(`Vecteur : ${item.vector} | Description : ${item.description}`, 20, yPos + 16)
    doc.text(`Correctif recommandé : ${item.remediation}`, 20, yPos + 24)

    yPos += 38
  })

  // Pied de page
  const totalPages = doc.internal.pages.length - 1
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('CyberShield Security - Document Confidentiel - Usage Exclusif Client', 15, 285)
    doc.text(`Page ${i} / ${totalPages}`, pageWidth - 25, 285)
  }

  doc.save(`Rapport_RedTeam_${report.clientName.replace(/\s+/g, '_')}_${Date.now()}.pdf`)
}

export const generateFullEnterpriseReport = generateEnterprisePentestPDF