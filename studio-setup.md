# Music Setup Reference

## Guitars
| Instrument                   | URL | Key Specs                                            | Tuning   |
|------------------------------|-----|------------------------------------------------------|----------|
| Dean Evo FTX                 | [Reverb](https://reverb.com/search?query=Dean%20Evo%20FTX) | Humbuckers, bridge specs                             | Drop D   |
| Jackson JS32Q Dinky          | [Sweetwater](https://www.sweetwater.com/store/detail/JS32DKAHTPB--jackson-js-series-dinky-arch-top-js32q-dka-ht-electric-guitar-transparent-purple-burst?utm_source=chatgpt.com) | Poplar/quilt maple, Floyd Rose, dual HB, 24 frets    | Open A   |
| Schecter Evil Twin           | [Sweetwater](https://www.sweetwater.com/store/detail/C1SLSETB--schecter-c-1-sls-evil-twin-satin-black?utm_source=chatgpt.com) | Fishman Fluence Modern, swamp ash, neck-thru         | Standard |

## Synthesizers
| Instrument                   | URL | Type                                   | Key Specs                                            |
|------------------------------|-----|----------------------------------------|------------------------------------------------------|
| Modal Argon8 (37)            | [Sweetwater](https://www.sweetwater.com/store/detail/ArgonSynth--modal-electronics-argon8-37-key-8-voice-polyphonic-wavetable-synthesizer?utm_source=chatgpt.com) | Polyphonic Wavetable/Sequencer         | 8-voice, 32 osc, 120 wavetables, sequencer           |
| Moog Little Phatty Stage II  | [Wikipedia](https://en.wikipedia.org/wiki/Moog_Little_Phatty) | Monophonic Analog                      | Monophonic analog, ladder filter                     |
| Dave Smith Poly Evolver      | [Sequential](https://www.sequential.com/products/poly-evolver/) | Hybrid Analog/Digital                  | 4-voice hybrid analog/digital                        |
| Yamaha PSR-730               | [Yamaha](https://usa.yamaha.com/products/music_production/keyboards/portable_keyboard/psr_series/psr730) | Arranger / Texture                     | 64-note poly, XG voices                              |
| Alesis Micron                | [Wikipedia](https://en.wikipedia.org/wiki/Alesis_Micron) | Virtual Analog / Vocoder               | VA synth with vocoder                                |
| Korg microKORG               | [Sweetwater](https://www.sweetwater.com/store/detail/microKORG2--korg-microkorg-2-37-key-virtual-analog-synthesizer-and-vocoder?utm_source=chatgpt.com) | Virtual Analog / Vocoder               | VA synth + vocoder                                   |

## Effects & Processing
| Instrument                   | URL | Type                                   | Key Specs                                            |
|------------------------------|-----|----------------------------------------|------------------------------------------------------|
| Toneworks AX1500G            | [ZZounds](https://www.zzounds.com/productdetail.php?zsound_id=37972) | Guitar Multi-FX / Distortion & Modeling| Multi-FX / amp modeling unit                         |
| Roland RE-201 Space Echo     | [Roland](https://www.roland.com/global/products/re201/) | Tape Delay & Spring Reverb             | Classic tape echo + spring reverb                    |
| Digitech RV-7                | [Digitech](https://digitech.com/en/products/rv-7) | Reverb                                 | 7 reverb modes                                       |
| Boss BR-8                    | [Boss](https://www.boss.info/us/support/by_product/rc-8/owners_manual/) | Multitrack Recorder / FX Looper        | Digital multitrack recorder                          |
| Antares AVP-1                | [Antares](https://www.antarestech.com/products/avp-1/) | Vocal Pitch / Harmony                  | Vocal pitch/harmony processor                        |
| TC-Helicon Harmony M         | [TC-Helicon](https://www.tc-helicon.com/product.html?modelCode=P0DEP) | Vocal Harmony / Doubling               | Vocal harmony/doubling unit                          |

## Drums & Percussion
| Instrument                   | URL | Key Specs                                            |
|------------------------------|-----|------------------------------------------------------|
| Starion Drum Kit             | N/A | Remo upgraded heads, cowbell, snare, toms, bass, cymbals |
| Cowbell                      | N/A | Mounted on drum kit, accents                         |
| Korg Electribe ESX-1         | [Reverb](https://reverb.com/p/korg-electribe-esx-1) | Groovebox sampler/sequencer, pattern/part control    |
| Zildjian Hi-Hat              | [Zildjian](https://zildjian.com/products/cymbals/) | Hi-hat cymbal (alloy)                                |
| Meinl HCS 10" Splash         | [Meinl](https://meinlcymbals.com/product/hcs-10-splash/) | Brass splash cymbal                                  |
| Meinl HCS 14" Crash          | [Meinl](https://meinlcymbals.com/product/hcs-14-crash/) | Brass crash cymbal                                   |
| Meinl HCS 18" Crash          | [Meinl](https://meinlcymbals.com/product/hcs-18-crash/) | Brass crash cymbal                                   |
| Meinl HCS 20" Ride           | [Meinl](https://meinlcymbals.com/product/hcs-20-ride/) | Brass ride cymbal                                    |

## Mixer & Amps
| Instrument                   | URL | Key Specs                                            |
|------------------------------|-----|------------------------------------------------------|
| Boss Katana 100 MkIII        | [Boss](https://www.boss.info/us/products/katana_100_mkiii/) | 100W combo, built-in models/FX                       |
| Mackie Onyx 1640i            | [Mackie](https://mackie.com/products/onyx-1604i-16-channel-analog-mixer) | 16-channel analog mixer                              |

## Effects
| Send | Return | Notes | Source | Purpose |
|------|--------|-------|--------|---------|
| Mackie 1 | Mackie 1 | | Digitech RV-7 | Reverb depth / space |
| Mackie 2 | Track/Ch/Via Synth | | MicroKorg Vocoder input | Vocoder processing (sound in → vocoder out) |
| Mackie 3 | Mackie 3 | | Toneworks AX1500G → Roland RE-201 Space Echo | Distortion + tape delay / echo |
| Mackie 4 | Mackie 4 | ESX-1 Audio In Button, Indiv. Out | Boss BR-8 → Electribe ESX-1 | Glitch / experimental FX into drum/percussion chain |
| Mackie 4 | Mackie 2 | BR-8 Main out | Boss BR-8 | Guitar effects |

## MIDI Chains
| MIDI | Routing | Role |
|---|---|---|
| Master Clock | Reaper | Timing, quantization, sync |
| MIDI Chain 1 | Controller → MicroKorg → Electribe → Poly Evolver | All synths pass-thru, Reaper clock |
| MIDI Chain 2 | Controller → Yamaha PSR-730 | Arranger / textures |
| USB MIDI Devices | Argon8, Little Phatty Stage II, Alesis Micron | USB devices synced to Reaper |
| Mode | All MIDI pass-thru | Reaper as master clock |
