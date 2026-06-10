export async function extractTextFromFile(file) {
  const ext = file.name.split('.').pop().toLowerCase()

  if (ext === 'txt' || ext === 'md') {
    return await readAsText(file)
  }

  if (ext === 'docx') {
    return await extractDocx(file)
  }

  if (ext === 'pdf') {
    return await extractPdf(file)
  }

  throw new Error(`Unsupported file type: .${ext}. Please upload a PDF, DOCX, TXT, or MD file.`)
}

function readAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsText(file)
  })
}

async function extractDocx(file) {
  const mammoth = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  if (!result.value?.trim()) throw new Error('Could not extract text from this DOCX file.')
  return result.value.trim()
}

async function extractPdf(file) {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString()

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    pages.push(content.items.map((item) => item.str).join(' '))
  }
  const text = pages.join('\n\n').trim()
  if (!text) throw new Error('Could not extract text from this PDF. It may be a scanned image.')
  return text
}
