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
      <stop offset="0" stop-color="#f6e7a5"/>
      <stop offset="0.45" stop-color="#d4af37"/>
      <stop offset="1" stop-color="#8f6f1f"/>
    </linearGradient>
    <linearGradient id="gBand" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ecd27a"/>
      <stop offset="1" stop-color="#a8842a"/>
    </linearGradient>
    <radialGradient id="gGlow" cx="0.5" cy="0.42" r="0.6">
      <stop offset="0" stop-color="#d4af37" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#d4af37" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="400" height="300" fill="url(#gGlow)"/>
  <path d="M40 258 L40 150 Q40 144 46 146 L90 198 Q94 202 98 198 L126 122 Q128 116 134 118 L150 190 Q153 195 159 193 L200 96 Q203 90 209 93 L249 193 Q255 195 258 190 L274 118 Q280 116 282 122 L310 198 Q314 202 318 198 L362 146 Q368 144 368 150 L368 258 Z"
        fill="url(#gGold)" stroke="#f0d98c" stroke-width="2.5" stroke-linejoin="round"/>
  <circle cx="131" cy="107" r="8" fill="#f6e7a5" stroke="#d4af37" stroke-width="2"/>
  <circle cx="204" cy="83" r="10.5" fill="#f6e7a5" stroke="#d4af37" stroke-width="2"/>
  <circle cx="277" cy="107" r="8" fill="#f6e7a5" stroke="#d4af37" stroke-width="2"/>
  <circle cx="201" cy="80" r="3.6" fill="#fff8d8"/>
  <circle cx="129" cy="104" r="2.8" fill="#fff8d8"/>
  <circle cx="275" cy="104" r="2.8" fill="#fff8d8"/>
  <rect x="40" y="232" width="328" height="27" rx="7" fill="url(#gBand)"/>
  <rect x="40" y="232" width="328" height="2.4" fill="#f0d98c" opacity="0.75"/>
  <circle cx="92" cy="245.5" r="4.2" fill="#7a5c17"/>
  <circle cx="200" cy="245.5" r="4.8" fill="#7a5c17"/>
  <circle cx="308" cy="245.5" r="4.2" fill="#7a5c17"/>
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
