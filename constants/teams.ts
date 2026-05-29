export interface TeamConfig {
  abbrev: string;
  primary: string;
  secondary: string;
  text: string;
  logo: string;
}

export const TEAM_CONFIG: Record<string, TeamConfig> = {
  "Chennai Super Kings":         { abbrev: "CSK",  primary: "#F9CD1F", secondary: "#1B4B8A", text: "#000000", logo: "https://upload.wikimedia.org/wikipedia/en/2/2b/Chennai_Super_Kings_Logo.svg" },
  "Delhi Capitals":              { abbrev: "DC",   primary: "#0078BC", secondary: "#EF1C25", text: "#FFFFFF", logo: "https://upload.wikimedia.org/wikipedia/en/2/2f/Delhi_Capitals.svg" },
  "Gujarat Titans":              { abbrev: "GT",   primary: "#C7A84B", secondary: "#1C1C1C", text: "#000000", logo: "https://upload.wikimedia.org/wikipedia/en/0/09/Gujarat_Titans_Logo.svg" },
  "Kolkata Knight Riders":       { abbrev: "KKR",  primary: "#3B215A", secondary: "#F5A818", text: "#FFFFFF", logo: "https://upload.wikimedia.org/wikipedia/en/4/4c/Kolkata_Knight_Riders_Logo.svg" },
  "Lucknow Super Giants":        { abbrev: "LSG",  primary: "#A9E4FF", secondary: "#031636", text: "#000000", logo: "https://upload.wikimedia.org/wikipedia/en/3/34/Lucknow_Super_Giants_Logo.svg" },
  "Mumbai Indians":              { abbrev: "MI",   primary: "#004BA0", secondary: "#D1AB3E", text: "#FFFFFF", logo: "https://upload.wikimedia.org/wikipedia/en/c/cd/Mumbai_Indians_Logo.svg" },
  "Punjab Kings":                { abbrev: "PBKS", primary: "#DD1F2D", secondary: "#84898C", text: "#FFFFFF", logo: "https://upload.wikimedia.org/wikipedia/en/d/d4/Punjab_Kings_Logo.svg" },
  "Rajasthan Royals":            { abbrev: "RR",   primary: "#2D4EA2", secondary: "#FF69B4", text: "#FFFFFF", logo: "https://upload.wikimedia.org/wikipedia/en/5/5c/This_is_the_logo_for_Rajasthan_Royals%2C_a_cricket_team_playing_in_the_Indian_Premier_League_%28IPL%29.svg" },
  "Royal Challengers Bengaluru": { abbrev: "RCB",  primary: "#D4173A", secondary: "#000000", text: "#FFFFFF", logo: "https://upload.wikimedia.org/wikipedia/en/d/d4/Royal_Challengers_Bengaluru_Logo.svg" },
  "Sunrisers Hyderabad":         { abbrev: "SRH",  primary: "#F7621E", secondary: "#000000", text: "#FFFFFF", logo: "https://upload.wikimedia.org/wikipedia/en/5/51/Sunrisers_Hyderabad_Logo.svg" },
};

export const ALL_TEAMS = Object.keys(TEAM_CONFIG);
