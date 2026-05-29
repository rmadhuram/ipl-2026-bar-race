export interface TeamConfig {
  abbrev: string;
  primary: string;
  secondary: string;
  text: string;
  logo: string;
}

export const TEAM_CONFIG: Record<string, TeamConfig> = {
  "Chennai Super Kings":         { abbrev: "CSK",  primary: "#F9CD1F", secondary: "#1B4B8A", text: "#000000", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Chennai_Super_Kings_colours.svg/250px-Chennai_Super_Kings_colours.svg.png" },
  "Delhi Capitals":              { abbrev: "DC",   primary: "#0078BC", secondary: "#EF1C25", text: "#FFFFFF", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Delhi_Capitals_colours.svg/250px-Delhi_Capitals_colours.svg.png" },
  "Gujarat Titans":              { abbrev: "GT",   primary: "#1C1C1C", secondary: "#B5B5B5", text: "#FFFFFF", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Gujarat_Titans_colours.svg/250px-Gujarat_Titans_colours.svg.png" },
  "Kolkata Knight Riders":       { abbrev: "KKR",  primary: "#3B215A", secondary: "#F5A818", text: "#FFFFFF", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Kolkata_Knight_Riders_colours.svg/250px-Kolkata_Knight_Riders_colours.svg.png" },
  "Lucknow Super Giants":        { abbrev: "LSG",  primary: "#A9E4FF", secondary: "#031636", text: "#000000", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/34/Lucknow_Super_Giants_Logo.svg/250px-Lucknow_Super_Giants_Logo.svg.png" },
  "Mumbai Indians":              { abbrev: "MI",   primary: "#004BA0", secondary: "#D1AB3E", text: "#FFFFFF", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Mumbai_Indians_colours.svg/250px-Mumbai_Indians_colours.svg.png" },
  "Punjab Kings":                { abbrev: "PBKS", primary: "#DD1F2D", secondary: "#84898C", text: "#FFFFFF", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Punjab_Kings_colours.svg/250px-Punjab_Kings_colours.svg.png" },
  "Rajasthan Royals":            { abbrev: "RR",   primary: "#2D4EA2", secondary: "#FF69B4", text: "#FFFFFF", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Rajasthan_Royals_colours.svg/250px-Rajasthan_Royals_colours.svg.png" },
  "Royal Challengers Bengaluru": { abbrev: "RCB",  primary: "#D4173A", secondary: "#000000", text: "#FFFFFF", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Royal_Challengers_Bangalore_colours_2.svg/250px-Royal_Challengers_Bangalore_colours_2.svg.png" },
  "Sunrisers Hyderabad":         { abbrev: "SRH",  primary: "#F7621E", secondary: "#000000", text: "#FFFFFF", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Sunrisers_Hyderabad_colours.svg/250px-Sunrisers_Hyderabad_colours.svg.png" },
};

export const ALL_TEAMS = Object.keys(TEAM_CONFIG);
