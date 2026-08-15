#!/usr/bin/perl
# make-cover.pl — prepend a full-bleed black & gold cover to an md2html build.
# Usage: perl make-cover.pl <body.html> <out.html> "<Doc Title>" "<EYEBROW>" "<Meta line>"
# Reads the md2html-generated body, extracts its <style> and <body> content,
# and composes a single print document: @page :first { margin:0 } for the
# full-bleed cover, the standard @page for the body pages. Printed once with
# headless Edge, page 1 is the cover and the rest flow untouched.
use strict; use warnings;

my ($in, $out, $title, $eyebrow, $meta) = @ARGV;
$title   ||= "Reality FX";
$eyebrow ||= "THE TRADING ACADEMY";
$meta    ||= "15 August 2026";

open my $fh, "<", $in or die "$in: $!";
local $/; my $html = <$fh>; close $fh;

my ($css) = $html =~ m{<style>(.*?)</style>}s;
my ($body) = $html =~ m{<body>(.*)</body>}s;
die "could not parse $in" unless defined $css && defined $body;

my $cover_css = <<'COVER';
/* ---- the cover: full-bleed A4, black & gold, one big crown ---- */
@page :first { margin: 0; }
.cover {
  position: relative; width: 210mm; height: 297mm; overflow: hidden;
  background:
    radial-gradient(ellipse at 50% 42%, rgba(212,175,55,.10) 0%, rgba(212,175,55,.03) 34%, rgba(0,0,0,0) 62%),
    radial-gradient(ellipse at 50% 108%, #0c0a07 0%, #0e0d0a 55%, #090807 100%),
    #0e0d0a;
  display: flex; align-items: center; justify-content: center;
  page-break-after: always; break-after: page;
}
.cover-frame { position: absolute; inset: 11mm; pointer-events: none; }
.cover-frame::before { content: ""; position: absolute; inset: 0; border: 1px solid rgba(212,175,55,.42); }
.cover-frame::after  { content: ""; position: absolute; inset: 2.6mm; border: 1px solid rgba(212,175,55,.16); }
.cover-frame .corner { position: absolute; width: 15mm; height: 15mm; color: rgba(212,175,55,.85); }
.cover-frame .corner svg { width: 100%; height: 100%; display: block; }
.cover-frame .corner.tl { top: 0; left: 0; }
.cover-frame .corner.tr { top: 0; right: 0; transform: scaleX(-1); }
.cover-frame .corner.bl { bottom: 0; left: 0; transform: scaleY(-1); }
.cover-frame .corner.br { bottom: 0; right: 0; transform: scale(-1,-1); }
.cover-inner { position: relative; text-align: center; padding: 0 22mm; }
.cover-brand { font-family: Arial, Helvetica, sans-serif; font-size: 8.5pt; letter-spacing: 7px; color: var(--gold); text-transform: uppercase; margin-bottom: 13mm; }
.cover-crown { width: 128mm; margin: 0 auto 8mm; }
.cover-rule { position: relative; width: 62mm; height: 1px; margin: 9mm auto; background: linear-gradient(90deg, rgba(212,175,55,0), rgba(212,175,55,.75), rgba(212,175,55,0)); }
.cover-rule .cover-orn { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); background: #0d0b08; padding: 0 5px; color: var(--gold); font-size: 8.5pt; line-height: 1; }
.cover-title { font-family: Georgia, serif; font-size: 25pt; font-weight: 700; color: var(--ink); margin: 0; letter-spacing: .3px; line-height: 1.22; }
.cover-sub { font-family: Arial, Helvetica, sans-serif; font-size: 7.5pt; letter-spacing: 3px; color: var(--gold); text-transform: uppercase; margin-top: 7mm; }
.cover-tagline { font-family: Georgia, serif; font-style: italic; font-size: 11pt; color: var(--gold-soft); margin: 8mm 0 0; }
.cover-meta { font-family: Arial, Helvetica, sans-serif; font-size: 8pt; letter-spacing: 2px; color: var(--mut); margin-top: 11mm; }
.cover-foot { position: absolute; left: 0; right: 0; bottom: 13mm; text-align: center; font-family: Arial, Helvetica, sans-serif; font-size: 7.5pt; letter-spacing: 3px; color: var(--mut); }
.cover-foot .c { color: var(--gold); }
COVER

my $corner_svg = <<'CORNER';
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M10 90 L10 26 Q10 10 26 10 L90 10" stroke="currentColor" stroke-width="2.6" fill="none"/>
  <path d="M10 58 Q10 44 24 44 L90 44" stroke="currentColor" stroke-width="1.1" fill="none" opacity="0.55"/>
  <rect x="72" y="-2" width="15" height="15" transform="rotate(45 79.5 5.5)" stroke="currentColor" stroke-width="1.6" fill="none"/>
</svg>
CORNER

my $crown_svg = <<'CROWN';
<svg class="cover-crown" viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f9efc0"/>
      <stop offset="0.35" stop-color="#e3bd4e"/>
      <stop offset="0.75" stop-color="#b58f2e"/>
      <stop offset="1" stop-color="#7a5c17"/>
    </linearGradient>
    <linearGradient id="gBand" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#eed27c"/>
      <stop offset="1" stop-color="#8f6f1f"/>
    </linearGradient>
    <radialGradient id="gBead" gradientUnits="objectBoundingBox" cx="0.35" cy="0.3" r="0.8">
      <stop offset="0" stop-color="#fff3c4"/>
      <stop offset="0.4" stop-color="#e8c76a"/>
      <stop offset="0.8" stop-color="#a8842a"/>
      <stop offset="1" stop-color="#6f5514"/>
    </radialGradient>
    <radialGradient id="gGlow" cx="0.5" cy="0.42" r="0.62">
      <stop offset="0" stop-color="#d4af37" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#d4af37" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="gFloor" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#e8c76a" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#e8c76a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gFacet" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3a2d12"/>
      <stop offset="1" stop-color="#0c0b09"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="420" height="340" fill="url(#gGlow)"/>
  <ellipse cx="210" cy="301" rx="188" ry="18" fill="url(#gFloor)"/>
  <!-- the band: engraved, jewelled with black diamonds, riveted rim -->
  <rect x="30" y="238" width="360" height="56" rx="13" fill="url(#gBand)" stroke="#f0d98c" stroke-width="1.4"/>
  <path d="M42 254 Q140 251 210 254 Q280 257 378 254" stroke="#6f5514" stroke-width="2" opacity="0.5" fill="none"/>
  <path d="M42 262 Q140 259 210 262 Q280 265 378 262" stroke="#6f5514" stroke-width="2" opacity="0.5" fill="none"/>
  <g fill="url(#gFacet)" stroke="#d4af37" stroke-width="1.2">
    <rect x="199" y="251" width="22" height="22" transform="rotate(45 210 262)"/>
    <rect x="156" y="253" width="18" height="18" transform="rotate(45 165 262)"/>
    <rect x="246" y="253" width="18" height="18" transform="rotate(45 255 262)"/>
    <rect x="118" y="255" width="14" height="14" transform="rotate(45 125 262)"/>
    <rect x="302" y="255" width="14" height="14" transform="rotate(45 309 262)"/>
  </g>
  <g fill="#b58f2e" opacity="0.55">
    <rect x="203.5" y="255.5" width="9" height="9" transform="rotate(45 208 260)"/>
    <rect x="160.5" y="257.5" width="7" height="7" transform="rotate(45 164 261)"/>
    <rect x="250.5" y="257.5" width="7" height="7" transform="rotate(45 254 261)"/>
  </g>
  <rect x="30" y="280" width="360" height="4" rx="2" fill="#f0d98c" opacity="0.85"/>
  <g fill="#7a5c17">
    <circle cx="55" cy="284" r="2.6"/><circle cx="99" cy="284" r="2.6"/><circle cx="143" cy="284" r="2.6"/>
    <circle cx="187" cy="284" r="2.6"/><circle cx="231" cy="284" r="2.6"/><circle cx="275" cy="284" r="2.6"/>
    <circle cx="319" cy="284" r="2.6"/><circle cx="363" cy="284" r="2.6"/>
  </g>
  <!-- the five peaks -->
  <path d="M30 240 L82 240 Q72 194 96 166 Q120 194 110 240 L140 240
           Q130 176 160 134 Q190 176 180 240 L192 240 Q196 154 210 84
           Q224 154 228 240 L240 240 Q230 176 260 134 Q290 176 280 240
           L310 240 Q300 194 324 166 Q348 194 338 240 L390 240 Z"
        fill="url(#gGold)" stroke="#f0d98c" stroke-width="1.5" stroke-linejoin="round"/>
  <g stroke="#8f6f1f" stroke-width="1.6" fill="none" opacity="0.6" stroke-linecap="round">
    <path d="M210 200 Q210 150 210 112"/>
    <path d="M160 190 Q160 165 160 150"/>
    <path d="M260 190 Q260 165 260 150"/>
    <path d="M96 200 Q96 185 96 176"/>
    <path d="M324 200 Q324 185 324 176"/>
  </g>
  <!-- beads on all five peaks -->
  <circle cx="210" cy="76" r="13" fill="url(#gBead)" stroke="#f0d98c" stroke-width="1.5"/>
  <circle cx="160" cy="126" r="10" fill="url(#gBead)" stroke="#f0d98c" stroke-width="1.5"/>
  <circle cx="260" cy="126" r="10" fill="url(#gBead)" stroke="#f0d98c" stroke-width="1.5"/>
  <circle cx="96" cy="158" r="9" fill="url(#gBead)" stroke="#f0d98c" stroke-width="1.5"/>
  <circle cx="324" cy="158" r="9" fill="url(#gBead)" stroke="#f0d98c" stroke-width="1.5"/>
  <circle cx="206" cy="71" r="4" fill="#fff8d8" opacity="0.9"/>
  <circle cx="157" cy="121" r="3" fill="#fff8d8" opacity="0.85"/>
  <circle cx="257" cy="121" r="3" fill="#fff8d8" opacity="0.85"/>
  <circle cx="93" cy="153" r="2.6" fill="#fff8d8" opacity="0.8"/>
  <circle cx="321" cy="153" r="2.6" fill="#fff8d8" opacity="0.8"/>
</svg>
CROWN

my $cover_html = <<"COVERHTML";
<div class="cover">
  <div class="cover-frame">
    <span class="corner tl">$corner_svg</span>
    <span class="corner tr">$corner_svg</span>
    <span class="corner bl">$corner_svg</span>
    <span class="corner br">$corner_svg</span>
  </div>
  <div class="cover-inner">
    <div class="cover-brand">Reality FX</div>
    $crown_svg
    <h1 class="cover-title">$title</h1>
    <div class="cover-rule"><span class="cover-orn">&#10022;</span></div>
    <div class="cover-sub">$eyebrow</div>
    <p class="cover-tagline">&ldquo;Every lesson is a trade. Every trade is a lesson.&rdquo;</p>
    <div class="cover-meta">$meta</div>
  </div>
  <div class="cover-foot"><span class="c">&#9819;</span> &nbsp;REALITY FX &nbsp;·&nbsp; THE TRADING ACADEMY &nbsp;·&nbsp; EST. 2020</div>
</div>
COVERHTML

my $full = <<"HTML";
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>$title</title>
<style>
$css
$cover_css
</style></head>
<body>
$cover_html
$body
</body></html>
HTML

open my $oh, ">", $out or die "$out: $!";
print $oh $full;
close $oh;
print "wrote $out (cover + " . length($body) . " bytes of body)\n";
