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
.cover-inner { position: relative; text-align: center; padding: 0 22mm; }
.cover-brand { font-family: Arial, Helvetica, sans-serif; font-size: 8.5pt; letter-spacing: 7px; color: var(--gold); text-transform: uppercase; margin-bottom: 13mm; }
.cover-crown { width: 128mm; margin: 0 auto 10mm; }
.cover-rule { width: 62mm; height: 1px; margin: 9mm auto; background: linear-gradient(90deg, rgba(212,175,55,0), rgba(212,175,55,.75), rgba(212,175,55,0)); }
.cover-title { font-family: Georgia, serif; font-size: 25pt; font-weight: 700; color: var(--ink); margin: 0; letter-spacing: .3px; line-height: 1.22; }
.cover-sub { font-family: Arial, Helvetica, sans-serif; font-size: 7.5pt; letter-spacing: 3px; color: var(--gold); text-transform: uppercase; margin-top: 7mm; }
.cover-tagline { font-family: Georgia, serif; font-style: italic; font-size: 11pt; color: var(--gold-soft); margin: 8mm 0 0; }
.cover-meta { font-family: Arial, Helvetica, sans-serif; font-size: 8pt; letter-spacing: 2px; color: var(--mut); margin-top: 11mm; }
.cover-foot { position: absolute; left: 0; right: 0; bottom: 13mm; text-align: center; font-family: Arial, Helvetica, sans-serif; font-size: 7.5pt; letter-spacing: 3px; color: var(--mut); }
.cover-foot .c { color: var(--gold); }
COVER

my $crown_svg = <<'CROWN';
<svg class="cover-crown" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f8ecb4"/>
      <stop offset="0.4" stop-color="#d4af37"/>
      <stop offset="1" stop-color="#8f6f1f"/>
    </linearGradient>
    <radialGradient id="gGlow" cx="0.5" cy="0.4" r="0.62">
      <stop offset="0" stop-color="#d4af37" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#d4af37" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="400" height="300" fill="url(#gGlow)"/>
  <!-- The classic crown silhouette: five peaks, each topped with a bead,
       flowing into the band — the exact shape of the house crown. -->
  <path d="M40 262 L40 232 L88 232 Q78 192 96 158 Q114 192 110 232 L142 232
           Q134 170 152 128 Q170 170 166 232 L192 232 Q196 148 200 94
           Q204 148 208 232 L234 232 Q230 170 248 128 Q266 170 262 232
           L290 232 Q284 192 304 158 Q322 192 312 232 L360 232 L360 262
           Q200 275 40 262 Z"
        fill="url(#gGold)" stroke="#f0d98c" stroke-width="1.6" stroke-linejoin="round"/>
  <!-- beads on all five peaks -->
  <circle cx="200" cy="86" r="10.5" fill="url(#gGold)" stroke="#f0d98c" stroke-width="1.6"/>
  <circle cx="152" cy="120" r="8.5" fill="url(#gGold)" stroke="#f0d98c" stroke-width="1.6"/>
  <circle cx="248" cy="120" r="8.5" fill="url(#gGold)" stroke="#f0d98c" stroke-width="1.6"/>
  <circle cx="96" cy="150" r="7" fill="url(#gGold)" stroke="#f0d98c" stroke-width="1.6"/>
  <circle cx="304" cy="150" r="7" fill="url(#gGold)" stroke="#f0d98c" stroke-width="1.6"/>
  <circle cx="197" cy="82" r="3.4" fill="#fff8d8"/>
  <circle cx="150" cy="116" r="2.7" fill="#fff8d8"/>
  <circle cx="246" cy="116" r="2.7" fill="#fff8d8"/>
  <circle cx="94" cy="146" r="2.2" fill="#fff8d8"/>
  <circle cx="302" cy="146" r="2.2" fill="#fff8d8"/>
  <!-- the two etched stripes across the band, as in the house crown -->
  <path d="M54 240 Q120 237 200 240 Q280 243 346 240" stroke="#2e2108" stroke-width="2.6" opacity="0.55" fill="none"/>
  <path d="M54 251 Q120 248 200 251 Q280 254 346 251" stroke="#2e2108" stroke-width="2.6" opacity="0.55" fill="none"/>
</svg>
CROWN

my $cover_html = <<"COVERHTML";
<div class="cover">
  <div class="cover-frame"></div>
  <div class="cover-inner">
    <div class="cover-brand">Reality FX</div>
    $crown_svg
    <h1 class="cover-title">$title</h1>
    <div class="cover-rule"></div>
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
