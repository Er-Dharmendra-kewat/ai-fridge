#!/usr/bin/env python3
"""
scanner.py — Raspberry Pi barcode scanner
Reads barcodes from a USB/GPIO scanner and POSTs to the Express backend.

Requirements:
  pip install evdev requests

Run as root or add user to 'input' group:
  sudo python3 scanner.py
"""

import requests
import sys

BACKEND_URL = "http://localhost:4000/api/items/scan"

# ── Keyboard-emulation scanner (most USB barcode scanners) ────────────────────
# The scanner acts as a keyboard and types the barcode + Enter.
# We read from /dev/input/eventX — find the right device with:
#   python3 -c "import evdev; [print(d.path, d.name) for d in [evdev.InputDevice(p) for p in evdev.list_devices()]]"

try:
    import evdev
except ImportError:
    print("evdev not installed. Run: pip install evdev")
    sys.exit(1)

SCANCODES = {
    2:  "1", 3:  "2", 4:  "3", 5:  "4", 6:  "5",
    7:  "6", 8:  "7", 9:  "8", 10: "9", 11: "0",
    28: "ENTER",
}

def find_scanner():
    devices = [evdev.InputDevice(p) for p in evdev.list_devices()]
    for d in devices:
        # Most scanners include "barcode" or "scanner" in their name
        if any(k in d.name.lower() for k in ["barcode", "scanner", "usb"]):
            print(f"✅ Using device: {d.name} ({d.path})")
            return d
    # Fallback: return first keyboard-like device
    print("⚠  No scanner found by name — using first input device")
    return devices[0] if devices else None

def post_barcode(barcode: str):
    try:
        r = requests.post(BACKEND_URL, json={"barcode": barcode}, timeout=5)
        data = r.json()
        if data.get("action") == "incremented":
            print(f"🔄  {data['data']['name']} — qty now {data['data']['qty']}")
        elif data.get("action") == "unknown":
            print(f"❓  Unknown barcode {barcode} — frontend will prompt for details")
        else:
            print(f"✅  Response: {data}")
    except requests.exceptions.ConnectionError:
        print(f"❌  Could not reach backend at {BACKEND_URL}")
    except Exception as e:
        print(f"❌  Error: {e}")

def main():
    device = find_scanner()
    if not device:
        print("No input device found. Connect your scanner and retry.")
        sys.exit(1)

    print(f"📡  Listening for barcodes on {device.path}…")
    buffer = ""

    for event in device.read_loop():
        if event.type == evdev.ecodes.EV_KEY:
            key = evdev.categorize(event)
            if key.keystate == evdev.KeyEvent.key_down:
                char = SCANCODES.get(key.scancode)
                if char == "ENTER":
                    if buffer:
                        print(f"📷  Scanned: {buffer}")
                        post_barcode(buffer)
                        buffer = ""
                elif char:
                    buffer += char

if __name__ == "__main__":
    main()
