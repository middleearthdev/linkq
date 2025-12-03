/**
 * Shared Icon Registry
 * Centralized icon definitions for LinkQ
 * Used by: IconPicker, LinkListBlock, etc.
 */

import {
  Home, Mail, Phone, MessageCircle, Instagram, Twitter, Facebook, Linkedin,
  Youtube, Github, Globe, Link2, ShoppingBag, Coffee, Heart, Star,
  Music, Camera, Book, Briefcase, Calendar, Clock, MapPin, User,
  Users, Settings, Search, Download, Upload, ExternalLink, FileText,
  Image, Video, Headphones, Mic, Zap, TrendingUp, Award, Check,
  X, ChevronRight, Plus, Minus, ArrowRight, ArrowLeft, Eye,
  Shield, Lock, Unlock, Bell, Bookmark, Tag, Package, Truck,
  CreditCard, DollarSign, Gift, Sparkles, Sun, Moon, Cloud,
  Umbrella, Smile, ThumbsUp, Flag, AlertCircle, Info, HelpCircle,
  type LucideIcon
} from "lucide-react"

export interface IconDefinition {
  name: string
  icon: LucideIcon
  category?: string
}

export const ICONS: IconDefinition[] = [
  { name: "Home", icon: Home },
  { name: "Mail", icon: Mail },
  { name: "Phone", icon: Phone },
  { name: "Message", icon: MessageCircle },
  { name: "Instagram", icon: Instagram },
  { name: "Twitter", icon: Twitter },
  { name: "Facebook", icon: Facebook },
  { name: "LinkedIn", icon: Linkedin },
  { name: "YouTube", icon: Youtube },
  { name: "GitHub", icon: Github },
  { name: "Globe", icon: Globe },
  { name: "Link", icon: Link2 },
  { name: "Shopping", icon: ShoppingBag },
  { name: "Coffee", icon: Coffee },
  { name: "Heart", icon: Heart },
  { name: "Star", icon: Star },
  { name: "Music", icon: Music },
  { name: "Camera", icon: Camera },
  { name: "Book", icon: Book },
  { name: "Briefcase", icon: Briefcase },
  { name: "Calendar", icon: Calendar },
  { name: "Clock", icon: Clock },
  { name: "Location", icon: MapPin },
  { name: "User", icon: User },
  { name: "Users", icon: Users },
  { name: "Settings", icon: Settings },
  { name: "Search", icon: Search },
  { name: "Download", icon: Download },
  { name: "Upload", icon: Upload },
  { name: "External", icon: ExternalLink },
  { name: "Document", icon: FileText },
  { name: "Image", icon: Image },
  { name: "Video", icon: Video },
  { name: "Headphones", icon: Headphones },
  { name: "Microphone", icon: Mic },
  { name: "Zap", icon: Zap },
  { name: "Trending", icon: TrendingUp },
  { name: "Award", icon: Award },
  { name: "Check", icon: Check },
  { name: "Close", icon: X },
  { name: "Next", icon: ChevronRight },
  { name: "Plus", icon: Plus },
  { name: "Minus", icon: Minus },
  { name: "Right", icon: ArrowRight },
  { name: "Left", icon: ArrowLeft },
  { name: "Eye", icon: Eye },
  { name: "Shield", icon: Shield },
  { name: "Lock", icon: Lock },
  { name: "Unlock", icon: Unlock },
  { name: "Bell", icon: Bell },
  { name: "Bookmark", icon: Bookmark },
  { name: "Tag", icon: Tag },
  { name: "Package", icon: Package },
  { name: "Truck", icon: Truck },
  { name: "Card", icon: CreditCard },
  { name: "Dollar", icon: DollarSign },
  { name: "Gift", icon: Gift },
  { name: "Sparkles", icon: Sparkles },
  { name: "Sun", icon: Sun },
  { name: "Moon", icon: Moon },
  { name: "Cloud", icon: Cloud },
  { name: "Umbrella", icon: Umbrella },
  { name: "Smile", icon: Smile },
  { name: "Like", icon: ThumbsUp },
  { name: "Flag", icon: Flag },
  { name: "Alert", icon: AlertCircle },
  { name: "Info", icon: Info },
  { name: "Help", icon: HelpCircle },
]

/**
 * Get icon component by name
 * @param name - Icon name (e.g., "Home", "Instagram")
 * @returns Lucide icon component or Link2 as fallback
 */
export function getIconByName(name: string): LucideIcon {
  const iconData = ICONS.find(i => i.name === name)
  return iconData?.icon || Link2
}
