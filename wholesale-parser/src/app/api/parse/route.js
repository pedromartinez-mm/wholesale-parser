import Anthropic from "@anthropic-ai/sdk";
import SKU_DATABASE from "../../../skuDatabase";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const skuList = SKU_DATABASE.map(([product, sku]) => `${product} → ${sku}`).join("\n");

export async function POST(request) {
  try {
    const { orders } = await request.json();
    if (!orders || !orders.trim()) {
      return Response.json({ error: "No order text provided" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `You are a wholesale order parser for a furniture/shelving company. Parse the order text below into structured line items, matching each product to the correct SKU from the database.

IMPORTANT MATCHING RULES:
- Customers often write product names informally, abbreviated, or with typos. Use fuzzy matching.
- "Kit mustard" = "The Kit Mustard" = KI-MU
- "Storybd chalk" = "The Storyboard in Chalk" = SB-CH  
- "Twinny extra shelves butter" = "2 x Extra Twinny Shelves in Butter" = 2SP-TW-BU
- "Lowdown chalk" = "The Lowdown in Chalk" = LO-CH
- Colour names: berry, blush, butter, chalk, lilac, mustard, navy, ocean, olive, poppy, sage, slate
- If qty is not specified, assume 1
- Quantities may appear as "3x", "x3", "3 x", "qty 3", or just a number
- Multiple orders in the text are separated by blank lines, "---", "Order:", "Customer:", or similar
- If something genuinely cannot be matched, set sku to "UNMATCHED" and title to the original text

SKU DATABASE:
${skuList}

ORDER TEXT:
${orders}

Return ONLY a JSON array of order objects. No markdown, no preamble.
Each order:
{
  "orderNumber": 1,
  "lines": [
    { "title": "matched product name from DB", "sku": "SKU", "quantity": 1 }
  ],
  "unmatched": ["any lines that could not be matched"]
}`,
        },
      ],
    });

    const raw = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());

    // Build CSV
    const csvRows = ["Number,Command,Line: Type,Line: Title,Line: SKU,Line: Quantity"];
    for (const order of parsed) {
      for (const line of order.lines) {
        csvRows.push(
          `${order.orderNumber},NEW,Line Item,"${line.title}",${line.sku},${line.quantity}`
        );
      }
    }

    const csv = csvRows.join("\n");
    const unmatched = parsed.flatMap((o) =>
      (o.unmatched || []).map((u) => ({ order: o.orderNumber, text: u }))
    );

    return Response.json({ csv, parsed, unmatched });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
