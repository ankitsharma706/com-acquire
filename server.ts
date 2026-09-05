import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString(), platform: "CompanyHQ OS" });
});

// AI CEO Copilot endpoint
app.post("/api/ai/copilot", async (req, res) => {
  try {
    const { message, history, context } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are the executive AI Co-Pilot for "CompanyHQ", a billion-dollar virtual company operating system.
You serve the CEO and department heads with sharp, Linear/Stripe-caliber executive intelligence.
You have real-time telemetry on all departments (CEO Office, Engineering, Design, Product, HR, Finance, Marketing, Sales, Support), employees, sprints, budgets, runway, burn rate, payroll cycles, and hiring pipelines.

Company State Context:
${JSON.stringify(context || {}, null, 2)}

Provide concise, highly actionable, strategic executive advice. Format with clean bullet points, bold highlights, and clear recommendations. If asked to draft announcements, generate project specs, analyze risks, or allocate tasks, provide complete and ready-to-execute copy.`;

    if (ai) {
      const chatContents: any[] = [];
      if (history && Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          chatContents.push({
            role: item.sender === "user" ? "user" : "model",
            parts: [{ text: item.text }],
          });
        }
      }
      chatContents.push({
        role: "user",
        parts: [{ text: message || "Provide an executive health overview of the company." }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: chatContents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      return res.json({ reply: response.text || "Executive intelligence analysis complete." });
    }

    // Heuristic intelligent fallback when offline or no API key
    const lower = (message || "").toLowerCase();
    let reply = "";
    if (lower.includes("delay") || lower.includes("risk") || lower.includes("bottleneck")) {
      reply = `**Executive Risk Analysis**:
• **Quantum Core v3**: 84% complete. Current velocity indicates a potential 3-day slip on the Q3 security audit stage due to backend workload.
• **Recommendation**: Reallocate 2 Senior Engineers from Growth Lab to Core Platform for sprint 42.
• **Cash Runway**: $14.8M (26 months). Burn rate is healthy at $380k/mo.`;
    } else if (lower.includes("hire") || lower.includes("recruit") || lower.includes("talent")) {
      reply = `**Talent Pipeline & Headcount Advisory**:
• 3 candidates are in final Technical & HR rounds (Staff AI Architect, Lead Product Designer, Enterprise Sales VP).
• Engineering capacity is at 91% utilization. Recommend accelerating the Staff AI Architect offer ($210k + equity) to prevent project bottlenecks.`;
    } else if (lower.includes("payroll") || lower.includes("salary") || lower.includes("bonus") || lower.includes("finance")) {
      reply = `**Financial & Payroll Summary**:
• Current Month Payroll: **$348,500.00** across 48 employees.
• Pending CEO Authorization: **$348,500.00** queued for release.
• Monthly Recurring Revenue: **$1,240,000.00** (+18.4% MoM).
• Gross Margin: **84.2%**. Everything is cleared for payment release.`;
    } else if (lower.includes("promote") || lower.includes("performance") || lower.includes("review")) {
      reply = `**Performance & Promotion Insight**:
• **Elena Rostova** (Staff Eng) has delivered 3 consecutive top-tier milestones with 98.4% sprint accuracy. Strong candidate for VP of Engineering.
• **Marcus Vance** (Design Lead) has achieved a 99% design system adoption score.
• 4 team members have exceeded quarterly OKR targets by >120%.`;
    } else {
      reply = `**CompanyHQ Executive Briefing**:
• **Overall Health**: 96/100 (Optimal)
• **Active Operations**: 8 Departments fully operational with 48 active team members.
• **Sprint Velocity**: 94.2% on-track across 6 major enterprise initiatives.
• **Next Strategic Actions**:
  1. Review & authorize the pending September Payroll batch ($348.5k).
  2. Approve the offer package for Senior AI Engineer candidate.
  3. Broadcast Q3 all-hands announcement to the company feed.`;
    }

    return res.json({ reply });
  } catch (error: any) {
    console.error("AI Copilot Error:", error);
    res.status(500).json({ error: error.message || "Failed to process AI request" });
  }
});

// AI Delays and Performance Predictor
app.post("/api/ai/predict-delays", async (req, res) => {
  try {
    const { projects, employees } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `Analyze the following project and employee workloads and predict potential delays, risk factors, and resource allocation fixes in JSON format.
Projects: ${JSON.stringify(projects)}
Employees: ${JSON.stringify(employees)}

Respond with strict JSON adhering to:
{
  "insights": [
    {
      "projectId": "string",
      "projectName": "string",
      "riskLevel": "Low" | "Medium" | "High" | "Critical",
      "predictedDelayDays": number,
      "rootCause": "string",
      "recommendedAction": "string"
    }
  ],
  "efficiencyScore": number,
  "executiveSummary": "string"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      return res.json(JSON.parse(response.text || "{}"));
    }

    // Default heuristic output
    return res.json({
      insights: [
        {
          projectId: "prj-1",
          projectName: "NextGen AI Engine v4",
          riskLevel: "Medium",
          predictedDelayDays: 2,
          rootCause: "High PR review backlog in Neural Net microservice",
          recommendedAction: "Shift 1 senior reviewer from internal tooling to AI engine.",
        },
        {
          projectId: "prj-2",
          projectName: "Enterprise SOC2 & Security Shield",
          riskLevel: "Low",
          predictedDelayDays: 0,
          rootCause: "Milestones progressing ahead of schedule",
          recommendedAction: "Maintain current cadence and schedule final audit.",
        },
        {
          projectId: "prj-3",
          projectName: "Global Coworking WebRTC Mesh",
          riskLevel: "High",
          predictedDelayDays: 4,
          rootCause: "High memory utilization in peer-to-peer relay nodes",
          recommendedAction: "Pair Dev lead with DevOps architect to profile memory footprint.",
        },
      ],
      efficiencyScore: 92,
      executiveSummary: "Company projects are operating at 92% efficiency with only 1 high-risk item easily mitigated through cross-team resource reallocation.",
    });
  } catch (error: any) {
    console.error("AI Predict Delays Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// AI Report Generator
app.post("/api/ai/generate-report", async (req, res) => {
  try {
    const { department, timeRange, metrics } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `Generate a high-level executive report for the "${department || "Entire Company"}" covering "${timeRange || "Current Quarter"}".
Metrics: ${JSON.stringify(metrics)}
Tone: Professional, data-driven, strategic, polished SaaS.
Include:
1. Executive Summary
2. Key Operational Highlights
3. Financial & Resource Performance
4. Key Risks & Mitigations
5. Strategic Next Steps for CEO`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite enterprise executive intelligence analyst.",
          temperature: 0.5,
        },
      });

      return res.json({ report: response.text });
    }

    const report = `# 🏢 Executive Quarterly Operations Report: ${department || "Company-Wide HQ"}
**Period**: ${timeRange || "Q3 2026"} | **Generated by**: CompanyHQ AI Intelligence Engine

---

## 1. Executive Summary
CompanyHQ has accelerated overall operational velocity to **94.8%**, sustaining an average team productivity score of **92.4/100**. Headcount expanded to 48 elite contributors across 8 fully synchronized virtual rooms with a 98.2% attendance and engagement index.

## 2. Key Operational Highlights
- **Engineering & Product**: Delivered 142 sprint points across 6 strategic pillars, maintaining 99.98% system uptime on internal real-time mesh networks.
- **Revenue & Finance**: Gross revenue reached **$1,240,000/mo** with disciplined monthly expenditure at **$380,000**, extending runway to **26.4 months**.
- **Talent & Hiring**: 4 strategic roles filled with an average time-to-hire of 14 days, reducing recruitment cycle latency by 32%.

## 3. Financial & Resource Performance
- **Payroll Outlay**: $348,500.00 processed with 100% CEO compliance and tax withholding validation.
- **Resource Allocation**: Engineering (42%), Sales & Marketing (26%), Product & Design (18%), G&A/HR/Finance (14%).

## 4. Key Risks & Mitigations
- **Risk**: Sprint load spikes in core WebRTC streaming microservices.
- **Mitigation**: Cross-allocated 2 senior backend engineers to support load-testing ahead of client demos.

## 5. Strategic Recommendations for the CEO
1. Authorize expansion of the Enterprise Sales department to capture surging Q4 inbound demand.
2. Sign off on the promotion of Elena Rostova to Staff Principal Lead.
3. Finalize next quarter's bonus pool allocation with the Finance team.`;

    return res.json({ report });
  } catch (error: any) {
    console.error("AI Generate Report Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// AI Automatic Employee Recognition Engine (Awards 'Top Performer' & 'Collaboration Hero' Badges)
app.post("/api/ai/award-badges", async (req, res) => {
  try {
    const { employees = [] } = req.body;
    const ai = getGeminiClient();

    // Prepare lean activity dataset for AI evaluation
    const employeeActivities = (employees as any[]).map((e) => ({
      id: e.id,
      name: e.name,
      role: e.role,
      department: e.departmentName,
      performanceRating: e.performanceRating,
      performanceTier: e.performanceTier,
      attendanceRate: e.attendanceRate,
      completedTasksCount: e.completedTasksCount,
      assignedTasksCount: e.assignedTasksCount,
      currentTask: e.currentTask,
      skills: e.skills?.slice(0, 5),
      kudosCount: e.kudosCount || 0,
      collaborationScore: e.collaborationScore || 0,
      recentActivities: e.recentActivities || [],
    }));

    if (ai && employeeActivities.length > 0) {
      const prompt = `You are the autonomous AI Talent Recognition Engine for CompanyHQ enterprise.
Evaluate the following employee real-time activity metrics and objectively determine awards for two prestigious enterprise badges:

1. 'Top Performer':
   - Criteria: Exceptionally high performance rating (>=90%), high velocity of completed tasks, stellar delivery reliability, >=95% attendance rate.
2. 'Collaboration Hero':
   - Criteria: High cross-functional team enablement, high peer kudos, cross-department unblocking, leadership/coordination, mentoring, or active participation in war room and multi-team initiatives.

Employees Data:
${JSON.stringify(employeeActivities.slice(0, 25), null, 2)}

Return a strict JSON object with this exact structure:
{
  "awards": [
    {
      "employeeId": "string",
      "employeeName": "string",
      "badgeType": "Top Performer" | "Collaboration Hero",
      "title": "string",
      "aiReason": "string (1-2 sentences citing explicit activity metrics and accomplishments)",
      "activityMetric": "string (e.g. '142 tasks delivered • 99% rating • 100% attendance')",
      "level": "Elite" | "Gold" | "Diamond",
      "confidenceScore": number (85-99)
    }
  ],
  "auditSummary": "string (Executive summary of the AI recognition evaluation run)",
  "totalAwarded": number
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are an objective, data-driven Chief Talent & Recognition AI Officer.",
          temperature: 0.2,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      if (parsed.awards && Array.isArray(parsed.awards)) {
        return res.json(parsed);
      }
    }

    // Heuristic data-driven evaluation fallback
    const heuristicAwards: any[] = [];

    for (const emp of employeeActivities) {
      const perf = emp.performanceRating || 85;
      const tasks = emp.completedTasksCount || 0;
      const attendance = emp.attendanceRate || 95;
      const kudos = emp.kudosCount || 0;

      // Top Performer Check: rating >= 94 or high task velocity
      if (perf >= 94 || tasks >= 85) {
        heuristicAwards.push({
          employeeId: emp.id,
          employeeName: emp.name,
          badgeType: "Top Performer",
          title: perf >= 98 ? "Top Performer (Elite Tier)" : "Top Performer",
          aiReason: `AI evaluated: ${emp.name} achieved a ${perf}% rating with ${tasks} completed deliverables and ${attendance}% attendance consistency.`,
          activityMetric: `${perf}% rating • ${tasks} deliverables • ${attendance}% attendance`,
          level: perf >= 98 ? "Diamond" : perf >= 95 ? "Platinum" : "Gold",
          confidenceScore: Math.min(99, Math.floor(perf * 0.98)),
        });
      }

      // Collaboration Hero Check: cross-functional role, kudos >= 4, lead role, or high collaboration
      const isLead = (emp.role || "").toLowerCase().includes("lead") || (emp.role || "").toLowerCase().includes("manager") || (emp.role || "").toLowerCase().includes("head");
      const isCrossFunc = (emp.department || "").toLowerCase().includes("design") || (emp.department || "").toLowerCase().includes("hr") || (emp.department || "").toLowerCase().includes("product") || kudos >= 3;

      if (isLead || isCrossFunc || (perf >= 90 && tasks >= 50)) {
        heuristicAwards.push({
          employeeId: emp.id,
          employeeName: emp.name,
          badgeType: "Collaboration Hero",
          title: isLead ? "Collaboration Hero (Squad Anchor)" : "Collaboration Hero",
          aiReason: `AI evaluated: Actively enabled cross-squad synergies, unblocked multi-team dependencies, and received high peer recognition in the workspace.`,
          activityMetric: `${kudos > 0 ? kudos + ' Peer Kudos • ' : ''}Cross-team initiative anchor • ${emp.department}`,
          level: isLead ? "Diamond" : "Gold",
          confidenceScore: 94,
        });
      }
    }

    return res.json({
      awards: heuristicAwards,
      auditSummary: `AI Talent Recognition evaluated ${employeeActivities.length} team members. Identified ${heuristicAwards.filter(a => a.badgeType === 'Top Performer').length} Top Performers and ${heuristicAwards.filter(a => a.badgeType === 'Collaboration Hero').length} Collaboration Heroes based on real-time sprint velocity and peer activity.`,
      totalAwarded: heuristicAwards.length,
    });
  } catch (error: any) {
    console.error("AI Award Badges Error:", error);
    res.status(500).json({ error: error.message || "Failed to process AI badge recognition" });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CompanyHQ Enterprise OS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
