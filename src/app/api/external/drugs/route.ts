import { NextRequest, NextResponse } from "next/server";
import { VerifiedDrug, DataProvenance } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query || query.length < 2) {
      return NextResponse.json({
        drugs: [],
        message: "Search query must be at least 2 characters.",
      });
    }

    // Query U.S. National Library of Medicine (NLM) RxNorm API
    const rxNavUrl = `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(query)}`;
    
    const response = await fetch(rxNavUrl, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache valid queries for 1 hour
    });

    if (!response.ok) {
      // If primary query has no exact match, try spelling suggestions
      const spellingUrl = `https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${encodeURIComponent(query)}`;
      const spellRes = await fetch(spellingUrl);
      if (spellRes.ok) {
        const spellData = await spellRes.json();
        const suggestions = spellData.suggestionGroup?.suggestionList?.suggestion || [];
        return NextResponse.json({
          drugs: [],
          suggestions,
          provenance: {
            source_name: "NIH National Library of Medicine (RxNorm)",
            source_url: "https://rxnav.nlm.nih.gov/",
            source_type: "clinical_api",
            fetched_at: new Date().toISOString(),
            last_verified_at: new Date().toISOString(),
            license: "US Government Public Domain",
            verification_status: "verified",
          },
        });
      }
      return NextResponse.json({ drugs: [] });
    }

    const data = await response.json();
    const conceptGroups = data.drugGroup?.conceptGroup || [];
    
    const drugs: VerifiedDrug[] = [];
    const provenance: DataProvenance = {
      source_name: "NIH National Library of Medicine (RxNorm)",
      source_url: rxNavUrl,
      source_type: "clinical_api",
      fetched_at: new Date().toISOString(),
      last_verified_at: new Date().toISOString(),
      data_version: "RxNorm Monthly Release",
      license: "US Government Public Domain",
      verification_status: "verified",
    };

    for (const group of conceptGroups) {
      if (group.conceptProperties) {
        for (const prop of group.conceptProperties) {
          drugs.push({
            rxcui: prop.rxcui,
            name: prop.name,
            synonym: prop.synonym,
            dosage_form: group.tty, // Term type: SBD (Semantic Branded Drug), SCD (Semantic Clinical Drug)
            provenance,
          });
        }
      }
    }

    // Limit to top 15 verified results to keep payload concise
    return NextResponse.json({
      query,
      count: drugs.length,
      drugs: drugs.slice(0, 15),
      provenance,
    });
  } catch (error: any) {
    console.error("RxNorm Drug API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch verified medication data",
        details: error.message,
        drugs: [],
      },
      { status: 500 }
    );
  }
}

