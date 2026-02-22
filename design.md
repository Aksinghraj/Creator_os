# Creator OS - Mobile App Design

## Overview
Creator OS is an all-in-one command center for content creators. It provides AI-powered tools for analyzing, improving, and monetizing short-form content. The app focuses on a clean, analytical interface that makes complex content strategy accessible and actionable.

## Design Philosophy
- **Analytical yet approachable**: Present data and insights in a structured, easy-to-digest format
- **Mobile-first**: Designed for portrait orientation (9:16) with one-handed thumb navigation
- **iOS-native feel**: Follows Apple Human Interface Guidelines with clean typography, generous spacing, and intuitive interactions
- **Action-oriented**: Every screen drives toward a specific creator action or insight

## Screen List

### 1. **Home / Dashboard**
   - Quick access hub to all Creator OS features
   - Display recent analyses and quick stats
   - Featured tool cards with icons and descriptions
   - Navigation to all major features

### 2. **Hook Scorer** (Core Feature)
   - Input field for hook text
   - Submit button to analyze
   - Results display with:
     - Hook Score (1-10) prominently displayed
     - Hook Type badge
     - Breakdown metrics (Curiosity, Clarity, Emotional Trigger, Specificity, Scroll-Stopping Power)
     - Main Weakness section
     - 5 Improved Hooks list
     - Virality Confidence indicator
   - Copy and share buttons for results

### 3. **Content Ideation**
   - Topic/niche input field
   - Generate content ideas based on trends
   - Display list of ideas with descriptions
   - Save ideas to favorites

### 4. **Script Writer**
   - Hook input field
   - Select video type/platform
   - Generate full script
   - Display formatted script with timestamps
   - Copy and export options

### 5. **Thumbnail Analyzer**
   - Image picker (upload or camera)
   - Analyze thumbnail for CTR potential
   - Provide improvement suggestions
   - Display analysis results

### 6. **Repurposing Tool**
   - Input original content
   - Select target platforms
   - Generate repurposed versions
   - Display adapted content

### 7. **Monetization Modeler**
   - Input channel metrics (subscribers, views, engagement)
   - Calculate potential revenue
   - Display breakdown by revenue source
   - Show optimization recommendations

### 8. **Sponsorship Pitch Generator**
   - Input channel details
   - Select sponsorship type
   - Generate pitch deck content
   - Display formatted pitch

## Primary Content and Functionality

### Hook Scorer (Primary Feature)
**Content:**
- Large text input area for hook submission
- Prominent submit button
- Results card with structured sections:
  - Score display (large, centered)
  - Type badge (colored, small)
  - 5 metrics in a grid or list
  - Weakness section (1-2 lines)
  - Improved hooks list (5 items, each selectable)
  - Virality confidence (Low/Medium/High indicator)

**Functionality:**
- Real-time character count
- Submit via button or keyboard
- Copy individual improved hooks
- Share results
- Save to history

### Home Dashboard
**Content:**
- Welcome message with creator name (if logged in)
- Quick stats (recent analyses, saved ideas)
- Feature cards grid (Hook Scorer, Ideation, Script Writer, etc.)
- Recent history section

**Functionality:**
- Tap feature card to navigate
- View recent analyses
- Quick access to favorites

## Key User Flows

### Flow 1: Analyze a Hook (Primary)
1. User opens app → lands on Home
2. Taps "Hook Scorer" card or tab
3. Enters hook text in input field
4. Taps "Analyze" button
5. Waits for AI analysis (loading state)
6. Views results: score, breakdown, weaknesses, improved hooks
7. Can copy improved hooks or share results
8. Can save to history or favorites

### Flow 2: Generate Content Ideas
1. User navigates to "Content Ideation"
2. Enters topic/niche
3. Taps "Generate Ideas"
4. Views list of ideas
5. Can tap idea to expand, copy, or save

### Flow 3: Generate Script
1. User navigates to "Script Writer"
2. Enters hook or topic
3. Selects platform (TikTok, YouTube Shorts, Instagram Reels)
4. Taps "Generate Script"
5. Views formatted script with timestamps
6. Can copy, share, or save

## Color Choices

**Brand Colors:**
- **Primary**: `#0a7ea4` (Teal/Blue) - Used for CTAs, highlights, and key metrics
- **Secondary**: `#6366f1` (Indigo) - Used for secondary actions and accents
- **Success**: `#22c55e` (Green) - Used for positive metrics, high scores
- **Warning**: `#f59e0b` (Amber) - Used for medium scores, cautions
- **Error**: `#ef4444` (Red) - Used for low scores, errors

**Neutral Colors:**
- **Background**: `#ffffff` (Light) / `#151718` (Dark)
- **Surface**: `#f5f5f5` (Light) / `#1e2022` (Dark)
- **Foreground**: `#11181c` (Light) / `#ecedee` (Dark)
- **Muted**: `#687076` (Light) / `#9ba1a6` (Dark)
- **Border**: `#e5e7eb` (Light) / `#334155` (Dark)

**Score Visualization:**
- 8-10: Green (#22c55e)
- 6-7: Amber (#f59e0b)
- 1-5: Red (#ef4444)

## Navigation Structure

**Tab Bar (Bottom):**
1. Home - Dashboard and quick access
2. Hook Scorer - Core feature
3. Tools - Secondary features (Ideation, Script, Thumbnail, Repurposing, Monetization, Sponsorship)
4. Saved - Favorites and history
5. Settings - User preferences and account

**Tools Screen (Expandable):**
- Grid or list of all secondary tools
- Each tool has icon, name, and brief description
- Tap to navigate to tool

## Interaction Patterns

- **Buttons**: Scale down slightly on press (0.97) with light haptic feedback
- **Cards**: Opacity change on press (0.7)
- **Input Fields**: Focus state with border color change to primary
- **Loading States**: Spinner with "Analyzing..." text
- **Success States**: Checkmark animation
- **Error States**: Red border with error message

## Typography

- **Headings**: Bold, 24-28px (primary content)
- **Subheadings**: Semibold, 18-20px (section headers)
- **Body**: Regular, 16px (main content)
- **Small**: Regular, 14px (secondary info, labels)
- **Tiny**: Regular, 12px (captions, timestamps)

## Spacing

- **Padding**: 16px (standard), 12px (compact), 24px (generous)
- **Gap**: 12px (between elements), 16px (between sections)
- **Radius**: 12px (standard), 8px (compact), 16px (large)
