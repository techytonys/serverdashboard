// Region to flag mapping for Linode data centers
// Using Unicode flag emojis for visual representation

interface RegionInfo {
  flag: string;
  country: string;
  city: string;
}

export const regionFlags: Record<string, RegionInfo> = {
  // North America
  "us-east": { flag: "🇺🇸", country: "United States", city: "Newark, NJ" },
  "us-central": { flag: "🇺🇸", country: "United States", city: "Dallas, TX" },
  "us-west": { flag: "🇺🇸", country: "United States", city: "Fremont, CA" },
  "us-southeast": { flag: "🇺🇸", country: "United States", city: "Atlanta, GA" },
  "ca-central": { flag: "🇨🇦", country: "Canada", city: "Toronto, ON" },

  // Europe
  "eu-west": { flag: "🇬🇧", country: "United Kingdom", city: "London" },
  "eu-central": { flag: "🇩🇪", country: "Germany", city: "Frankfurt" },
  "fr-par": { flag: "🇫🇷", country: "France", city: "Paris" },
  "nl-ams": { flag: "🇳🇱", country: "Netherlands", city: "Amsterdam" },
  "se-sto": { flag: "🇸🇪", country: "Sweden", city: "Stockholm" },

  // Asia Pacific
  "ap-south": { flag: "🇸🇬", country: "Singapore", city: "Singapore" },
  "ap-northeast": { flag: "🇯🇵", country: "Japan", city: "Tokyo" },
  "ap-southeast": { flag: "🇦🇺", country: "Australia", city: "Sydney" },
  "ap-west": { flag: "🇮🇳", country: "India", city: "Mumbai" },

  // Other regions (fallback)
  default: { flag: "🌍", country: "Global", city: "Unknown" },
};

export const getRegionInfo = (region: string): RegionInfo => {
  return regionFlags[region] || regionFlags.default;
};

export const formatRegionDisplay = (region: string): string => {
  const info = getRegionInfo(region);
  return `${info.flag} ${region}`;
};

export const getRegionTooltip = (region: string): string => {
  const info = getRegionInfo(region);
  return `${info.city}, ${info.country}`;
};
