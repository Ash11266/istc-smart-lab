const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel, AlignmentType, Header, Footer, PageNumber } = require("docx");
const fs = require("fs");

const COLORS = {
  PRIMARY: "0B5D57",   // Teal
  SECONDARY: "F97316", // Orange
  TEXT: "333333",      // Dark Gray
  MUTED: "64748B",     // Gray
  LIGHT: "F8FAFC",     // Light gray for backgrounds
  WHITE: "FFFFFF",
  BORDER: "CBD5E1"
};

const FONTS = {
  HEADING: "Arial",
  BODY: "Calibri",
  CODE: "Courier New"
};

function title(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 },
    children: [new TextRun({ text, size: 72, bold: true, color: COLORS.PRIMARY, font: FONTS.HEADING })]
  });
}

function subtitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 800 },
    children: [new TextRun({ text, size: 36, color: COLORS.SECONDARY, font: FONTS.HEADING, bold: true })]
  });
}

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 600, after: 300 },
    border: { bottom: { color: COLORS.PRIMARY, space: 10, style: BorderStyle.SINGLE, size: 12 } },
    children: [new TextRun({ text, size: 36, bold: true, color: COLORS.PRIMARY, font: FONTS.HEADING })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, size: 28, bold: true, color: COLORS.TEXT, font: FONTS.HEADING })]
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, size: 24, bold: true, color: COLORS.TEXT, font: FONTS.HEADING })]
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 200, line: 360 },
    children: [new TextRun({ text, size: 22, font: FONTS.BODY, color: opts.color || COLORS.TEXT, ...opts })]
  });
}

function codeBlock(text) {
  return new Paragraph({
    spacing: { before: 100, after: 200 },
    shading: { fill: COLORS.LIGHT },
    border: {
      top: { color: COLORS.BORDER, space: 10, style: BorderStyle.SINGLE, size: 4 },
      bottom: { color: COLORS.BORDER, space: 10, style: BorderStyle.SINGLE, size: 4 },
      left: { color: COLORS.BORDER, space: 10, style: BorderStyle.SINGLE, size: 4 },
      right: { color: COLORS.BORDER, space: 10, style: BorderStyle.SINGLE, size: 4 }
    },
    children: [new TextRun({ text, size: 20, font: FONTS.CODE, color: COLORS.TEXT })]
  });
}

function bullet(text, boldPrefix = "") {
  const children = [];
  if (boldPrefix) {
    children.push(new TextRun({ text: boldPrefix, bold: true, size: 22, font: FONTS.BODY, color: COLORS.TEXT }));
  }
  children.push(new TextRun({ text, size: 22, font: FONTS.BODY, color: COLORS.TEXT }));
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 120, line: 360 },
    children
  });
}

function makeCell(text, isHeader = false, widthOpts = null) {
  return new TableCell({
    width: widthOpts ? { size: widthOpts, type: WidthType.PERCENTAGE } : undefined,
    shading: isHeader ? { fill: COLORS.PRIMARY } : { fill: COLORS.WHITE },
    margins: { top: 150, bottom: 150, left: 150, right: 150 },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            size: isHeader ? 22 : 20,
            font: FONTS.BODY,
            bold: isHeader,
            color: isHeader ? COLORS.WHITE : COLORS.TEXT
          })
        ]
      })
    ]
  });
}

function makeTable(headers, rows, colWidths) {
  const headerRow = new TableRow({
    children: headers.map((h, i) => makeCell(h, true, colWidths?.[i]))
  });
  const dataRows = rows.map((row, rowIndex) => new TableRow({
    children: row.map((cell, i) => makeCell(cell, false, colWidths?.[i]))
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER },
      left: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER },
      right: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: COLORS.BORDER }
    }
  });
}

function pageBreak() {
  return new Paragraph({ pageBreakBefore: true });
}

async function generate() {
  const sections = [];

  // ===== TITLE PAGE =====
  sections.push(
    new Paragraph({ spacing: { before: 4000 } }),
    title("D.A.M.S."),
    subtitle("Data Acquisition & Monitoring System"),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: "System Architecture & Technical Documentation", size: 28, color: COLORS.MUTED, font: FONTS.BODY })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "ISTC Smart Lab", size: 24, bold: true, color: COLORS.TEXT, font: FONTS.BODY })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), size: 22, color: COLORS.MUTED, font: FONTS.BODY })] }),
    pageBreak()
  );

  // ===== TABLE OF CONTENTS =====
  sections.push(
    heading1("Table of Contents"),
    para("1. Overview"),
    para("2. Key Features"),
    para("3. Technology Stack"),
    para("4. System Architecture"),
    para("5. Getting Started"),
    para("6. Environment Configuration"),
    para("7. API Reference"),
    para("8. WebSocket Protocol"),
    para("9. Default Credentials"),
    pageBreak()
  );

  // ===== 1. OVERVIEW =====
  sections.push(
    heading1("1. Overview"),
    para("D.A.M.S. (Data Acquisition & Monitoring System) is a comprehensive research laboratory interface tailored for the ISTC Smart Lab. It empowers researchers and administrators to seamlessly manage IoT experiments, stream live telemetry data via WebSocket/MQTT, remotely control connected hardware, and leverage state-of-the-art AI (Google Gemini) for automated analysis and lab report generation.")
  );

  // ===== 2. FEATURES =====
  sections.push(
    heading1("2. Key Features"),
    heading2("Experiment Management"),
    bullet("Lifecycle Control: Create, view, list, and delete experiments."),
    bullet("Visibility: Fine-grained access control with Public and Private experiment visibility."),
    
    heading2("Real-Time Telemetry & Control"),
    bullet("Live Streaming: Low-latency WebSocket data ingestion for continuous metric tracking."),
    bullet("Bi-directional Control: Issue start/stop commands and custom instructions to devices."),
    bullet("Dynamic Dashboards: Visualize data with 6 diverse ECharts (Line, Gauge, Dial, Bar, Area, Scatter)."),
    
    heading2("AI-Powered Intelligence"),
    bullet("Interactive Assistant: Context-aware chat powered by Gemini 1.5 Flash. Generates device boilerplate code."),
    bullet("Automated Insights: One-click holistic summaries of experiment parameters."),
    bullet("Report Generation: Upload CSV datasets to generate 2-3 page comprehensive lab reports using Gemini 2.5 Flash."),
    
    heading2("Security & Administration"),
    bullet("Robust Authentication: JWT (HS256) session management with jose and bcrypt password hashing."),
    bullet("Role-Based Access: Middleware-enforced route protection and admin-exclusive endpoints."),
    bullet("Bulk Operations: Admins can bulk-import users via .xlsx or .csv files.")
  );

  // ===== 3. TECH STACK =====
  sections.push(
    heading1("3. Technology Stack"),
    makeTable(["Category", "Technologies"], [
      ["Frontend & Core", "Next.js 16 (App Router), React 19, TypeScript"],
      ["Styling & UI", "Tailwind CSS 4, Framer Motion, Lucide React"],
      ["Database & Auth", "MySQL (mysql2), jose (JWT), bcryptjs"],
      ["AI & ML", "Google Gemini API (1.5 Flash, 2.5 Flash)"],
      ["Data Visualization", "Apache ECharts (echarts-for-react)"],
      ["Data Processing", "SheetJS (xlsx), html2pdf.js, react-markdown"]
    ], [30, 70])
  );

  // ===== 4. SYSTEM ARCHITECTURE =====
  sections.push(
    heading1("4. System Architecture"),
    para("The system consists of interconnected hardware and software layers:"),
    bullet("IoT Hardware (Sensors/Devices) communicates via MQTT to a Broker (e.g., Node-RED)."),
    bullet("Node-RED bridges MQTT to WebSocket, streaming directly to the Next.js Client."),
    bullet("The Next.js Server provides HTTP APIs for authentication, database interaction (MySQL), and AI operations (Google Gemini)."),
    
    heading2("Authentication Flow"),
    bullet("Login: Verifies credentials, generates HS256 JWT, sets httpOnly cookie (session)."),
    bullet("Middleware: Intercepts requests, validates JWT, enforces role-based access (User vs. Admin).")
  );

  // ===== 5. GETTING STARTED =====
  sections.push(
    heading1("5. Getting Started"),
    heading2("Prerequisites"),
    bullet("Node.js: v18 or newer"),
    bullet("Database: MySQL 5.7+ or 8.x"),
    bullet("Services: Google Gemini API Key, WebSocket/MQTT Broker"),
    
    heading2("Installation & Setup"),
    para("Clone the repository and install dependencies:"),
    codeBlock("git clone <repository-url>\ncd istc-smart-lab\nnpm install"),
    para("Initialize the database schema and seed data:"),
    codeBlock("node seed.js"),
    
    heading2("Running the Application"),
    para("Development Mode:"),
    codeBlock("npm run dev"),
    para("Production Mode (with PM2):"),
    codeBlock("npm run build\npm2 start ecosystem.config.js")
  );

  // ===== 6. ENVIRONMENT CONFIGURATION =====
  sections.push(
    heading1("6. Environment Configuration"),
    para("Ensure your .env.local file is populated with the following variables:"),
    makeTable(["Variable", "Description"], [
      ["DB_HOST", "MySQL server hostname"],
      ["DB_USER", "MySQL username"],
      ["DB_PASSWORD", "MySQL password"],
      ["DB_NAME", "MySQL database name"],
      ["SESSION_SECRET", "Secret key for JWT signing. Must be secure."],
      ["GEMINI_API_KEY", "Google Gemini API key"],
      ["NEXT_PUBLIC_BASE_URL", "Base URL (e.g., http://localhost:3000)"],
      ["NEXT_PUBLIC_WS_HOST", "WebSocket server hostname"],
      ["NEXT_PUBLIC_WS_PORT", "WebSocket server port"],
      ["NEXT_PUBLIC_WS_PATH", "WebSocket path for telemetry stream"],
      ["NEXT_PUBLIC_WS_CONTROL_PATH", "WebSocket path for device commands"]
    ], [40, 60])
  );

  // ===== 7. API REFERENCE =====
  sections.push(
    heading1("7. API Reference"),
    
    heading2("Authentication (/api/auth/*)"),
    bullet("POST /login: Authenticate and issue JWT."),
    bullet("POST /logout: Destroy session."),
    bullet("GET /session: Retrieve current session status."),
    bullet("POST /signup: (Admin) Provision new user."),
    bullet("POST /bulk-signup: (Admin) Batch import users from spreadsheet."),
    bullet("POST /change-password: Change authenticated user's password."),
    bullet("POST /reset-password: (Admin) Reset user password to default."),
    
    heading2("Experiments (/api/experiments/*)"),
    bullet("GET /: List accessible experiments."),
    bullet("POST /: Create a new experiment."),
    bullet("GET /[id]: Retrieve experiment details."),
    bullet("DELETE /[id]: (Admin) Delete experiment."),
    
    heading2("AI Services (/api/ai*)"),
    bullet("POST /ai: Generate quick experiment insights."),
    bullet("POST /ai-chat: Context-aware conversational assistant."),
    bullet("POST /ai-report: Generate full PDF lab report from CSV.")
  );

  // ===== 8. WEBSOCKET PROTOCOL =====
  sections.push(
    heading1("8. WebSocket Protocol"),
    heading2("Data Stream (/mqtt-stream)"),
    para("Expects JSON payloads from connected devices:"),
    codeBlock('{\n  "device": "esp32-alpha",\n  "metric": "temperature",\n  "value": 24.5,\n  "passkey": "session-auth-key",\n  "timestamp": "2026-05-03T12:00:00.000Z"\n}'),
    
    heading2("Control Channel (/control)"),
    para("Transmits JSON commands to devices:"),
    codeBlock('{\n  "action": "command",\n  "device": "esp32-alpha",\n  "command": "start",\n  "timestamp": "2026-05-03T12:00:00.000Z"\n}')
  );

  // ===== 9. DEFAULT CREDENTIALS =====
  sections.push(
    heading1("9. Default Credentials"),
    para("SECURITY WARNING: Change these credentials immediately upon deployment.", { color: "DC2626", bold: true }),
    makeTable(["Role", "Email", "Password"], [
      ["System Admin", "admin@smartlab.com", "—"],
      ["Bulk-Import Default", "(Per CSV/XLSX)", "istc@12345"],
      ["Reset Default", "(Target User)", "istc@12345"]
    ], [35, 35, 30])
  );

  const doc = new Document({
    styles: {
      default: { document: { run: { font: FONTS.BODY, size: 22 } } },
    },
    sections: [{
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: "D.A.M.S. Technical Documentation", color: COLORS.MUTED, size: 18, font: FONTS.BODY })
              ]
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "ISTC Smart Lab | D.A.M.S. Technical Documentation", color: COLORS.MUTED, size: 18, font: FONTS.BODY })
              ]
            })
          ]
        })
      },
      children: sections
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = "./DAMS_Technical_Documentation.docx";
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Word document generated: ${outputPath}`);
}

generate().catch(console.error);
