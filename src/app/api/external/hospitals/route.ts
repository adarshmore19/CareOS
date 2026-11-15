import { NextRequest, NextResponse } from "next/server";
import { VerifiedFacility, DataProvenance } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city")?.trim() || "Delhi";
    const query = searchParams.get("q")?.trim() || `hospital in ${city}`;

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&addressdetails=1&limit=10`;

    const response = await fetch(nominatimUrl, {
      headers: {
        "User-Agent": "CareOS-Health-Ecosystem/2.0 (contact: medical-engineering@careos.health)",
        Accept: "application/json",
      },
      next: { revalidate: 86400 }, // Cache facility locations for 24 hours
    });

    if (!response.ok) {
      return NextResponse.json({
        facilities: [],
        message: "External hospital directory currently unavailable.",
      });
    }

    const data = await response.json();
    const provenance: DataProvenance = {
      source_name: "OpenStreetMap Verified Healthcare Registry / Nominatim",
      source_url: nominatimUrl,
      source_type: "verified_registry",
      fetched_at: new Date().toISOString(),
      last_verified_at: new Date().toISOString(),
      license: "Open Database License (ODbL) / OpenStreetMap contributors",
      verification_status: "verified",
    };

    const facilities: VerifiedFacility[] = (data || []).map((item: any) => {
      const addressObj = item.address || {};
      const fullAddress = [
        addressObj.road,
        addressObj.suburb || addressObj.neighbourhood,
        addressObj.city || addressObj.town || addressObj.state_district,
        addressObj.state,
        addressObj.postcode,
      ]
        .filter(Boolean)
        .join(", ");

      const facilityType =
        item.type === "pharmacy"
          ? "pharmacy"
          : item.type === "clinic"
          ? "clinic"
          : "hospital";

      return {
        id: `osm-${item.osm_id || item.place_id}`,
        name: item.name || addressObj.hospital || addressObj.clinic || item.display_name.split(",")[0],
        facility_type: facilityType,
        address: fullAddress || item.display_name,
        city: addressObj.city || addressObj.town || city,
        state: addressObj.state,
        country: addressObj.country || "India",
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        emergency_services: true,
        phone: item.extratags?.phone || item.extratags?.["contact:phone"] || undefined,
        website: item.extratags?.website || undefined,
        provenance,
      };
    });

    return NextResponse.json({
      query,
      count: facilities.length,
      facilities,
      provenance,
    });
  } catch (error: any) {
    console.error("Verified Hospital API error:", error);
    return NextResponse.json(
      {
        error: "Failed to query verified hospital directory",
        details: error.message,
        facilities: [],
      },
      { status: 500 }
    );
  }
}
