---
name: agent-reach
description: >-
  Read, extract transcripts, metadata, and analyze external social media and video content (such as YouTube, RSS feeds, and social media) via the agent-reach CLI. Use whenever the user provides a YouTube URL, video link, or social media post to analyze or summarize.
---

# Agent Reach Skill

This skill allows the agent to read and search external media and video platforms directly from the command line using `agent-reach` and `yt-dlp`.

## Usage & Commands

Run commands using PowerShell:

```powershell
agent-reach get <channel>.<command> <query> [--max-tokens N] [--limit N] [--json]
```

### 1. YouTube Video Analysis & Transcripts
- **Extract Full Video Transcript**:
  ```powershell
  agent-reach get youtube.transcript "<youtube_url_or_video_id>"
  ```
- **Extract Video Info & Metadata** (title, channel, upload date, views, tags):
  ```powershell
  agent-reach get youtube.info "<youtube_url_or_video_id>"
  ```

### 2. RSS & Feeds
- **Read RSS or Atom Feed**:
  ```powershell
  agent-reach get rss.feed "<feed_url>"
  ```

### 3. Health Diagnostics
If a channel fails or needs inspection:
```powershell
agent-reach doctor
```
