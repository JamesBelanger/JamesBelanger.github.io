"""Generate the spoken-name clips: public/audio/name-<lang>.mp3.

One clip per entry in SITE.nameScripts (src/data/site.ts), each read by a native neural
voice for that language. Re-run after editing the transliterations:

    python scripts/make-name-audio.py            # every script
    python scripts/make-name-audio.py ja ko      # just these

English is NOT made here. A general voice reads "Belanger" as BEL-an-jer; the name is
buh-LAN-jer (/bəˈlændʒɚ/, with a hard final r). name-en.mp3 is rendered from the exact phonemes by the Kokoro
engine in the vault's graduation_name_pronouncer project (run from that folder):

    python -c "import kokoro_synth, pathlib; kokoro_synth.render_tokens(list('dʒˈeɪmz bəlˈændʒɚɹ'), pathlib.Path('name-en.wav'), voice='am_liam')"
    ffmpeg -i name-en.wav -af "adelay=80:all=1,apad=pad_dur=0.15" -ar 24000 -ac 1 -c:a libmp3lame -b:a 64k <site>/public/audio/name-en.mp3

The trailing ɹ and the am_liam voice are deliberate: plain ɚ in the default voice (am_michael) came out
as "uh" (r-colouring lasted ~40 ms; this version holds it ~140 ms, third formant near 1700 Hz).

(`python scripts/make-name-audio.py en` still forces the general-voice version.)

Uses edge-tts (Microsoft's online neural voices; `pip install edge-tts`), so it needs a
network connection. A hand recording always wins: drop your own file at the same path
and don't re-run for that language. public/audio/name.mp3, if present, replaces the
English clip on the site.
"""
import asyncio
import pathlib
import re
import sys

import edge_tts

ROOT = pathlib.Path(__file__).resolve().parents[1]
SITE_TS = ROOT / "src" / "data" / "site.ts"
OUT = ROOT / "public" / "audio"

# Preferred locale per language code; the first male voice in that locale is used.
LOCALE = {
    "en": "en-US", "ja": "ja-JP", "ko": "ko-KR", "hi": "hi-IN", "ar": "ar-SA", "ru": "ru-RU",
    "el": "el-GR", "he": "he-IL", "zh": "zh-CN", "th": "th-TH", "am": "am-ET", "hy": "hy-AM",
}


def entries() -> dict[str, str]:
    ts = SITE_TS.read_text(encoding="utf-8")
    out = {"en": re.search(r"name: '([^']+)'", ts).group(1)}
    for lang, text in re.findall(r"\{ lang: '(\w+)', label: '[^']+', text: '([^']+)'", ts):
        out[lang] = text
    return out


async def main() -> None:
    want = set(sys.argv[1:])
    voices = await edge_tts.list_voices()
    OUT.mkdir(parents=True, exist_ok=True)
    for lang, text in entries().items():
        if (want and lang not in want) or (lang == "en" and "en" not in want):
            continue
        locale = LOCALE.get(lang)
        pool = [v for v in voices if v["Locale"] == locale]
        if not pool:
            print(f"{lang}: no voice for {locale}, skipped")
            continue
        voice = next((v for v in pool if v["Gender"] == "Male"), pool[0])["ShortName"]
        dest = OUT / f"name-{lang}.mp3"
        await edge_tts.Communicate(text, voice, rate="-12%").save(str(dest))
        print(f"{lang}: {voice} -> {dest.name} ({dest.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    asyncio.run(main())
