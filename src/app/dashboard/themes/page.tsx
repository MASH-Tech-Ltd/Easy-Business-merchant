"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Palette,
  CheckCircle2,
  LayoutTemplate,
  Settings,
  Type,
  Link as LinkIcon,
  Save,
  Phone,
  Mail,
  MapPin,
  Shield,
  HelpCircle,
  Image as ImageIcon,
  Truck,
  Plus,
  Trash2,
  Minus,
  Megaphone,
  Sparkles,
  ShoppingCart,
  Zap,
  Star,
  Heart,
  Eye,
  EyeOff,
  ExternalLink,
  MessageCircle,
  ChevronDown,
  Check,
  Search,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../../utils/api";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { MultipleImageUpload } from "@/components/ui/MultipleImageUpload";
import { bdLocations } from "@/data/locations";

const availableThemes = [
  {
    id: "design-01",
    name: "Design 01 (Classic)",
    color: "#ffffff",
    textColor: "#171717",
    accent: "#5022C3",
  },
  {
    id: "design-02",
    name: "Design 02 (Minimal)",
    color: "#f8fafc",
    textColor: "#0f172a",
    accent: "#3b82f6",
  },
  {
    id: "design-03",
    name: "Design 03 (Brutalist)",
    color: "#050505",
    textColor: "#ffffff",
    accent: "#06b6d4",
  },
  {
    id: "design-04",
    name: "Design 04 (Clean)",
    color: "#ffffff",
    textColor: "#111827",
    accent: "#111827",
  },
  {
    id: "design-05",
    name: "Design 05 (Premium)",
    color: "#ffffff",
    textColor: "#000000",
    accent: "#000000",
  },
  {
    id: "design-06",
    name: "Design 06 (Boutique Elegance)",
    color: "#ffffff",
    textColor: "#0f172a",
    accent: "#111827",
  },
];

const STORE_TITLE_FONTS = [
  // ── Luxury, Editorial & Classic Serif (45 fonts) ──
  { value: "Playfair Display", label: "Playfair Display", category: "Luxury Serif" },
  { value: "Cinzel", label: "Cinzel", category: "Roman Serif" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond", category: "Classic Serif" },
  { value: "Bodoni Moda", label: "Bodoni Moda", category: "Vogue Serif" },
  { value: "Marcellus", label: "Marcellus", category: "Classic Serif" },
  { value: "Prata", label: "Prata", category: "Elegant Serif" },
  { value: "Italiana", label: "Italiana", category: "Fashion Serif" },
  { value: "Merriweather", label: "Merriweather", category: "Book Serif" },
  { value: "Libre Baskerville", label: "Libre Baskerville", category: "Heritage Serif" },
  { value: "EB Garamond", label: "EB Garamond", category: "Royal Serif" },
  { value: "Lora", label: "Lora", category: "Editorial Serif" },
  { value: "Bitter", label: "Bitter", category: "Contemporary Serif" },
  { value: "Spectral", label: "Spectral", category: "Crisp Serif" },
  { value: "Frank Ruhl Libre", label: "Frank Ruhl Libre", category: "Classic Serif" },
  { value: "Castoro", label: "Castoro", category: "Scholarly Serif" },
  { value: "Bellefair", label: "Bellefair", category: "Haute Couture Serif" },
  { value: "Cardo", label: "Cardo", category: "Historic Serif" },
  { value: "Faustina", label: "Faustina", category: "Boutique Serif" },
  { value: "Forum", label: "Forum", category: "Roman Antique" },
  { value: "Alice", label: "Alice", category: "Whimsical Serif" },
  { value: "Amiri", label: "Amiri", category: "Classical Arabic Serif" },
  { value: "Bentham", label: "Bentham", category: "19th Century Serif" },
  { value: "BioRhyme", label: "BioRhyme", category: "Expanded Serif" },
  { value: "Rozha One", label: "Rozha One", category: "High-Contrast Serif" },
  { value: "Rufina", label: "Rufina", category: "Vintage Bodoni Serif" },
  { value: "Vidaloka", label: "Vidaloka", category: "Curled Didone Serif" },
  { value: "Volkhov", label: "Volkhov", category: "Sturdy Serif" },
  { value: "Yeseva One", label: "Yeseva One", category: "Complete Grace Serif" },
  { value: "Gilda Display", label: "Gilda Display", category: "Editorial Glamour" },
  { value: "DM Serif Display", label: "DM Serif Display", category: "High-End Display Serif" },
  { value: "DM Serif Text", label: "DM Serif Text", category: "Editorial Text Serif" },
  { value: "Newsreader", label: "Newsreader", category: "Literary Serif" },
  { value: "Petrona", label: "Petrona", category: "Sharp Serif" },
  { value: "Besley", label: "Besley", category: "Heritage Slab Serif" },
  { value: "Suranna", label: "Suranna", category: "Fine Classic Serif" },
  { value: "Trirong", label: "Trirong", category: "Modern Didone" },
  { value: "Marcellus SC", label: "Marcellus SC", category: "Small Caps Roman" },
  { value: "Cinzel Decorative", label: "Cinzel Decorative", category: "Royal Ornate Serif" },
  { value: "Cormorant", label: "Cormorant", category: "Garamond Serif" },
  { value: "Cormorant SC", label: "Cormorant SC", category: "Garamond Small Caps" },
  { value: "Cormorant Infant", label: "Cormorant Infant", category: "Soft Serif" },
  { value: "Cormorant Unicase", label: "Cormorant Unicase", category: "Artistic Serif" },
  { value: "Arapey", label: "Arapey", category: "Bodoni Delicate Serif" },
  { value: "Antic Didone", label: "Antic Didone", category: "Luxury Vogue Serif" },
  { value: "Oranienbaum", label: "Oranienbaum", category: "Imperial Russian Serif" },

  // ── Modern, Clean & Geometric Sans-Serif (65 fonts) ──
  { value: "Montserrat", label: "Montserrat", category: "Modern Sans" },
  { value: "Poppins", label: "Poppins", category: "Geometric Sans" },
  { value: "Inter", label: "Inter", category: "Neutral Sans" },
  { value: "Plus Jakarta Sans", label: "Plus Jakarta Sans", category: "Corporate Sans" },
  { value: "Outfit", label: "Outfit", category: "Modern Tech" },
  { value: "Manrope", label: "Manrope", category: "Minimalist Sans" },
  { value: "DM Sans", label: "DM Sans", category: "Geometric Sans" },
  { value: "Sora", label: "Sora", category: "Minimal Tech" },
  { value: "Syne", label: "Syne", category: "Edgy Display" },
  { value: "Space Grotesk", label: "Space Grotesk", category: "Cyber Sans" },
  { value: "Roboto", label: "Roboto", category: "Standard Clean Sans" },
  { value: "Open Sans", label: "Open Sans", category: "Neutral Sans" },
  { value: "Lato", label: "Lato", category: "Warm Professional" },
  { value: "Raleway", label: "Raleway", category: "Fashion Sans" },
  { value: "Urbanist", label: "Urbanist", category: "Neo-Grotesque" },
  { value: "Jost", label: "Jost", category: "Bauhaus Sans" },
  { value: "Nunito", label: "Nunito", category: "Rounded Modern Sans" },
  { value: "Nunito Sans", label: "Nunito Sans", category: "Modern Sharp Sans" },
  { value: "Work Sans", label: "Work Sans", category: "Grotesque Sans" },
  { value: "Rubik", label: "Rubik", category: "Slightly Rounded" },
  { value: "Quicksand", label: "Quicksand", category: "Friendly Geometric" },
  { value: "Cabin", label: "Cabin", category: "Humanist Sans" },
  { value: "Heebo", label: "Heebo", category: "Crisp Modern Sans" },
  { value: "Mulish", label: "Mulish", category: "Minimalist Sans" },
  { value: "Barlow", label: "Barlow", category: "Clean Grotesk" },
  { value: "Barlow Condensed", label: "Barlow Condensed", category: "Condensed Modern" },
  { value: "Kanit", label: "Kanit", category: "Modern Thai-English" },
  { value: "Karla", label: "Karla", category: "Quirky Grotesque" },
  { value: "Fira Sans", label: "Fira Sans", category: "Technical Sans" },
  { value: "PT Sans", label: "PT Sans", category: "Contemporary Sans" },
  { value: "Overpass", label: "Overpass", category: "Highway Inspired" },
  { value: "Lexend", label: "Lexend", category: "High Legibility" },
  { value: "Lexend Deca", label: "Lexend Deca", category: "Expanded Clean Sans" },
  { value: "Epilogue", label: "Epilogue", category: "Variable Geometric" },
  { value: "Red Hat Display", label: "Red Hat Display", category: "Bold Display Sans" },
  { value: "Red Hat Text", label: "Red Hat Text", category: "Legible Tech Sans" },
  { value: "Figtree", label: "Figtree", category: "Friendly Clean Sans" },
  { value: "Albert Sans", label: "Albert Sans", category: "Scandinavian Modern" },
  { value: "Public Sans", label: "Public Sans", category: "Neutral Corporate" },
  { value: "Georama", label: "Georama", category: "Neo-Grotesque Sans" },
  { value: "Be Vietnam Pro", label: "Be Vietnam Pro", category: "Refined Geometric" },
  { value: "Spline Sans", label: "Spline Sans", category: "UI Optimized Sans" },
  { value: "Hanken Grotesk", label: "Hanken Grotesk", category: "Classic Grotesk" },
  { value: "Archivo", label: "Archivo", category: "High-Performance Sans" },
  { value: "Exo 2", label: "Exo 2", category: "Futuristic Tech" },
  { value: "Questrial", label: "Questrial", category: "Circle Based Modern" },
  { value: "Chivo", label: "Chivo", category: "Grotesque Punchy" },
  { value: "Asap", label: "Asap", category: "Rounded Corner Sans" },
  { value: "Oxygen", label: "Oxygen", category: "Linux Heritage Sans" },
  { value: "Catamaran", label: "Catamaran", category: "Contemporary Sans" },
  { value: "Signika", label: "Signika", category: "Wayfinding Signage" },
  { value: "Noto Sans", label: "Noto Sans", category: "Universal Sans" },
  { value: "Source Sans 3", label: "Source Sans 3", category: "Adobe Clean Sans" },
  { value: "Titillium Web", label: "Titillium Web", category: "Industrial Tech Sans" },
  { value: "Ubuntu", label: "Ubuntu", category: "Contemporary Humanist" },
  { value: "Varela Round", label: "Varela Round", category: "Clean Soft Rounded" },
  { value: "Alata", label: "Alata", category: "Greek Geometric Blend" },
  { value: "Tenor Sans", label: "Tenor Sans", category: "Fashion Forward Sans" },
  { value: "Syncopate", label: "Syncopate", category: "Wide Architecture Sans" },
  { value: "Kumbh Sans", label: "Kumbh Sans", category: "Modern Geometric" },
  { value: "Golos Text", label: "Golos Text", category: "Sleek Modern Sans" },
  { value: "Onest", label: "Onest", category: "Accessible Modern" },
  { value: "Radio Canada", label: "Radio Canada", category: "Clean Bilingual" },
  { value: "Schibsted Grotesk", label: "Schibsted Grotesk", category: "Editorial Digital" },

  // ── Signature, Calligraphy & Handwritten Script (45 fonts) ──
  { value: "Great Vibes", label: "Great Vibes", category: "Signature Script" },
  { value: "Dancing Script", label: "Dancing Script", category: "Casual Script" },
  { value: "Alex Brush", label: "Alex Brush", category: "Calligraphy" },
  { value: "Parisienne", label: "Parisienne", category: "French Cursive" },
  { value: "Sacramento", label: "Sacramento", category: "Monoline Script" },
  { value: "Pacifico", label: "Pacifico", category: "Surf Retro Script" },
  { value: "Caveat", label: "Caveat", category: "Handwritten Playful" },
  { value: "Satisfy", label: "Satisfy", category: "Smooth Brush Script" },
  { value: "Allura", label: "Allura", category: "Fine Stylized Script" },
  { value: "Tangerine", label: "Tangerine", category: "Tall Calligraphy" },
  { value: "Yellowtail", label: "Yellowtail", category: "Flat Brush Script" },
  { value: "Marck Script", label: "Marck Script", category: "Felt Pen Script" },
  { value: "Kaushan Script", label: "Kaushan Script", category: "Textured Brush" },
  { value: "Bad Script", label: "Bad Script", category: "Natural Handwriting" },
  { value: "Cookie", label: "Cookie", category: "1950s Pin-up Script" },
  { value: "Damion", label: "Damion", category: "Casual Mid-Century" },
  { value: "Grand Hotel", label: "Grand Hotel", category: "Upright Script" },
  { value: "Montez", label: "Montez", category: "Beauty Calligraphy" },
  { value: "Pinyon Script", label: "Pinyon Script", category: "High Aristocratic" },
  { value: "Rochester", label: "Rochester", category: "Victorian Formal" },
  { value: "Rouge Script", label: "Rouge Script", category: "Flirty Cursive" },
  { value: "Herr Von Muellerhoff", label: "Herr Von Muellerhoff", category: "Antique Ornate" },
  { value: "Italianno", label: "Italianno", category: "Chic Italian Script" },
  { value: "Lovers Quarrel", label: "Lovers Quarrel", category: "Embellished Romance" },
  { value: "Meddon", label: "Meddon", category: "18th Century Law Script" },
  { value: "Mrs Saint Delafield", label: "Mrs Saint Delafield", category: "Expressive Handwriting" },
  { value: "Qwigley", label: "Qwigley", category: "Contemporary Calligraphy" },
  { value: "Ruthie", label: "Ruthie", category: "Delicate Cursive" },
  { value: "Seaweed Script", label: "Seaweed Script", category: "Boutique Signature" },
  { value: "Stalemate", label: "Stalemate", category: "Vintage Brush Script" },
  { value: "Reenie Beanie", label: "Reenie Beanie", category: "Ballpoint Pen" },
  { value: "Gloria Hallelujah", label: "Gloria Hallelujah", category: "Casual Marker" },
  { value: "Homemade Apple", label: "Homemade Apple", category: "Personal Cursive" },
  { value: "Nothing You Could Do", label: "Nothing You Could Do", category: "Casual Scribble" },
  { value: "Shadows Into Light", label: "Shadows Into Light", category: "Clean Handwriting" },
  { value: "Indie Flower", label: "Indie Flower", category: "Bubbly Handwritten" },
  { value: "Covered By Your Grace", label: "Covered By Your Grace", category: "Cute Handwriting" },
  { value: "Permanent Marker", label: "Permanent Marker", category: "Thick Marker Pen" },
  { value: "Rock Salt", label: "Rock Salt", category: "Felt Marker Signature" },
  { value: "Architects Daughter", label: "Architects Daughter", category: "Architectural Drafting" },
  { value: "Kristi", label: "Kristi", category: "Quick Felt-Tip" },
  { value: "La Belle Aurore", label: "La Belle Aurore", category: "Organic Cursive" },
  { value: "Dawning of a New Day", label: "Dawning of a New Day", category: "Boutique Flowing" },
  { value: "Cedarville Cursive", label: "Cedarville Cursive", category: "School Teacher Script" },
  { value: "Just Another Hand", label: "Just Another Hand", category: "Narrow Handwriting" },

  // ── Display, Retro, Cyber & Creative (35 fonts) ──
  { value: "Righteous", label: "Righteous", category: "Retro Display" },
  { value: "Bungee", label: "Bungee", category: "Urban Signage" },
  { value: "Bungee Shade", label: "Bungee Shade", category: "3D Shadow Display" },
  { value: "Fredoka", label: "Fredoka", category: "Chunky Modern" },
  { value: "Comfortaa", label: "Comfortaa", category: "Geometric Rounded" },
  { value: "Audiowide", label: "Audiowide", category: "Futuristic Cyber" },
  { value: "Orbitron", label: "Orbitron", category: "Sci-Fi Geometric" },
  { value: "Russo One", label: "Russo One", category: "Heavy Block Impact" },
  { value: "Press Start 2P", label: "Press Start 2P", category: "8-Bit Arcade Pixel" },
  { value: "Monoton", label: "Monoton", category: "Neon Multi-Line" },
  { value: "Megrim", label: "Megrim", category: "Abstract Line Art" },
  { value: "Plaster", label: "Plaster", category: "Art Deco Stencil" },
  { value: "Faster One", label: "Faster One", category: "Speed Line Racer" },
  { value: "Shrikhand", label: "Shrikhand", category: "Thick Hand-Drawn" },
  { value: "Abril Fatface", label: "Abril Fatface", category: "Victorian Poster" },
  { value: "Alfa Slab One", label: "Alfa Slab One", category: "Heavy Weight Slab" },
  { value: "Black Ops One", label: "Black Ops One", category: "Military Stencil" },
  { value: "Boogaloo", label: "Boogaloo", category: "1960s Record Sleeve" },
  { value: "Carter One", label: "Carter One", category: "Bold Casual Display" },
  { value: "Chango", label: "Chango", category: "Woodcut Heavy" },
  { value: "Creepster", label: "Creepster", category: "Monster Horror" },
  { value: "Fugaz One", label: "Fugaz One", category: "Italic Dynamic" },
  { value: "Graduate", label: "Graduate", category: "Varsity College" },
  { value: "Kelly Slab", label: "Kelly Slab", category: "Square Stencil" },
  { value: "Limelight", label: "Limelight", category: "1920s Hollywood Deco" },
  { value: "Lobster", label: "Lobster", category: "Bold Retro Script" },
  { value: "Lobster Two", label: "Lobster Two", category: "Refined Retro Script" },
  { value: "Luckiest Guy", label: "Luckiest Guy", category: "Comic Bold Punch" },
  { value: "Modak", label: "Modak", category: "Ultra Plump Bubble" },
  { value: "Notable", label: "Notable", category: "Uppercase Monumental" },
  { value: "Nova Square", label: "Nova Square", category: "Square Cyber" },
  { value: "Passion One", label: "Passion One", category: "Condensed Punch" },
  { value: "Paytone One", label: "Paytone One", category: "Casual Impact" },
  { value: "Poetsen One", label: "Poetsen One", category: "Hand-Painted Sign" },
  { value: "Rammetto One", label: "Rammetto One", category: "Modernist Slab" },

  // ── Technical & Monospace (15 fonts) ──
  { value: "JetBrains Mono", label: "JetBrains Mono", category: "Monospace" },
  { value: "Fira Code", label: "Fira Code", category: "Code Monospace" },
  { value: "Source Code Pro", label: "Source Code Pro", category: "Clean Monospace" },
  { value: "Roboto Mono", label: "Roboto Mono", category: "Industrial Mono" },
  { value: "Inconsolata", label: "Inconsolata", category: "Humanist Mono" },
  { value: "Space Mono", label: "Space Mono", category: "Futuristic Mono" },
  { value: "IBM Plex Mono", label: "IBM Plex Mono", category: "Corporate Mono" },
  { value: "Ubuntu Mono", label: "Ubuntu Mono", category: "Linux Mono" },
  { value: "Courier Prime", label: "Courier Prime", category: "Screenplay Typewriter" },
  { value: "Cutive Mono", label: "Cutive Mono", category: "Vintage Typewriter" },
  { value: "Anonymous Pro", label: "Anonymous Pro", category: "Classic Hacker Mono" },
  { value: "Share Tech Mono", label: "Share Tech Mono", category: "Cyber Terminal" },
  { value: "Overpass Mono", label: "Overpass Mono", category: "Signage Monospace" },
  { value: "DM Mono", label: "DM Mono", category: "Geometric Monospace" },
  { value: "Major Mono Display", label: "Major Mono Display", category: "Avant-Garde Mono" },

  // ── Bengali & Multilingual (10 fonts) ──
  { value: "Hind Siliguri", label: "Hind Siliguri", category: "Bengali Sans" },
  { value: "Tiro Bangla", label: "Tiro Bangla", category: "Bengali Serif" },
  { value: "Noto Serif Bengali", label: "Noto Serif Bengali", category: "Formal Bengali Serif" },
  { value: "Noto Sans Bengali", label: "Noto Sans Bengali", category: "Clean Bengali Sans" },
  { value: "Galada", label: "Galada", category: "Bengali Script" },
  { value: "Mina", label: "Mina", category: "Geometric Bengali" },
  { value: "Atma", label: "Atma", category: "Playful Bengali" },
  { value: "Anek Bangla", label: "Anek Bangla", category: "Modern Variable Bengali" },
  { value: "Baloo Da 2", label: "Baloo Da 2", category: "Friendly Bengali Rounded" },
  { value: "Noto Sans", label: "Noto Sans", category: "Multilingual Global" },
];

// Preload flagship fonts for instantaneous first render
const PRELOAD_FONTS = [
  "Playfair Display", "Cinzel", "Cormorant Garamond", "Bodoni Moda", "Marcellus",
  "Prata", "Italiana", "Merriweather", "Libre Baskerville", "EB Garamond",
  "Montserrat", "Poppins", "Inter", "Plus Jakarta Sans", "Outfit", "Manrope",
  "DM Sans", "Sora", "Syne", "Space Grotesk", "Raleway", "Urbanist", "Jost",
  "Great Vibes", "Dancing Script", "Alex Brush", "Parisienne", "Sacramento",
  "Righteous", "Bungee", "Fredoka", "Comfortaa", "Orbitron", "JetBrains Mono",
  "Hind Siliguri", "Tiro Bangla"
];

const PRELOAD_GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?" +
  PRELOAD_FONTS.map(
    (f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}`
  ).join("&") +
  "&display=swap";

// Global cache for instant UI rendering during client navigation
let globalThemeCache: any = null;

function ThemesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tabParam = searchParams.get("tab");
  const policyParam = searchParams.get("policy");
  const highlightParam = searchParams.get("highlight");

  const MarqueeTag = "marquee" as any;
  const [activeTheme, setActiveTheme] = useState(
    globalThemeCache?.activeTheme || "design-01",
  );
  const [savedTheme, setSavedTheme] = useState(
    globalThemeCache?.savedTheme || "design-01",
  );
  const [primaryColor, setPrimaryColor] = useState(
    globalThemeCache?.primaryColor || "#5022C3",
  );
  const [buttonColors, setButtonColors] = useState(
    globalThemeCache?.buttonColors || { addToCart: "", buyNow: "" },
  );
  const [fontFamily, setFontFamily] = useState(
    globalThemeCache?.fontFamily || "Inter",
  );
  const [storeTitleFont, setStoreTitleFont] = useState(
    globalThemeCache?.storeTitleFont || "Inter",
  );
  const [storeName, setStoreName] = useState(
    globalThemeCache?.storeName || "ALI FASHION",
  );
  const [titleCasePreview, setTitleCasePreview] = useState<"uppercase" | "original">("uppercase");
  const [fontPickerOpen, setFontPickerOpen] = useState(false);
  const [fontPickerSearch, setFontPickerSearch] = useState("");
  const [fontPickerTab, setFontPickerTab] = useState<"All" | "Serif" | "Sans" | "Script" | "Display" | "Mono" | "Bengali">("All");
  const fontPickerRef = useRef<HTMLDivElement>(null);

  const [headingFontPickerOpen, setHeadingFontPickerOpen] = useState(false);
  const [headingFontSearch, setHeadingFontSearch] = useState("");
  const [headingFontTab, setHeadingFontTab] = useState<"All" | "Serif" | "Sans" | "Script" | "Display" | "Mono" | "Bengali">("All");
  const headingFontPickerRef = useRef<HTMLDivElement>(null);

  const loadedFontsRef = useRef<Set<string>>(new Set(PRELOAD_FONTS));

  const ensureFontLoaded = (fontName: string) => {
    if (typeof document === "undefined" || !fontName) return;
    if (loadedFontsRef.current.has(fontName)) return;
    loadedFontsRef.current.add(fontName);

    const fontId = `gfont-${fontName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`;
    if (document.getElementById(fontId)) return;

    const link = document.createElement("link");
    link.id = fontId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName).replace(/%20/g, "+")}&display=swap`;
    document.head.appendChild(link);
  };

  useEffect(() => {
    if (storeTitleFont) {
      ensureFontLoaded(storeTitleFont);
    }
  }, [storeTitleFont]);

  useEffect(() => {
    if (fontFamily) {
      ensureFontLoaded(fontFamily);
    }
  }, [fontFamily]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fontPickerRef.current && !fontPickerRef.current.contains(e.target as Node)) {
        setFontPickerOpen(false);
      }
      if (headingFontPickerRef.current && !headingFontPickerRef.current.contains(e.target as Node)) {
        setHeadingFontPickerOpen(false);
      }
    };
    if (fontPickerOpen || headingFontPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fontPickerOpen, headingFontPickerOpen]);

  const filteredFonts = STORE_TITLE_FONTS.filter((f) => {
    const matchesSearch =
      f.value.toLowerCase().includes(fontPickerSearch.toLowerCase()) ||
      f.label.toLowerCase().includes(fontPickerSearch.toLowerCase()) ||
      f.category.toLowerCase().includes(fontPickerSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (fontPickerTab === "All") return true;
    if (fontPickerTab === "Serif") return f.category.toLowerCase().includes("serif");
    if (fontPickerTab === "Sans") return f.category.toLowerCase().includes("sans");
    if (fontPickerTab === "Script") return f.category.toLowerCase().includes("script") || f.category.toLowerCase().includes("cursive") || f.category.toLowerCase().includes("calligraphy") || f.category.toLowerCase().includes("hand");
    if (fontPickerTab === "Display") return f.category.toLowerCase().includes("display") || f.category.toLowerCase().includes("retro") || f.category.toLowerCase().includes("stencil") || f.category.toLowerCase().includes("cyber");
    if (fontPickerTab === "Mono") return f.category.toLowerCase().includes("mono");
    if (fontPickerTab === "Bengali") return f.category.toLowerCase().includes("bengali");
    return true;
  });

  const filteredHeadingFonts = STORE_TITLE_FONTS.filter((f) => {
    const matchesSearch =
      f.value.toLowerCase().includes(headingFontSearch.toLowerCase()) ||
      f.label.toLowerCase().includes(headingFontSearch.toLowerCase()) ||
      f.category.toLowerCase().includes(headingFontSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (headingFontTab === "All") return true;
    if (headingFontTab === "Serif") return f.category.toLowerCase().includes("serif");
    if (headingFontTab === "Sans") return f.category.toLowerCase().includes("sans");
    if (headingFontTab === "Script") return f.category.toLowerCase().includes("script") || f.category.toLowerCase().includes("cursive") || f.category.toLowerCase().includes("calligraphy") || f.category.toLowerCase().includes("hand");
    if (headingFontTab === "Display") return f.category.toLowerCase().includes("display") || f.category.toLowerCase().includes("retro") || f.category.toLowerCase().includes("stencil") || f.category.toLowerCase().includes("cyber");
    if (headingFontTab === "Mono") return f.category.toLowerCase().includes("mono");
    if (headingFontTab === "Bengali") return f.category.toLowerCase().includes("bengali");
    return true;
  });
  const [language, setLanguage] = useState(globalThemeCache?.language || "en");
  const [currencySymbol, setCurrencySymbol] = useState(
    globalThemeCache?.currencySymbol || "৳",
  );
  const [footer, setFooter] = useState<{
    socialLinks: { facebook: string; youtube: string; tiktok: string };
    contactInfo: { email: string; phone: string; address: string };
    policies: {
      aboutUs: string;
      privacyPolicy: string;
      termsAndConditions: string;
      returnPolicy: string;
    };
    copyrightText: string;
  }>(
    globalThemeCache?.footer || {
      socialLinks: { facebook: "", youtube: "", tiktok: "" },
      contactInfo: { email: "", phone: "", address: "" },
      policies: {
        aboutUs: "",
        privacyPolicy: "",
        termsAndConditions: "",
        returnPolicy: "",
      },
      copyrightText: "",
    },
  );
  const [banner, setBanner] = useState<{
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    image: any;
    images?: any[];
    showBannerContent?: boolean;
    showAnnouncement?: boolean;
    announcementText?: string;
    isSliding?: boolean;
    announcementBgColor?: string;
    announcementTextColor?: string;
  }>(
    globalThemeCache?.banner || {
      title: "",
      subtitle: "",
      description: "",
      buttonText: "",
      buttonLink: "",
      image: null,
      images: [],
      showBannerContent: true,
      showAnnouncement: false,
      announcementText: "",
      isSliding: false,
      announcementBgColor: "#0f172a",
      announcementTextColor: "#ffffff",
    },
  );
  const [bannerImagesFiles, setBannerImagesFiles] = useState<File[]>([]);
  const [bannerPreviewUrls, setBannerPreviewUrls] = useState<string[]>(
    globalThemeCache?.bannerPreviewUrls || [],
  );
  const [bannerExistingImages, setBannerExistingImages] = useState<
    { public_id: string; secure_url: string }[]
  >(globalThemeCache?.bannerExistingImages || []);
  const [bannerErrors, setBannerErrors] = useState<Record<string, string>>({});

  const [chatWidget, setChatWidget] = useState<{
    enabled: boolean;
    whatsappEnabled: boolean;
    whatsappNumber: string;
    whatsappMessage: string;
    messengerEnabled: boolean;
    messengerUsername: string;
    autoOpen: boolean;
    displayStyle: "expandable" | "stacked";
    greetingText: string;
  }>(
    globalThemeCache?.chatWidget || {
      enabled: false,
      whatsappEnabled: false,
      whatsappNumber: "",
      whatsappMessage:
        "Hello! I have a question about a product on your store.",
      messengerEnabled: false,
      messengerUsername: "",
      autoOpen: false,
      displayStyle: "expandable",
      greetingText: "Need help? Chat with us!",
    },
  );

  const [loading, setLoading] = useState(!globalThemeCache);
  const [saving, setSaving] = useState(false);
  const VALID_THEME_TABS = ["template", "customization", "banner", "footer", "shipping", "chat"];
  const [activeTab, setActiveTabState] = useState(
    tabParam && VALID_THEME_TABS.includes(tabParam) ? tabParam : "template"
  );
  const setActiveTab = (nextTab: string) => {
    setActiveTabState(nextTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", nextTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  const [activePolicyTab, setActivePolicyTab] = useState<string>("aboutUs");

  // Shipping zones state
  interface ShippingZone {
    name: string;
    cost: number;
    division: string;
    districts: string[];
  }
  const [defaultShippingCost, setDefaultShippingCost] = useState(
    globalThemeCache?.defaultShippingCost ?? 120,
  );
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>(
    globalThemeCache?.shippingZones || [],
  );
  const [newZone, setNewZone] = useState<ShippingZone>({
    name: "",
    cost: 0,
    division: "",
    districts: [],
  });
  const [newZoneDistrictsList, setNewZoneDistrictsList] = useState<string[]>(
    [],
  );

  // Theme live preview URLs managed dynamically by Super Admin
  const [themePreviews, setThemePreviews] = useState<Record<string, string>>(
    globalThemeCache?.themePreviews || {},
  );

  const fetchThemePreviews = async () => {
    try {
      const res = await api.get("/themes/previews");
      if (res.data?.data) {
        setThemePreviews(res.data.data);
        if (globalThemeCache) {
          globalThemeCache.themePreviews = res.data.data;
        }
      }
    } catch (err) {
      console.error("Failed to load theme preview links:", err);
    }
  };

  const handlePreviewTheme = (themeId: string, themeName: string) => {
    const rawUrl = themePreviews[themeId];
    if (rawUrl && rawUrl.trim()) {
      let finalUrl = rawUrl.trim();
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = "https://" + finalUrl;
      }
      window.open(finalUrl, "_blank", "noopener,noreferrer");
    } else {
      toast(`Live preview demo for ${themeName} is not configured yet.`, {
        icon: "ℹ️",
      });
    }
  };

  useEffect(() => {
    fetchTheme();
    fetchThemePreviews();
  }, []);

  useEffect(() => {
    if (
      tabParam &&
      [
        "template",
        "customization",
        "banner",
        "footer",
        "shipping",
        "chat",
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
    if (
      policyParam &&
      [
        "aboutUs",
        "privacyPolicy",
        "termsAndConditions",
        "returnPolicy",
      ].includes(policyParam)
    ) {
      setActivePolicyTab(policyParam);
    }
    if (highlightParam || tabParam) {
      const targetId =
        highlightParam === "policies"
          ? "footer-policies-section"
          : `${highlightParam || tabParam}-section`;
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [tabParam, highlightParam, policyParam]);

  const fetchTheme = async () => {
    if (!globalThemeCache) setLoading(true);
    try {
      const res = await api.get("/themes/my-theme");
      const themeData = res.data.data;
      if (themeData) {
        let dbTheme = "design-01";
        if (themeData.themeId) {
          dbTheme =
            themeData.themeId === "light" ? "design-01" : themeData.themeId;
          setActiveTheme(dbTheme);
          setSavedTheme(dbTheme);
        }
        if (themeData.primaryColor) setPrimaryColor(themeData.primaryColor);
        if (themeData.buttonColors) {
          setButtonColors({
            addToCart: themeData.buttonColors.addToCart || "",
            buyNow: themeData.buttonColors.buyNow || "",
          });
        }
        if (themeData.fontFamily) setFontFamily(themeData.fontFamily);
        if (themeData.storeTitleFont) setStoreTitleFont(themeData.storeTitleFont);
        if (themeData.language) setLanguage(themeData.language);
        if (themeData.currencySymbol)
          setCurrencySymbol(themeData.currencySymbol);
        if (Array.isArray(themeData.shippingZones))
          setShippingZones(themeData.shippingZones);
        if (themeData.defaultShippingCost !== undefined)
          setDefaultShippingCost(themeData.defaultShippingCost);

        let contactEmail = themeData.footer?.contactInfo?.email || "";
        let contactPhone = themeData.footer?.contactInfo?.phone || "";
        let contactAddress = themeData.footer?.contactInfo?.address || "";

        // Fetch store profile to sync storeName for live preview & contact info if needed
        try {
          const storeRes = await api.get("/tenants/my-store");
          const storeData = storeRes.data?.data;
          if (storeData) {
            if (storeData.name) setStoreName(storeData.name);
            if (!contactEmail) contactEmail = storeData.contactEmail || "";
            if (!contactPhone) contactPhone = storeData.contactPhone || "";
            if (!contactAddress)
              contactAddress = storeData.contactAddress || "";
          }
        } catch (e) {}

        const newFooter = {
          socialLinks: {
            facebook: themeData.footer?.socialLinks?.facebook || "",
            youtube: themeData.footer?.socialLinks?.youtube || "",
            tiktok: themeData.footer?.socialLinks?.tiktok || "",
          },
          contactInfo: {
            email: contactEmail,
            phone: contactPhone,
            address: contactAddress,
          },
          policies: {
            aboutUs: themeData.footer?.policies?.aboutUs || "",
            privacyPolicy: themeData.footer?.policies?.privacyPolicy || "",
            termsAndConditions:
              themeData.footer?.policies?.termsAndConditions || "",
            returnPolicy: themeData.footer?.policies?.returnPolicy || "",
          },
          copyrightText: themeData.footer?.copyrightText || "",
        };
        setFooter(newFooter);

        const newBanner = {
          title: themeData.banner?.title || "",
          subtitle: themeData.banner?.subtitle || "",
          description: themeData.banner?.description || "",
          buttonText: themeData.banner?.buttonText || "",
          buttonLink: themeData.banner?.buttonLink || "",
          image: themeData.banner?.image || null,
          images: Array.isArray(themeData.banner?.images)
            ? themeData.banner.images
            : [],
          showBannerContent: themeData.banner?.showBannerContent !== false,
          showAnnouncement:
            themeData.banner?.showAnnouncement ??
            (themeData.banner?.announcementText ? true : false),
          announcementText: themeData.banner?.announcementText || "",
          isSliding: themeData.banner?.isSliding ?? false,
          announcementBgColor:
            themeData.banner?.announcementBgColor || "#0f172a",
          announcementTextColor:
            themeData.banner?.announcementTextColor || "#ffffff",
        };
        setBanner(newBanner);

        let existingImgs: { public_id: string; secure_url: string }[] = [];
        if (
          Array.isArray(themeData.banner?.images) &&
          themeData.banner.images.length > 0
        ) {
          existingImgs = themeData.banner.images.filter(
            (img: any) => img && (img.secure_url || img.public_id),
          );
        } else if (themeData.banner?.image?.secure_url) {
          existingImgs = [themeData.banner.image];
        }

        setBannerExistingImages(existingImgs);
        setBannerPreviewUrls(existingImgs.map((img) => img.secure_url));
        setBannerImagesFiles([]);

        const newChatWidget = {
          enabled: Boolean(themeData.chatWidget?.enabled),
          whatsappEnabled: Boolean(themeData.chatWidget?.whatsappEnabled),
          whatsappNumber:
            themeData.chatWidget?.whatsappNumber || contactPhone || "",
          whatsappMessage:
            themeData.chatWidget?.whatsappMessage ||
            "Hello! I have a question about a product on your store.",
          messengerEnabled: Boolean(themeData.chatWidget?.messengerEnabled),
          messengerUsername:
            themeData.chatWidget?.messengerUsername ||
            themeData.footer?.socialLinks?.facebook ||
            "",
          autoOpen: Boolean(themeData.chatWidget?.autoOpen),
          displayStyle: (themeData.chatWidget?.displayStyle === "stacked"
            ? "stacked"
            : "expandable") as "expandable" | "stacked",
          greetingText:
            themeData.chatWidget?.greetingText || "Need help? Chat with us!",
        };
        setChatWidget(newChatWidget);

        // Save to global cache
        globalThemeCache = {
          activeTheme: dbTheme,
          savedTheme: dbTheme,
          primaryColor: themeData.primaryColor || "#5022C3",
          buttonColors: {
            addToCart: themeData.buttonColors?.addToCart || "",
            buyNow: themeData.buttonColors?.buyNow || "",
          },
          fontFamily: themeData.fontFamily || "Inter",
          storeTitleFont: themeData.storeTitleFont || "Inter",
          storeName: storeName || "ALI FASHION",
          language: themeData.language || "en",
          currencySymbol: themeData.currencySymbol || "৳",
          footer: newFooter,
          banner: newBanner,
          chatWidget: newChatWidget,
          bannerPreviewUrls: existingImgs.map((img) => img.secure_url),
          bannerExistingImages: existingImgs,
          defaultShippingCost: themeData.defaultShippingCost ?? 120,
          shippingZones: Array.isArray(themeData.shippingZones)
            ? themeData.shippingZones
            : [],
        };
      }
    } catch (error) {
      console.error("Error fetching theme", error);
    } finally {
      setLoading(false);
    }
  };

  const isValidBDPhone = (phone?: string): boolean => {
    if (!phone || !phone.trim()) return true;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    return /^(?:\+?88|88)?01[3-9]\d{8}$/.test(cleanPhone);
  };

  const handleSyncFromProfile = async () => {
    try {
      const storeRes = await api.get("/tenants/my-store");
      const store = storeRes.data?.data;
      const userRes = await api.get("/users/me").catch(() => null);
      const user = userRes?.data?.data;

      const email = store?.contactEmail || user?.email || "";
      const phone = store?.contactPhone || user?.phone || "";
      const address = store?.contactAddress || user?.address || "";
      const aboutUs = store?.description || "";

      setFooter((prev) => ({
        ...prev,
        contactInfo: {
          email,
          phone,
          address,
        },
        policies: {
          ...prev.policies,
          aboutUs: prev.policies.aboutUs || aboutUs,
        },
      }));
      toast.success("Contact Information auto-filled from Profile!");
    } catch (e) {
      toast.error("Failed to auto-fill from Profile");
    }
  };

  const handleSaveTheme = async () => {
    // Validate BD phone number in footer contact info
    if (footer.contactInfo.phone && !isValidBDPhone(footer.contactInfo.phone)) {
      toast.error(
        "Please enter a valid Bangladeshi Phone Number in Footer Settings (e.g. 01XXXXXXXXXX)",
      );
      return;
    }

    // Frontend Validation for Banner
    const hasBannerImage =
      bannerImagesFiles.length > 0 || bannerPreviewUrls.length > 0;
    const hasBannerContent =
      banner.title ||
      banner.subtitle ||
      banner.description ||
      banner.buttonText ||
      banner.buttonLink ||
      hasBannerImage;

    if (hasBannerContent) {
      let isValid = true;
      const errors: Record<string, string> = {};

      if (!banner.title) {
        errors.title = "Title is required";
        isValid = false;
      }
      if (!banner.subtitle) {
        errors.subtitle = "Subtitle is required";
        isValid = false;
      }
      if (!banner.description) {
        errors.description = "Description is required";
        isValid = false;
      }
      if (!banner.buttonText) {
        errors.buttonText = "Button text is required";
        isValid = false;
      }
      if (!banner.buttonLink) {
        errors.buttonLink = "Button link is required";
        isValid = false;
      }
      if (!hasBannerImage) {
        errors.image = "At least 1 banner image is required";
        isValid = false;
      }

      setBannerErrors(errors);

      if (!isValid) {
        toast.error("Please fix the errors in the Banner Settings.");
        return;
      }
    } else {
      setBannerErrors({});
    }

    setSaving(true);
    try {
      const imageSlots = bannerPreviewUrls
        .map((url) => {
          if (url.startsWith("blob:")) {
            return { isNew: true };
          }
          const existing = bannerExistingImages.find(
            (img) => img.secure_url === url,
          );
          return existing
            ? { public_id: existing.public_id, secure_url: existing.secure_url }
            : null;
        })
        .filter(Boolean);

      const retainedExistingImages = bannerPreviewUrls
        .map((url) =>
          bannerExistingImages.find((img) => img.secure_url === url),
        )
        .filter(
          (img): img is { public_id: string; secure_url: string } => !!img,
        );

      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          themeId: activeTheme,
          primaryColor,
          buttonColors,
          fontFamily,
          storeTitleFont,
          language,
          currencySymbol,
          footer,
          banner: {
            title: banner.title,
            subtitle: banner.subtitle,
            description: banner.description,
            buttonText: banner.buttonText,
            buttonLink: banner.buttonLink,
            showBannerContent: banner.showBannerContent !== false,
            imageSlots,
            existingImages: retainedExistingImages,
            showAnnouncement: banner.showAnnouncement || false,
            announcementText: banner.announcementText || "",
            isSliding: banner.isSliding || false,
            announcementBgColor: banner.announcementBgColor || "#0f172a",
            announcementTextColor: banner.announcementTextColor || "#ffffff",
          },
          shippingZones,
          defaultShippingCost,
          chatWidget,
        }),
      );

      bannerImagesFiles.forEach((file) => {
        formData.append("bannerImages", file);
      });

      await api.put("/themes/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSavedTheme(activeTheme);
      toast.success("Settings saved successfully!");
      // Refetch to refresh cache & previews
      await fetchTheme();
    } catch (error: any) {
      console.error("Error saving theme", error);
      const errorMessage =
        error.response?.data?.message || "Failed to save settings";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const updateFooter = (
    section: "socialLinks" | "contactInfo" | "policies",
    field: string,
    value: string,
  ) => {
    let finalValue = value;
    if (section === "contactInfo" && field === "phone") {
      finalValue = value.replace(/[^0-9+\-\s()]/g, "");
    }
    setFooter((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: finalValue,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 w-full max-w-[1800px] mx-auto min-h-screen">
      {/* Header Section */}
      <div className="relative mb-6 sm:mb-10 overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#1E1B4B] shadow-xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 px-4 py-6 sm:px-8 sm:py-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-4 sm:gap-6 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-5">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/10 p-3 sm:p-4 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center flex-shrink-0">
              <Palette className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
            </div>
            <div className="text-white text-center md:text-left">
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                Store Theme & Settings
              </h1>
              <p className="text-indigo-200 mt-1 sm:mt-2 text-xs sm:text-sm font-medium">
                Customize the look, feel, and details of your storefront
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col pb-32">
        {/* Tabs Navigation */}
        <div className="flex flex-nowrap sm:flex-wrap justify-start items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 bg-gray-50/80 p-1.5 sm:p-2 rounded-xl border border-gray-100 shadow-sm w-full overflow-x-auto">
          {[
            { id: "template", label: "Theme Template", icon: LayoutTemplate },
            {
              id: "customization",
              label: "Advanced Customization",
              icon: Settings,
            },
            { id: "banner", label: "Banner Settings", icon: ImageIcon },
            { id: "footer", label: "Footer & Policies", icon: Type },
            { id: "shipping", label: "Shipping", icon: Truck },
            {
              id: "chat",
              label: "Live Chat (WhatsApp & Messenger)",
              icon: MessageCircle,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-5 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all shrink-0 sm:grow md:grow-0 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-indigo-600 shadow-sm border border-gray-100"
                  : "text-gray-500 hover:bg-white hover:text-gray-800"
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Theme Template Selection */}
          {activeTab === "template" && (
            <Card className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
              <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex items-center gap-3">
                <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Choose a Theme Template
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Select a base design for your store
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {availableThemes.map((theme) => (
                    <div
                      key={theme.id}
                      onClick={() => {
                        setActiveTheme(theme.id);
                        setPrimaryColor(theme.accent);
                      }}
                      className={`group relative border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                        activeTheme === theme.id
                          ? "border-indigo-600 ring-4 ring-indigo-50 bg-indigo-50/10 scale-[1.02]"
                          : "border-gray-200 hover:border-indigo-300 hover:shadow-md"
                      }`}
                    >
                      {savedTheme === theme.id && (
                        <div className="absolute top-0 left-0 bg-indigo-600 text-white text-[10px] uppercase tracking-wide font-bold px-2.5 py-1 rounded-br-lg rounded-tl-xl z-20 shadow-sm border-r border-b border-indigo-700">
                          Live
                        </div>
                      )}
                      {activeTheme === theme.id && (
                        <div className="absolute top-3 right-3 text-indigo-600 z-10">
                          <CheckCircle2 className="w-6 h-6 fill-indigo-100" />
                        </div>
                      )}

                      <div>
                        <div
                          className="w-full h-36 rounded-xl mb-3 border border-gray-200 shadow-sm flex flex-col p-4 relative overflow-hidden group-hover:shadow-md transition-shadow"
                          style={{ backgroundColor: theme.color }}
                        >
                          {/* Mockup UI */}
                          <div className="flex justify-between items-center mb-4">
                            <div
                              className="w-16 h-4 rounded-md"
                              style={{
                                backgroundColor: theme.textColor,
                                opacity: 0.8,
                              }}
                            ></div>
                            <div className="flex gap-1.5">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{
                                  backgroundColor: theme.textColor,
                                  opacity: 0.2,
                                }}
                              ></div>
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{
                                  backgroundColor: theme.textColor,
                                  opacity: 0.2,
                                }}
                              ></div>
                            </div>
                          </div>
                          <div
                            className="w-3/4 h-6 rounded-md mb-2"
                            style={{
                              backgroundColor: theme.textColor,
                              opacity: 0.9,
                            }}
                          ></div>
                          <div
                            className="w-1/2 h-4 rounded-md mb-4"
                            style={{
                              backgroundColor: theme.textColor,
                              opacity: 0.5,
                            }}
                          ></div>
                          <div
                            className="w-24 h-8 rounded-lg mt-auto shadow-sm transition-colors duration-300"
                            style={{
                              backgroundColor:
                                activeTheme === theme.id
                                  ? primaryColor
                                  : theme.accent,
                            }}
                          ></div>

                          {/* Hover Quick Preview Action */}
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreviewTheme(theme.id, theme.name);
                              }}
                              className="px-3.5 py-1.5 bg-white text-slate-900 font-semibold text-xs rounded-xl shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform"
                            >
                              <Eye className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Live Preview</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100/90 mt-1">
                        <h4
                          className={`text-xs font-bold truncate transition-colors ${activeTheme === theme.id ? "text-indigo-700" : "text-gray-800"}`}
                        >
                          {theme.name}
                        </h4>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewTheme(theme.id, theme.name);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 rounded-lg transition-all shadow-2xs hover:shadow-xs flex-shrink-0 active:scale-95"
                          title={`Preview live demo for ${theme.name}`}
                        >
                          <ExternalLink className="w-3 h-3 text-indigo-500" />
                          <span>Preview</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Advanced Customization */}
          {activeTab === "customization" && (
            <Card
              id="customization-section"
              className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl h-full mb-0"
            >
              <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Advanced Customization
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Fine-tune your store's appearance
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <Palette className="w-4 h-4 text-gray-500" /> Primary
                      Accent Color
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm cursor-pointer group">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="absolute inset-[-10px] w-20 h-20 cursor-pointer"
                        />
                      </div>
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-32 font-mono uppercase text-center"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-3 font-medium">
                      Used for primary buttons, active states, and highlights.
                    </p>
                  </div>

                  <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <Palette className="w-4 h-4 text-gray-500" /> Add to Cart
                      Button Color
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm cursor-pointer group">
                        <input
                          type="color"
                          value={buttonColors.addToCart || primaryColor}
                          onChange={(e) =>
                            setButtonColors({
                              ...buttonColors,
                              addToCart: e.target.value,
                            })
                          }
                          className="absolute inset-[-10px] w-20 h-20 cursor-pointer"
                        />
                      </div>
                      <Input
                        value={buttonColors.addToCart}
                        onChange={(e) =>
                          setButtonColors({
                            ...buttonColors,
                            addToCart: e.target.value,
                          })
                        }
                        placeholder={primaryColor}
                        className="w-32 font-mono uppercase text-center"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-3 font-medium">
                      Optional. Overrides the primary color.
                    </p>
                  </div>

                  <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <Palette className="w-4 h-4 text-gray-500" /> Buy Now
                      Button Color
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm cursor-pointer group">
                        <input
                          type="color"
                          value={buttonColors.buyNow || "#ef4444"}
                          onChange={(e) =>
                            setButtonColors({
                              ...buttonColors,
                              buyNow: e.target.value,
                            })
                          }
                          className="absolute inset-[-10px] w-20 h-20 cursor-pointer"
                        />
                      </div>
                      <Input
                        value={buttonColors.buyNow}
                        onChange={(e) =>
                          setButtonColors({
                            ...buttonColors,
                            buyNow: e.target.value,
                          })
                        }
                        placeholder="#ef4444"
                        className="w-32 font-mono uppercase text-center"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-3 font-medium">
                      Optional. Defaults to standard red.
                    </p>
                  </div>

                  {/* Heading Font (Hidden per user request) */}
                  <div className="hidden">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 truncate">
                        <Type className="w-4 h-4 text-[#5022C3] shrink-0" /> Heading Font
                      </label>
                      {/* Compact live text preview badge right beside label */}
                      <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5 bg-white border border-gray-200/80 px-2 py-0.5 rounded-md shadow-2xs shrink-0">
                        <span className="text-gray-400">Preview:</span>
                        <span
                          style={{ fontFamily: `'${fontFamily || "Inter"}', sans-serif` }}
                          className="font-bold text-gray-900 truncate max-w-[110px] sm:max-w-[140px]"
                        >
                          New Arrivals
                        </span>
                      </span>
                    </div>

                    {/* Custom Dropdown Trigger */}
                    <div className="relative" ref={headingFontPickerRef}>
                      <button
                        type="button"
                        onClick={() => setHeadingFontPickerOpen(!headingFontPickerOpen)}
                        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg text-sm transition-all focus:outline-none border cursor-pointer ${
                          headingFontPickerOpen
                            ? "bg-white border-[#5022C3] ring-2 ring-[#5022C3]/20 shadow-sm"
                            : "bg-white/90 hover:bg-white border-gray-200 hover:border-gray-300 shadow-2xs"
                        }`}
                      >
                        {/* Selected Font Name & Category */}
                        <div className="flex items-center gap-2 truncate text-left">
                          <span className="font-semibold text-gray-900 truncate">
                            {fontFamily}
                          </span>
                          <span className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded shrink-0">
                            {STORE_TITLE_FONTS.find((f) => f.value === fontFamily)?.category || "Sans"}
                          </span>
                        </div>

                        {/* Live Text Preview right beside the select value */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            style={{ fontFamily: `'${fontFamily || "Inter"}', sans-serif` }}
                            className="text-sm sm:text-base font-bold tracking-wide text-gray-900 px-2 py-0.5 bg-gray-50 border border-gray-200/90 rounded shadow-2xs max-w-[120px] sm:max-w-[160px] truncate"
                          >
                            New Arrivals
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-500 transition-transform duration-200 shrink-0 ${
                              headingFontPickerOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {/* Dropdown Menu Popover with Option Previews */}
                      {headingFontPickerOpen && (
                        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl p-3 flex flex-col gap-2.5 animate-in fade-in-50 zoom-in-95 duration-150">
                          {/* Search Input */}
                          <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={headingFontSearch}
                              onChange={(e) => setHeadingFontSearch(e.target.value)}
                              placeholder={`Search ${STORE_TITLE_FONTS.length}+ heading fonts...`}
                              className="w-full pl-9 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5022C3]/20 focus:border-[#5022C3] text-gray-900 placeholder:text-gray-400"
                              autoFocus
                            />
                            {headingFontSearch && (
                              <button
                                type="button"
                                onClick={() => setHeadingFontSearch("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Category Filter Tabs */}
                          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-medium scrollbar-none">
                            {(["All", "Serif", "Sans", "Script", "Display", "Mono", "Bengali"] as const).map((tab) => (
                              <button
                                type="button"
                                key={tab}
                                onClick={() => setHeadingFontTab(tab)}
                                className={`px-2.5 py-1 rounded-md transition-colors shrink-0 cursor-pointer ${
                                  headingFontTab === tab
                                    ? "bg-[#5022C3] text-white font-semibold shadow-2xs"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                }`}
                              >
                                {tab === "All" ? `All (${STORE_TITLE_FONTS.length})` : tab}
                              </button>
                            ))}
                          </div>

                          {/* Options List with LIVE TEXT PREVIEWS on the right */}
                          <div className="max-h-[300px] overflow-y-auto space-y-1 pr-1 divide-y divide-gray-50">
                            {filteredHeadingFonts.length === 0 ? (
                              <div className="py-6 text-center text-xs text-gray-400">
                                No fonts found matching "{headingFontSearch}"
                              </div>
                            ) : (
                              filteredHeadingFonts.map((font) => {
                                const isSelected = fontFamily === font.value;
                                ensureFontLoaded(font.value);
                                return (
                                  <button
                                    type="button"
                                    key={font.value}
                                    onClick={() => {
                                      setFontFamily(font.value);
                                      setHeadingFontPickerOpen(false);
                                      setHeadingFontSearch("");
                                    }}
                                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left transition-all cursor-pointer group ${
                                      isSelected
                                        ? "bg-purple-50/80 border border-purple-200 text-purple-900"
                                        : "hover:bg-gray-50 border border-transparent text-gray-800"
                                    }`}
                                  >
                                    {/* Left: Font Name + category label */}
                                    <div className="min-w-0 pr-2">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-semibold text-xs sm:text-sm truncate">
                                          {font.label}
                                        </span>
                                        {isSelected && (
                                          <Check className="w-3.5 h-3.5 text-[#5022C3] shrink-0" />
                                        )}
                                      </div>
                                      <span className="text-[10px] text-gray-400 font-medium">
                                        {font.category}
                                      </span>
                                    </div>

                                    {/* Right: Real-time text preview in that exact font */}
                                    <div className="shrink-0 text-right">
                                      <span
                                        style={{ fontFamily: `'${font.value}', sans-serif` }}
                                        className="text-base sm:text-lg font-bold tracking-wider text-gray-900 group-hover:text-black truncate max-w-[130px] sm:max-w-[200px] block"
                                      >
                                        Featured Collection
                                      </span>
                                    </div>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-3 font-medium">
                      Select the font used for headings and titles across sections.
                    </p>
                  </div>

                  <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 relative">
                    {/* Preload flagship Google Web Fonts */}
                    <link rel="stylesheet" href={PRELOAD_GOOGLE_FONTS_URL} />

                    <div className="flex items-center justify-between gap-2 mb-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 truncate">
                        <Sparkles className="w-4 h-4 text-[#5022C3] shrink-0" /> Store Title / Brand Font
                      </label>
                      {/* Compact live text preview badge right beside label */}
                      <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5 bg-white border border-gray-200/80 px-2 py-0.5 rounded-md shadow-2xs shrink-0">
                        <span className="text-gray-400">Preview:</span>
                        <span
                          style={{ fontFamily: `'${storeTitleFont || "Inter"}', sans-serif` }}
                          className="font-bold text-gray-900 truncate max-w-[110px] sm:max-w-[140px]"
                        >
                          {storeName || "ALI FASHION"}
                        </span>
                      </span>
                    </div>

                    {/* Custom Dropdown Trigger */}
                    <div className="relative" ref={fontPickerRef}>
                      <button
                        type="button"
                        onClick={() => setFontPickerOpen(!fontPickerOpen)}
                        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg text-sm transition-all focus:outline-none border cursor-pointer ${
                          fontPickerOpen
                            ? "bg-white border-[#5022C3] ring-2 ring-[#5022C3]/20 shadow-sm"
                            : "bg-white/90 hover:bg-white border-gray-200 hover:border-gray-300 shadow-2xs"
                        }`}
                      >
                        {/* Selected Font Name & Category */}
                        <div className="flex items-center gap-2 truncate text-left">
                          <span className="font-semibold text-gray-900 truncate">
                            {storeTitleFont}
                          </span>
                          <span className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded shrink-0">
                            {STORE_TITLE_FONTS.find((f) => f.value === storeTitleFont)?.category || "Serif"}
                          </span>
                        </div>

                        {/* Live Text Preview right beside the select value */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            style={{ fontFamily: `'${storeTitleFont || "Inter"}', sans-serif` }}
                            className="text-sm sm:text-base font-bold tracking-wide text-gray-900 px-2 py-0.5 bg-gray-50 border border-gray-200/90 rounded shadow-2xs max-w-[120px] sm:max-w-[160px] truncate"
                          >
                            {storeName || "NOt Load"}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-500 transition-transform duration-200 shrink-0 ${
                              fontPickerOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {/* Dropdown Menu Popover with Option Previews */}
                      {fontPickerOpen && (
                        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl p-3 flex flex-col gap-2.5 animate-in fade-in-50 zoom-in-95 duration-150">
                          {/* Search Input */}
                          <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={fontPickerSearch}
                              onChange={(e) => setFontPickerSearch(e.target.value)}
                              placeholder={`Search ${STORE_TITLE_FONTS.length}+ luxury, sans, script, mono & bengali fonts...`}
                              className="w-full pl-9 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5022C3]/20 focus:border-[#5022C3] text-gray-900 placeholder:text-gray-400"
                              autoFocus
                            />
                            {fontPickerSearch && (
                              <button
                                type="button"
                                onClick={() => setFontPickerSearch("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Category Filter Tabs */}
                          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-medium scrollbar-none">
                            {(["All", "Serif", "Sans", "Script", "Display", "Mono", "Bengali"] as const).map((tab) => (
                              <button
                                type="button"
                                key={tab}
                                onClick={() => setFontPickerTab(tab)}
                                className={`px-2.5 py-1 rounded-md transition-colors shrink-0 cursor-pointer ${
                                  fontPickerTab === tab
                                    ? "bg-[#5022C3] text-white font-semibold shadow-2xs"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                }`}
                              >
                                {tab === "All" ? `All (${STORE_TITLE_FONTS.length})` : tab}
                              </button>
                            ))}
                          </div>

                          {/* Options List with LIVE TEXT PREVIEWS on the right */}
                          <div className="max-h-[300px] overflow-y-auto space-y-1 pr-1 divide-y divide-gray-50">
                            {filteredFonts.length === 0 ? (
                              <div className="py-6 text-center text-xs text-gray-400">
                                No fonts found matching "{fontPickerSearch}"
                              </div>
                            ) : (
                              filteredFonts.map((font) => {
                                const isSelected = storeTitleFont === font.value;
                                // On-demand dynamic font loading as items are rendered
                                ensureFontLoaded(font.value);
                                return (
                                  <button
                                    type="button"
                                    key={font.value}
                                    onClick={() => {
                                      setStoreTitleFont(font.value);
                                      setFontPickerOpen(false);
                                      setFontPickerSearch("");
                                    }}
                                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left transition-all cursor-pointer group ${
                                      isSelected
                                        ? "bg-purple-50/80 border border-purple-200 text-purple-900"
                                        : "hover:bg-gray-50 border border-transparent text-gray-800"
                                    }`}
                                  >
                                    {/* Left: Font Name + category label */}
                                    <div className="min-w-0 pr-2">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-semibold text-xs sm:text-sm truncate">
                                          {font.label}
                                        </span>
                                        {isSelected && (
                                          <Check className="w-3.5 h-3.5 text-[#5022C3] shrink-0" />
                                        )}
                                      </div>
                                      <span className="text-[10px] text-gray-400 font-medium">
                                        {font.category}
                                      </span>
                                    </div>

                                    {/* Right: Real-time text preview in that exact font (WHERE USER'S RED BOX IS!) */}
                                    <div className="shrink-0 text-right">
                                      <span
                                        style={{ fontFamily: `'${font.value}', serif` }}
                                        className="text-base sm:text-lg font-bold tracking-wider text-gray-900 group-hover:text-black truncate max-w-[130px] sm:max-w-[200px] block"
                                      >
                                        {storeName || "ALI FASHION"}
                                      </span>
                                    </div>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-3 font-medium">
                      Select font specifically for your storefront logo / brand name text in header & footer.
                    </p>
                  </div>

                  <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <LayoutTemplate className="w-4 h-4 text-gray-500" /> Store
                      Language
                    </label>
                    <Select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      options={[
                        { value: "en", label: "English (EN)" },
                        { value: "bn", label: "Bengali (BN)" },
                      ]}
                    />
                    <p className="text-xs text-gray-500 mt-3 font-medium">
                      Select the default language for your storefront.
                    </p>
                  </div>

                  <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <Type className="w-4 h-4 text-gray-500" /> Currency Symbol
                    </label>
                    <Input
                      value={currencySymbol}
                      onChange={(e) => setCurrencySymbol(e.target.value)}
                      placeholder="e.g. ৳, BDT, $"
                    />
                    <p className="text-xs text-gray-500 mt-3 font-medium">
                      Set the currency symbol to display (e.g. ৳ or BDT).
                    </p>
                  </div>

                  {/* Instant Color & Button Live Preview Box - Product Card Size */}
                  <div className="lg:col-span-2 pt-6 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#5022C3]" />
                          Instant Color & Button Live Storefront Preview
                        </h3>
                        <p className="text-xs text-gray-500">
                          Real-time preview of how your custom colors and action buttons appear on storefront product cards.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Live Real Preview
                        </span>
                      </div>
                    </div>

                    {/* Compact Product Card Mockup Container (Product Card Size) */}
                    <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200/90 shadow-md p-4 sm:p-5 flex flex-col gap-3.5">
                      {/* Product Image & Badges */}
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center group">
                        <img
                          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
                          alt="Premium Studio Wireless Headphones"
                          className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Floating Discount Badge with primaryColor */}
                        <span
                          style={{
                            backgroundColor: primaryColor || "#5022C3",
                            color: "#ffffff",
                          }}
                          className="absolute top-2.5 left-2.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-sm tracking-wider"
                        >
                          -20% OFF
                        </span>

                        {/* Floating Wishlist Heart */}
                        <button
                          type="button"
                          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs border border-gray-200/80 flex items-center justify-center text-gray-400 hover:text-rose-500 shadow-2xs transition-colors"
                        >
                          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        </button>
                      </div>

                      {/* Product Details */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          <span>AUDIO & GADGETS</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> In Stock
                          </span>
                        </div>

                        {/* Product Title */}
                        <h4 className="text-sm sm:text-base font-bold text-gray-900 leading-snug line-clamp-2">
                          Wireless Active Noise-Cancelling Headphones Pro
                        </h4>

                        {/* Rating Stars */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-0.5">
                          <div className="flex items-center text-amber-400">
                            <Star className="w-3 h-3 fill-current" />
                            <Star className="w-3 h-3 fill-current" />
                            <Star className="w-3 h-3 fill-current" />
                            <Star className="w-3 h-3 fill-current" />
                            <Star className="w-3 h-3 fill-current" />
                          </div>
                          <span className="font-bold text-gray-800 text-[11px]">4.9</span>
                          <span className="text-gray-400 text-[10px]">(142)</span>
                        </div>
                      </div>

                      {/* Price display with primaryColor */}
                      <div className="flex items-baseline gap-2 pt-0.5">
                        <span
                          style={{ color: primaryColor || "#5022C3" }}
                          className="text-xl sm:text-2xl font-black tracking-tight"
                        >
                          {currencySymbol || "৳"} 12,500
                        </span>
                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                          {currencySymbol || "৳"} 15,600
                        </span>
                        <span
                          style={{
                            backgroundColor: `${primaryColor || "#5022C3"}15`,
                            color: primaryColor || "#5022C3",
                          }}
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto"
                        >
                          SAVE {currencySymbol || "৳"} 3,100
                        </span>
                      </div>

                      {/* Action Buttons: Add to Cart & Buy Now */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {/* Add to Cart Button */}
                        <button
                          type="button"
                          style={{
                            borderColor:
                              buttonColors.addToCart ||
                              primaryColor ||
                              "#111827",
                            backgroundColor:
                              buttonColors.addToCart ||
                              primaryColor ||
                              "#111827",
                            color: "#ffffff",
                          }}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold shadow-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer text-white"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>

                        {/* Buy Now Button */}
                        <button
                          type="button"
                          style={{
                            backgroundColor:
                              buttonColors.buyNow ||
                              "#ef4444",
                            color: "#ffffff",
                          }}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold shadow-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer text-white"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Buy Now</span>
                        </button>
                      </div>

                      {/* Color Palette Swatches Mini Strip */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 text-[11px] text-gray-500">
                        <span className="font-semibold text-gray-600">Palette:</span>
                        <div className="flex items-center gap-2.5">
                          <span className="flex items-center gap-1 text-[10px]">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block shadow-2xs border border-black/10"
                              style={{ backgroundColor: primaryColor || "#5022C3" }}
                            />
                            Primary
                          </span>
                          <span className="flex items-center gap-1 text-[10px]">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block shadow-2xs border border-black/10"
                              style={{
                                backgroundColor:
                                  buttonColors.addToCart || primaryColor || "#111827",
                              }}
                            />
                            Cart
                          </span>
                          <span className="flex items-center gap-1 text-[10px]">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block shadow-2xs border border-black/10"
                              style={{
                                backgroundColor: buttonColors.buyNow || "#ef4444",
                              }}
                            />
                            Buy
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Banner Settings */}
          {activeTab === "banner" && (
            <Card
              id="banner-section"
              className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl h-full mb-0 lg:col-span-2"
            >
              <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex items-center gap-3">
                <div className="p-2.5 bg-green-100 text-green-600 rounded-xl">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Banner Settings
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Configure the hero banner for your storefront
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
                      <h4 className="font-bold text-gray-800">
                        Banner Images (Max 3)
                      </h4>
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                        {bannerPreviewUrls.length} / 3 Images
                      </span>
                    </div>
                    <MultipleImageUpload
                      label="Upload Banner Images (Max 3 Images)"
                      maxFiles={3}
                      error={bannerErrors.image}
                      files={bannerImagesFiles}
                      previewUrls={bannerPreviewUrls}
                      recommendedRatio="1920 × 700 px (21:9)"
                      onChange={(newFiles, newUrls) => {
                        setBannerImagesFiles(newFiles);
                        setBannerPreviewUrls(newUrls);
                        if (bannerErrors.image) {
                          setBannerErrors((prev) => {
                            const next = { ...prev };
                            delete next.image;
                            return next;
                          });
                        }
                      }}
                    />
                    <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 text-xs text-gray-600 space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-indigo-900">
                        <span>📐 Recommended Banner Dimensions:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-gray-600 pl-1">
                        <li>
                          <strong>Resolution:</strong>{" "}
                          <code className="bg-white px-1.5 py-0.5 rounded text-indigo-700 font-mono font-bold">
                            1920 × 700 px
                          </code>{" "}
                          (or min{" "}
                          <code className="bg-white px-1.5 py-0.5 rounded text-gray-700 font-mono">
                            1400 × 500 px
                          </code>
                          )
                        </li>
                        <li>
                          <strong>Aspect Ratio:</strong>{" "}
                          <code className="bg-white px-1.5 py-0.5 rounded text-indigo-700 font-mono font-bold">
                            21:9
                          </code>{" "}
                          or{" "}
                          <code className="bg-white px-1.5 py-0.5 rounded text-gray-700 font-mono">
                            16:9
                          </code>{" "}
                          widescreen
                        </li>
                        <li>
                          <strong>Formats:</strong> JPG, PNG, WebP (Max 10MB per
                          image)
                        </li>
                      </ul>
                    </div>

                    {/* Top Announcement Bar Settings */}
                    <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200/80 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                            <Megaphone className="w-4 h-4 text-[#5022C3]" /> Top
                            Announcement Bar
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Display a custom notice bar at the top of every
                            storefront theme.
                          </p>
                        </div>

                        {/* Visibility Switch */}
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={banner.showAnnouncement || false}
                            onChange={(e) =>
                              setBanner((prev) => ({
                                ...prev,
                                showAnnouncement: e.target.checked,
                              }))
                            }
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5022C3]"></div>
                        </label>
                      </div>

                      {banner.showAnnouncement && (
                        <div className="space-y-4 pt-3 border-t border-gray-200/60">
                          <Input
                            label="Announcement Text"
                            type="text"
                            value={banner.announcementText || ""}
                            onChange={(e) =>
                              setBanner((prev) => ({
                                ...prev,
                                announcementText: e.target.value,
                              }))
                            }
                            placeholder="e.g. Free shipping on orders over ৳999 | All Products"
                          />

                          {/* Sliding Marquee Toggle Button */}
                          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 gap-3">
                            <div>
                              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                                sliding
                              </span>
                              <p className="text-[11px] text-gray-500">
                                Enable sliding text animation
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setBanner((prev) => ({
                                  ...prev,
                                  isSliding: !prev.isSliding,
                                }))
                              }
                              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                                banner.isSliding
                                  ? "bg-[#5022C3] text-white shadow-sm ring-2 ring-purple-300"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                              }`}
                            >
                              {banner.isSliding
                                ? "sliding (ON)"
                                : "sliding (OFF)"}
                            </button>
                          </div>

                          {/* Background Color & Text Color */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Background Color */}
                            <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                                Background Color
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={
                                    banner.announcementBgColor || "#0f172a"
                                  }
                                  onChange={(e) =>
                                    setBanner((prev) => ({
                                      ...prev,
                                      announcementBgColor: e.target.value,
                                    }))
                                  }
                                  className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 p-0.5"
                                />
                                <input
                                  type="text"
                                  value={
                                    banner.announcementBgColor || "#0f172a"
                                  }
                                  onChange={(e) =>
                                    setBanner((prev) => ({
                                      ...prev,
                                      announcementBgColor: e.target.value,
                                    }))
                                  }
                                  className="w-full text-xs font-mono uppercase bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#5022C3]"
                                />
                              </div>
                              {/* Color Swatches */}
                              <div className="flex items-center gap-1.5 pt-1">
                                {[
                                  "#0f172a",
                                  "#dc2626",
                                  "#5022C3",
                                  "#059669",
                                  "#18181b",
                                  "#1e3a8a",
                                  "#b45309",
                                ].map((c) => (
                                  <button
                                    key={c}
                                    type="button"
                                    onClick={() =>
                                      setBanner((prev) => ({
                                        ...prev,
                                        announcementBgColor: c,
                                      }))
                                    }
                                    className="w-5 h-5 rounded-full border border-gray-300 transition-transform hover:scale-110 shadow-sm"
                                    style={{ backgroundColor: c }}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Text Color */}
                            <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                                Text Color
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={
                                    banner.announcementTextColor || "#ffffff"
                                  }
                                  onChange={(e) =>
                                    setBanner((prev) => ({
                                      ...prev,
                                      announcementTextColor: e.target.value,
                                    }))
                                  }
                                  className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 p-0.5"
                                />
                                <input
                                  type="text"
                                  value={
                                    banner.announcementTextColor || "#ffffff"
                                  }
                                  onChange={(e) =>
                                    setBanner((prev) => ({
                                      ...prev,
                                      announcementTextColor: e.target.value,
                                    }))
                                  }
                                  className="w-full text-xs font-mono uppercase bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#5022C3]"
                                />
                              </div>
                              {/* Color Swatches */}
                              <div className="flex items-center gap-1.5 pt-1">
                                {[
                                  "#ffffff",
                                  "#fef08a",
                                  "#a5f3fc",
                                  "#f3f4f6",
                                  "#fbbf24",
                                  "#f87171",
                                ].map((c) => (
                                  <button
                                    key={c}
                                    type="button"
                                    onClick={() =>
                                      setBanner((prev) => ({
                                        ...prev,
                                        announcementTextColor: c,
                                      }))
                                    }
                                    className="w-5 h-5 rounded-full border border-gray-300 transition-transform hover:scale-110 shadow-sm"
                                    style={{ backgroundColor: c }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Live Announcement Bar Preview */}
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                              Live Preview
                            </span>
                            <div
                              style={{
                                backgroundColor:
                                  banner.announcementBgColor || "#0f172a",
                                color:
                                  banner.announcementTextColor || "#ffffff",
                              }}
                              className="p-2.5 rounded-xl text-sm font-medium text-center overflow-hidden border border-black/10 transition-all shadow-sm"
                            >
                              {banner.isSliding ? (
                                <MarqueeTag
                                  scrollamount="6"
                                  className="whitespace-nowrap flex items-center tracking-wide"
                                >
                                  {banner.announcementText ||
                                    "Announcement bar text preview..."}
                                </MarqueeTag>
                              ) : (
                                <span>
                                  {banner.announcementText ||
                                    "Announcement bar text preview..."}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                          Banner Content
                          {banner.showBannerContent === false ? (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              Hidden on Storefront
                            </span>
                          ) : (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Visible
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Toggle whether banner overlay title, description, and buttons appear over your banner images.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={banner.showBannerContent !== false}
                          onChange={(e) =>
                            setBanner((prev) => ({
                              ...prev,
                              showBannerContent: e.target.checked,
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    {banner.showBannerContent === false ? (
                      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <EyeOff className="w-4 h-4 shrink-0 text-amber-600" />
                          <span>
                            <strong>Banner text content is hidden.</strong> Your storefront will showcase clean, full-bleed banner images without any text or dark shading.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setBanner((prev) => ({ ...prev, showBannerContent: true }))
                          }
                          className="text-indigo-600 hover:text-indigo-700 font-semibold underline shrink-0 text-left sm:text-right"
                        >
                          Enable Content
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <Input
                          label="Title"
                          type="text"
                          error={bannerErrors.title}
                          value={banner.title}
                          onChange={(e) =>
                            setBanner((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          placeholder="e.g. Summer Sale 2026"
                        />
                        <Input
                          label="Subtitle"
                          type="text"
                          error={bannerErrors.subtitle}
                          value={banner.subtitle}
                          onChange={(e) =>
                            setBanner((prev) => ({
                              ...prev,
                              subtitle: e.target.value,
                            }))
                          }
                          placeholder="e.g. Up to 50% off on all electronics"
                        />
                        <div className="space-y-1">
                          <label className="block text-sm font-semibold text-gray-700">
                            Description
                          </label>
                          <textarea
                            value={banner.description}
                            onChange={(e) =>
                              setBanner((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder="e.g. Discover premium products curated for every lifestyle and budget."
                            className={`w-full min-h-[100px] px-4 py-3 rounded-xl border ${bannerErrors.description ? "border-red-300 bg-red-50/30" : "border-gray-200"} focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all resize-none text-sm shadow-sm`}
                          />
                          {bannerErrors.description && (
                            <p className="mt-1 text-xs text-red-500">
                              {bannerErrors.description}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="block text-sm font-semibold text-gray-700">
                                Button Text
                              </label>
                              <select
                                aria-label="Button Text Quick Presets"
                                className="text-xs border border-gray-200 rounded-md px-2 py-0.5 bg-gray-50 hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                                onChange={(e) => {
                                  if (e.target.value) {
                                    setBanner((prev) => ({
                                      ...prev,
                                      buttonText: e.target.value,
                                    }));
                                  }
                                }}
                                defaultValue=""
                              >
                                <option value="" disabled>Choose Preset...</option>
                                <option value="Shop Now">Shop Now</option>
                                <option value="Order Now">Order Now</option>
                                <option value="Explore More">Explore More</option>
                                <option value="View Collection">View Collection</option>
                                <option value="Buy Now">Buy Now</option>
                                <option value="Get Offer">Get Offer</option>
                                <option value="Discover">Discover</option>
                                <option value="শপ করুন">শপ করুন</option>
                                <option value="অর্ডার করুন">অর্ডার করুন</option>
                                <option value="এখনই কিনুন">এখনই কিনুন</option>
                                <option value="অফার দেখুন">অফার দেখুন</option>
                              </select>
                            </div>
                            <Input
                              type="text"
                              error={bannerErrors.buttonText}
                              value={banner.buttonText}
                              onChange={(e) =>
                                setBanner((prev) => ({
                                  ...prev,
                                  buttonText: e.target.value,
                                }))
                              }
                              placeholder="e.g. Shop Now or custom text"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="block text-sm font-semibold text-gray-700">
                                Button Link
                              </label>
                              <select
                                aria-label="Button Link Quick Presets"
                                className="text-xs border border-gray-200 rounded-md px-2 py-0.5 bg-gray-50 hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                                onChange={(e) => {
                                  if (e.target.value) {
                                    setBanner((prev) => ({
                                      ...prev,
                                      buttonLink: e.target.value,
                                    }));
                                  }
                                }}
                                defaultValue=""
                              >
                                <option value="" disabled>Choose Preset...</option>
                                <option value="/products">All Products (/products)</option>
                                <option value="/categories">Categories (/categories)</option>
                                <option value="/track-order">Track Order (/track-order)</option>
                                <option value="/">Home (/)</option>
                              </select>
                            </div>
                            <Input
                              type="text"
                              error={bannerErrors.buttonLink}
                              value={banner.buttonLink}
                              onChange={(e) =>
                                setBanner((prev) => ({
                                  ...prev,
                                  buttonLink: e.target.value,
                                }))
                              }
                              placeholder="e.g. /products, /categories or full URL"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Footer Settings */}
          {activeTab === "footer" && (
            <Card
              id="footer-policies-section"
              className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl h-full mb-0"
            >
              <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Footer Settings
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Manage contact info and important links
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Contact Info */}
                  <div className="space-y-6">
                    <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" /> Contact
                      Information
                    </h4>
                    <div className="space-y-5">
                      <Input
                        label="Support Email"
                        type="email"
                        value={footer.contactInfo.email}
                        onChange={(e) =>
                          updateFooter("contactInfo", "email", e.target.value)
                        }
                        placeholder="support@mystore.com"
                      />
                      <div>
                        <Input
                          label="Phone Number"
                          type="tel"
                          value={footer.contactInfo.phone}
                          onChange={(e) =>
                            updateFooter("contactInfo", "phone", e.target.value)
                          }
                          placeholder="E.g. 01XXXXXXXXXX"
                        />
                        {footer.contactInfo.phone &&
                          !isValidBDPhone(footer.contactInfo.phone) && (
                            <p className="text-xs text-red-500 mt-1 font-medium">
                              Please enter a valid BD phone number (e.g.
                              01XXXXXXXXXX)
                            </p>
                          )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                          Store Address
                        </label>
                        <textarea
                          value={footer.contactInfo.address}
                          onChange={(e) =>
                            updateFooter(
                              "contactInfo",
                              "address",
                              e.target.value,
                            )
                          }
                          placeholder="123 Main St, City, Country"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 bg-gray-50/50 hover:bg-gray-50 text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Policy Content */}
                  <div className="space-y-6">
                    <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-400" /> Policy
                      Content
                    </h4>
                    <div className="space-y-3">
                      {[
                        { id: "aboutUs", label: "About Us Content" },
                        {
                          id: "privacyPolicy",
                          label: "Privacy Policy Content",
                        },
                        {
                          id: "termsAndConditions",
                          label: "Terms & Conditions Content",
                        },
                        { id: "returnPolicy", label: "Return Policy Content" },
                      ].map((policy) => (
                        <div
                          key={policy.id}
                          className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                        >
                          <button
                            className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 text-sm font-bold text-gray-700 transition-colors"
                            onClick={() =>
                              setActivePolicyTab(
                                activePolicyTab === policy.id ? "" : policy.id,
                              )
                            }
                          >
                            {policy.label}
                            <svg
                              className={`w-4 h-4 transition-transform ${activePolicyTab === policy.id ? "rotate-180" : ""}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>

                          {activePolicyTab === policy.id && (
                            <div className="p-4 border-t border-gray-100">
                              <Textarea
                                value={
                                  footer.policies[
                                    policy.id as keyof typeof footer.policies
                                  ]
                                }
                                onChange={(e) =>
                                  updateFooter(
                                    "policies",
                                    policy.id,
                                    e.target.value,
                                  )
                                }
                                placeholder={`Enter ${policy.label} here...`}
                                className="min-h-[250px]"
                                richText={true}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social Links & Copyright */}
                  <div className="lg:col-span-2 space-y-6 pt-4">
                    <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-gray-400" /> Social
                      Links & Copyright
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <Input
                        label="Facebook URL"
                        type="url"
                        value={footer.socialLinks.facebook}
                        onChange={(e) =>
                          updateFooter(
                            "socialLinks",
                            "facebook",
                            e.target.value,
                          )
                        }
                        placeholder="https://facebook.com/yourstore"
                      />
                      <Input
                        label="YouTube URL"
                        type="url"
                        value={footer.socialLinks.youtube}
                        onChange={(e) =>
                          updateFooter("socialLinks", "youtube", e.target.value)
                        }
                        placeholder="https://youtube.com/@yourstore"
                      />
                      <Input
                        label="TikTok URL"
                        type="url"
                        value={footer.socialLinks.tiktok}
                        onChange={(e) =>
                          updateFooter("socialLinks", "tiktok", e.target.value)
                        }
                        placeholder="https://tiktok.com/@yourstore"
                      />
                    </div>
                    <div className="pt-2 max-w-md">
                      <Input
                        label="Copyright Text"
                        type="text"
                        value={footer.copyrightText}
                        onChange={(e) =>
                          setFooter((prev) => ({
                            ...prev,
                            copyrightText: e.target.value,
                          }))
                        }
                        placeholder="© 2026 Your Store Name"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Shipping Settings Tab */}
          {activeTab === "shipping" && (
            <Card
              id="shipping-section"
              className="p-8 border border-gray-100 shadow-sm rounded-2xl bg-white animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-visible"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                    Shipping Zones
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Configure delivery charges based on customer location.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Default Shipping */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    Default Shipping Cost
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    This cost applies to any location that doesn't match a
                    specific zone below.
                  </p>
                  <div className="max-w-xs">
                    <Input
                      type="number"
                      value={defaultShippingCost.toString()}
                      onChange={(e) =>
                        setDefaultShippingCost(Number(e.target.value))
                      }
                      placeholder="e.g. 120"
                      label="Amount (BDT)"
                    />
                  </div>
                </div>

                {/* Existing Zones */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2">
                    Configured Zones
                  </h4>
                  {shippingZones.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <p className="text-gray-500 text-sm">
                        No shipping zones configured yet. Add one below.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {shippingZones.map((zone, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
                        >
                          <div className="space-y-1">
                            <h5 className="font-bold text-gray-900 flex items-center gap-2">
                              {zone.name}
                              <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-md">
                                {zone.cost === 0 ? "Free" : `৳ ${zone.cost}`}
                              </span>
                            </h5>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-700">
                                {zone.division}
                              </span>
                              {zone.districts.length > 0 &&
                                ` • ${zone.districts.join(", ")}`}
                              {zone.districts.length === 0 &&
                                ` • All districts`}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              setShippingZones((prev) =>
                                prev.filter((_, i) => i !== idx),
                              )
                            }
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                            title="Delete Zone"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add New Zone */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-4">Add New Zone</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Zone Name"
                      placeholder="e.g. Inside Dhaka"
                      value={newZone.name}
                      onChange={(e) =>
                        setNewZone((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                    <Input
                      label="Delivery Charge (৳)"
                      type="number"
                      placeholder="e.g. 80 (0 for Free)"
                      value={newZone.cost.toString()}
                      onChange={(e) =>
                        setNewZone((prev) => ({
                          ...prev,
                          cost: Number(e.target.value),
                        }))
                      }
                    />

                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-700">
                        Division
                      </label>
                      <Select
                        value={newZone.division}
                        onChange={(e) => {
                          setNewZone((prev) => ({
                            ...prev,
                            division: e.target.value,
                            districts: [],
                          }));
                          const found = bdLocations.find(
                            (d) => d.division === e.target.value,
                          );
                          setNewZoneDistrictsList(
                            found ? found.districts.map((d) => d.district) : [],
                          );
                        }}
                        options={[
                          { label: "Select Division...", value: "" },
                          ...bdLocations.map((d) => ({
                            label: d.division,
                            value: d.division,
                          })),
                        ]}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-700 flex justify-between">
                        <span>Districts</span>
                        <span className="text-xs text-gray-400 font-normal">
                          Optional
                        </span>
                      </label>
                      <Select
                        disabled={!newZone.division}
                        value=""
                        onChange={(e) => {
                          const dist = e.target.value;
                          if (dist && !newZone.districts.includes(dist)) {
                            setNewZone((prev) => ({
                              ...prev,
                              districts: [...prev.districts, dist],
                            }));
                          }
                        }}
                        options={[
                          { label: "Select districts to add...", value: "" },
                          ...newZoneDistrictsList.map((dist) => ({
                            label: dist,
                            value: dist,
                          })),
                        ]}
                      />

                      {newZone.districts.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {newZone.districts.map((dist) => (
                            <div
                              key={dist}
                              className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 border border-indigo-100"
                            >
                              {dist}
                              <button
                                onClick={() =>
                                  setNewZone((prev) => ({
                                    ...prev,
                                    districts: prev.districts.filter(
                                      (d) => d !== dist,
                                    ),
                                  }))
                                }
                                className="hover:text-indigo-900 transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        If no districts are selected, this zone applies to the
                        entire division.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!newZone.name) {
                        toast.error("Please provide a zone name");
                        return;
                      }
                      setShippingZones((prev) => [...prev, newZone]);
                      setNewZone({
                        name: "",
                        cost: 0,
                        division: "",
                        districts: [],
                      });
                      setNewZoneDistrictsList([]);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Zone
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* Live Chat (WhatsApp & Messenger) Settings Tab */}
          {activeTab === "chat" && (
            <Card
              id="chat-section"
              className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl h-full mb-0"
            >
              {/* Top Header */}
              <div className="border-b border-gray-100 bg-gray-50/70 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#006AFF] text-white shadow-sm shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                      aria-hidden="true"
                    >
                      <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.758.459 3.473 1.331 4.988L2 22l5.169-1.356a9.927 9.927 0 0 0 4.862 1.262h.004c5.515 0 9.969-4.453 9.969-9.969 0-2.663-1.037-5.168-2.92-7.051A9.905 9.905 0 0 0 12.031 2zm5.822 14.28c-.246.693-1.425 1.326-1.979 1.411-.506.077-1.147.109-1.852-.115-.428-.136-.977-.318-1.678-.621-2.952-1.275-4.881-4.246-5.028-4.443-.147-.197-1.2-1.597-1.2-3.047 0-1.45.759-2.163 1.029-2.458.27-.295.59-.369.786-.369.197 0 .393.002.565.01.181.009.424-.069.663.507.246.59.836 2.04.909 2.187.074.148.123.32.025.516-.098.197-.148.32-.295.492-.147.172-.31.384-.442.516-.148.147-.302.307-.13.602.172.295.764 1.26 1.64 2.041 1.127 1.004 2.077 1.316 2.372 1.463.295.148.467.123.639-.074.172-.197.737-.86.934-1.155.197-.295.393-.246.664-.148.27.098 1.721.811 2.016.959.295.147.492.221.565.344.074.123.074.713-.173 1.406z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                      Messenger & WhatsApp Chat
                    </h2>
                    <p className="text-xs text-gray-500 font-medium mt-0.5 leading-relaxed">
                      Floating live chat buttons in the bottom-right corner of your storefront
                    </p>
                  </div>
                </div>

                {/* Master Toggle */}
                <label className="flex items-center justify-between sm:justify-start gap-3 cursor-pointer bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 shadow-2xs w-full sm:w-auto shrink-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        chatWidget.enabled ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                    />
                    <span className="text-xs sm:text-sm font-bold text-gray-800">
                      {chatWidget.enabled ? "Widget Active" : "Widget Disabled"}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={chatWidget.enabled}
                    onChange={(e) =>
                      setChatWidget((prev) => ({
                        ...prev,
                        enabled: e.target.checked,
                      }))
                    }
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 shrink-0" />
                </label>
              </div>

              <div className="p-3.5 sm:p-6 space-y-5 sm:space-y-7">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* WhatsApp Configuration */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-4 ${
                      chatWidget.whatsappEnabled
                        ? "border-emerald-200 bg-emerald-50/30 shadow-2xs"
                        : "border-gray-200 bg-gray-50/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Real Official WhatsApp Brand Icon */}
                        <div className="w-11 h-11 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-sm shrink-0">
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                            aria-hidden="true"
                          >
                            <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.758.459 3.473 1.331 4.988L2 22l5.169-1.356a9.927 9.927 0 0 0 4.862 1.262h.004c5.515 0 9.969-4.453 9.969-9.969 0-2.663-1.037-5.168-2.92-7.051A9.905 9.905 0 0 0 12.031 2zm5.822 14.28c-.246.693-1.425 1.326-1.979 1.411-.506.077-1.147.109-1.852-.115-.428-.136-.977-.318-1.678-.621-2.952-1.275-4.881-4.246-5.028-4.443-.147-.197-1.2-1.597-1.2-3.047 0-1.45.759-2.163 1.029-2.458.27-.295.59-.369.786-.369.197 0 .393.002.565.01.181.009.424-.069.663.507.246.59.836 2.04.909 2.187.074.148.123.32.025.516-.098.197-.148.32-.295.492-.147.172-.31.384-.442.516-.148.147-.302.307-.13.602.172.295.764 1.26 1.64 2.041 1.127 1.004 2.077 1.316 2.372 1.463.295.148.467.123.639-.074.172-.197.737-.86.934-1.155.197-.295.393-.246.664-.148.27.098 1.721.811 2.016.959.295.147.492.221.565.344.074.123.074.713-.173 1.406z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-gray-900">
                            WhatsApp Chat
                          </h4>
                          <p className="text-xs text-gray-500 leading-snug">
                            Direct customer chat via WhatsApp
                          </p>
                        </div>
                      </div>
                      <label className="inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={chatWidget.whatsappEnabled}
                          onChange={(e) =>
                            setChatWidget((prev) => ({
                              ...prev,
                              whatsappEnabled: e.target.checked,
                              enabled: e.target.checked ? true : prev.enabled,
                            }))
                          }
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]" />
                      </label>
                    </div>

                    <div className="space-y-4 pt-1">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            WhatsApp Number or Link
                          </label>
                          {footer.contactInfo.phone && (
                            <button
                              type="button"
                              onClick={() =>
                                setChatWidget((prev) => ({
                                  ...prev,
                                  whatsappNumber: footer.contactInfo.phone,
                                }))
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100/80 hover:bg-emerald-100 text-[11px] font-bold text-emerald-800 transition-colors"
                            >
                              Use Store Phone ({footer.contactInfo.phone})
                            </button>
                          )}
                        </div>
                        <Input
                          type="text"
                          value={chatWidget.whatsappNumber}
                          onChange={(e) =>
                            setChatWidget((prev) => ({
                              ...prev,
                              whatsappNumber: e.target.value,
                            }))
                          }
                          placeholder="e.g. 017XXXXXXXX or +88017XXXXXXXX"
                        />
                        <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                          11-digit BD numbers (01XXXXXXXXX) are automatically converted to +880 format.
                        </p>
                      </div>

                      <Input
                        label="Pre-filled Customer Message"
                        type="text"
                        value={chatWidget.whatsappMessage}
                        onChange={(e) =>
                          setChatWidget((prev) => ({
                            ...prev,
                            whatsappMessage: e.target.value,
                          }))
                        }
                        placeholder="Hello! I have a question about a product on your store."
                      />
                    </div>
                  </div>

                  {/* Messenger Configuration */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-4 ${
                      chatWidget.messengerEnabled
                        ? "border-blue-200 bg-blue-50/30 shadow-2xs"
                        : "border-gray-200 bg-gray-50/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Real Official Facebook Messenger Brand Icon */}
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#006AFF] to-[#00B2FF] text-white flex items-center justify-center shadow-sm shrink-0">
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                            aria-hidden="true"
                          >
                            <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.35.27.57l.05 1.78c.02.57.61.94 1.13.71l1.98-.87c.17-.07.36-.1.55-.06.91.25 1.87.38 2.88.38 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm5.95 7.56-2.93 4.65c-.47.74-1.47.92-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.93-4.65c.47-.74 1.47-.92 2.17-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97.18.69.63z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-gray-900">
                            Facebook Messenger
                          </h4>
                          <p className="text-xs text-gray-500 leading-snug">
                            Direct customer chat via Messenger
                          </p>
                        </div>
                      </div>
                      <label className="inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={chatWidget.messengerEnabled}
                          onChange={(e) =>
                            setChatWidget((prev) => ({
                              ...prev,
                              messengerEnabled: e.target.checked,
                              enabled: e.target.checked ? true : prev.enabled,
                            }))
                          }
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006AFF]" />
                      </label>
                    </div>

                    <div className="space-y-4 pt-1">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Page Username or Facebook Link
                          </label>
                          {footer.socialLinks.facebook && (
                            <button
                              type="button"
                              onClick={() =>
                                setChatWidget((prev) => ({
                                  ...prev,
                                  messengerUsername: footer.socialLinks.facebook,
                                }))
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100/80 hover:bg-blue-100 text-[11px] font-bold text-blue-700 transition-colors"
                            >
                              Use Store Facebook Link
                            </button>
                          )}
                        </div>
                        <Input
                          type="text"
                          value={chatWidget.messengerUsername}
                          onChange={(e) =>
                            setChatWidget((prev) => ({
                              ...prev,
                              messengerUsername: e.target.value,
                            }))
                          }
                          placeholder="e.g. mashiatfashion or https://facebook.com/mashiatfashion"
                        />
                        <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                          Paste your Facebook Page URL, m.me link, or Page username—customers will be redirected directly to Messenger.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Behavior & Display Style */}
                <div className="p-4 sm:p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200/70 pb-2.5">
                    Widget Behavior & Corner Appearance
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                        Corner Button Style
                      </label>
                      <Select
                        value={chatWidget.displayStyle}
                        onChange={(e) =>
                          setChatWidget((prev) => ({
                            ...prev,
                            displayStyle: e.target.value as
                              | "expandable"
                              | "stacked",
                          }))
                        }
                        options={[
                          {
                            label: "Expandable Popup Card (Recommended)",
                            value: "expandable",
                          },
                          {
                            label: "Stacked Direct Buttons (1-Click Redirect)",
                            value: "stacked",
                          },
                        ]}
                      />
                    </div>

                    <div>
                      <Input
                        label="Greeting / Popup Prompt"
                        type="text"
                        value={chatWidget.greetingText}
                        onChange={(e) =>
                          setChatWidget((prev) => ({
                            ...prev,
                            greetingText: e.target.value,
                          }))
                        }
                        placeholder="Need help? Chat with us!"
                      />
                    </div>

                    <div className="flex flex-col justify-end">
                      <label className="flex items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-gray-200 cursor-pointer">
                        <div className="min-w-0">
                          <span className="block text-xs font-bold text-gray-900">
                            Auto-Open on Store Visit
                          </span>
                          <span className="block text-[11px] text-gray-500 leading-snug mt-0.5">
                            Automatically opens chat prompt after 2 seconds
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={chatWidget.autoOpen}
                          onChange={(e) =>
                            setChatWidget((prev) => ({
                              ...prev,
                              autoOpen: e.target.checked,
                            }))
                          }
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shrink-0" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-auto sm:right-8 z-50 flex justify-center sm:justify-end pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-xl p-2 sm:p-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.14)] border border-gray-200/70 flex items-center gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
          <p className="text-xs sm:text-sm text-gray-500 font-medium ml-2 hidden md:block whitespace-nowrap">
            Update theme to save changes
          </p>
          <button
            onClick={handleSaveTheme}
            disabled={saving}
            className="px-5 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 w-full sm:w-auto whitespace-nowrap cursor-pointer"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>{saving ? "Saving Changes..." : "Save Theme Settings"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ThemesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      }
    >
      <ThemesContent />
    </Suspense>
  );
}
