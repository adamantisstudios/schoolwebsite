"use client"

import { jsPDF } from "jspdf"

export type PdfTableColumn = { header: string; key: string; width?: number }
export type PdfOptions = {
  title: string
  subtitle?: string
  filename: string
  columns: PdfTableColumn[]
  rows: Record<string, string | number>[]
  footer?: string
}

const SCHOOL_NAME = "Montessori Bloom"
const SCHOOL_TAGLINE = "Nurturing Young Minds · Accra, Ghana"

export function downloadTablePdf(options: PdfOptions) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 18

  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.setTextColor(5, 96, 58)
  doc.text(SCHOOL_NAME, pageWidth / 2, y, { align: "center" })
  y += 7

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(SCHOOL_TAGLINE, pageWidth / 2, y, { align: "center" })
  y += 8

  doc.setDrawColor(5, 96, 58)
  doc.setLineWidth(0.4)
  doc.line(14, y, pageWidth - 14, y)
  y += 8

  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.setTextColor(20, 20, 20)
  doc.text(options.title, 14, y)
  y += 6

  if (options.subtitle) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(80, 80, 80)
    doc.text(options.subtitle, 14, y)
    y += 8
  }

  const colCount = options.columns.length
  const tableWidth = pageWidth - 28
  const colWidth = tableWidth / colCount

  doc.setFillColor(236, 253, 245)
  doc.rect(14, y - 4, tableWidth, 8, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(20, 20, 20)

  options.columns.forEach((col, i) => {
    doc.text(col.header, 14 + i * colWidth + 1, y)
  })
  y += 6

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)

  for (const row of options.rows) {
    if (y > 275) {
      doc.addPage()
      y = 20
    }
    options.columns.forEach((col, i) => {
      const val = String(row[col.key] ?? "")
      const truncated = val.length > 28 ? val.slice(0, 25) + "…" : val
      doc.text(truncated, 14 + i * colWidth + 1, y)
    })
    y += 5
  }

  y += 6
  doc.setFontSize(8)
  doc.setTextColor(120, 120, 120)
  doc.text(options.footer || `Generated ${new Date().toLocaleString()}`, 14, y)

  doc.save(options.filename)
}

export function downloadSimplePdf(title: string, lines: string[], filename: string) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(5, 96, 58)
  doc.text(SCHOOL_NAME, pageWidth / 2, y, { align: "center" })
  y += 10

  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text(title, 14, y)
  y += 10

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  for (const line of lines) {
    if (y > 280) {
      doc.addPage()
      y = 20
    }
    doc.text(line, 14, y)
    y += 6
  }

  doc.save(filename)
}

export type WardReportSection = {
  heading: string
  lines: string[]
}

export function downloadWardReportPdf(options: {
  studentName: string
  studentId: string
  className?: string
  sections: WardReportSection[]
  filename: string
}) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 18

  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.setTextColor(5, 96, 58)
  doc.text(SCHOOL_NAME, pageWidth / 2, y, { align: "center" })
  y += 7

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(SCHOOL_TAGLINE, pageWidth / 2, y, { align: "center" })
  y += 8

  doc.setDrawColor(5, 96, 58)
  doc.setLineWidth(0.4)
  doc.line(14, y, pageWidth - 14, y)
  y += 8

  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.setTextColor(20, 20, 20)
  doc.text("Student Progress Report", 14, y)
  y += 7

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(60, 60, 60)
  doc.text(`Student: ${options.studentName}`, 14, y)
  y += 5
  doc.text(`Student ID: ${options.studentId}`, 14, y)
  y += 5
  if (options.className) {
    doc.text(`Class: ${options.className}`, 14, y)
    y += 5
  }
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, y)
  y += 10

  for (const section of options.sections) {
    if (y > 260) {
      doc.addPage()
      y = 20
    }
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    doc.setTextColor(5, 96, 58)
    doc.text(section.heading, 14, y)
    y += 6

    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(30, 30, 30)

    if (section.lines.length === 0) {
      doc.text("No records.", 16, y)
      y += 8
      continue
    }

    for (const line of section.lines) {
      if (y > 280) {
        doc.addPage()
        y = 20
      }
      const wrapped = doc.splitTextToSize(line, pageWidth - 28)
      doc.text(wrapped, 16, y)
      y += wrapped.length * 4.5 + 1
    }
    y += 4
  }

  doc.save(options.filename)
}
