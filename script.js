document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const caseInput = document.getElementById("caseInput");
  const sideInput = document.getElementById("sideInput");
  const outputSection = document.getElementById("outputSection");
  const argumentsDiv = document.getElementById("arguments");
  const copyBtn = document.getElementById("copyBtn");
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");

  // Generate arguments
  generateBtn.addEventListener("click", async () => {
    const caseText = caseInput.value.trim();
    const side = sideInput.value;

    if (!caseText) {
      alert("⚠️ Please enter case facts first!");
      return;
    }

    // Show loading
    argumentsDiv.innerHTML = "<p><em>Generating arguments...</em></p>";
    outputSection.style.display = "block";

    try {
      const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseText, side })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      argumentsDiv.innerHTML = marked.parse(data.output);

    } catch (error) {
      console.error("Error fetching arguments:", error);
      argumentsDiv.innerHTML =
        "<p style='color:red'>❌ Error: could not generate arguments.</p>";
    }
  });

  // Copy to Clipboard
  copyBtn.addEventListener("click", () => {
    const text = argumentsDiv.textContent;
    if (!text) {
      alert("Nothing to copy!");
      return;
    }

    navigator.clipboard.writeText(text)
      .then(() => alert("📋 Copied to clipboard!"))
      .catch((err) => alert("❌ Failed to copy: " + err));
  });

  // Save as PDF
  downloadPdfBtn.addEventListener("click", () => {
  const text = argumentsDiv.textContent;
  if (!text) {
    alert("Nothing to save!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const lineHeight = 7;

  // Split text into lines that fit page width
  const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);

  let y = 20; // Start vertical position
  for (let i = 0; i < lines.length; i++) {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = 20;
    }
    doc.text(lines[i], margin, y);
    y += lineHeight;
  }

  doc.save("LegalPrepSheet.pdf");
});

});
