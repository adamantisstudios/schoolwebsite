export interface WhatsAppFormData {
  name: string
  email?: string
  phone: string
  message: string
  formType: "contact" | "tour" | "application" | "inquiry"
  additionalData?: Record<string, any>
}

export function formatWhatsAppMessage(data: WhatsAppFormData): string {
  const { name, email, phone, message, formType, additionalData } = data

  let formattedMessage = `*${getFormTypeTitle(formType)}*\n\n`
  formattedMessage += `*Name:* ${name}\n`
  formattedMessage += `*Phone:* ${phone}\n`

  if (email) {
    formattedMessage += `*Email:* ${email}\n`
  }

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      if (value) {
        formattedMessage += `*${formatFieldName(key)}:* ${value}\n`
      }
    })
  }

  formattedMessage += `\n*Message:*\n${message}\n`
  formattedMessage += `\n_Sent from Montessori Bloom website_`

  return formattedMessage
}

function getFormTypeTitle(formType: string): string {
  switch (formType) {
    case "contact":
      return "Contact Form Submission"
    case "tour":
      return "Schedule a Tour Request"
    case "application":
      return "Application Inquiry"
    case "inquiry":
      return "General Inquiry"
    default:
      return "Website Form Submission"
  }
}

function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

export function sendToWhatsApp(data: WhatsAppFormData): void {
  const phoneNumber = "233242799990" // Ghana number format
  const message = formatWhatsAppMessage(data)
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

  // Open WhatsApp in new window
  window.open(whatsappUrl, "_blank")
}

export function sendWhatsAppMessage(message: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const phoneNumber = "233242799990" // Ghana number format
      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

      // Open WhatsApp in new window
      window.open(whatsappUrl, "_blank")
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
